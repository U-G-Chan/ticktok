<template>
  <div class="notices-board">
    <div class="notices-container">
      <div class="notices-header">
        <div class="title">通知消息</div>
        <div class="nav-link">
          有新消息 <span class="badge">4</span>
          <i class="arrow">›</i>
        </div>
      </div>
      <div class="notices-list">
        <div class="notice-item">
          <div class="notice-icon blue">
            <icon-chart-pie theme="filled" size="18" fill="#ffffff"/>
          </div>
          <div class="notice-content">
            <div class="notice-title">用户调研：叮~你的有奖问卷...</div>
            <div class="notice-time">前天</div>
          </div>
        </div>
        <div class="notice-item">
          <div class="notice-icon orange">
            <icon-wallet-two theme="filled" size="18" fill="#ffffff"/>
          </div>
          <div class="notice-content">
            <div class="notice-title">钱包服务：14.88元现金待...</div>
            <div class="notice-time">周二</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../Icon/index.vue'

export default defineComponent({
  name: 'NoticesBoard',
  components: {
    Icon
  }
})
</script>

<style scoped>
.notices-board {
  padding: 10px;
  padding-bottom: 5px;
}

.notices-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 15px;
}

.notices-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: black;
}

.nav-link {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.badge {
  display: inline-block;
  background-color: #f44;
  color: white;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 12px;
  margin: 0 2px;
}

.arrow {
  font-size: 16px;
  margin-left: 2px;
}

.notices-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  align-items: center;
}

.notice-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.notice-icon.blue {
  background-color: #1da1f2;
}

.notice-icon.orange {
  background-color: #ff9500;
}

.notice-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notice-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 0;
}

.notice-time {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  white-space: nowrap;
}
</style> 