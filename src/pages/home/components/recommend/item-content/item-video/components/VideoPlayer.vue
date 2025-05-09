<template>
  <div class="video-player" ref="playerRef" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <video
      ref="videoRef"
      class="video"
      :src="videoUrl"
      :muted="false"
      :loop="true"
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
    
    <!-- 暂停/播放图标 - 只在用户主动暂停时显示 -->
    <div class="play-pause-icon" v-if="isPaused && isUserPaused && !isUserInteracting">
      <div class="play-triangle"></div>
    </div>
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
const lastStatus = ref<SlideItemStatus>(SlideItemStatus.INACTIVE)
const isUserInteracting = ref(false)
const isUserPaused = ref(false)

// 监听 itemStatus 变化
watch(() => props.itemStatus, (newStatus, oldStatus) => {
  if (!videoRef.value) return
  
  // 保存上一个状态，便于后续处理
  if (oldStatus !== undefined) {
    lastStatus.value = oldStatus
  }

  if (SlideItemStatusHelper.shouldPlay(newStatus)) {
    // 应该播放的状态
    videoRef.value.play().catch(err => {
      console.error("视频播放失败:", err);
    })
  } else if (SlideItemStatusHelper.isPaused(newStatus)) {
    // 暂停状态
    videoRef.value.pause()
    
    // 如果不应保持状态，则重置
    if (!SlideItemStatusHelper.shouldPreserveState(newStatus) && 
        !SlideItemStatusHelper.shouldPreserveState(oldStatus || SlideItemStatus.INACTIVE)) {
      videoRef.value.currentTime = 0
      progress.value = 0
    }
  } else if (newStatus === SlideItemStatus.INACTIVE) {
    // 完全未激活状态
    videoRef.value.pause()
    videoRef.value.currentTime = 0
    progress.value = 0
  }
}, { immediate: true }) // 添加immediate:true确保组件创建时就执行一次

const togglePlay = () => {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play()
    isUserPaused.value = false
  } else {
    videoRef.value.pause()
    isUserPaused.value = true
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
  isUserInteracting.value = true
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
  isUserInteracting.value = false
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
    // 根据初始状态决定是否播放
    if (SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
      videoRef.value.play().catch(err => {
        console.error("视频初始播放失败:", err);
      })
    }
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

.play-pause-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.play-triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12px 0 12px 20px;
  border-color: transparent transparent transparent rgba(255, 255, 255, 0.8);
  margin-left: 4px;
}
</style> 