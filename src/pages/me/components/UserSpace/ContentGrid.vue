<template>
  <div class="content-grid">
    <!-- 加载状态 -->
    <div v-if="loading && contentItems.length === 0" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!loading && contentItems.length === 0" class="empty-container">
      <div class="empty-icon">📝</div>
      <div class="empty-title">{{ emptyStateConfig.title }}</div>
      <div class="empty-description">{{ emptyStateConfig.description }}</div>
      <button 
        v-if="emptyStateConfig.showButton" 
        class="empty-action-btn"
        @click="handleEmptyAction"
      >
        {{ emptyStateConfig.buttonText }}
      </button>
    </div>
    
    <!-- 内容网格 -->
    <div v-else class="grid-container">
      <ContentGridItem
        v-for="item in contentItems"
        :key="item.itemId"
        :item="item"
        @click="handleItemClick"
      />
      
      <!-- 加载更多状态 -->
      <div v-if="loading && contentItems.length > 0" class="load-more-container">
        <div class="loading-spinner small"></div>
        <span class="load-more-text">加载更多...</span>
      </div>
      
      <!-- 没有更多数据 -->
      <div v-if="!hasMore && contentItems.length > 0" class="no-more-container">
        <span class="no-more-text">暂时没有更多了</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ContentItem, ListType } from '@/types/userContent'
import ContentGridItem from './ContentGridItem.vue'

interface EmptyStateConfig {
  title: string
  description: string
  showButton: boolean
  buttonText?: string
}

export default defineComponent({
  name: 'ContentGrid',
  components: {
    ContentGridItem
  },
  props: {
    contentItems: {
      type: Array as PropType<ContentItem[]>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String as PropType<ListType>,
      required: true
    }
  },
  emits: ['item-click', 'empty-action'],
  setup(props, { emit }) {
    // 空状态配置
    const emptyStateConfig = computed((): EmptyStateConfig => {
      switch (props.listType) {
        case 'works':
          return {
            title: '发作品，留下记忆',
            description: '开始在TickTok记录生活',
            showButton: true,
            buttonText: '去发布'
          }
        case 'recommend':
          return {
            title: '暂无推荐内容',
            description: '多关注一些感兴趣的创作者吧',
            showButton: false
          }
        case 'collection':
          return {
            title: '暂无收藏内容',
            description: '收藏喜欢的内容，随时回看',
            showButton: false
          }
        case 'likes':
          return {
            title: '暂无喜欢的内容',
            description: '给喜欢的内容点赞吧',
            showButton: false
          }
        default:
          return {
            title: '暂无内容',
            description: '',
            showButton: false
          }
      }
    })
    
    // 处理项目点击
    const handleItemClick = (item: ContentItem) => {
      emit('item-click', item)
    }
    
    // 处理空状态按钮点击
    const handleEmptyAction = () => {
      emit('empty-action', props.listType)
    }
    
    return {
      emptyStateConfig,
      handleItemClick,
      handleEmptyAction
    }
  }
})
</script>

<style scoped>
.content-grid {
  padding: 5px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin-bottom: 8px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.4;
}

.empty-action-btn {
  padding: 10px 24px;
  background-color: #fe2c55;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.empty-action-btn:hover {
  background-color: #e02547;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.load-more-container {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.load-more-text {
  color: #666;
  font-size: 14px;
  margin-left: 8px;
}

.no-more-container {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.no-more-text {
  color: #999;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 