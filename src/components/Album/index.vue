<template>
    <div class="album-page">
        <AlbumHeader />
        
        <div class="content">
            <AlbumTabs v-model="activeTab" />
            
            <MediaGrid 
                v-if="mediaItems.length > 0"
                :items="filteredMediaItems"
                @preview="previewMedia"
            />
            
            <EmptyState v-else />
        </div>
        
        <MediaPreview
            v-model="previewedMedia"
            @close="closePreview"
            @delete="deleteMedia"
            @share="shareMedia"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { getFilesystem, Directory } from '@/utils/web-capacitor-adapter'
import AlbumHeader from './components/AlbumHeader.vue'
import AlbumTabs from './components/AlbumTabs.vue'
import MediaGrid from './components/MediaGrid.vue'
import MediaPreview from './components/MediaPreview.vue'
import EmptyState from './components/EmptyState.vue'

interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    url: string;
    thumbnail?: string;
    date: Date;
    duration?: number;
    path: string;
}

interface FilesystemInterface {
    readdir: (options: any) => Promise<{ files: any[] }>;
    readFile: (options: any) => Promise<{ data: string }>;
    writeFile: (options: any) => Promise<{ uri: string }>;
    deleteFile: (options: any) => Promise<{ success: boolean }>;
    mkdir: (options: any) => Promise<{ success: boolean }>;
}

export default defineComponent({
    name: 'Album',
    components: {
        AlbumHeader,
        AlbumTabs,
        MediaGrid,
        MediaPreview,
        EmptyState
    },
    setup() {
        const activeTab = ref('all')
        const mediaItems = ref<MediaItem[]>([])
        const previewedMedia = ref<MediaItem | null>(null)
        
        // 筛选媒体项
        const filteredMediaItems = computed(() => {
            if (activeTab.value === 'all') return mediaItems.value
            return mediaItems.value.filter(item => item.type === activeTab.value.slice(0, -1))
        })
        
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
                                thumbnail: isVideo ? url : undefined,
                                date,
                                duration: isVideo ? 0 : undefined,
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
        
        onMounted(() => {
            loadMediaFiles()
        })
        
        return {
            activeTab,
            mediaItems,
            filteredMediaItems,
            previewedMedia,
            previewMedia,
            closePreview,
            deleteMedia,
            shareMedia
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

.content {
    padding: 16px;
}
</style> 