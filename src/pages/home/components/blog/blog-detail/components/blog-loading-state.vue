<template>
  <div class="loading-state">
    <div class="loading-spinner" v-if="loading"></div>
    <div class="loading-text" v-if="loading">加载中...</div>
    <div class="not-found-text" v-else-if="!loading">博客不存在或已被删除</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
/* 加载状态 */
.loading-state {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff2442;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

.loading-text, .not-found-text {
  font-size: 14px;
  color: #999;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 