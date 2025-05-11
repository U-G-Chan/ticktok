<template>
    <div 
        class="camera-screen" 
        :class="effectBinding"
    >
        <video ref="videoEl" class="video" autoplay playsinline v-if="!noCamera"></video>
        <canvas ref="filterCanvasEl" class="canvas filter-canvas" v-if="!noCamera"></canvas>
        <canvas ref="decorationCanvasEl" class="canvas decoration-canvas" v-if="!noCamera"></canvas>
        <div v-if="noCamera" class="no-camera-message">
            <div class="message-content">
                <div class="message-icon">📷</div>
                <div class="message-text">未检测到摄像头</div>
                <div class="message-subtext">请使用其他方式上传照片</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import { CameraDirection } from '@/utils/web-capacitor-adapter'
import { 
    CaptureEffectType, 
    createEffectClassBinding,
    getEffectDuration
} from './captureEffects'
import { faceEffectService } from '@/services/faceEffectService'
import { decorationEffectService } from '@/services/decorationEffectService'

export default defineComponent({
    name: 'CameraScreen',
    setup() {
        const videoEl = ref<HTMLVideoElement | null>(null)
        const filterCanvasEl = ref<HTMLCanvasElement | null>(null)
        const decorationCanvasEl = ref<HTMLCanvasElement | null>(null)
        let mediaStream: MediaStream | null = null
        const captureEffectActive = ref<boolean>(false)
        const noCamera = ref<boolean>(false)
        let animationFrameId: number | null = null
        let lastFrameTime = 0
        let frameCount = 0
        
        // 当前使用的拍照效果类型
        const captureEffectType = ref<CaptureEffectType>('pulse')

        // 计算当前效果的类绑定
        const effectBinding = computed(() => 
            createEffectClassBinding(captureEffectType.value, captureEffectActive.value)
        )

        // 性能监控 - 简化版
        const measurePerformance = (timestamp: number) => {
            if (!lastFrameTime) {
                lastFrameTime = timestamp
                frameCount = 0
            }

            frameCount++
            const elapsed = timestamp - lastFrameTime

            if (elapsed >= 1000) {
                frameCount = 0
                lastFrameTime = timestamp
            }

            animationFrameId = requestAnimationFrame(measurePerformance)
        }

        const initializeCamera = async (direction: string = CameraDirection.Rear) => {
            try {
                // 检查浏览器是否支持getUserMedia
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    console.error('您的浏览器不支持摄像头功能')
                    noCamera.value = true
                    return
                }

                // 停止之前的流
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop())
                }

                // 请求摄像头权限
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: direction === CameraDirection.Front ? 'user' : 'environment',
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                })

                // 设置视频源
                if (videoEl.value) {
                    videoEl.value.srcObject = mediaStream
                    
                    // 等待视频元数据加载完成
                    await new Promise((resolve) => {
                        videoEl.value!.onloadedmetadata = () => {
                            resolve(true)
                        }
                    })

                    // 设置Canvas尺寸
                    if (filterCanvasEl.value && decorationCanvasEl.value) {
                        const container = filterCanvasEl.value.parentElement
                        if (container) {
                            const rect = container.getBoundingClientRect()
                            const videoRatio = videoEl.value.videoWidth / videoEl.value.videoHeight

                            // 计算Canvas尺寸 - 确保高度适应容器，宽度自适应且居中
                            let canvasWidth, canvasHeight
                            
                            // 始终让高度适应容器
                            canvasHeight = rect.height 
                            // 宽度根据视频比例自适应
                            canvasWidth = canvasHeight * videoRatio
                            
                            // 设置Canvas尺寸
                            filterCanvasEl.value.width = canvasWidth
                            filterCanvasEl.value.height = canvasHeight
                            if (decorationCanvasEl.value) {
                                decorationCanvasEl.value.width = canvasWidth
                                decorationCanvasEl.value.height = canvasHeight
                            }
                        }
                    }
                }

                // 开始性能监控
                animationFrameId = requestAnimationFrame(measurePerformance)

                // 初始化美颜服务，传递两个canvas
                if (videoEl.value && filterCanvasEl.value && decorationCanvasEl.value) {
                    await faceEffectService.initialize(videoEl.value, filterCanvasEl.value)
                    await decorationEffectService.initialize(decorationCanvasEl.value)
                }

                // 重置捕获状态
                noCamera.value = false
            } catch (error) {
                console.error('无法访问摄像头:', error)
                noCamera.value = true
            }
        }

        const switchCamera = (direction: string) => {
            initializeCamera(direction)
        }

        const toggleFlash = async (enabled: boolean) => {
            if (!mediaStream || noCamera.value) return

            try {
                const track = mediaStream.getVideoTracks()[0]
                if (track) {
                    const capabilities = track.getCapabilities()
                    // 检查是否支持闪光灯
                    if ('torch' in capabilities) {
                        await track.applyConstraints({
                            advanced: [{ torch: enabled } as any]
                        })
                    } else {
                        console.warn('当前设备不支持闪光灯控制')
                    }
                }
            } catch (error) {
                console.error('控制闪光灯失败:', error)
            }
        }
        
        // 设置拍照效果类型
        const setCaptureEffectType = (type: CaptureEffectType) => {
            captureEffectType.value = type
            // console.log(`已切换到${type}拍照效果`)
        }

        // 播放拍照效果
        const playCaptureEffect = () => {
            captureEffectActive.value = true
            
            // 获取当前效果的持续时间
            const duration = getEffectDuration(captureEffectType.value)
            
            setTimeout(() => {
                captureEffectActive.value = false
            }, duration)
        }

        const captureImage = async (): Promise<string | null> => {
            if (noCamera.value) {
                // 没有摄像头时，打开文件选择器
                return new Promise((resolve, reject) => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    
                    input.onchange = (e: Event) => {
                        const target = e.target as HTMLInputElement
                        if (target.files && target.files[0]) {
                            const file = target.files[0]
                            const reader = new FileReader()
                            reader.onload = () => {
                                const imageUrl = reader.result as string
                                // 播放拍照效果
                                playCaptureEffect()
                                resolve(imageUrl)
                            }
                            reader.onerror = reject
                            reader.readAsDataURL(file)
                        } else {
                            reject(new Error('未选择图片'))
                        }
                    }
                    
                    input.click()
                })
            }
            
            if (!filterCanvasEl.value) return null

            try {
                const width = filterCanvasEl.value.width;
                const height = filterCanvasEl.value.height;
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const ctx = tempCanvas.getContext('2d');

                // 强制 WebGL flush，确保内容可读
                const gl = filterCanvasEl.value.getContext('webgl');
                if (gl && gl.flush) gl.flush();

                // 先绘制滤镜层
                ctx?.drawImage(filterCanvasEl.value, 0, 0, width, height);

                // 再叠加装饰层
                if (decorationCanvasEl.value) {
                    ctx?.drawImage(decorationCanvasEl.value, 0, 0, width, height);
                }

                // 导出合成后的图片
                const imageUrl = tempCanvas.toDataURL('image/jpeg');
                playCaptureEffect();
                return imageUrl;
            } catch (error) {
                console.error('捕获图像失败:', error);
                return null;
            }
        }

        const stopCamera = () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop())
                mediaStream = null
            }
            faceEffectService.stop()
            decorationEffectService.stop()
        }

        // 添加窗口大小变化监听
        const handleResize = () => {
            if (filterCanvasEl.value && videoEl.value) {
                const container = filterCanvasEl.value.parentElement
                if (container) {
                    const rect = container.getBoundingClientRect()
                    const videoRatio = videoEl.value.videoWidth / videoEl.value.videoHeight
                    
                    // 计算Canvas尺寸 - 确保高度适应容器，宽度自适应且居中
                    let canvasWidth, canvasHeight
                    
                    // 始终让高度适应容器
                    canvasHeight = rect.height 
                    // 宽度根据视频比例自适应
                    canvasWidth = canvasHeight * videoRatio
                    
                    // 设置Canvas尺寸
                    filterCanvasEl.value.width = canvasWidth
                    filterCanvasEl.value.height = canvasHeight
                    if (decorationCanvasEl.value) {
                        decorationCanvasEl.value.width = canvasWidth
                        decorationCanvasEl.value.height = canvasHeight
                    }
                }
            }
        }

        onMounted(() => {
            initializeCamera()
            window.addEventListener('resize', handleResize)
        })

        onUnmounted(() => {
            stopCamera()
            window.removeEventListener('resize', handleResize)
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        })

        return {
            videoEl,
            filterCanvasEl,
            decorationCanvasEl,
            captureEffectActive,
            captureEffectType,
            effectBinding,
            noCamera,
            switchCamera,
            toggleFlash,
            captureImage,
            setCaptureEffectType
        }
    }
})
</script>

