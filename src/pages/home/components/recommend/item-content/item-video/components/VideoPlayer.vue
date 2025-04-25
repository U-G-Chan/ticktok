<template>
  <div class="video-player" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <video
      ref="videoRef"
      class="video"
      :src="videoUrl"
      loop
      autoplay
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @click="togglePlay"
    ></video>
    <div 
      class="progress-bar-container" 
      :class="{ 'show': showProgress, 'dragging': isDragging }"
      @touchstart.stop="handleProgressTouchStart"
      @touchmove.stop="handleProgressTouchMove"
      @touchend.stop="handleProgressTouchEnd"
    >
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue'

export default defineComponent({
  name: 'VideoPlayer',
  props: {
    videoUrl: {
      type: String,
      required: true
    }
  },
  emits: ['dragStart', 'dragMove', 'dragEnd'],
  setup(props, { emit }) {
    const videoRef = ref<HTMLVideoElement | null>(null)
    const showProgress = ref(false)
    const isDragging = ref(false)
    const progress = ref(0)
    const progressHideTimer = ref<number | null>(null)
    const startX = ref(0)
    const startY = ref(0)

    const togglePlay = () => {
      if (!videoRef.value) return
      if (videoRef.value.paused) {
        videoRef.value.play()
      } else {
        videoRef.value.pause()
      }
    }

    const handlePlay = () => {
      if (progressHideTimer.value) {
        clearTimeout(progressHideTimer.value)
      }
      progressHideTimer.value = window.setTimeout(() => {
        if (!isDragging.value) {
          showProgress.value = false
        }
      }, 2000)
    }

    const handlePause = () => {
      showProgress.value = true
      if (progressHideTimer.value) {
        clearTimeout(progressHideTimer.value)
      }
    }

    const handleTimeUpdate = () => {
      if (!videoRef.value || isDragging.value) return
      const currentTime = videoRef.value.currentTime
      const duration = videoRef.value.duration
      progress.value = (currentTime / duration) * 100
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

    const handleProgressTouchStart = (e: TouchEvent) => {
      isDragging.value = true
      showProgress.value = true
      if (!videoRef.value) return
      videoRef.value.pause()
      updateProgressFromTouch(e)
    }

    const handleProgressTouchMove = (e: TouchEvent) => {
      if (!isDragging.value) return
      updateProgressFromTouch(e)
    }

    const handleProgressTouchEnd = () => {
      isDragging.value = false
      if (!videoRef.value) return
      videoRef.value.currentTime = (progress.value / 100) * videoRef.value.duration
      videoRef.value.play()
    }

    const updateProgressFromTouch = (e: TouchEvent) => {
      if (!videoRef.value) return
      const progressBar = e.currentTarget as HTMLElement
      const rect = progressBar.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      progress.value = Math.max(0, Math.min(100, (x / rect.width) * 100))
    }

    const reset = () => {
      if (!videoRef.value) return
      videoRef.value.currentTime = 0
      videoRef.value.pause()
      progress.value = 0
    }

    onUnmounted(() => {
      if (progressHideTimer.value) {
        clearTimeout(progressHideTimer.value)
      }
    })

    return {
      videoRef,
      videoUrl: props.videoUrl,
      showProgress,
      isDragging,
      progress,
      togglePlay,
      handlePlay,
      handlePause,
      handleTimeUpdate,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleProgressTouchStart,
      handleProgressTouchMove,
      handleProgressTouchEnd,
      reset
    }
  }
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

.progress-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.progress-bar-container.show {
  opacity: 1;
  pointer-events: auto;
}

.progress-bar-container.dragging {
  transform: scaleY(1.5);
  transform-origin: bottom;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #fff;
  transition: width 0.1s linear;
}
</style> 