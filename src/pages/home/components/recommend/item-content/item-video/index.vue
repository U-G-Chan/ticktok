<template>
  <div class="video-content">
    <video-player
      ref="videoPlayerRef"
      :video-url="data.videoUrl"
      @drag-start="handleDragStart"
      @drag-move="handleDragMove"
      @drag-end="handleDragEnd"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import VideoPlayer from './components/VideoPlayer.vue'
import VideoSidebar from './components/VideoSidebar.vue'
import VideoFooter from './components/VideoFooter.vue'

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
}
</style> 