<template>
  <div class="blog-content">
    <!-- 标题 -->
    <div class="blog-title">{{ blog.title }}</div>
    
    <!-- 正文 -->
    <div class="blog-text">
      <span class="text-content">{{ blog.content }}</span>
      <div class="blog-tags">
        <span 
          v-for="(tag, index) in blog.tags" 
          :key="index" 
          class="tag"
        >{{ tag }}</span>
      </div>
    </div>
    
    <!-- 发布日期 -->
    <div class="create-time">{{ blog.createdAt }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
/* 博客内容 */
.blog-content {
  padding: 0 0 16px 0;
}

.blog-title {
  padding: 16px 16px 8px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.blog-text {
  padding: 0 16px;
  margin-bottom: 10px;
}

.text-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.blog-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  color: #1890ff;
  font-size: 14px;
}

.create-time {
  padding: 0 16px;
  font-size: 12px;
  color: #999;
}
</style> 