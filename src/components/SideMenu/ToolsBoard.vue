<template>
  <div class="tools-board">
    <div class="tools-container">
      <div class="tools-header">
        <div class="title">常用功能</div>
      </div>
      <div class="tools-grid">
        <div class="tool-item" v-for="(tool, index) in tools" :key="index">
          <div class="tool-icon">
            <Icon :name="tool.iconName" />
          </div>
          <div class="tool-name">{{ tool.name }}</div>
          <div class="tool-badge" v-if="tool.badge">{{ tool.badge }}</div>
        </div>
      </div>
      <div class="more-tools">
        <div class="more-button">
          <Icon name="grid" size="16" />
          <span>更多功能</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Icon from '../Icon/index.vue'

export default defineComponent({
  name: 'ToolsBoard',
  components: {
    Icon
  },
  setup() {
    const tools = ref([
      { name: '观看历史', iconName: 'history' },
      { name: '我的钱包', iconName: 'wallet', badge: '14.8元待提现' },
      { name: '离线缓存', iconName: 'download' },
      { name: '稍后再看', iconName: 'bookmark' },
      { name: '打车', iconName: 'car' },
      { name: '抖音创作者', iconName: 'video' },
      { name: '直播广场', iconName: 'live' },
      { name: '附近团购', iconName: 'shop' },
      { name: '放映厅', iconName: 'movie' }
    ])
    
    return { tools }
  }
})
</script>

<style scoped>
.tools-board {
  padding: 10px;
  padding-top: 5px;
}

.tools-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 15px;
}

.tools-header {
  margin-bottom: 15px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-bottom: 20px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.tool-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.tool-name {
  font-size: 12px;
  color: #333;
  text-align: center;
}

.tool-badge {
  position: absolute;
  top: -5px;
  right: -15px;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  color: #666;
  white-space: nowrap;
}

.more-tools {
  display: flex;
  justify-content: center;
  border-top: 1px solid #f5f5f5;
  padding-top: 15px;
  width: 100%;
}

.more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  width: 100%;
  max-width: 220px;
  height: 35px;
}

.more-button span {
  font-size: 14px;
  color: #333;
  margin-left: 5px;
}
</style> 