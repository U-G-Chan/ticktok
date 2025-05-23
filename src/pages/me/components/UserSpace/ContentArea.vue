<template>
  <div class="content-area-container">
    <!-- 内容标签页 -->
    <div class="content-tabs" ref="contentTabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="tab" 
        :class="{ active: currentTab === tab.id }"
        @click="handleTabSwitch(tab.id)"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <ContentGrid
          :content-items="currentState.items"
          :loading="currentState.loading"
          :has-more="currentState.hasMore"
          :list-type="currentTab"
          @item-click="handleItemClick"
          @empty-action="handleEmptyAction"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ContentItem, ListType } from '@/types/userContent'
import { useUserContent } from './hooks/useUserContent'
import ContentGrid from './ContentGrid.vue'

export default defineComponent({
  name: 'ContentArea',
  components: {
    ContentGrid
  },
  setup() {
    const router = useRouter()
    const contentTabs = ref<HTMLElement | null>(null)
    const activeSubTab = ref('videos')
    
    // 模拟当前用户ID，实际项目中应该从store或路由参数获取
    const currentUserId = '123456'
    
    // 使用内容管理hook
    const {
      currentTab,
      currentState,
      switchTab,
      loadMoreCurrentContent,
      init
    } = useUserContent(currentUserId)
    
    const tabs = [
      { id: 'works' as ListType, name: '作品' },
      { id: 'recommend' as ListType, name: '推荐' },
      { id: 'collection' as ListType, name: '收藏' },
      { id: 'likes' as ListType, name: '喜欢' }
    ]
    
    const recommendSubTabs = [
      { id: 'videos', name: '视频' },
      { id: 'locations', name: '地点' }
    ]
    
    // 处理标签切换
    const handleTabSwitch = async (tabId: ListType) => {
      await switchTab(tabId)
    }
    
    // 处理推荐子标签切换
    const switchSubTab = (subTabId: string) => {
      activeSubTab.value = subTabId
      // TODO: 根据子标签加载不同内容
    }
    
    // 处理内容项点击
    const handleItemClick = (item: ContentItem) => {
      console.log('点击内容项:', item)
      // TODO: 跳转到内容详情页
      // router.push(`/content/${item.itemId}`)
    }
    
    // 处理空状态按钮点击
    const handleEmptyAction = (listType: ListType) => {
      if (listType === 'works') {
        // 跳转到发布页面
        router.push('/publish')
      }
    }
    
    // 滚动加载更多
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // 距离底部100px时触发加载更多
      if (scrollTop + windowHeight >= documentHeight - 100) {
        if (currentState.value.hasMore && !currentState.value.loading) {
          loadMoreCurrentContent()
        }
      }
    }
    
    onMounted(async () => {
      // 初始化加载内容
      await init()
      
      // 添加滚动事件监听
      window.addEventListener('scroll', handleScroll)
    })
    
    onUnmounted(() => {
      // 移除滚动事件监听
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      currentTab,
      currentState,
      tabs,
      recommendSubTabs,
      activeSubTab,
      contentTabs,
      handleTabSwitch,
      switchSubTab,
      handleItemClick,
      handleEmptyAction
    }
  }
})
</script>

<style scoped>
.content-area-container {
  background-color: #fff;
}

/* 内容标签页 */
.content-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 5;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 15px;
  color: #666;
  position: relative;
  cursor: pointer;
  transition: color 0.2s ease;
}

.tab.active {
  color: #000;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30%;
  width: 40%;
  height: 2px;
  background-color: #000;
}

.tab:hover {
  color: #333;
}

/* 内容区域 */
.content-area {
  min-height: 400px;
}

</style> 