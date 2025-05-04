<template>
    <div class="upload page">
        <h1>上传</h1>
        <div class="camera-container">
            <div class="preview" v-if="imageUrl">
                <img :src="imageUrl" alt="预览图片" />
            </div>
            <button class="camera-btn" @click="takePicture">拍照</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'UploadPage',
    setup() {
        const imageUrl = ref<string>('')

        const takePicture = async () => {
            try {
                // 检查浏览器是否支持getUserMedia
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert('您的浏览器不支持摄像头功能')
                    return
                }

                // 请求摄像头权限
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment' // 优先使用后置摄像头
                    }
                })

                // 创建video元素
                const video = document.createElement('video')
                video.srcObject = stream
                video.autoplay = true

                // 等待视频加载
                await new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        video.play()
                        resolve(true)
                    }
                })

                // 创建canvas元素
                const canvas = document.createElement('canvas')
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.drawImage(video, 0, 0)
                    // 停止视频流
                    stream.getTracks().forEach(track => track.stop())
                    // 转换为图片URL
                    imageUrl.value = canvas.toDataURL('image/jpeg')
                }
            } catch (error) {
                console.error('拍照失败:', error)
                alert('无法访问摄像头，请确保已授予摄像头权限')
            }
        }

        return {
            imageUrl,
            takePicture
        }
    }
})
</script>

<style scoped>
.upload {
    color: #fff;
    padding: 20px;
}

.page {
    width: 100%;
    height: 100%;
}

.camera-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
}

.preview {
    width: 300px;
    height: 300px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.camera-btn {
    padding: 12px 24px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.camera-btn:hover {
    background-color: #45a049;
}
</style>