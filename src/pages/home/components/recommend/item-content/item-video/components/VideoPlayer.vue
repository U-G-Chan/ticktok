<template>
  <div class="video-player" ref="playerRef" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <video
      ref="videoRef"
      class="video"
      :src="videoUrl"
      :muted="false"
      :loop="true"
      autoplay
      playsinline
      webkit-playsinline
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @click="togglePlay"
    ></video>
    <video-progress :progress="progress" :is-paused="isPaused" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import VideoProgress from './VideoProgress.vue'
import { SlideItemStatus, SlideItemStatusHelper } from '@/types/slide'

const props = defineProps<{
  videoUrl: string
  itemStatus: SlideItemStatus
}>()

const emit = defineEmits<{
  dragStart: [e: TouchEvent]
  dragMove: [e: TouchEvent]
  dragEnd: [e: TouchEvent]
  timeupdate: [currentTime: number, duration: number]
  isPausedChange: [isPaused: boolean]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const playerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const startX = ref(0)
const startY = ref(0)
const isPaused = ref(true)
const lastStatus = ref(SlideItemStatus.INACTIVE)

// 监听 itemStatus 变化
watch(() => props.itemStatus, (newStatus, oldStatus) => {
  if (!videoRef.value) return
  
  // 保存上一个状态，便于后续处理
  lastStatus.value = oldStatus

  if (SlideItemStatusHelper.shouldPlay(newStatus)) {
    // 应该播放的状态
    videoRef.value.play()
  } else if (SlideItemStatusHelper.isPaused(newStatus)) {
    // 暂停状态
    videoRef.value.pause()
    
    // 如果不应保持状态，则重置
    if (!SlideItemStatusHelper.shouldPreserveState(newStatus) && 
        !SlideItemStatusHelper.shouldPreserveState(oldStatus)) {
      videoRef.value.currentTime = 0
      progress.value = 0
    }
  } else if (newStatus === SlideItemStatus.INACTIVE) {
    // 完全未激活状态
    videoRef.value.pause()
    videoRef.value.currentTime = 0
    progress.value = 0
  }
})

const togglePlay = () => {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play()
  } else {
    videoRef.value.pause()
  }
}

const handlePlay = () => {
  isPaused.value = false
  emit('isPausedChange', false)
}

const handlePause = () => {
  isPaused.value = true
  emit('isPausedChange', true)
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  const currentTime = videoRef.value.currentTime
  const duration = videoRef.value.duration
  progress.value = (currentTime / duration) * 100
  emit('timeupdate', currentTime, duration)
}

const handleTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  emit('dragStart', e)
}

const handleTouchMove = (e: TouchEvent) => {
  const deltaX = Math.abs(e.touches[0].clientX - startX.value)
  const deltaY = Math.abs(e.touches[0].clientY - startY.value)
  if (deltaX > deltaY) {
    e.stopPropagation()
  }
  emit('dragMove', e)
}

const handleTouchEnd = (e: TouchEvent) => {
  emit('dragEnd', e)
}

const setProgress = (newProgress: number) => {
  if (!videoRef.value) return
  const time = (newProgress / 100) * videoRef.value.duration
  videoRef.value.currentTime = time
}

const reset = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = 0
  videoRef.value.pause()
  progress.value = 0
  isPaused.value = true
  emit('isPausedChange', true)
}

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.muted = false
  }
})

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.src = ''
    videoRef.value.load()
  }
  videoRef.value = null
})

defineExpose({
  reset,
  setProgress
})
</script>

<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style> 