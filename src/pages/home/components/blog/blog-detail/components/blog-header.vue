<template>
  <div class="blog-detail-header">
    <div class="left-section">
      <div class="return-btn" @click="goBack">
        <icon-left theme="outline" size="28" fill="#000000"/>
      </div>
      <div class="user-info">
        <img 
          class="author-avatar" 
          :src="blog.authorAvatar" 
          :alt="blog.authorName" 
          @error="handleAvatarError" 
        />
        <div class="author-name">{{ blog.authorName }}</div>
      </div>
    </div>
    <div class="right-section">
      <div 
        class="follow-btn"
        :class="{ 'followed': blog.isFollowing }"
        @click="toggleFollow"
      >
        {{ blog.isFollowing ? '已关注' : '关注' }}
      </div>
      <div class="search-btn" @click="goToSearch">
        <icon-search theme="outline" size="28" fill="#000000"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['go-back', 'go-search', 'toggle-follow'])

// 处理头像加载错误
const handleAvatarError = (e) => {
  e.target.src = 'https://via.placeholder.com/40x40?text=头像'
}

// 返回上一页
const goBack = () => {
  emit('go-back')
}

// 跳转到搜索页面
const goToSearch = () => {
  emit('go-search')
}

// 关注/取消关注
const toggleFollow = () => {
  emit('toggle-follow')
}
</script>

<style scoped>
/* 顶部 */
.blog-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  height: 55px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.left-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.return-btn {
  font-size: 20px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}

.author-name {
  font-size: 14px;
  font-weight: normal;
  color: #333;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.follow-btn {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 16px;
  background: #ff2442;
  color: #fff;
  border: none;
}

.follow-btn.followed {
  background: #f5f5f5;
  color: #666;
}

.search-btn {
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}
</style> 