<style scoped>
.camera-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 1;
    transition: all 0.3s ease;
}

/* 1. 基础缩放效果 */
.capture-effect {
    transform: scale(0.95);
    opacity: 0.9;
}

/* 2. 闪光灯效果 */
.flash-effect {
    position: relative;
}

.flash-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    animation: flash 0.2s ease-out;
    pointer-events: none;
    z-index: 3;
}

@keyframes flash {
    from { opacity: 1; }
    to { opacity: 0; }
}

/* 3. 快门效果 */
.shutter-effect {
    animation: shutter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@keyframes shutter {
    0% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(1);
    }
    15% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(0.97);
    }
    30% { 
        clip-path: inset(50% 0% 50% 0%);
        transform: scale(0.9);
    }
    50% { 
        clip-path: inset(50% 50% 50% 50%);
        transform: scale(0.9);
    }
    80% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(0.95);
    }
    100% { 
        clip-path: inset(0% 0% 0% 0%);
        transform: scale(1);
    }
}

/* 4. 扫描线效果 */
.scan-effect {
    position: relative;
}

.scan-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: rgba(0, 255, 255, 0.8);
    box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
    z-index: 5;
    animation: scanLine 0.6s linear;
    pointer-events: none;
}

@keyframes scanLine {
    from { top: 0; }
    to { top: 100%; }
}

/* 5. 脉冲边框效果 */
.pulse-effect {
    position: relative;
    transform: scale(0.98);
    transition: transform 0.2s;
}

.pulse-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid #fe2c55;
    z-index: 5;
    animation: pulseBorder 0.8s ease-out;
    pointer-events: none;
}

@keyframes pulseBorder {
    0% { 
        opacity: 1;
        transform: scale(0.95);
    }
    50% { 
        opacity: 0.5;
        transform: scale(1.02);
    }
    100% { 
        opacity: 0;
        transform: scale(1.05);
    }
}

.video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.filter-canvas { 
    z-index: 1; 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: none;
    max-height: 100%;
    width: auto;
    height: auto;
}
.decoration-canvas { 
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: none;
    max-height: 100%;
    width: auto;
    height: auto;
}

.no-camera-message {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
}

.message-content {
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
}

.message-icon {
    font-size: 48px;
    margin-bottom: 10px;
}

.message-text {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}

.message-subtext {
    font-size: 14px;
    opacity: 0.8;
}
</style> 