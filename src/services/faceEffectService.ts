import { ref } from 'vue'
import * as faceMesh from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'
import { decorationEffectService } from './decorationEffectService'

export interface EffectOption {
    type: 'filter'
    name: string
}

export class FaceEffectService {
    private faceMesh: faceMesh.FaceMesh | null = null
    private camera: Camera | null = null
    private videoElement: HTMLVideoElement | null = null
    private canvasElement: HTMLCanvasElement | null = null
    private currentEffect = ref<EffectOption | null>(null)
    private isInitialized = false
    private gl: WebGLRenderingContext | null = null
    private glProgram: WebGLProgram | null = null
    private glTexture: WebGLTexture | null = null
    private glBuffer: WebGLBuffer | null = null
    private currentFilterName: string = 'none'

    constructor() {
        this.initializeFaceMesh();
    }

    private async initializeFaceMesh() {
        try {
            this.faceMesh = new faceMesh.FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`
            });
            this.faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: false,
                minDetectionConfidence: 0.1,
                minTrackingConfidence: 0.1
            });
            this.faceMesh.onResults(this.onResults.bind(this));
        } catch (error) {
            console.error('FaceMesh 初始化失败:', error);
        }
    }

    public async initialize(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
        if (this.isInitialized) return;
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.initWebGL(canvasElement);
        try {
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.faceMesh && this.videoElement) {
                        try {
                            await this.faceMesh.send({ image: this.videoElement });
                        } catch (error) {
                            console.error('发送视频帧到 FaceMesh 失败:', error);
                        }
                    }
                },
                width: 640,
                height: 480
            });
            await this.camera.start();
            this.isInitialized = true;
        } catch (error) {
            console.error('摄像头启动失败:', error);
            throw error;
        }
    }

    private onResults(results: faceMesh.Results) {
        if (!this.canvasElement) return;
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length === 0) {
            return;
        }
        if (this.currentEffect.value && this.currentEffect.value.type === 'filter') {
            this.renderWithWebGL(results.image as any, this.currentEffect.value.name);
        } else {
            this.renderWithWebGL(results.image as any, 'none');
        }
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            decorationEffectService.renderDecoration(results.multiFaceLandmarks[0]);
        }
    }

    public setEffect(effect: EffectOption) {
        this.currentEffect.value = effect
    }

    public async stop() {
        if (this.camera) {
            await this.camera.stop()
        }
        this.isInitialized = false
    }

    private initWebGL(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
        if (!this.gl) {
            console.error('WebGL 初始化失败')
            return
        }
        // 创建 shader 程序
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `
        const fragmentShaderSource = this.getFragmentShaderSource(this.currentFilterName)
        const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)
        this.glProgram = this.createProgram(this.gl, vertexShader, fragmentShader)

        // 创建 buffer
        this.glBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glBuffer)
        // 顶点和纹理坐标
        const vertices = new Float32Array([
            -1, -1, 0, 0,
            1, -1, 1, 0,
            -1,  1, 0, 1,
            1,  1, 1, 1,
        ])
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

