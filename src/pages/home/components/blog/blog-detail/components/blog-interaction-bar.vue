<template>
  <div class="blog-interaction-bar">
    <div class="comment-box">
      <input type="text" placeholder="说点什么..." readonly />
    </div>
    <div class="interaction-icons">
      <div class="icon-item">
        <icon-like theme="outline" size="28" fill="#666"/>
        <span>{{ formatNumber(blog.likes) }}</span>
      </div>
      <div class="icon-item">
        <icon-comment theme="outline" size="28" fill="#666"/>
        <span>{{ formatNumber(blog.comments.length) }}</span>
      </div>
      <div class="icon-item">
        <icon-star theme="outline" size="28" fill="#666"/>
        <span>{{ formatNumber(blog.stars) }}</span>
      </div>
      <div class="icon-item">
        <icon-share-two theme="outline" size="28" fill="#666"/>
        <span>{{ formatNumber(blog.forwards) }}</span>
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
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-like', 'toggle-star'])

// 点赞/取消点赞
const toggleLike = () => {
  emit('toggle-like')
}

// 收藏/取消收藏
const toggleStar = () => {
  emit('toggle-star')
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
/* 底部互动栏 */
.blog-interaction-bar {
  display: flex;
  align-items: center;
  padding: 10px 10px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
  z-index: 10;
  height: 56px;
}

.comment-box {
  flex: 0.3;
  background: #f5f5f5;
  border-radius: 18px;
  padding: 8px 12px;
  margin-right: 12px;
}

.comment-box input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.interaction-icons {
  flex: 0.7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #666;
  flex: 1;
}

.icon-item i {
  font-size: 20px;
  margin-bottom: 2px;
}

.icon-item i.active {
  color: #ff2442;
}
</style> 