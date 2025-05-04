<template>
    <div class="camera-screen">
        <video ref="videoEl" class="video" autoplay playsinline v-if="!noCamera"></video>
        <div v-if="imageCaptured" class="preview-container">
            <img :src="capturedImageUrl" class="preview-image" />
            <div class="preview-controls">
                <button class="confirm-btn" @click="confirmImage">确认</button>
                <button class="cancel-btn" @click="resetCamera">取消</button>
            </div>
        </div>
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
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { CameraDirection } from '@/utils/web-capacitor-adapter'

export default defineComponent({
    name: 'CameraScreen',
    emits: ['image-confirmed'],
    setup(_, { emit }) {
        const videoEl = ref<HTMLVideoElement | null>(null)
        let mediaStream: MediaStream | null = null
        const imageCaptured = ref<boolean>(false)
        const capturedImageUrl = ref<string>('')
        const noCamera = ref<boolean>(false)

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
                imageCaptured.value = false
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
                                capturedImageUrl.value = imageUrl
                                imageCaptured.value = true
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
                    
                    // 显示捕获的图像但不停止视频流
                    capturedImageUrl.value = imageUrl
                    imageCaptured.value = true
                    
                    return imageUrl
                }
                return null
            } catch (error) {
                console.error('捕获图像失败:', error)
                return null
            }
        }

        const confirmImage = () => {
            // 确认使用已捕获的图像
            emit('image-confirmed', capturedImageUrl.value)
            resetCamera()
        }

        const resetCamera = () => {
            imageCaptured.value = false
            capturedImageUrl.value = ''
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
            imageCaptured,
            capturedImageUrl,
            noCamera,
            switchCamera,
            toggleFlash,
            captureImage,
            resetCamera,
            confirmImage
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
}

.video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.preview-image {
    max-width: 90%;
    max-height: 70%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.preview-controls {
    margin-top: 20px;
    display: flex;
    gap: 20px;
}

.confirm-btn, .cancel-btn {
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: white;
}

.confirm-btn {
    background-color: #4CAF50;
}

.cancel-btn {
    background-color: #f44336;
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