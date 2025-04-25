<template>
  <div class="video-content">
    <video-player
      ref="videoPlayerRef"
      :video-url="data.videoUrl"
      @drag-start="handleDragStart"
      @drag-move="handleDragMove"
      @drag-end="handleDragEnd"
      @timeupdate="handleTimeUpdate"
      @is-paused-change="handlePausedChange"
    />
    <video-sidebar
      :avatar="data.avatar"
      :likes="data.likes"
      :comments="data.comments"
      :stars="data.stars"
      :forwards="data.forwards"
      :opacity="overlayOpacity"
    />
    <video-footer
      :author="data.author"
      :title="data.title"
      :labels="data.labels"
      :opacity="overlayOpacity"
    />
    <video-progress 
      :progress="progress" 
      :is-paused="isPaused"
      @progress-change="handleProgressChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import VideoPlayer from './components/VideoPlayer.vue'
import VideoSidebar from './components/VideoSidebar.vue'
import VideoFooter from './components/VideoFooter.vue'
import VideoProgress from './components/VideoProgress.vue'
import '@/components/Icon/iconfont.css'

interface VideoData {
  id: string
  title: string
  author: string
  videoUrl: string
  avatar: string
  likes: number
  comments: number
  stars: number
  forwards: number
  labels: string[]
  [key: string]: any
}

const { data } = defineProps<{
  data: VideoData
}>()

const videoPlayerRef = ref()
const overlayOpacity = ref(1)
const startY = ref(0)
const progress = ref(0)
const isPaused = ref(false)

const handleDragStart = (e: TouchEvent) => {
  startY.value = e.touches[0].clientY
}

const handleDragMove = (e: TouchEvent) => {
  const deltaY = Math.abs(e.touches[0].clientY - startY.value)
  // 根据拖动距离计算透明度，最小为0.5
  overlayOpacity.value = Math.max(0.5, 1 - deltaY / 200)
}

const handleDragEnd = () => {
  overlayOpacity.value = 1
}

const handleTimeUpdate = (currentTime: number, duration: number) => {
  progress.value = (currentTime / duration) * 100
}

const handlePausedChange = (paused: boolean) => {
  isPaused.value = paused
}

const handleProgressChange = (newProgress: number) => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.setProgress(newProgress)
  }
}

// 当组件被卸载时重置视频
onUnmounted(() => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.reset()
  }
})

defineOptions({
  name: 'VideoContent'
})
</script>

<style scoped>
.video-content {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
  display: flex;
  flex-direction: column;
}

.video-controls {
  position: absolute;
  left: 12px;
  bottom: calc(2px + 12px); /* 进度条高度 + 原来的底部间距 */
  z-index: 1;
  display: flex;
  align-items: center;
}

.danmaku-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.danmaku-btn i {
  font-size: 16px;
  color: #fff;
}

.danmaku-btn span {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}
</style> 