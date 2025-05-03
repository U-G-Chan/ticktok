<template>
  <div 
    class="picture-player" 
    ref="playerRef" 
    @touchstart="handleTouchStart" 
    @touchmove="handleTouchMove" 
    @touchend="handleTouchEnd"
    @click="togglePlay"
  >
    <!-- 模糊背景层 -->
    <div class="background-blur" :style="backgroundStyle"></div>
    
    <!-- 图片轮播层 -->
    <div class="picture-container">
      <div 
        class="picture-slider"
        :style="{ 
          transform: `translateX(${translateX}px)`, 
          transition: isAnimating ? `transform ${transitionDuration}ms cubic-bezier(0.33, 1, 0.68, 1)` : 'none' 
        }"
      >
        <!-- 添加最后一张图片的克隆（放在最前面） -->
        <div 
          v-if="props.album.length > 1"
          class="picture-item"
          :style="{ left: `-100%` }"
        >
          <img 
            :src="getImageUrl(props.album[props.album.length - 1])" 
            alt="图片" 
            class="picture"
          />
        </div>
        
        <!-- 原始图片列表 -->
        <div 
          v-for="(url, index) in props.album" 
          :key="index" 
          class="picture-item"
          :class="{ 'active': displayIndex === index }"
          :style="{ left: `${index * 100}%` }"
        >
          <img 
            :src="getImageUrl(url)" 
            alt="图片" 
            class="picture"
            @load="onImageLoad(index)"
          />
        </div>
        
        <!-- 添加第一张图片的克隆（放在最后面） -->
        <div 
          v-if="props.album.length > 1"
          class="picture-item"
          :style="{ left: `${props.album.length * 100}%` }"
        >
          <img 
            :src="getImageUrl(props.album[0])" 
            alt="图片" 
            class="picture"
          />
        </div>
      </div>
    </div>
    
    <!-- 暂停/播放图标 -->
    <div class="play-pause-icon" v-if="isPaused && !isUserInteracting">
      <div class="play-triangle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { SlideItemStatus, SlideItemStatusHelper } from '@/types/slide'

const props = defineProps<{
  album: string[]
  itemStatus: SlideItemStatus
  interval?: number // 轮播间隔时间，默认3000ms
}>()

const emit = defineEmits<{
  indexChange: [index: number]
  isPausedChange: [isPaused: boolean]
}>()

// 组件状态
const playerRef = ref<HTMLElement | null>(null)
const isPaused = ref(true)
const isAnimating = ref(false)
const isUserInteracting = ref(false)
const currentIndex = ref(0) // 实际索引（带克隆逻辑）
const displayIndex = ref(0) // 显示给用户的索引
const playerWidth = ref(0)
const loadedImages = ref<Set<number>>(new Set())
const isTransitioning = ref(false)
const lastStatus = ref(SlideItemStatus.INACTIVE)

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchDeltaX = ref(0)
const touchDeltaY = ref(0)
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
  if (Math.abs(touchDeltaX.value) > 10) {
    return;
  }
  
  isPaused.value = !isPaused.value;
  emit('isPausedChange', isPaused.value);
  
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
  emit('indexChange', nextDisplayIndex);
  
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
      emit('indexChange', 1); // 同步通知父组件显示索引变化
      
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
  emit('indexChange', prevDisplayIndex);
  
  // 更新位置
  translateX.value = -currentIndex.value * playerWidth.value;
  
  // 重置滑动动画状态
  setTimeout(() => {
    isAnimating.value = false;
  }, transitionDuration.value);
}

// 处理触摸开始
const handleTouchStart = (e: TouchEvent) => {
  if (props.album.length <= 1 || isTransitioning.value) return;
  
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
  if (!isUserInteracting.value || props.album.length <= 1 || isTransitioning.value) return;
  
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
  if (!isUserInteracting.value || props.album.length <= 1 || isTransitioning.value) return;
  
  isUserInteracting.value = false;
  isAnimating.value = true;
  
  // 如果垂直移动大于水平移动，不处理
  if (Math.abs(touchDeltaY.value) > Math.abs(touchDeltaX.value)) {
    // 重置位置
    translateX.value = -currentIndex.value * playerWidth.value;
    
    // 如果未暂停，恢复自动播放
    if (!isPaused.value && SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
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
      goToPrevImage();
    } else {
      // 向左滑动，显示下一张
      goToNextImage();
    }
  } else {
    // 滑动距离小于阈值，回弹到当前图片
    translateX.value = -currentIndex.value * playerWidth.value;
    
    // 重置动画状态
    setTimeout(() => {
      isAnimating.value = false;
    }, transitionDuration.value);
  }
  
  // 如果未暂停，恢复自动播放
  if (!isPaused.value && SlideItemStatusHelper.shouldPlay(props.itemStatus)) {
    startAutoPlay();
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
  isTransitioning.value = false;
  emit('indexChange', 0);
  emit('isPausedChange', true);
  stopAutoPlay();
}

// 监听激活状态
watch(() => props.itemStatus, (newStatus, oldStatus) => {
  // 保存上一个状态，便于后续处理
  lastStatus.value = oldStatus as SlideItemStatus;
  
  if (SlideItemStatusHelper.shouldPlay(newStatus)) {
    // 真正激活时开始播放
    isPaused.value = false;
    emit('isPausedChange', false);
    
    // 确保尺寸正确
    updatePlayerSize();
    
    // 启动自动播放
    startAutoPlay();
  } else if (SlideItemStatusHelper.isPaused(newStatus)) {
    // 暂停状态
    isPaused.value = true;
    emit('isPausedChange', true);
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
    emit('isPausedChange', false);
    startAutoPlay();
  }
});

onUnmounted(() => {
  // 清理工作
  stopAutoPlay();
  window.removeEventListener('resize', handleResize);
});

// 对外暴露方法
defineExpose({
  reset,
  goToNextImage,
  goToPrevImage
});
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

.background-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.picture-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.picture-slider {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.picture-item {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picture {
  max-width: 100%;
  max-height: 100%;
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