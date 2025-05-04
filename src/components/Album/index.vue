<template>
    <div class="album-page">
        <header class="album-header">
            <div class="back-button" @click="goBack">
                <span class="back-icon">←</span>
            </div>
            <h1 class="page-title">我的相册</h1>
        </header>
        
        <div class="content">
            <!-- 标签页切换 -->
            <div class="tabs">
                <div 
                    class="tab" 
                    :class="{ 'active': activeTab === 'all' }" 
                    @click="activeTab = 'all'"
                >全部</div>
                <div 
                    class="tab" 
                    :class="{ 'active': activeTab === 'photos' }" 
                    @click="activeTab = 'photos'"
                >照片</div>
                <div 
                    class="tab" 
                    :class="{ 'active': activeTab === 'videos' }" 
                    @click="activeTab = 'videos'"
                >视频</div>
            </div>
            
            <!-- 内容展示区 -->
            <div class="media-grid" v-if="mediaItems.length > 0">
                <div 
                    v-for="(item, index) in filteredMediaItems" 
                    :key="index" 
                    class="media-item"
                    @click="previewMedia(item)"
                >
                    <img v-if="item.type === 'photo'" :src="item.url" alt="照片" />
                    <div v-else-if="item.type === 'video'" class="video-thumbnail">
                        <img :src="item.thumbnail" alt="视频缩略图" />
                        <div class="video-duration">{{ formatDuration(item.duration) }}</div>
                        <div class="play-icon">▶</div>
                    </div>
                    <div class="media-info">
                        <div class="media-date">{{ formatDate(item.date) }}</div>
                    </div>
                </div>
            </div>
            
            <div class="no-media" v-else>
                <div class="empty-icon">📷</div>
                <div class="empty-text">还没有任何媒体文件</div>
                <div class="empty-subtext">拍照或录制视频后将在这里显示</div>
            </div>
        </div>
        
        <!-- 媒体预览 -->
        <div class="media-preview" v-if="previewedMedia" @click="closePreview">
            <div class="preview-content" >
                <div class="preview-header">
                    <button class="close-btn" @click="closePreview">
                        <span>×</span>
                    </button>
                </div>
                <img 
                    v-if="previewedMedia.type === 'photo'" 
                    :src="previewedMedia.url" 
                    alt="预览照片" 
                    class="preview-image"
                    @click.stop
                />
                <video 
                    v-else-if="previewedMedia.type === 'video'" 
                    :src="previewedMedia.url" 
                    controls 
                    class="preview-video"
                    @click.stop
                ></video>
                <div class="preview-actions" @click.stop>
                    <button class="action-button delete-btn" @click="deleteMedia(previewedMedia)">
                        <span class="action-icon">🗑️</span>
                        <span>删除</span>
                    </button>
                    <button class="action-button share-btn" @click="shareMedia(previewedMedia)">
                        <span class="action-icon">📤</span>
                        <span>分享</span>
                    </button>
                </div>
                <div class="preview-tip">点击空白区域返回相册</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFilesystem, Directory } from '@/utils/web-capacitor-adapter'

interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    url: string;
    thumbnail?: string;
    date: Date;
    duration?: number;
    path: string;
}

// 添加类型声明以解决类型错误
interface FilesystemInterface {
    readdir: (options: any) => Promise<{ files: any[] }>;
    readFile: (options: any) => Promise<{ data: string }>;
    writeFile: (options: any) => Promise<{ uri: string }>;
    deleteFile: (options: any) => Promise<{ success: boolean }>;
    mkdir: (options: any) => Promise<{ success: boolean }>;
}

