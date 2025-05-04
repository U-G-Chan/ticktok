<template>
    <div 
        class="camera-screen" 
        :class="effectBinding"
    >
        <video ref="videoEl" class="video" autoplay playsinline v-if="!noCamera"></video>
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

export default defineComponent({
    name: 'CameraScreen',
    emits: ['image-confirmed'],
    setup(_, { emit }) {
        const videoEl = ref<HTMLVideoElement | null>(null)
        let mediaStream: MediaStream | null = null
        const captureEffectActive = ref<boolean>(false)
        const noCamera = ref<boolean>(false)
        
        // 当前使用的拍照效果类型
        const captureEffectType = ref<CaptureEffectType>('pulse')

        // 计算当前效果的类绑定
        const effectBinding = computed(() => 
            createEffectClassBinding(captureEffectType.value, captureEffectActive.value)
        )

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
                                // 直接确认图片，无需显示预览
                                emit('image-confirmed', imageUrl)
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
            
            if (!videoEl.value || !mediaStream) return null

            try {
                // 创建canvas元素
                const canvas = document.createElement('canvas')
                canvas.width = videoEl.value.videoWidth
                canvas.height = videoEl.value.videoHeight
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.drawImage(videoEl.value, 0, 0)
                    // 转换为图片URL
                    const imageUrl = canvas.toDataURL('image/jpeg')
                    
                    // 播放拍照效果
                    playCaptureEffect()
                    
                    // 直接确认图片，无需显示预览
                    emit('image-confirmed', imageUrl)
                    
                    return imageUrl
                }
                return null
            } catch (error) {
                console.error('捕获图像失败:', error)
                return null
            }
        }

        const stopCamera = () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop())
                mediaStream = null
            }
        }

        onMounted(() => {
            initializeCamera()
        })

        onUnmounted(() => {
            stopCamera()
        })

        return {
            videoEl,
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
    width: 100%;
    height: 100%;
    object-fit: cover;
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