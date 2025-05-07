<template>
  <div class="blog-search-bar" @click="goSearch">
    <div class="search-icon">
      <icon-search theme="outline" size="18" fill="#333"/>
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
/* 容器样式 */
.blog-search-bar {
  /* 布局 */
  display: flex;
  align-items: center;
  align-self: center;
  
  /* 尺寸 */
  width: calc(100% - 24px);
  padding: 2px 16px;
  margin: 0 12px;
  
  /* 外观 */
  background: white;
  backdrop-filter: blur(10px);
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 搜索图标 */
.search-icon {
  margin-right: 8px;
  color: #666;
  font-size: 18px;
}

/* 搜索输入框容器 */
.search-input-wrapper {
  /* 布局 */
  flex: 1;
  display: flex;
  align-items: center;
  
  /* 尺寸 */
  padding: 8px 5px;

  border-right: 1px solid #e0e0e0;
}

/* 搜索输入框 */
.search-input {
  /* 尺寸 */
  width: 100%;
  
  /* 外观 */
  border: none;
  background: white;
  font-size: 14px;
  color: #333;
  
  /* 交互 */
  outline: none;
}

/* 搜索按钮 */
.search-button {
  margin-left: 10px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}
</style> 