export default defineComponent({
    name: 'Album',
    setup() {
        const router = useRouter()
        const activeTab = ref('all')
        const mediaItems = ref<MediaItem[]>([])
        const previewedMedia = ref<MediaItem | null>(null)
        
        // 筛选媒体项
        const filteredMediaItems = computed(() => {
            if (activeTab.value === 'all') return mediaItems.value
            return mediaItems.value.filter(item => item.type === activeTab.value.slice(0, -1))
        })
        
        // 格式化日期
        const formatDate = (date: Date) => {
            return new Date(date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        }
        
        // 格式化视频时长
        const formatDuration = (seconds: number = 0) => {
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = Math.floor(seconds % 60)
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        }
        
        // 加载媒体文件
        const loadMediaFiles = async () => {
            try {
                const Filesystem = await getFilesystem() as FilesystemInterface
                
                // 读取photos目录
                try {
                    const result = await Filesystem.readdir({
                        path: 'photos',
                        directory: Directory.Data
                    })
                    
                    // 处理文件列表
                    const items: MediaItem[] = []
                    
                    for (const entry of result.files) {
                        // 判断文件类型
                        const isVideo = entry.name.endsWith('.mp4') || entry.name.endsWith('.mov')
                        const isPhoto = entry.name.endsWith('.jpeg') || entry.name.endsWith('.jpg') || entry.name.endsWith('.png')
                        
                        if (!isVideo && !isPhoto) continue
                        
                        // 读取文件
                        try {
                            const fileData = await Filesystem.readFile({
                                path: `photos/${entry.name}`,
                                directory: Directory.Data
                            })
                            
                            // 创建URL
                            let url = ''
                            if (typeof fileData.data === 'string') {
                                // Base64数据
                                url = `data:image/${isPhoto ? 'jpeg' : 'mp4'};base64,${fileData.data}`
                            }
                            
                            // 提取时间戳
                            const timestamp = entry.name.split('.')[0]
                            const date = new Date(parseInt(timestamp, 10))
                            
                            items.push({
                                id: entry.name,
                                type: isVideo ? 'video' : 'photo',
                                url,
                                thumbnail: isVideo ? url : undefined, // 视频缩略图暂时使用相同URL
                                date,
                                duration: isVideo ? 0 : undefined, // 视频时长暂时设为0
                                path: `photos/${entry.name}`
                            })
                        } catch (readErr) {
                            console.error('读取文件失败:', readErr)
                        }
                    }
                    
                    // 按日期排序，最新的在前
                    items.sort((a, b) => b.date.getTime() - a.date.getTime())
                    mediaItems.value = items
                } catch (dirErr) {
                    console.error('读取目录失败:', dirErr)
                    // 如果目录不存在，创建一个
                    try {
                        await Filesystem.mkdir({
                            path: 'photos',
                            directory: Directory.Data,
                            recursive: true
                        })
                    } catch (mkdirErr) {
                        console.error('创建照片目录失败:', mkdirErr)
                    }
                }
            } catch (error) {
                console.error('初始化文件系统失败:', error)
            }
        }
        
        // 预览媒体
        const previewMedia = (item: MediaItem) => {
            previewedMedia.value = item
        }
        
        // 关闭预览
        const closePreview = () => {
            previewedMedia.value = null
        }
        
        // 删除媒体
        const deleteMedia = async (item: MediaItem) => {
            try {
                const Filesystem = await getFilesystem() as FilesystemInterface
                try {
                    await Filesystem.deleteFile({
                        path: item.path,
                        directory: Directory.Data
                    })
                    
                    // 从列表中移除
                    mediaItems.value = mediaItems.value.filter(media => media.id !== item.id)
                    closePreview()
                } catch (deleteErr) {
                    console.error('删除文件失败:', deleteErr)
                    alert('删除失败，请重试')
                }
            } catch (error) {
                console.error('获取文件系统失败:', error)
                alert('系统错误，请重试')
            }
        }
        
        // 分享媒体
        const shareMedia = (item: MediaItem) => {
            // 此处实现分享功能
            console.log('分享:', item)
            alert('分享功能正在开发中')
        }
        
        // 返回上一页
        const goBack = () => {
            router.back()
        }
        
        onMounted(() => {
            loadMediaFiles()
        })
        
        return {
            activeTab,
            mediaItems,
            filteredMediaItems,
            previewedMedia,
            formatDate,
            formatDuration,
            previewMedia,
            closePreview,
            deleteMedia,
            shareMedia,
            goBack
        }
    }
})
</script>

<style scoped>
.album-page {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    color: #333;
    overflow-y: auto;
}

.album-header {
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: sticky;
    top: 0;
    background-color: #ffffff;
    z-index: 10;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.back-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
}

.back-icon {
    font-size: 24px;
}

.page-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 auto;
    color: #333;
}

.content {
    padding: 16px;
}

.tabs {
    display: flex;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
}

.tab {
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    position: relative;
    color: #666;
}

.tab.active {
    color: #fe2c55;
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #fe2c55;
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 4px;
}

.media-item {
    aspect-ratio: 1/1;
    overflow: hidden;
    border-radius: 12px;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.media-item:hover {
    transform: scale(1.02);
}

.media-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-thumbnail {
    width: 100%;
    height: 100%;
    position: relative;
}

.video-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fe2c55;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.media-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 12px 8px 8px;
    background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.media-date {
    color: white;
    font-size: 12px;
}

.no-media {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: #999;
    text-align: center;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    margin: 20px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #ccc;
}

.empty-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #666;
}

.empty-subtext {
    font-size: 14px;
    color: #999;
}

.media-preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.preview-image, .preview-video {
    max-width: 100%;
    max-height: 80%;
    object-fit: contain;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
}

.preview-actions {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-top: 24px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 16px 32px;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.action-button:hover {
    transform: scale(1.1);
}

.action-icon {
    font-size: 24px;
}

.delete-btn {
    color: #ff4757;
}

.share-btn {
    color: #2e86de;
}

.preview-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    z-index: 5;
}

.close-btn {
    background: rgba(255, 255, 255, 0.8);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 24px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.preview-tip {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #666;
    font-size: 14px;
    opacity: 0.7;
}
</style> 