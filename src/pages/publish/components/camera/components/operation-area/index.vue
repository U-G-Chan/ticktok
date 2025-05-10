<template>
    <div class="operation-area">
        <!-- 模式导航 -->
        <mode-nav :activeMode="activeMode" @change-mode="handleModeChange" />

        <!-- 底部操作按钮 -->
        <div class="action-buttons">
            <!-- 特效按钮 -->
            <div class="action-button effects" @click="toggleEffectPanel">
                <div class="button-icon">
                    <icon-effects theme="multi-color" size="26" :fill="['#333','#f8e71c' ,'#f8e71c' ,'#f5a623']" />
                </div>
                <div class="button-text">特效</div>
            </div>

            <!-- 拍照按钮 -->
            <div class="capture-button" @click.stop="handleCapture" @mousedown.stop="handlePressStart"
                @mouseup.stop="handlePressEnd" @mouseleave.stop="handlePressEnd" @touchstart.stop="handlePressStart"
                @touchend.stop="handlePressEnd">
                <div class="inner-circle" :class="{ 'pressed': isPressed }"></div>
                <div v-if="noCamera" class="upload-text">选择</div>
            </div>

            <!-- 相册按钮 -->
            <div class="action-button album" @click="navigateToAlbum">
                <div class="button-icon album-preview">
                    <img v-if="latestPhoto" :src="latestPhoto.url" alt="相册" class="album-image" />
                    <img v-else src="/images/album-icon.png" alt="相册" class="placeholder-icon" />
                </div>
                <div class="button-text">相册</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModeNav from './components/mode-nav/index.vue'
import { getFilesystem, Directory } from '@/utils/web-capacitor-adapter'
import { useEffectPanelStore } from '@/store/effectPanel'

interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    url: string;
    date: Date;
    path: string;
}

interface FilesystemInterface {
    readdir: (options: any) => Promise<{ files: any[] }>;
    readFile: (options: any) => Promise<{ data: string }>;
}

export default defineComponent({
    name: 'OperationArea',
    components: {
        ModeNav
    },
    props: {
        noCamera: {
            type: Boolean,
            default: false
        }
    },
    emits: ['capture', 'mode-change', 'toggle-effect-panel', 'upload'],
    setup(_, { emit }) {
        const router = useRouter()
        const activeMode = ref('photo')
        const isPressed = ref(false)
        const isCapturing = ref(false)
        const latestPhoto = ref<MediaItem | null>(null)
        const effectPanelStore = useEffectPanelStore()

        const handleModeChange = (mode: string) => {
            activeMode.value = mode
            emit('mode-change', mode)
        }

        const navigateToAlbum = () => {
            router.push('/publish/album')
        }

        const handlePressStart = () => {
            if (!isCapturing.value) {
                isPressed.value = true
            }
        }

        const handlePressEnd = () => {
            if (isPressed.value && !isCapturing.value) {
                isPressed.value = false
                handleCapture()
            }
        }

        const handleCapture = () => {
            if (!isCapturing.value) {
                isCapturing.value = true
                emit('capture')
                setTimeout(() => {
                    isCapturing.value = false
                    // 拍照后刷新最新图片
                    loadLatestPhoto()
                }, 1000) // 设置1秒的冷却时间
            }
        }

        // 加载最新的照片
        const loadLatestPhoto = async () => {
            try {
                const Filesystem = await getFilesystem() as FilesystemInterface

                // 读取photos目录
                try {
                    const result = await Filesystem.readdir({
                        path: 'photos',
                        directory: Directory.Data
                    })

                    // 如果没有文件，直接返回
                    if (!result.files || result.files.length === 0) return

                    // 筛选照片文件
                    const photoFiles = result.files.filter(file => {
                        const name = file.name.toLowerCase()
                        return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')
                    })

                    // 如果没有照片，直接返回
                    if (photoFiles.length === 0) return

                    // 根据文件名(时间戳)排序，获取最新的照片
                    photoFiles.sort((a, b) => {
                        const timestampA = parseInt(a.name.split('.')[0], 10)
                        const timestampB = parseInt(b.name.split('.')[0], 10)
                        return timestampB - timestampA // 降序排列，最新的在前
                    })

                    const latestFile = photoFiles[0]

                    // 读取文件内容
                    const fileData = await Filesystem.readFile({
                        path: `photos/${latestFile.name}`,
                        directory: Directory.Data
                    })

                    // 创建URL
                    let url = ''
                    if (typeof fileData.data === 'string') {
                        const ext = latestFile.name.split('.').pop()?.toLowerCase()
                        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'
                        url = `data:${mimeType};base64,${fileData.data}`
                    }

                    // 提取时间戳
                    const timestamp = latestFile.name.split('.')[0]
                    const date = new Date(parseInt(timestamp, 10))

                    latestPhoto.value = {
                        id: latestFile.name,
                        type: 'photo',
                        url,
                        date,
                        path: `photos/${latestFile.name}`
                    }
                } catch (err) {
                    console.error('读取相册文件失败:', err)
                }
            } catch (error) {
                console.error('初始化文件系统失败:', error)
            }
        }

        // 打开特效面板
        const toggleEffectPanel = () => {
            effectPanelStore.toggle()
        }

        onMounted(() => {
            loadLatestPhoto()
        })

        return {
            activeMode,
            isPressed,
            latestPhoto,
            handleModeChange,
            navigateToAlbum,
            handlePressStart,
            handlePressEnd,
            handleCapture,
            toggleEffectPanel
        }
    }
})
</script>

<style scoped>
.operation-area {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: 30px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.action-buttons {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 30px;
    padding: 0 20px;
}

.action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    cursor: pointer;
}

.button-icon {
    width: 50px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
}

.album-preview {
    overflow: hidden;
}

.album-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

.placeholder-icon {
    width: 30px;
    height: 30px;
    opacity: 0.8;
    pointer-events: none;
}

.button-text {
    font-size: 14px;
    color: #fff;
    user-select: none;
    -webkit-user-select: none;
}

.capture-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    -webkit-tap-highlight-color: transparent;
    outline: none;
    user-select: none;
    -webkit-user-select: none;
}

.inner-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform 0.2s ease;
}

.inner-circle.pressed {
    transform: scale(0.8);
}

.upload-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: #fff;
    user-select: none;-webkit-user-select:none;
}
</style> 