        // 创建纹理
        this.glTexture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    }

    private createShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type)!
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed')
        }
        return shader
    }

    private createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
        const program = gl.createProgram()!
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program) || 'Program link failed')
        }
        return program
    }

    private getFragmentShaderSource(filter: string) {
        // 可扩展更多滤镜
        switch (filter) {
            case 'grayscale':
                return `
                    precision mediump float;
                    varying vec2 v_texCoord;
                    uniform sampler2D u_image;
                    void main() {
                        vec4 color = texture2D(u_image, v_texCoord);
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        gl_FragColor = vec4(vec3(gray), color.a);
                    }
                `
            case 'warm':
                return `
                    precision mediump float;
                    varying vec2 v_texCoord;
                    uniform sampler2D u_image;
                    void main() {
                        vec4 color = texture2D(u_image, v_texCoord);
                        color.r *= 1.1;
                        color.g *= 1.05;
                        color.b *= 0.95;
                        gl_FragColor = color;
                    }
                `
            case 'cool':
                return `
                    precision mediump float;
                    varying vec2 v_texCoord;
                    uniform sampler2D u_image;
                    void main() {
                        vec4 color = texture2D(u_image, v_texCoord);
                        color.r *= 0.95;
                        color.g *= 1.05;
                        color.b *= 1.1;
                        gl_FragColor = color;
                    }
                `
            case 'vintage':
                return `
                    precision mediump float;
                    varying vec2 v_texCoord;
                    uniform sampler2D u_image;
                    void main() {
                        vec4 color = texture2D(u_image, v_texCoord);
                        color.r = min(1.0, color.r * 1.1 + 0.04);
                        color.g = min(1.0, color.g * 0.9 + 0.02);
                        color.b = min(1.0, color.b * 0.8 + 0.02);
                        gl_FragColor = color;
                    }
                `
            default:
                return `
                    precision mediump float;
                    varying vec2 v_texCoord;
                    uniform sampler2D u_image;
                    void main() {
                        gl_FragColor = texture2D(u_image, v_texCoord);
                    }
                `
        }
    }

    private renderWithWebGL(image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, filter: string) {
        if (!this.gl || !this.glProgram) {
            this.currentFilterName = filter
            this.initWebGL(this.canvasElement!)
        }
        if (!this.gl || !this.glProgram) return

        // 切换shader
        if (filter !== this.currentFilterName) {
            this.currentFilterName = filter
            this.initWebGL(this.canvasElement!)
        }

        const gl = this.gl
        
        // 获取视频和 canvas 的尺寸
        const videoWidth = (image as HTMLVideoElement).videoWidth || image.width;
        const videoHeight = (image as HTMLVideoElement).videoHeight || image.height;
        const canvasWidth = this.canvasElement!.width;
        const canvasHeight = this.canvasElement!.height;
        
        // 计算视频与 canvas 的宽高比
        const videoRatio = videoWidth / videoHeight;
        const canvasRatio = canvasWidth / canvasHeight;
        
        // 设置 WebGL 纹理坐标，以保持视频正确的宽高比
        // 这样即使 canvas 和视频的宽高比不同，视频也能正确显示而不变形
        let s0 = 0, s1 = 1, t0 = 0, t1 = 1;
        
        if (canvasRatio > videoRatio) {
            // canvas 比视频更宽，需要裁剪纹理的顶部和底部
            const texHeight = videoWidth / canvasRatio / videoHeight;
            const offset = (1 - texHeight) / 2;
            t0 = offset;
            t1 = 1 - offset;
        } else {
            // canvas 比视频更高，需要裁剪纹理的左右两侧
            const texWidth = videoHeight * canvasRatio / videoWidth;
            const offset = (1 - texWidth) / 2;
            s0 = offset;
            s1 = 1 - offset;
        }
                
        // 设置视口
        gl.viewport(0, 0, canvasWidth, canvasHeight);
        gl.clearColor(0, 0, 0, 0) // 设置清除颜色为透明
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(this.glProgram)
        
        // 绑定 buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer)
        
        // 使用全屏四边形顶点坐标
        const vertices = new Float32Array([
            -1, -1, s0, t0, // 左下
             1, -1, s1, t0, // 右下
            -1,  1, s0, t1, // 左上
             1,  1, s1, t1, // 右上
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const a_position = gl.getAttribLocation(this.glProgram, 'a_position')
        const a_texCoord = gl.getAttribLocation(this.glProgram, 'a_texCoord')
        gl.enableVertexAttribArray(a_position)
        gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0)
        gl.enableVertexAttribArray(a_texCoord)
        gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 16, 8)

        // 上传纹理
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

        // 设置 uniform
        const u_image = gl.getUniformLocation(this.glProgram, 'u_image')
        gl.uniform1i(u_image, 0)

        // 绘制
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
}

// 创建单例实例
export const faceEffectService = new FaceEffectService() 
 