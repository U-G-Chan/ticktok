<template>
  <div class="user-space">
    <!-- 用户数据统计 -->
    <div class="user-stats">
      <div class="stat-item">
        <div class="stat-num">0</div>
        <div class="stat-label">获赞</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">0</div>
        <div class="stat-label">互关</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">3</div>
        <div class="stat-label">关注</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">0</div>
        <div class="stat-label">粉丝</div>
      </div>
      <div class="edit-profile-btn" @click="handleEditProfile">编辑主页</div>
    </div>

    <!-- 个人介绍 -->
    <div class="user-intro" @click="handleEditIntro">
      <div class="intro-text">点击添加介绍，让大家认识你...</div>
      <i class="icon-edit"></i>
    </div>

    <!-- 位置和学校标签 -->
    <div class="user-tags" @click="handleAddTags">
      <div class="add-tag-btn">
        <i class="icon-plus"></i>
        <span>添加所在地、学校等标签</span>
      </div>
    </div>

    <!-- 功能区 -->
    <div class="function-area">
      <div class="function-item" @click="handleFunction('mall')">
        <i class="icon-shop func-icon"></i>
        <div class="func-name">抖音商城</div>
      </div>
      <div class="function-item" @click="handleFunction('wallet')">
        <i class="icon-wallet func-icon"></i>
        <div class="func-name">我的钱包</div>
      </div>
      <div class="function-item" @click="handleFunction('service')">
        <i class="icon-service func-icon"></i>
        <div class="func-name">我的客服</div>
      </div>
      <div class="function-item" @click="handleFunction('mini-program')">
        <i class="icon-mini-program func-icon"></i>
        <div class="func-name">我的小程序</div>
      </div>
      <div class="function-item" @click="handleFunction('more')">
        <i class="icon-more func-icon"></i>
        <div class="func-name">全部功能</div>
      </div>
    </div>

    <!-- 内容标签页 -->
    <div class="content-tabs" ref="contentTabs">
      <div 
        v-for="(tab, index) in tabs" 
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
          <i class="icon-camera"></i>
          <div class="empty-tip">
            <div class="tip-title">发作品，留下记忆</div>
            <div class="tip-desc">开始在抖音记录生活</div>
          </div>
          <div class="publish-btn" @click="handlePublish">去发布</div>
        </div>
      </div>
      
      <div v-if="activeTab === 'recommend'" class="tab-content recommend-content">
        <!-- 推荐内容区域 -->
        <div class="subtabs">
          <div 
            v-for="(subTab, index) in recommendSubTabs" 
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
  name: 'UserSpace',
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
    
    const handleEditProfile = () => {
      console.log('编辑主页按钮点击')
    }
    
    const handleEditIntro = () => {
      console.log('编辑介绍按钮点击')
    }
    
    const handleAddTags = () => {
      console.log('添加标签按钮点击')
    }
    
    const handleFunction = (type: string) => {
      console.log(`功能按钮点击: ${type}`)
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
      handleEditProfile,
      handleEditIntro,
      handleAddTags,
      handleFunction,
      handlePublish
    }
  }
})
</script>

<style scoped>
.user-space {
  width: 100%;
  height: auto;
  background-color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}

/* 用户数据统计 */
.user-stats {
  display: flex;
  padding: 20px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-num {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 3px;
}

.edit-profile-btn {
  background-color: #f8f8f8;
  color: #333;
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 个人介绍 */
.user-intro {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  color: #999;
}

.intro-text {
  font-size: 14px;
}

.icon-edit {
  margin-left: 5px;
  font-size: 14px;
}

/* 位置和学校标签 */
.user-tags {
  display: flex;
  justify-content: center;
  padding: 10px 0 15px;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 13px;
}

.icon-plus {
  margin-right: 3px;
  font-size: 12px;
}

/* 功能区 */
.function-area {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.func-icon {
  font-size: 24px;
  color: #666;
  margin-bottom: 5px;
}

.func-name {
  font-size: 12px;
  color: #666;
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
  min-height: 350px;
}

.tab-content {
  padding: 30px 0;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-camera {
  font-size: 40px;
  color: #ddd;
  margin-bottom: 15px;
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