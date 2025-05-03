import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { SlideItemStatus, SlideItemStatusHelper } from '@/types/slide'
import { useTouchEvents } from '@/pages/home/components/recommend/item-content/item-picture/components/PicturePlayer/hooks/useTouchEvents'

export interface PicturePlayerProps {
  album: string[]
  itemStatus: SlideItemStatus
  interval?: number
}

export interface PicturePlayerEmits {
  indexChange: (index: number) => void
  isPausedChange: (isPaused: boolean) => void
}

export function usePicturePlayer(props: PicturePlayerProps, emit: PicturePlayerEmits) {
  // 组件状态
  const playerRef = ref<HTMLElement | null>(null)
  const isPaused = ref(true)
  const isAnimating = ref(false)
  const isUserInteracting = ref(false)
  const isUserPaused = ref(false) // 添加用户主动暂停状态
  const currentIndex = ref(0) // 实际索引（带克隆逻辑）
  const displayIndex = ref(0) // 显示给用户的索引
  const playerWidth = ref(0)
  const loadedImages = ref<Set<number>>(new Set())
  const isTransitioning = ref(false)
  const lastStatus = ref(SlideItemStatus.INACTIVE)
  const translateX = ref(0)
  const autoPlayTimer = ref<number | null>(null)
  const transitionDuration = ref(300)

  // 计算属性：图片背景样式
  const backgroundStyle = computed(() => {
    const currentUrl = displayIndex.value < props.album.length 
      ? getImageUrl(props.album[displayIndex.value]) 
      : '';
    
    return {
      backgroundImage: currentUrl ? `url(${currentUrl})` : 'none',
      filter: 'blur(20px) brightness(0.7)',
    }
  })

  // 获取图片URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url;
  }

  // 图片加载完成处理
  const onImageLoad = (index: number) => {
    loadedImages.value.add(index);
    
    if (index === 0 && SlideItemStatusHelper.shouldPlay(props.itemStatus) && !isPaused.value) {
      startAutoPlay();
    }
  }

  // 自动播放功能
  const startAutoPlay = () => {
    // 先确保清除之前的定时器
    stopAutoPlay();
    
    // 设置新的定时器
    autoPlayTimer.value = window.setTimeout(() => {
      if (!isPaused.value && !isUserInteracting.value && !isTransitioning.value && 
          SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
        goToNextImage(true);
      }
    }, props.interval || 3000);
  }

  // 停止自动播放
  const stopAutoPlay = () => {
    if (autoPlayTimer.value) {
      clearTimeout(autoPlayTimer.value);
      autoPlayTimer.value = null;
    }
  }

  // 切换播放/暂停状态
  const togglePlay = () => {
    // 如果是滑动结束触发的点击事件，忽略
    if (Math.abs(touchEvents.touchDeltaX.value) > 10) {
      return;
    }
    
    isPaused.value = !isPaused.value;
    isUserPaused.value = isPaused.value; // 设置用户主动暂停状态
    emit.isPausedChange(isPaused.value);
    
    if (!isPaused.value) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }

  // 前往下一张图片（始终从右向左滑动）
  const goToNextImage = (animate = true) => {
    if (props.album.length <= 1) return;
    if (isTransitioning.value) return;
    
    // 停止自动播放，避免多次触发
    stopAutoPlay();
    
    isAnimating.value = animate;
    transitionDuration.value = animate ? 300 : 0;
    
    // 计算下一个索引（真实索引）
    const nextIndex = currentIndex.value + 1;
    currentIndex.value = nextIndex;
    
    // 计算显示索引
    const nextDisplayIndex = nextIndex <= props.album.length 
      ? nextIndex % props.album.length
      : 0;
    
    displayIndex.value = nextDisplayIndex;
    emit.indexChange(nextDisplayIndex);
    
    // 更新位置
    translateX.value = -nextIndex * playerWidth.value;
    
    // 检查是否需要处理回到第一张图片的无缝过渡
    if (nextIndex > props.album.length) {
      // 进入过渡状态
      isTransitioning.value = true;
      
      // 等待过渡动画完成
      setTimeout(() => {
        // 禁用过渡动画
        isAnimating.value = false;
        
        // 重置到真实的第一张图片位置
        currentIndex.value = 1; // 关键改动：设置为1而不是0，因为下一次应该显示第2张
        translateX.value = -playerWidth.value; // 对应位置也调整为第1张的位置
        
        // 同步更新显示索引为第一张
        displayIndex.value = 1; // 保持与currentIndex一致
        emit.indexChange(1); // 同步通知父组件显示索引变化
        
        // 设置一个足够长的延迟，确保位置重置已完成
        setTimeout(() => {
          isTransitioning.value = false;
          
          // 重新启动自动播放（仅当不是暂停状态）
          if (!isPaused.value && !isUserInteracting.value && 
              SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
            // 使用setTimeout而不是setInterval，避免累积调用
            autoPlayTimer.value = window.setTimeout(() => {
              if (!isPaused.value && !isUserInteracting.value && 
                  SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
                goToNextImage(true);
              }
            }, props.interval || 3000);
          }
        }, 100); // 增加延迟确保状态完全稳定
      }, transitionDuration.value);
    } else {
      // 普通切换，等待动画完成后重置状态
      setTimeout(() => {
        isAnimating.value = false;
        
        // 重新启动自动播放（如果需要）
        if (!isPaused.value && !isUserInteracting.value && 
            SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
          startAutoPlay();
        }
      }, transitionDuration.value);
    }
  }

  // 前往上一张图片（始终从左向右滑动）
  const goToPrevImage = (animate = true) => {
    if (props.album.length <= 1) return;
    if (isTransitioning.value) return;
    
    isAnimating.value = animate;
    transitionDuration.value = animate ? 300 : 0;
    
    // 如果是第一张，先立即转到克隆的最后一张位置
    if (currentIndex.value === 0) {
      currentIndex.value = props.album.length;
      translateX.value = -currentIndex.value * playerWidth.value;
      
      // 强制一次重绘，确保位置已更新
      void playerRef.value?.offsetWidth;
    }
    
    // 向前移动一个位置
    currentIndex.value--;
    const prevDisplayIndex = currentIndex.value % props.album.length;
    
    // 更新显示索引
    displayIndex.value = prevDisplayIndex;
    emit.indexChange(prevDisplayIndex);
    
    // 更新位置
    translateX.value = -currentIndex.value * playerWidth.value;
    
    // 重置滑动动画状态
    setTimeout(() => {
      isAnimating.value = false;
    }, transitionDuration.value);
  }

  // 更新播放器尺寸
  const updatePlayerSize = () => {
    if (playerRef.value) {
      playerWidth.value = playerRef.value.offsetWidth;
      translateX.value = -currentIndex.value * playerWidth.value;
    }
  }

  // 初始化轮播位置
  const initCarousel = () => {
    // 确保从第一张图片开始
    currentIndex.value = 0;
    displayIndex.value = 0;
    translateX.value = 0;
    
    // 更新尺寸
    nextTick(() => {
      updatePlayerSize();
    });
  }

  // 重置组件状态
  const reset = () => {
    currentIndex.value = 0;
    displayIndex.value = 0;
    translateX.value = 0;
    isPaused.value = true;
    isUserPaused.value = false; // 重置用户暂停状态
    isTransitioning.value = false;
    emit.indexChange(0);
    emit.isPausedChange(true);
    stopAutoPlay();
  }

  // 触摸相关逻辑
  const touchEvents = useTouchEvents({
    playerRef,
    isUserInteracting,
    isAnimating,
    isTransitioning,
    translateX,
    currentIndex,
    playerWidth,
    isPaused,
    displayIndex,
    album: () => props.album,
    itemStatus: () => props.itemStatus,
    goToNextImage,
    goToPrevImage,
    stopAutoPlay,
    startAutoPlay,
    onIndexChange: (index) => emit.indexChange(index)
  });

  // 监听激活状态
  watch(() => props.itemStatus, (newStatus, oldStatus) => {
    // 保存上一个状态，便于后续处理
    lastStatus.value = oldStatus as SlideItemStatus;
    
    if (SlideItemStatusHelper.shouldPlay(newStatus)) {
      // 真正激活时开始播放
      isPaused.value = false;
      // 不更改isUserPaused状态，因为这是系统触发的
      emit.isPausedChange(false);
      
      // 确保尺寸正确
      updatePlayerSize();
      
      // 启动自动播放
      startAutoPlay();
    } else if (SlideItemStatusHelper.isPaused(newStatus)) {
      // 暂停状态
      isPaused.value = true;
      // 不更改isUserPaused状态，因为这是系统触发的
      emit.isPausedChange(true);
      stopAutoPlay();
      
      // 如果不应保持状态，则重置
      if (!SlideItemStatusHelper.shouldPreserveState(newStatus as SlideItemStatus) && 
          !SlideItemStatusHelper.shouldPreserveState(oldStatus as SlideItemStatus)) {
        reset();
      }
    } else if (newStatus === SlideItemStatus.INACTIVE) {
      // 完全未激活状态
      reset();
    }
  }, { immediate: true });

  // 监听窗口大小变化
  const handleResize = () => {
    updatePlayerSize();
  }

  // 生命周期钩子
  onMounted(() => {
    // 初始化轮播
    initCarousel();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);
    
    // 如果组件已激活，开始自动播放
    if (SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
      isPaused.value = false;
      emit.isPausedChange(false);
      startAutoPlay();
    }
  });

  onUnmounted(() => {
    // 清理工作
    stopAutoPlay();
    window.removeEventListener('resize', handleResize);
  });

  return {
    playerRef,
    isPaused,
    isUserPaused, // 返回用户暂停状态
    isAnimating,
    isUserInteracting,
    displayIndex,
    translateX,
    transitionDuration,
    backgroundStyle,
    getImageUrl,
    togglePlay,
    onImageLoad,
    handleTouchStart: touchEvents.handleTouchStart,
    handleTouchMove: touchEvents.handleTouchMove,
    handleTouchEnd: touchEvents.handleTouchEnd,
    reset,
    goToNextImage,
    goToPrevImage
  }
} 