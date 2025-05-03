import { ref, Ref } from 'vue'
import { SlideItemStatus, SlideItemStatusHelper } from '@/types/slide'

export interface TouchEventsOptions {
  playerRef: Ref<HTMLElement | null>
  isUserInteracting: Ref<boolean>
  isAnimating: Ref<boolean>
  isTransitioning: Ref<boolean>
  translateX: Ref<number>
  currentIndex: Ref<number>
  playerWidth: Ref<number>
  isPaused: Ref<boolean>
  displayIndex: Ref<number>
  album: () => string[]
  itemStatus: () => SlideItemStatus
  goToNextImage: (animate: boolean) => void
  goToPrevImage: (animate: boolean) => void
  stopAutoPlay: () => void
  startAutoPlay: () => void
  onIndexChange: (index: number) => void
}

export function useTouchEvents(options: TouchEventsOptions) {
  const {
    isUserInteracting,
    isAnimating,
    isTransitioning,
    translateX,
    currentIndex,
    playerWidth,
    isPaused,
    album,
    itemStatus,
    goToNextImage,
    goToPrevImage,
    stopAutoPlay,
    startAutoPlay,
  } = options

  // 触摸相关
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const touchDeltaX = ref(0)
  const touchDeltaY = ref(0)

  // 处理触摸开始
  const handleTouchStart = (e: TouchEvent) => {
    if (album().length <= 1 || isTransitioning.value) return;
    
    // 记录开始位置
    touchStartX.value = e.touches[0].clientX;
    touchStartY.value = e.touches[0].clientY;
    touchDeltaX.value = 0;
    touchDeltaY.value = 0;
    
    // 停止动画
    isAnimating.value = false;
    isUserInteracting.value = true;
    
    // 暂停自动播放
    stopAutoPlay();
  }

  // 处理触摸移动
  const handleTouchMove = (e: TouchEvent) => {
    if (!isUserInteracting.value || album().length <= 1 || isTransitioning.value) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    // 计算水平和垂直移动距离
    touchDeltaX.value = currentX - touchStartX.value;
    touchDeltaY.value = currentY - touchStartY.value;
    
    // 如果垂直移动大于水平移动，不处理水平滑动
    if (Math.abs(touchDeltaY.value) > Math.abs(touchDeltaX.value)) {
      return;
    }
    
    // 防止默认行为（如页面滚动）
    e.preventDefault();
    
    // 计算滑动位置，添加阻尼效果
    const dampingFactor = 0.8; // 阻尼系数
    const baseTranslateX = -currentIndex.value * playerWidth.value;
    translateX.value = baseTranslateX + (touchDeltaX.value * dampingFactor);
  }

  // 处理触摸结束
  const handleTouchEnd = () => {
    if (!isUserInteracting.value || album().length <= 1 || isTransitioning.value) return;
    
    isUserInteracting.value = false;
    isAnimating.value = true;
    
    // 如果垂直移动大于水平移动，不处理
    if (Math.abs(touchDeltaY.value) > Math.abs(touchDeltaX.value)) {
      // 重置位置
      translateX.value = -currentIndex.value * playerWidth.value;
      
      // 如果未暂停，恢复自动播放
      if (!isPaused.value && SlideItemStatusHelper.shouldPlay(itemStatus())) {
        startAutoPlay();
      }
      return;
    }
    
    // 计算滑动阈值（播放器宽度的50%）
    const threshold = playerWidth.value * 0.5;
    
    // 根据滑动距离和方向决定是切换还是回弹
    if (Math.abs(touchDeltaX.value) > threshold) {
      // 滑动距离大于阈值，切换图片
      if (touchDeltaX.value > 0) {
        // 向右滑动，显示上一张
        goToPrevImage(true);
      } else {
        // 向左滑动，显示下一张
        goToNextImage(true);
      }
    } else {
      // 滑动距离小于阈值，回弹到当前图片
      translateX.value = -currentIndex.value * playerWidth.value;
      
      // 重置动画状态
      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    }
    
    // 如果未暂停，恢复自动播放
    if (!isPaused.value && SlideItemStatusHelper.shouldPlay(itemStatus())) {
      startAutoPlay();
    }
  }

  return {
    touchStartX,
    touchStartY,
    touchDeltaX,
    touchDeltaY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
} 