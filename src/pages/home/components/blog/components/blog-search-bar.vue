<template>
  <div class="blog-search-bar" @click="goSearch">
    <div class="search-icon">
      <i class="iconfont icon-search"></i>
    </div>
    <div class="search-input-wrapper">
      <input 
        class="search-input" 
        type="text" 
        placeholder="搜索你感兴趣的内容" 
        readonly
      />
    </div>
    <div class="search-button">
      搜索
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goSearch = () => {
  router.push('/home/blog/search')
}
</script>

<style scoped>
.blog-search-bar {
  width: 100%;
  padding: 10px 16px;
  background: #fff;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-icon {
  margin-right: 8px;
  color: #666;
  font-size: 18px;
}

.search-input-wrapper {
  flex: 1;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  color: #333;
}

.search-button {
  margin-left: 10px;
  color: #ff2442;
  font-size: 14px;
  font-weight: 500;
}
</style> 