<template>
    <div class="content-grid-item" @click="handleItemClick">
        <!-- 草稿箱标记 -->
        <div v-if="showDraftLabel" class="draft-label">
            <icon-hard-disk theme="outline" size="16" fill="#000000"/>
            <text>
                草稿箱
            </text>
        </div>

        <!-- 封面图片 -->
        <div class="thumbnail-container">
            <img :src="item.thumbnail" :alt="item.other?.title || '内容封面'" class="thumbnail" loading="lazy"
                @error="handleImageError" />

            <!-- 加载状态 -->
            <div v-if="imageLoading" class="image-loading">
                <div class="loading-spinner"></div>
            </div>
        </div>

        <!-- 点赞数 -->
        <div class="likes-container">
            <icon-like theme="outline" size="18" fill="white" />
            <span class="likes-count">{{ formatLikes(item.likes) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'
import { ContentItem } from '@/types/userContent'

export default defineComponent({
    name: 'ContentGridItem',
    props: {
        item: {
            type: Object as PropType<ContentItem>,
            required: true
        }
    },
    emits: ['click'],
    setup(props, { emit }) {
        const imageLoading = ref(false)

        // 是否显示草稿箱标签
        const showDraftLabel = computed(() => {
            return props.item.listType === 'works' && props.item.other?.workType === 'draft'
        })

        // 格式化点赞数
        const formatLikes = (likes: number): string => {
            if (likes >= 10000000) {
                return `${(likes / 10000000).toFixed(1)}千万`
            } else if (likes >= 10000) {
                return `${(likes / 10000).toFixed(1)}万`
            } else if (likes >= 1000) {
                return `${(likes / 1000).toFixed(1)}k`
            } else {
                return likes.toString()
            }
        }

        // 处理图片加载错误
        const handleImageError = (event: Event) => {
            const img = event.target as HTMLImageElement
            img.src = '/images/default-thumbnail.png' // 默认图片
            imageLoading.value = false
        }

        // 处理项目点击
        const handleItemClick = () => {
            emit('click', props.item)
        }

        return {
            imageLoading,
            showDraftLabel,
            formatLikes,
            handleImageError,
            handleItemClick
        }
    }
})
</script>

<style scoped>
.content-grid-item {
    position: relative;
    background-color: #f8f8f8;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 9/16;
    /* 短视频比例 */
}

.draft-label {
    position: absolute;
    top: 8px;
    transform: translateX(10%);
    background-color: rgba(255, 255, 255, 0.836);
    color: black;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 2;
}

.thumbnail-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.image-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.likes-container {
    position: absolute;
    bottom: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    padding: 4px 6px;
    border-radius: 12px;
    color: white;
    font-size: 12px;
}

.heart-icon {
    color: #ff2d55;
    margin-right: 4px;
    font-size: 10px;
}

.likes-count {
    font-weight: 500;
}

/* 悬停效果 */
.content-grid-item:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}
</style>