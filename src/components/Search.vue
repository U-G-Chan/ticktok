<template>
  <div class="search">
    <div class="search-header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" class="back-icon">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <div class="search-input">
        <input type="text" placeholder="搜索" v-model="searchText" />
      </div>
    </div>
    <div class="search-content">
      <div class="search-history">
        <h3></h3>
        <div class="history-list">
          <div class="history-item">搜索历史记录1</div>
          <div class="history-item">搜索历史记录2</div>
        </div>
      </div>
      <div class="search-suggestions">
        <h3>猜你想搜</h3>
        <div class="suggestion-list">
          <div class="suggestion-item">搜索建议1</div>
          <div class="suggestion-item">搜索建议2</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchText = ref('')

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.search {
  width: 100%;
  height: 100vh;
  background: #fff;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  padding: 5px;
  margin-right: 10px;
  cursor: pointer;
}

.back-icon {
  width: 24px;
  height: 24px;
  fill: #333;
}

.search-input {
  flex: 1;
}

.search-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.search-content {
  padding: 15px;
}

.search-history,
.search-suggestions {
  margin-bottom: 20px;
}

h3 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
}

.history-list,
.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-item,
.suggestion-item {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
</style> 