<template>
    <div class="media-container">
        <div class="media-grid">
            <div 
                v-for="(item, index) in items" 
                :key="index" 
                class="media-item"
                @click="toggleSelect(item)"
            >
                <img v-if="item.type === 'photo'" :src="item.url" alt="照片" />
                <div v-else-if="item.type === 'video'" class="video-thumbnail">
                    <img :src="item.thumbnail" alt="视频缩略图" />
                    <div class="video-duration">{{ formatDuration(item.duration) }}</div>
                    <div class="play-icon">▶</div>
                </div>
                
                <!-- 黑色遮罩 -->
                <div 
                    v-if="selectedItems.includes(item.id)" 
                    class="selected-overlay"
                ></div>
                
                <!-- 复选框 -->
                <div 
                    class="checkbox" 
                    :class="{ 'checked': selectedItems.includes(item.id) }"
                    @click.stop="toggleSelect(item)"
                >
                    <span v-if="selectedItems.includes(item.id)" class="check-icon">
                        {{ selectedItems.indexOf(item.id) + 1 }}
                    </span>
                </div>
            </div>
        </div>
        
        <!-- 底部选中栏 -->
        <div class="selection-bar" v-if="selectedItems.length > 0">
            <div class="selected-items">
                <div v-for="(id, idx) in selectedItems" :key="id" class="selected-item">
                    <img :src="getItemById(id)?.url" :alt="`选中项${idx+1}`" />
                    <div class="remove-btn" @click="removeSelected(id)">
                        <icon-close theme="outline" size="10" fill="#fff"/>
                    </div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn note-btn" @click="writeNote">写笔记</button>
                <button class="btn next-btn" @click="$emit('next-step', selectedItems)">
                    下一步 ({{ selectedItems.length }})
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

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
    emits: ['preview', 'next-step'],
    setup(props) {
        const selectedItems = ref<string[]>([]);
        
        const formatDuration = (seconds: number = 0) => {
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = Math.floor(seconds % 60)
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        }
        
        const toggleSelect = (item: MediaItem) => {
            const index = selectedItems.value.indexOf(item.id);
            if (index === -1) {
                selectedItems.value.push(item.id);
            } else {
                selectedItems.value.splice(index, 1);
            }
        }
        
        const removeSelected = (id: string) => {
            const index = selectedItems.value.indexOf(id);
            if (index !== -1) {
                selectedItems.value.splice(index, 1);
            }
        }
        
        const getItemById = (id: string) => {
            return props.items.find(item => item.id === id);
        }
        
        const writeNote = () => {
            console.log('写笔记功能');
            // 此处实现写笔记功能
        }
        
        return {
            formatDuration,
            selectedItems,
            toggleSelect,
            removeSelected,
            getItemById,
            writeNote
        }
    }
})
</script>

<style scoped>
.media-container {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
}

.media-item {
    position: relative;
    aspect-ratio: 1/1;
    overflow: hidden;
    background-color: #eee;
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
    padding: 2px 6px;
    border-radius: 10px;
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
}

/* 选中项黑色遮罩 */
.selected-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    pointer-events: none;
    z-index: 1;
}

/* 复选框样式 */
.checkbox {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.checkbox.checked {
    background-color: #fe2c55;
    border: none;
}

.check-icon {
    color: white;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

/* 底部选中栏 */
.selection-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20%;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 10;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.selected-items {
    display: flex;
    overflow-x: auto;
    padding: 10px;
    gap: 10px;
    height: 60%;
    flex: 0 0 60%;
    box-sizing: border-box;
    align-items: center;
}

.selected-item {
    position: relative;
    height: 90%;
    aspect-ratio: 1/1;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.selected-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 18px;
    height: 18px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
}

.action-buttons {
    display: flex;
    padding: 10px 15px;
    gap: 10px;
    border-top: 1px solid #eee;
    height: 40%;
    flex: 0 0 40%;
    box-sizing: border-box;
    align-items: center;
}

.btn {
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
    border: none;
    cursor: pointer;
}

.note-btn {
    background-color: #f8f8f8;
    color: #333;
    flex: 1;
}

.next-btn {
    background-color: #fe2c55;
    color: white;
    flex: 1;
}
</style> 