import { ref } from 'vue'
import * as faceMesh from '@mediapipe/face_mesh'

export interface DecorationOption {
    name: string
    texture: string
    scale: number
    offset: { x: number, y: number }
    anchorPoints: number[]
}

export class DecorationEffectService {
    private gl: WebGLRenderingContext | null = null
    private glProgram: WebGLProgram | null = null
    private glTexture: WebGLTexture | null = null
    private glBuffer: WebGLBuffer | null = null
    private currentDecoration = ref<DecorationOption | null>(null)
    private isInitialized = false
    private canvasElement: HTMLCanvasElement | null = null
    private decorationTextures: Map<string, HTMLImageElement> = new Map()

    // 预定义的装饰选项
    private readonly decorations: DecorationOption[] = [
        {
            name: 'sunglasses',
            texture: '/textures/sunglasses.png',
            scale: 1.5,  // 增加默认缩放比例
            offset: { x: 0, y: 0.02 },  // 微调垂直偏移，向下移动一点
            anchorPoints: [159, 386]  // 使用更准确的眼睛内侧点 (左眼内侧159，右眼内侧386)
        },
        {
            name: 'hat',
            texture: '/textures/hat.png',
            scale: 1.5,
            offset: { x: 0, y: -0.2 },
            anchorPoints: [10] // 头顶
        },
        {
            name: 'cat-ears',
            texture: '/textures/cat-ears.png',
            scale: 1.0,
            offset: { x: 0, y: -0.15 },
            anchorPoints: [10] // 头顶
        }
    ]

    constructor() {
        this.preloadTextures()
    }

