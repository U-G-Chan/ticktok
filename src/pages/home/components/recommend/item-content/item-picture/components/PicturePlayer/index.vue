<template>
  <div 
    class="picture-player" 
    ref="playerRef" 
    @touchstart="handleTouchStart" 
    @touchmove="handleTouchMove" 
    @touchend="handleTouchEnd"
    @click="togglePlay"
  >
    <background-blur :background-style="backgroundStyle" />
    <picture-slider 
      :album="album"
      :translate-x="translateX"
      :is-animating="isAnimating"
      :transition-duration="transitionDuration"
      :display-index="displayIndex"
      :get-image-url="getImageUrl"
      :on-image-load="onImageLoad"
    />
    <play-pause-icon 
      :is-paused="isPaused" 
      :is-user-interacting="isUserInteracting"
      :is-user-paused="isUserPaused"
    />
  </div>
</template>

<script setup lang="ts">
import { SlideItemStatus } from '@/types/slide'
import { usePicturePlayer } from './hooks/usePicturePlayer'
import BackgroundBlur from './components/BackgroundBlur.vue'
import PictureSlider from './components/PictureSlider.vue'
import PlayPauseIcon from './components/PlayPauseIcon.vue'

const props = defineProps<{
  album: string[]
  itemStatus: SlideItemStatus
  interval?: number // 轮播间隔时间，默认3000ms
}>()

const emit = defineEmits<{
  indexChange: [index: number]
  isPausedChange: [isPaused: boolean]
}>()

// 使用钩子函数获取所有逻辑和状态
const {
  playerRef,
  isPaused,
  isUserPaused,
  isAnimating,
  isUserInteracting,
  displayIndex,
  translateX,
  transitionDuration,
  backgroundStyle,
  getImageUrl,
  togglePlay,
  onImageLoad,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  reset,
  goToNextImage,
  goToPrevImage
} = usePicturePlayer(props, {
  indexChange: (index) => emit('indexChange', index),
  isPausedChange: (isPaused) => emit('isPausedChange', isPaused)
})

// 对外暴露方法
defineExpose({
  reset,
  goToNextImage,
  goToPrevImage
})
</script>

<style scoped>
.picture-player {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #000;
  user-select: none;
  touch-action: pan-y;
}
</style> 