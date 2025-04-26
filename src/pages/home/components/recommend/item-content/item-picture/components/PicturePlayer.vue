<template>
  <div 
    class="picture-player" 
    ref="playerRef" 
    @touchstart="handleTouchStart" 
    @touchmove="handleTouchMove" 
    @touchend="handleTouchEnd"
    @click="togglePlay"
  >
    <div class="picture-container" :style="containerStyle">
      <div 
        class="picture-slide" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)`, transition: isAnimating ? 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none' }"
      >
        <div 
          v-for="(url, index) in album" 
          :key="index" 
          class="picture-item"
        >
          <img :src="url" alt="图片" class="picture" />
        </div>
      </div>
    </div>
    <div class="pause-icon" v-if="isPaused">
      <div class="pause-triangle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  album: string[]
  isActivated: boolean
}>()

const emit = defineEmits<{
  indexChange: [index: number]
  isPausedChange: [isPaused: boolean]
  dragStart: [e: TouchEvent]
  dragMove: [e: TouchEvent]
  dragEnd: [e: TouchEvent]
}>()

const playerRef = ref<HTMLElement | null>(null)
const isPaused = ref(true)
const currentIndex = ref(0)
const isAnimating = ref(false)
const autoplayTimer = ref<number | null>(null)
const startX = ref(0)
const startY = ref(0)
const deltaX = ref(0)
const isDragging = ref(false)
const touchStartTime = ref(0)

// 修复图片路径问题
const getImageUrl = (url: string) => {
  // 移除前导斜杠，确保路径以正确的方式解析
  if (url.startsWith('/')) {
    url = url.substring(1)
  }
  
  // 创建一个相对于当前基础URL的路径
  // 根据实际项目需求可能需要调整
  return new URL(url, import.meta.url).href
}

// 图片容器样式
const containerStyle = computed(() => {
  if (!playerRef.value) return {}
  
  const backgroundImage = currentIndex.value < props.album.length 
    ? `url(${getImageUrl(props.album[currentIndex.value])})` 
    : 'none'
  
  return {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage,
    filter: 'blur(15px) brightness(0.7)',
    position: 'absolute' as const,
    top: '0',
    left: '0',
    zIndex: -1
  }
})

// 自动播放函数
const startAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
  }
  
  autoplayTimer.value = window.setInterval(() => {
    if (!isPaused.value) {
      goToNextPicture()
    }
  }, 3000)
}

// 前往下一张图片
const goToNextPicture = () => {
  if (props.album.length <= 1) return
  
  isAnimating.value = true
  const nextIndex = (currentIndex.value + 1) % props.album.length
  currentIndex.value = nextIndex
  emit('indexChange', nextIndex)
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

// 前往上一张图片
const goToPrevPicture = () => {
  if (props.album.length <= 1) return
  
  isAnimating.value = true
  const prevIndex = (currentIndex.value - 1 + props.album.length) % props.album.length
  currentIndex.value = prevIndex
  emit('indexChange', prevIndex)
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

// 切换播放/暂停状态
const togglePlay = () => {
  isPaused.value = !isPaused.value
  emit('isPausedChange', isPaused.value)
  
  if (!isPaused.value) {
    startAutoplay()
  } else if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
  }
}

// 处理触摸开始
const handleTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  deltaX.value = 0
  touchStartTime.value = Date.now()
  isDragging.value = true
  isAnimating.value = false
  emit('dragStart', e)
}

// 处理触摸移动
const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  
  // 计算水平和垂直移动距离
  const moveX = currentX - startX.value
  const moveY = Math.abs(currentY - startY.value)
  
  // 如果垂直移动大于水平移动，不处理水平滑动
  if (moveY > Math.abs(moveX)) {
    return
  }
  
  // 阻止默认行为，避免页面滚动
  e.preventDefault()
  
  deltaX.value = moveX
  emit('dragMove', e)
}

// 处理触摸结束
const handleTouchEnd = (e: TouchEvent) => {
  if (!isDragging.value) return
  isDragging.value = false
  
  // 计算滑动速度
  const touchEndTime = Date.now()
  const touchDuration = touchEndTime - touchStartTime.value
  
  // 获取播放器宽度
  const playerWidth = playerRef.value?.offsetWidth || 300
  
  // 判断滑动距离和速度
  const threshold = playerWidth * 0.3 // 30% 的宽度作为阈值
  const velocityThreshold = 0.5 // 速度阈值
  const velocity = Math.abs(deltaX.value) / touchDuration
  
  if (Math.abs(deltaX.value) > threshold || velocity > velocityThreshold) {
    // 如果滑动距离大于阈值或速度大于阈值
    if (deltaX.value > 0) {
      goToPrevPicture()
    } else {
      goToNextPicture()
    }
  }
  
  // 无论如何重置动画状态
  isAnimating.value = true
  deltaX.value = 0
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
  
  emit('dragEnd', e)
}

// 监听激活状态
watch(() => props.isActivated, (newVal) => {
  if (newVal) {
    isPaused.value = false
    emit('isPausedChange', false)
    startAutoplay()
  } else {
    isPaused.value = true
    emit('isPausedChange', true)
    if (autoplayTimer.value) {
      clearInterval(autoplayTimer.value)
      autoplayTimer.value = null
    }
    currentIndex.value = 0
    emit('indexChange', 0)
  }
}, { immediate: true })

onMounted(() => {
  if (props.isActivated) {
    isPaused.value = false
    emit('isPausedChange', false)
    startAutoplay()
  }
})

onUnmounted(() => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
})

// 对外暴露重置方法
const reset = () => {
  currentIndex.value = 0
  emit('indexChange', 0)
  isPaused.value = true
  emit('isPausedChange', true)
  
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

defineExpose({ reset })
</script>

<style scoped>
.picture-player {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #000;
}

.picture-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.picture-slide {
  display: flex;
  width: 100%;
  height: 100%;
}

.picture-item {
  min-width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picture {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.pause-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12px 0 12px 20px;
  border-color: transparent transparent transparent rgba(255, 255, 255, 0.8);
  margin-left: 4px;
}
</style> 