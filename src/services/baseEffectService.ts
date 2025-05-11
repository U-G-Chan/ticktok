

export abstract class BaseEffectService {
    protected gl: WebGLRenderingContext | null = null
    protected glProgram: WebGLProgram | null = null
    protected glTexture: WebGLTexture | null = null
    protected glBuffer: WebGLBuffer | null = null
    protected canvasElement: HTMLCanvasElement | null = null
    protected isInitialized = false

    /**
     * 初始化WebGL上下文
     */
    protected initWebGL(canvas: HTMLCanvasElement, vertexShaderSource: string, fragmentShaderSource: string): void {
        try {
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

            // 创建着色器
            const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)
            const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource)
            
            // 创建程序
            this.glProgram = this.createProgram(this.gl, vertexShader, fragmentShader)
            
            // 创建缓冲区
            this.glBuffer = this.gl.createBuffer()
            if (!this.glBuffer) {
                console.error('无法创建缓冲区');
                return;
            }
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glBuffer)
            
            // 创建纹理
            this.glTexture = this.gl.createTexture()
            if (!this.glTexture) {
                console.error('无法创建纹理');
                return;
            }
            
            // 设置纹理参数
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture)
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
        } catch (error) {
            console.error('WebGL 初始化失败:', error);
        }
    }

    /**
     * 创建着色器
     */
    protected createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
        const shader = gl.createShader(type)!
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed')
        }
        return shader
    }

    /**
     * 创建WebGL程序
     */
    protected createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
        const program = gl.createProgram()!
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program) || 'Program link failed')
        }
        return program
    }

    /**
     * 停止特效
     */
    public async stop(): Promise<void> {
        this.isInitialized = false
    }
} 