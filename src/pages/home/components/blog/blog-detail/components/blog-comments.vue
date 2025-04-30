<template>
  <div class="blog-comment">
    <div class="comment-header">
      <span>共{{ comments.length }}条评论</span>
    </div>
    
    <!-- 我的评论输入框 -->
    <div class="my-comment">
      <img src="https://via.placeholder.com/40x40?text=我" class="my-avatar" />
      <div class="comment-input-wrapper">
        <input type="text" class="comment-input" placeholder="说点什么..." readonly />
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="comment-list">
      <div 
        v-for="comment in comments" 
        :key="comment.id" 
        class="comment-item"
      >
        <img 
          :src="comment.authorAvatar" 
          :alt="comment.authorName" 
          class="comment-avatar" 
          @error="handleAvatarError"
        />
        <div class="comment-content">
          <div class="comment-author">{{ comment.authorName }}</div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-footer">
            <span class="comment-time">{{ comment.createdAt }}</span>
            <span class="comment-location">{{ comment.location }}</span>
          </div>
        </div>
        <div class="comment-likes">
          <i class="iconfont icon-like"></i>
          <span>{{ comment.likes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  comments: {
    type: Array,
    required: true
  }
})

// 处理头像加载错误
const handleAvatarError = (e) => {
  e.target.src = 'https://via.placeholder.com/40x40?text=头像'
}
</script>

<style scoped>
/* 评论区 */
.blog-comment {
  padding: 16px;
}

.comment-header {
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.my-comment {
  display: flex;
  margin-bottom: 16px;
}

.my-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input-wrapper {
  flex: 1;
  margin-left: 8px;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 6px 12px;
}

.comment-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.comment-list {
  margin-top: 16px;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
  position: relative;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
  margin-left: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 6px;
}

.comment-footer {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.comment-time {
  margin-right: 8px;
}

.comment-likes {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 0;
}

.comment-likes i {
  margin-right: 4px;
}
</style> 