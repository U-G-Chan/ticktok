import { ref } from 'vue'
import * as faceMesh from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'

export interface EffectOption {
    type: 'decoration' | 'filter'
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
        this.initializeFaceMesh()
    }

    private async initializeFaceMesh() {
        this.faceMesh = new faceMesh.FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
            }
        })

        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        })

        this.faceMesh.onResults(this.onResults.bind(this))
    }

    public async initialize(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
        if (this.isInitialized) return

        this.videoElement = videoElement
        this.canvasElement = canvasElement

        // 初始化WebGL
        this.initWebGL(canvasElement)

        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                if (this.faceMesh && this.videoElement) {
                    await this.faceMesh.send({ image: this.videoElement })
                }
            },
            width: 1280,
            height: 720
        })

        await this.camera.start()
        this.isInitialized = true
    }

    private onResults(results: faceMesh.Results) {
        if (!this.canvasElement) return

        // 判断是否为滤镜
        if (this.currentEffect.value && this.currentEffect.value.type === 'filter') {
            this.renderWithWebGL(results.image as any, this.currentEffect.value.name)
        } else {
            // 无滤镜时，仍用WebGL渲染，但使用none滤镜（保持原始图像）
            this.renderWithWebGL(results.image as any, 'none')
        }

        // 贴纸/装饰效果
        if (this.currentEffect.value && this.currentEffect.value.type === 'decoration') {
            // 获取canvas 2D上下文绘制装饰
            const ctx = this.canvasElement.getContext('2d', {
                alpha: true,
                desynchronized: true,
                willReadFrequently: false
            })
            if (!ctx) return

            // 清除画布中的装饰部分（保留图像）
            ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
            
            // 应用装饰效果
            this.applyDecoration(ctx, results, this.currentEffect.value.name)
        }
    }

    private applyDecoration(ctx: CanvasRenderingContext2D, results: faceMesh.Results, decorationName: string) {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return

        const landmarks = results.multiFaceLandmarks[0]
        
        switch (decorationName) {
            case 'sunglasses':
                this.applySunglasses(ctx, landmarks)
                break
            case 'cat-ears':
                this.applyCatEars(ctx, landmarks)
                break
            case 'mustache':
                this.applyMustache(ctx, landmarks)
                break
            case 'hat':
                this.applyHat(ctx, landmarks)
                break
        }
    }

    // 贴纸应用方法
    private applySunglasses(ctx: CanvasRenderingContext2D, landmarks: faceMesh.NormalizedLandmark[]) {
        // 获取眼睛位置
        const leftEye = landmarks[33]
        const rightEye = landmarks[263]
        
        // 计算墨镜位置和大小
        const width = Math.abs(rightEye.x - leftEye.x) * this.canvasElement!.width * 2
        const height = width * 0.3
        const x = leftEye.x * this.canvasElement!.width - width / 2
        const y = leftEye.y * this.canvasElement!.height - height / 2

        // 绘制墨镜
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(x, y, width, height)
    }

    private applyCatEars(ctx: CanvasRenderingContext2D, landmarks: faceMesh.NormalizedLandmark[]) {
        // 获取头顶位置
        const top = landmarks[10]
        
        // 绘制猫耳
        ctx.beginPath()
        ctx.moveTo(top.x * this.canvasElement!.width, top.y * this.canvasElement!.height)
        ctx.lineTo((top.x - 0.1) * this.canvasElement!.width, (top.y - 0.2) * this.canvasElement!.height)
        ctx.lineTo((top.x + 0.1) * this.canvasElement!.width, (top.y - 0.2) * this.canvasElement!.height)
        ctx.closePath()
        ctx.fillStyle = 'pink'
        ctx.fill()
    }

    private applyMustache(ctx: CanvasRenderingContext2D, landmarks: faceMesh.NormalizedLandmark[]) {
        // 获取鼻子位置
        const nose = landmarks[1]
        
        // 绘制胡子
        ctx.beginPath()
        ctx.moveTo((nose.x - 0.1) * this.canvasElement!.width, nose.y * this.canvasElement!.height)
        ctx.lineTo((nose.x + 0.1) * this.canvasElement!.width, nose.y * this.canvasElement!.height)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()
    }

    private applyHat(ctx: CanvasRenderingContext2D, landmarks: faceMesh.NormalizedLandmark[]) {
        // 获取头顶位置
        const top = landmarks[10]
        
        // 绘制帽子
        ctx.beginPath()
        ctx.arc(top.x * this.canvasElement!.width, top.y * this.canvasElement!.height, 50, 0, Math.PI * 2)
        ctx.fillStyle = 'red'
        ctx.fill()
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
        this.gl = canvas.getContext('webgl')
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
                // 保持顶点坐标原样
                gl_Position = vec4(a_position.x, a_position.y, 0, 1);
                // 纹理坐标：x轴镜像，y轴翻转
                v_texCoord = vec2(1.0 - a_texCoord.x, 1.0 - a_texCoord.y);
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
        gl.viewport(0, 0, this.canvasElement!.width, this.canvasElement!.height)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(this.glProgram)

        // 绑定 buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer)
        const a_position = gl.getAttribLocation(this.glProgram, 'a_position')
        const a_texCoord = gl.getAttribLocation(this.glProgram, 'a_texCoord')
        gl.enableVertexAttribArray(a_position)
        gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0)
        gl.enableVertexAttribArray(a_texCoord)
        gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 16, 8)

        // 上传纹理
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
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
 