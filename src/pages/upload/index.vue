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
import { Camera } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'

export default defineComponent({
    name: 'UploadPage',
    setup() {
        const imageUrl = ref<string>('')

        const takePicture = async () => {
            try {
                const image = await Camera.getPhoto({
                    quality: 90,
                    allowEditing: true,
                    resultType: 'uri',
                    saveToGallery: true,
                    promptLabelHeader: '选择操作',
                    promptLabelPhoto: '从相册选择',
                    promptLabelPicture: '拍照'
                })

                // 显示图片
                imageUrl.value = image.webPath || ''

                // 如果需要保存到应用目录
                if (image.path) {
                    const savedFile = await Filesystem.writeFile({
                        path: 'photos/' + new Date().getTime() + '.jpg',
                        data: image.base64String || '',
                        directory: Directory.Data,
                        recursive: true
                    })
                    console.log('图片已保存:', savedFile.uri)
                }
            } catch (error) {
                console.error('拍照失败:', error)
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