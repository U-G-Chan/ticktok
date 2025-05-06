<template>
  <div>
    <!-- 内容标签页 -->
    <div class="content-tabs" ref="contentTabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="tab" 
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div v-if="activeTab === 'works'" class="tab-content works-content">
        <div class="empty-content">
          <div class="icon-camera-background">
            <icon-camera theme="outline" size="35" fill="#000000"/>
          </div>
          <div class="empty-tip">
            <div class="tip-title">发作品，留下记忆</div>
            <div class="tip-desc">开始在TickTok记录生活</div>
          </div>
          <div class="publish-btn" @click="handlePublish">去发布</div>
        </div>
      </div>
      
      <div v-if="activeTab === 'recommend'" class="tab-content recommend-content">
        <!-- 推荐内容区域 -->
        <div class="subtabs">
          <div 
            v-for="subTab in recommendSubTabs" 
            :key="subTab.id" 
            class="subtab" 
            :class="{ active: activeSubTab === subTab.id }"
            @click="switchSubTab(subTab.id)"
          >
            {{ subTab.name }}
          </div>
        </div>
        
        <div class="subtab-content">
          <!-- 子标签内容区 -->
        </div>
      </div>
      
      <div v-if="activeTab === 'collection'" class="tab-content collection-content">
        <div class="locked-notice">
          <i class="icon-lock"></i>
          <span>内容已设为私密</span>
        </div>
      </div>
      
      <div v-if="activeTab === 'likes'" class="tab-content likes-content">
        <!-- 喜欢内容区域 -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ContentArea',
  setup() {
    const activeTab = ref('works')
    const activeSubTab = ref('videos')
    
    const tabs = [
      { id: 'works', name: '作品' },
      { id: 'recommend', name: '推荐' },
      { id: 'collection', name: '收藏' },
      { id: 'likes', name: '喜欢' }
    ]
    
    const recommendSubTabs = [
      { id: 'videos', name: '视频' },
      { id: 'locations', name: '地点' }
    ]
    
    const contentTabs = ref<HTMLElement | null>(null)
    
    const switchTab = (tabId: string) => {
      activeTab.value = tabId
    }
    
    const switchSubTab = (subTabId: string) => {
      activeSubTab.value = subTabId
    }
    
    const handlePublish = () => {
      console.log('去发布按钮点击')
    }
    
    return {
      activeTab,
      activeSubTab,
      tabs,
      recommendSubTabs,
      contentTabs,
      switchTab,
      switchSubTab,
      handlePublish
    }
  }
})
</script>

<style scoped>
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

/* 内容区域 */
.content-area {
  min-height: 400px;
}

.tab-content {
  padding: 30px 0;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-camera-background {
  font-size: 40px;
  color: #ddd;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-radius: 50%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip {
  text-align: center;
  margin-bottom: 20px;
}

.tip-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.tip-desc {
  color: #999;
  font-size: 14px;
}

.publish-btn {
  padding: 8px 20px;
  background-color: #fe2c55;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
}

.subtabs {
  display: flex;
  padding: 5px 15px 15px;
  gap: 15px;
}

.subtab {
  padding: 5px 15px;
  background-color: #f5f5f5;
  border-radius: 15px;
  font-size: 14px;
  color: #666;
}

.subtab.active {
  background-color: #000;
  color: #fff;
}

.locked-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
  padding: 40px 0;
}

.icon-lock {
  font-size: 30px;
  margin-bottom: 10px;
}
</style> 