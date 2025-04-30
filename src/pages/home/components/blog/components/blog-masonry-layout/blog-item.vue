<template>
  <div class="blog-item">
    <!-- 博客封面图 -->
    <div class="blog-cover-img">
      <img :src="blog.coverImg" :alt="blog.title" @error="handleImgError" />
    </div>
    
    <!-- 博客标题 -->
    <div class="blog-title">{{ blog.title }}</div>
    
    <!-- 作者信息和点赞数 -->
    <div class="blog-footer">
      <div class="author-info">
        <img class="mini-avatar" :src="blog.authorAvatar" :alt="blog.authorName" @error="handleAvatarError" />
        <span class="author-name">{{ blog.authorName }}</span>
      </div>
      <div class="likes-info">
        <i class="iconfont icon-like"></i>
        <span>{{ formatNumber(blog.likes) }}</span>
      </div>
    </div>
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

// 默认图片，当图片加载失败时显示
const defaultImg = 'https://via.placeholder.com/300x400?text=图片不见了'
const defaultAvatar = 'https://via.placeholder.com/40x40?text=头像'

// 处理图片加载错误
const handleImgError = (e) => {
  e.target.src = defaultImg
}

// 处理头像加载错误
const handleAvatarError = (e) => {
  e.target.src = defaultAvatar
}

// 格式化数字（将大于1000的数字转为k形式）
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}
</script>

<style scoped>
.blog-item {
  width: 100%;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.blog-cover-img {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.blog-cover-img img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-cover-img img:hover {
  transform: scale(1.05);
}

.blog-title {
  padding: 8px 10px;
  font-size: 14px;
  font-weight: normal;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  line-clamp: 2;
  max-height: 2.6em;
}

.blog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px 10px;
}

.author-info {
  display: flex;
  align-items: center;
}

.mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
}

.author-name {
  font-size: 12px;
  color: #666;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.likes-info {
  display: flex;
  align-items: center;
  color: #ff2442;
  font-size: 12px;
}

.likes-info i {
  margin-right: 4px;
  font-size: 14px;
}
</style> 