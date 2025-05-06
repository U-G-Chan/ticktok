<template>
  <div class="video-sidebar" :style="{ opacity: opacityStyle }">
    <div class="sidebar-item avatar-container">
      <div class="avatar">
        <img :src="avatar" alt="avatar" />
      </div>
      <div class="follow-btn">+</div>
    </div>
    <div class="sidebar-item">
      <div class="icon like-icon" @click="toggleLike">
        <icon-like theme="filled" size="35" :fill="isLiked ? '#ff4040' : '#fff'" />
      </div>
      <span class="count">{{ formatCount(likes) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon">
        <!-- <icon-message theme="outline" size="35" fill="#ffffff"/> -->
        <icon-comment theme="filled" size="35" fill="#ffffff"/>
      </div>
      <span class="count">{{ formatCount(comments) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon" @click="toggleStar">
        <icon-star theme="filled" size="35" :fill="isStarred ? '#ffc107' : '#fff'"/>
      </div>
      <span class="count">{{ formatCount(stars) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon">
        <icon-share-two theme="filled" size="35" fill="#ffffff"  strokeLinejoin="bevel"/>
      </div>
      <span class="count">{{ formatCount(forwards) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon music-icon">
        <icon-music theme="outline" size="35" fill="#ffffff"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  avatar: string
  likes?: number
  comments?: number
  stars?: number
  forwards?: number
  opacity?: number
}>(), {
  likes: 0,
  comments: 0,
  stars: 0,
  forwards: 0
})

defineOptions({
  name: 'VideoSidebar'
})

const isLiked = ref(false)
const isStarred = ref(false)

const opacityStyle = computed(() => {
  if (props.opacity === undefined) return 1
  return Math.max(0.5, props.opacity)
})

const formatCount = (count: number | undefined) => {
  if (count === undefined || count === null) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const toggleStar = () => {
  isStarred.value = !isStarred.value
}
</script>

<style scoped>
.video-sidebar {
  position: absolute;
  right: 12px;
  bottom: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
}

.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.avatar-container {
  position: relative;
  margin-bottom: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #fff;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.follow-btn {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: #ff4040;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon:active {
  transform: scale(0.9);
}

.count {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  min-width: 30px;
  text-align: center;
}
</style> 