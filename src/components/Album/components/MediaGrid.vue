<template>
    <div class="media-grid">
        <div 
            v-for="(item, index) in items" 
            :key="index" 
            class="media-item"
            @click="$emit('preview', item)"
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    url: string;
    thumbnail?: string;
    date: Date;
    duration?: number;
    path: string;
}

export default defineComponent({
    name: 'MediaGrid',
    props: {
        items: {
            type: Array as () => MediaItem[],
            required: true
        }
    },
    emits: ['preview'],
    setup() {
        const formatDate = (date: Date) => {
            return new Date(date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        }
        
        const formatDuration = (seconds: number = 0) => {
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = Math.floor(seconds % 60)
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        }
        
        return {
            formatDate,
            formatDuration
        }
    }
})
</script>

<style scoped>
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
</style> 