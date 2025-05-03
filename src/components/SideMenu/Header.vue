<template>
  <div class="side-menu-header">
    <div class="weather-info">
      <div class="temperature">26°<span>阴</span></div>
      <div class="location">广州 <i class="location-arrow">›</i></div>
    </div>
    <div class="header-actions">
      <div class="action-button capsule">
        <Icon name="settings" size="16" />
        <span>设置</span>
      </div>
      <div class="action-button capsule">
        <Icon name="scan" size="16" />
        <span>扫一扫</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../Icon/index.vue'

export default defineComponent({
  name: 'SideMenuHeader',
  components: {
    Icon
  }
})
</script>

<style scoped>
.side-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px 5px 15px;
  
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.temperature {
  font-size: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.temperature span {
  font-size: 16px;
  margin-left: 5px;
}

.location {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}

.location-arrow {
  margin-left: 2px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.action-button.capsule {
  flex-direction: row;
  background-color: white;
  border-radius: 20px;
  padding: 5px 20px;
}

.action-button.capsule span {
  font-size: 12px;
  color: #333;
  margin-top: 0;
  margin-left: 4px;
}
</style> 