    private async preloadTextures() {
        console.log('开始预加载装饰贴图...')
        for (const decoration of this.decorations) {
            console.log(`加载贴图: ${decoration.texture}`)
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = decoration.texture
            try {
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        console.log(`贴图加载成功: ${decoration.texture}, 尺寸: ${img.width}x${img.height}`)
                        resolve(true)
                    }
                    img.onerror = (e) => {
                        console.error(`贴图加载失败: ${decoration.texture}`, e)
                        reject(new Error(`加载贴图失败: ${decoration.texture}`))
                    }
                })
                this.decorationTextures.set(decoration.name, img)
            } catch (error) {
                console.error(`贴图加载失败: ${decoration.texture}`, error)
            }
        }
        console.log('贴图预加载完成，已加载: ', Array.from(this.decorationTextures.keys()).join(', '))
    }

    public async initialize(canvasElement: HTMLCanvasElement) {
        if (this.isInitialized) return

        console.log('初始化装饰特效服务...')
        this.canvasElement = canvasElement
        // 动态设置canvas分辨率，确保与传入canvas一致
        if (canvasElement) {
            const width = canvasElement.width
            const height = canvasElement.height
            this.canvasElement.width = width
            this.canvasElement.height = height
            console.log('装饰特效canvas分辨率设置:', width, height)
        }
        this.initWebGL(canvasElement)
        this.isInitialized = true
        console.log('装饰特效服务初始化完成')
    }

    private initWebGL(canvas: HTMLCanvasElement) {
        try {
            console.log('初始化 WebGL...');
            // 尝试获取 WebGL 上下文
            this.gl = canvas.getContext('webgl', { 
                preserveDrawingBuffer: true,
                antialias: true,
                alpha: true,
                premultipliedAlpha: false
            });
            
            if (!this.gl) {
                console.error('无法获取 WebGL 上下文');
                return;
            }
            
            console.log('WebGL 上下文获取成功');

            // 创建 shader 程序 - 顶点着色器保持顶点位置不变
            const vertexShaderSource = `
                attribute vec2 a_position;
                attribute vec2 a_texCoord;
                varying vec2 v_texCoord;
                void main() {
                    // 直接使用传入的规范化坐标
                    gl_Position = vec4(a_position, 0.0, 1.0);
                    v_texCoord = a_texCoord;
                }
            `;

            // 片段着色器增强透明度处理
            const fragmentShaderSource = `
                precision mediump float;
                varying vec2 v_texCoord;
                uniform sampler2D u_image;
                void main() {
                    vec4 color = texture2D(u_image, v_texCoord);
                    // 增强 alpha 值判断，确保半透明效果
                    if (color.a < 0.01) discard;  // 几乎完全透明的像素直接丢弃
                    gl_FragColor = color;
                }
            `;

            console.log('编译着色器...');
            
            // 创建顶点着色器
            const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
            if (!vertexShader) {
                console.error('无法创建顶点着色器');
                return;
            }
            this.gl.shaderSource(vertexShader, vertexShaderSource);
            this.gl.compileShader(vertexShader);
            
            if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
                const info = this.gl.getShaderInfoLog(vertexShader);
                console.error('顶点着色器编译失败:', info);
                return;
            }
            
            // 创建片段着色器
            const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            if (!fragmentShader) {
                console.error('无法创建片段着色器');
                return;
            }
            this.gl.shaderSource(fragmentShader, fragmentShaderSource);
            this.gl.compileShader(fragmentShader);
            
            if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
                const info = this.gl.getShaderInfoLog(fragmentShader);
                console.error('片段着色器编译失败:', info);
                return;
            }
            
            // 创建程序
            this.glProgram = this.gl.createProgram();
            if (!this.glProgram) {
                console.error('无法创建着色器程序');
                return;
            }
            
            this.gl.attachShader(this.glProgram, vertexShader);
            this.gl.attachShader(this.glProgram, fragmentShader);
            this.gl.linkProgram(this.glProgram);
            
            if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
                const info = this.gl.getProgramInfoLog(this.glProgram);
                console.error('着色器程序链接失败:', info);
                return;
            }
            
            console.log('着色器程序创建成功');

            // 创建缓冲区
            this.glBuffer = this.gl.createBuffer();
            if (!this.glBuffer) {
                console.error('无法创建缓冲区');
                return;
            }
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glBuffer);
            
            // 创建纹理
            this.glTexture = this.gl.createTexture();
            if (!this.glTexture) {
                console.error('无法创建纹理');
                return;
            }
            
            // 设置纹理参数
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            
            console.log('WebGL 初始化完成');
        } catch (error) {
            console.error('WebGL 初始化失败:', error);
        }
    }

    public setDecoration(decorationName: string | null) {
        console.log('设置装饰:', decorationName)
        if (!decorationName) {
            this.currentDecoration.value = null
            return
        }

        const decoration = this.decorations.find(d => d.name === decorationName)
        if (decoration) {
            console.log('找到装饰配置:', decoration)
            this.currentDecoration.value = decoration
        } else {
            console.warn('未找到装饰配置:', decorationName)
        }
    }

    public renderDecoration(landmarks: faceMesh.NormalizedLandmark[]) {
        console.log('开始渲染装饰...')
        
        try {
            if (!this.gl || !this.glProgram || !this.currentDecoration.value || !this.canvasElement) {
                console.warn('渲染条件检查失败:', {
                    hasGL: !!this.gl,
                    hasProgram: !!this.glProgram,
                    hasDecoration: !!this.currentDecoration.value,
                    hasCanvas: !!this.canvasElement
                })
                return
            }

            const decoration = this.currentDecoration.value
            const texture = this.decorationTextures.get(decoration.name)
            
            // 即使纹理加载失败，也尝试渲染纯色装饰
            let useTexture = !!texture;
            
            if (!texture) {
                console.warn('未找到贴图，将使用纯色渲染:', decoration.name)
            } else {
                console.log('渲染装饰:', {
                    name: decoration.name,
                    textureSize: `${texture.width}x${texture.height}`,
                    canvasSize: `${this.canvasElement.width}x${this.canvasElement.height}`
                })
            }

            const gl = this.gl
            
            // 确保尺寸匹配
            gl.canvas.width = this.canvasElement.width;
            gl.canvas.height = this.canvasElement.height;
            
            gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)
            
            // 清除画布 - 完全透明
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            
            gl.useProgram(this.glProgram)

            // 启用混合 - 使用预乘 alpha 提高渲染质量
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

            try {
                // 计算装饰位置和大小
                if (decoration.anchorPoints.length === 2) {
                    // 对于需要两个锚点的装饰（如墨镜）
                    const leftPoint = landmarks[decoration.anchorPoints[0]]
                    const rightPoint = landmarks[decoration.anchorPoints[1]]
                    if (!leftPoint || !rightPoint) {
                        console.warn('未找到锚点:', {
                            leftPoint: decoration.anchorPoints[0],
                            rightPoint: decoration.anchorPoints[1]
                        })
                        return
                    }

                    // 针对墨镜做特殊处理
                    let finalScale = decoration.scale * 1.5; // 放大倍数
                    let widthAdjust = 1.8; // 宽度调整因子
                    
                    if (decoration.name === 'sunglasses') {
                        // 获取额外的面部特征点来更好地定位墨镜
                        const leftEyeOuter = landmarks[33];  // 左眼外侧
                        const rightEyeOuter = landmarks[263]; // 右眼外侧
                        const leftEyebrowOuter = landmarks[70]; // 左眉毛外侧
                        const rightEyebrowOuter = landmarks[300]; // 右眉毛外侧
                        
                        // 使用眼睛外侧点来计算墨镜宽度，使其更宽一些
                        if (leftEyeOuter && rightEyeOuter) {
                            // 使用眼睛外侧点代替内侧点计算宽度
                            const eyeDistance = Math.abs(rightEyeOuter.x - leftEyeOuter.x);
                            widthAdjust = 1.5; // 稍微缩小一点宽度调整
                            finalScale = decoration.scale;
                        }
                    }
                    
                    const offset = decoration.offset
                    
                    // 计算宽度基于两个锚点之间的距离，并应用宽度调整
                    const width = Math.abs(rightPoint.x - leftPoint.x) * this.canvasElement.width * finalScale * widthAdjust;
                    
                    // 预防除以零或极小值
                    let aspectRatio = 0.3; // 默认宽高比，墨镜通常比较扁
                    if (texture && texture.width > 0 && texture.height > 0) {
                        aspectRatio = texture.width / texture.height;
                    }
                    const height = width / aspectRatio
                    
                    // 计算中心点 - 调整位置
                    const centerX = (leftPoint.x + rightPoint.x) / 2 * this.canvasElement.width + offset.x * this.canvasElement.width
                    const centerY = (leftPoint.y + rightPoint.y) / 2 * this.canvasElement.height + offset.y * this.canvasElement.height

                    // 使用规范化坐标而不是像素坐标 (-1 到 1)
                    const left = (centerX - width/2) / this.canvasElement.width * 2 - 1;
                    const right = (centerX + width/2) / this.canvasElement.width * 2 - 1;
                    const bottom = (centerY - height/2) / this.canvasElement.height * 2 - 1;
                    const top = (centerY + height/2) / this.canvasElement.height * 2 - 1;
                    
                    // 设置顶点和纹理坐标
                    const vertices = new Float32Array([
                        left, bottom, 0, 0,
                        right, bottom, 1, 0,
                        left, top, 0, 1,
                        right, top, 1, 1,
                    ])

                    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer)
                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
                    
                    // 顶点绘制 - 使用规范化坐标
                    gl.enable(gl.SCISSOR_TEST);
                    gl.scissor(0, 0, this.canvasElement.width, this.canvasElement.height);
                    
                } else {
                    // 对于只需要一个锚点的装饰（如帽子、猫耳）
                    const anchorPoint = landmarks[decoration.anchorPoints[0]];
                    if (!anchorPoint) {
                        console.warn('未找到锚点:', decoration.anchorPoints[0]);
                        return;
                    }

                    const scale = decoration.scale * 2.0;
                    const offset = decoration.offset;
                    const width = this.canvasElement.width * 0.3 * scale;
                    const height = width * 0.8;

                    const x = anchorPoint.x * this.canvasElement.width + offset.x * this.canvasElement.width;
                    const y = anchorPoint.y * this.canvasElement.height + offset.y * this.canvasElement.height;

                    const left = (x - width/2) / this.canvasElement.width * 2 - 1;
                    const right = (x + width/2) / this.canvasElement.width * 2 - 1;
                    const bottom = (y - height/2) / this.canvasElement.height * 2 - 1;
                    const top = (y + height/2) / this.canvasElement.height * 2 - 1;

                    const vertices = new Float32Array([
                        left, bottom, 0, 0,
                        right, bottom, 1, 0,
                        left, top, 0, 1,
                        right, top, 1, 1,
                    ]);

                    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
                }

                // 设置属性
                const a_position = gl.getAttribLocation(this.glProgram, 'a_position')
                const a_texCoord = gl.getAttribLocation(this.glProgram, 'a_texCoord')
                
                if (a_position === -1 || a_texCoord === -1) {
                    console.error('无法获取着色器属性位置:', {
                        a_position,
                        a_texCoord
                    })
                    return
                }
                
                gl.enableVertexAttribArray(a_position)
                gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0)
                gl.enableVertexAttribArray(a_texCoord)
                gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 16, 8)

                // 设置纹理
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
                
                if (useTexture && texture) {
                    // 使用贴图纹理
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture)
                } else {
                    // 创建一个简单的1x1纯色像素作为纹理
                    const color = new Uint8Array([255, 0, 0, 200]);  // 半透明红色
                    if (decoration.name === 'hat') {
                        color[0] = 255; color[1] = 0; color[2] = 0; // 红色帽子
                    } else if (decoration.name === 'sunglasses') {
                        color[0] = 0; color[1] = 0; color[2] = 0; // 黑色墨镜
                    } else if (decoration.name === 'cat-ears') {
                        color[0] = 255; color[1] = 150; color[2] = 200; // 粉色猫耳
                    }
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color);
                }

                // 设置 uniform
                const u_image = gl.getUniformLocation(this.glProgram, 'u_image')
                if (u_image === null) {
                    console.error('无法获取uniform位置: u_image')
                    return
                }
                gl.uniform1i(u_image, 0)

                // 绘制
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
                
                // 如果有WebGL错误，输出
                const error = gl.getError();
                if (error !== gl.NO_ERROR) {
                    console.error('WebGL渲染错误:', error);
                } else {
                    console.log('WebGL渲染成功');
                }

                // 禁用混合和裁剪
                gl.disable(gl.BLEND)
                gl.disable(gl.SCISSOR_TEST)

                console.log('装饰渲染完成')
            } catch (error) {
                console.error('渲染装饰时发生错误:', error)
            }
        } catch (error) {
            console.error('装饰渲染过程发生异常:', error)
        }
    }

    public async stop() {
        this.isInitialized = false
        this.currentDecoration.value = null
    }
}

// 创建单例实例
export const decorationEffectService = new DecorationEffectService() 