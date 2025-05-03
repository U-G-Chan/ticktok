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
    // 记录已加载的图片
    loadedImages.value.add(index);
    
    // 特殊处理克隆图片的加载
    if (index === -1) {
      // 克隆的最后一张图片加载完成，记录为已加载
      loadedImages.value.add(props.album.length - 1);
    } else if (index === props.album.length) {
      // 克隆的第一张图片加载完成，记录为已加载
      loadedImages.value.add(0);
    }
    
    // 当第一张图片加载完成且组件处于激活状态时，开始自动播放
    if ((index === 0 || loadedImages.value.has(0)) && 
        SlideItemStatusHelper.shouldPlay(props.itemStatus) && 
        !isPaused.value) {
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
        // 使用isUserAction=false调用，表示这是系统自动轮播，不是用户交互
        goToNextImage(true, false);
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
  const goToNextImage = (animate = true, isUserAction = true) => {
    if (props.album.length <= 1) return;
    if (isTransitioning.value) return;
    
    // 用户操作且已在最后一张，不执行任何操作
    if (isUserAction && displayIndex.value === props.album.length - 1) {
      return;
    }
    
    // 停止自动播放，避免多次触发
    stopAutoPlay();
    
    isAnimating.value = animate;
    transitionDuration.value = animate ? 300 : 0;
    
    // 计算下一个索引（真实索引）
    const nextIndex = currentIndex.value + 1;
    currentIndex.value = nextIndex;
    
    // 计算显示索引
    const nextDisplayIndex = nextIndex % props.album.length;
    
    // 更新显示索引
    displayIndex.value = nextDisplayIndex;
    emit.indexChange(nextDisplayIndex);
    
    // 更新位置
    translateX.value = -nextIndex * playerWidth.value;
    
    // 检查是否需要处理回到第一张图片的无缝过渡
    if (nextIndex >= props.album.length) {
      // 进入过渡状态
      isTransitioning.value = true;
      
      // 等待过渡动画完成
      setTimeout(() => {
        // 禁用过渡动画
        isAnimating.value = false;
        
        // 重置到真实的第一张图片位置
        currentIndex.value = nextDisplayIndex; // 重置为真实索引位置
        translateX.value = -currentIndex.value * playerWidth.value; // 对应位置也调整
        
        // 设置一个足够长的延迟，确保位置重置已完成
        setTimeout(() => {
          isTransitioning.value = false;
          
          // 重新启动自动播放（仅当不是暂停状态）
          if (!isPaused.value && !isUserInteracting.value && 
              SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
            startAutoPlay();
          }
        }, 50); // 减少延迟时间，但仍保证状态稳定
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
  const goToPrevImage = (animate = true, isUserAction = true) => {
    if (props.album.length <= 1) return;
    if (isTransitioning.value) return;
    
    // 用户操作且已在第一张，不执行任何操作
    if (isUserAction && displayIndex.value === 0) {
      return;
    }
    
    // 停止自动播放，避免多次触发
    stopAutoPlay();
    
    isAnimating.value = animate;
    transitionDuration.value = animate ? 300 : 0;
    
    // 如果已经是第一张，进入特殊处理流程
    if (currentIndex.value === 0) {
      // 进入过渡状态
      isTransitioning.value = true;
      
      // 计算下一个显示索引（应显示最后一张图片）
      const prevDisplayIndex = props.album.length - 1;
      
      // 更新用于显示的索引
      displayIndex.value = prevDisplayIndex;
      emit.indexChange(prevDisplayIndex);
      
      // 设置动画移动到克隆的最后一张图片位置（在轮播图的左侧）
      translateX.value = playerWidth.value; // 向右移动一个位置

      // 等待过渡动画完成
      setTimeout(() => {
        // 禁用过渡动画
        isAnimating.value = false;
        
        // 重置到真实的最后一张图片位置
        currentIndex.value = props.album.length - 1;
        translateX.value = -currentIndex.value * playerWidth.value;
        
        // 恢复正常状态
        setTimeout(() => {
          isTransitioning.value = false;
          
          // 如果需要，重新启动自动播放
          if (!isPaused.value && !isUserInteracting.value && 
              SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
            startAutoPlay();
          }
        }, 50);
      }, transitionDuration.value);
    } else {
      // 标准情况：只需向前移动一个位置
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
        
        // 如果需要，重新启动自动播放
        if (!isPaused.value && !isUserInteracting.value && 
            SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
          startAutoPlay();
        }
      }, transitionDuration.value);
    }
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
    // 确保从第一张图片开始，考虑克隆逻辑
    if (props.album.length > 1) {
      // 对于多张图片，初始位置设为第一张图片，而不是克隆图片
      currentIndex.value = 0;
      displayIndex.value = 0;
    } else {
      // 单张图片的情况
      currentIndex.value = 0;
      displayIndex.value = 0;
    }
    
    // 初始位置设为0，更新尺寸后会重新计算
    translateX.value = 0;
    
    // 更新尺寸并设置正确的初始位置
    nextTick(() => {
      updatePlayerSize();
      
      // 对于多张图片，延迟一帧确保位置正确设置
      if (props.album.length > 1) {
        requestAnimationFrame(() => {
          // 实际图片应该在索引0的位置
          translateX.value = -currentIndex.value * playerWidth.value;
        });
      }
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