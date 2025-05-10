<template>
    <div class="media-preview" v-if="modelValue" @click="$emit('close')">
        <div class="preview-content">
            <div class="preview-header">
                <button class="close-btn" @click="$emit('close')">
                    <span>×</span>
                </button>
            </div>
            <img 
                v-if="modelValue.type === 'photo'" 
                :src="modelValue.url" 
                alt="预览照片" 
                class="preview-image"
                @click.stop
            />
            <video 
                v-else-if="modelValue.type === 'video'" 
                :src="modelValue.url" 
                controls 
                class="preview-video"
                @click.stop
            ></video>
            <div class="preview-actions" @click.stop>
                <button class="action-button delete-btn" @click="$emit('delete', modelValue)">
                    <span class="action-icon">🗑️</span>
                    <span>删除</span>
                </button>
                <button class="action-button share-btn" @click="$emit('share', modelValue)">
                    <span class="action-icon">📤</span>
                    <span>分享</span>
                </button>
            </div>
            <div class="preview-tip">点击空白区域返回相册</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

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
    name: 'MediaPreview',
    props: {
        modelValue: {
            type: Object as PropType<MediaItem | null>,
            required: false,
            default: null
        }
    },
    emits: ['close', 'delete', 'share']
})
</script>

<style scoped>
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