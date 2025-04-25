<template>
  <div 
    class="video-progress" 
    :class="{ 'show': isVisible, 'dragging': isDragging }"
    @touchstart.stop="handleTouchStart"
    @touchmove.stop="handleTouchMove"
    @touchend.stop="handleTouchEnd"
  >
    <div class="progress-bar">
      <div class="progress-inner" :style="{ width: `${progress}%` }">
        <div class="progress-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  progress: number,
  isPaused: boolean
}>()

const emit = defineEmits<{
  progressChange: [progress: number]
}>()

defineOptions({
  name: 'VideoProgress'
})

const isVisible = ref(false)
const isDragging = ref(false)
const hideTimer = ref<number | null>(null)
const startX = ref(0)
const startY = ref(0)

const showProgress = () => {
  isVisible.value = true
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
  }
}

const hideProgress = () => {
  if (!props.isPaused && !isDragging.value) {
    hideTimer.value = window.setTimeout(() => {
      isVisible.value = false
    }, 2000)
  }
}

const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  showProgress()
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return

  const deltaX = e.touches[0].clientX - startX.value
  const deltaY = Math.abs(e.touches[0].clientY - startY.value)
  
  // 如果垂直滑动距离大于水平滑动距离，则忽略此次拖动
  if (deltaY > Math.abs(deltaX)) {
    return
  }

  const progressBar = e.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const x = e.touches[0].clientX - rect.left
  const newProgress = Math.max(0, Math.min(100, (x / rect.width) * 100))
  emit('progressChange', newProgress)
}

const handleTouchEnd = () => {
  isDragging.value = false
  hideProgress()
}

// 监听暂停状态变化
watch(() => props.isPaused, (isPaused) => {
  if (isPaused) {
    showProgress()
  } else {
    hideProgress()
  }
})

onUnmounted(() => {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
  }
})
</script>

<style scoped>
.video-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.video-progress.show {
  opacity: 1;
  pointer-events: auto;
}

.progress-bar {
  width: 100%;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 1.5px;
  overflow: visible;
  transition: height 0.2s ease;
}

.video-progress.dragging .progress-bar {
  height: 4px;
}

.progress-inner {
  height: 100%;
  background-color: #fff;
  transition: width 0.1s linear;
  border-radius: 1.5px;
  position: relative;
}

.progress-dot {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center;
}

.video-progress.show .progress-dot {
  opacity: 0.8;
}

.video-progress.dragging .progress-dot {
  opacity: 1;
  transform: translateY(-50%) scale(1.2);
}
</style> 