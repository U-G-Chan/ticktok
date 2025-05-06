<template>
  <div class="tools-board">
    <div class="tools-container">
      <div class="tools-header">
        <div class="title">常用功能</div>
      </div>
      <div class="tools-grid">
        <div class="tool-item" v-for="(tool, index) in tools" :key="index">
          <div class="tool-icon">
            <component 
              :is="'icon-' + tool.iconName" 
              theme="outline" 
              size="30" 
              fill="black"
            />
          </div>
          <div class="tool-name">{{ tool.name }}</div>
        </div>
      </div>
      <div class="more-tools">
        <div class="more-button">
          <icon-system theme="outline" size="16" fill="black"/>
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
      { name: '我的钱包', iconName: 'wallet' },
      { name: '离线缓存', iconName: 'download-two' },
      { name: '稍后再看', iconName: 'folder-plus' },
      { name: '打车', iconName: 'car' },
      { name: '抖音创作者', iconName: 'tips' },
      { name: '直播广场', iconName: 'monitor' },
      { name: '附近团购', iconName: 'fork-spoon' },
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
  color: black;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-name {
  font-size: 14px;
  color: black;
  text-align: center;
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
  border: 2px solid #e8e8e8;
  width: 100%;
  max-width: 220px;
  height: 35px;
}

.more-button span {
  font-size: 14px;
  color: black;
  margin-left: 5px;
}
</style> 