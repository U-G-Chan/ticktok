import { ref } from 'vue'
import { BaseEffectService } from './baseEffectService'

export type FilterType = 'none' | 'grayscale' | 'warm' | 'cool' | 'vintage'

export interface FilterOption {
    type: 'filter'
    name: FilterType
}

export class FilterEffectService extends BaseEffectService {
    private currentFilter = ref<FilterOption | null>(null)
    private currentFilterName: FilterType = 'none'

    constructor() {
        super()
    }

    /**
     * 初始化滤镜效果服务
     */
    public async initialize(canvasElement: HTMLCanvasElement): Promise<void> {
        if (this.isInitialized) return

        // console.log('初始化滤镜效果服务...')
        this.canvasElement = canvasElement
        // 初始化WebGL
        const vertexShaderSource = this.getVertexShaderSource()
        const fragmentShaderSource = this.getFragmentShaderSource(this.currentFilterName)
        this.initWebGL(canvasElement, vertexShaderSource, fragmentShaderSource)
        
        this.isInitialized = true
        // console.log('滤镜效果服务初始化完成')
    }

    /**
     * 设置滤镜
     */
    public setFilter(filter: FilterOption | null): void {
        // console.log('设置滤镜:', filter?.name || 'none')
        this.currentFilter.value = filter
    }

    /**
     * 获取顶点着色器源码
     */
    private getVertexShaderSource(): string {
        return `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `
    }

    /**
     * 获取片段着色器源码
     */
    private getFragmentShaderSource(filter: FilterType): string {
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

    /**
     * 渲染滤镜
     */
    public renderFilter(image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): void {
        if (!this.isInitialized || !this.gl || !this.canvasElement || !this.glProgram) {
            console.warn('滤镜效果服务未初始化或缺少必要资源')
            return
        }
        
        try {
            const filterName = this.currentFilter.value?.name || 'none'
            
            // 如果滤镜有变化，重新初始化WebGL
            if (filterName !== this.currentFilterName) {
                this.currentFilterName = filterName
                const vertexShaderSource = this.getVertexShaderSource()
                const fragmentShaderSource = this.getFragmentShaderSource(filterName)
                this.initWebGL(this.canvasElement, vertexShaderSource, fragmentShaderSource)
                
                // 重新检查初始化是否成功
                if (!this.gl || !this.glProgram) {
                    console.warn('重新初始化WebGL失败')
                    return
                }
            }

            const gl = this.gl
            
            // 确保尺寸匹配
            gl.canvas.width = this.canvasElement.width
            gl.canvas.height = this.canvasElement.height
            
            gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)
            
            // 清除画布
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)

            gl.useProgram(this.glProgram)

            // 绑定顶点和纹理坐标
            gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer)
            
            // 设置顶点和纹理坐标
            const vertices = new Float32Array([
                -1, -1, 0, 0, // 左下
                 1, -1, 1, 0, // 右下
                -1,  1, 0, 1, // 左上
                 1,  1, 1, 1, // 右上
            ])
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            
            // 获取着色器中的属性位置
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

            // 设置 uniform 变量
            const u_image = gl.getUniformLocation(this.glProgram, 'u_image')
            gl.uniform1i(u_image, 0)

            // 绘制
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        } catch (error) {
            console.error('渲染滤镜时发生错误:', error)
        }
    }

    /**
     * 停止滤镜效果
     */
    public async stop(): Promise<void> {
        super.stop()
        this.currentFilter.value = null
        // console.log('滤镜效果服务已停止')
    }
}

// 创建单例实例
export const filterEffectService = new FilterEffectService() 