<template>
    <div class="camera-screen">
        <video ref="videoEl" class="video" autoplay playsinline></video>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
    name: 'CameraScreen',
    setup() {
        const videoEl = ref<HTMLVideoElement | null>(null)
        let mediaStream: MediaStream | null = null

        const initializeCamera = async () => {
            try {
                // 检查浏览器是否支持getUserMedia
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    console.error('您的浏览器不支持摄像头功能')
                    return
                }

                // 请求摄像头权限
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // 优先使用后置摄像头
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                })

                // 设置视频源
                if (videoEl.value) {
                    videoEl.value.srcObject = mediaStream
                }
            } catch (error) {
                console.error('无法访问摄像头:', error)
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
            videoEl
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
</style> 