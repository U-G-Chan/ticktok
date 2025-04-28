<template>
  <div class="back-to-top" v-show="visible" @click="scrollToTop">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4 12H9V20H15V12H20L12 4Z" fill="#333333"/>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  target: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['scroll-to-top'])

// 平滑滚动到顶部功能
const scrollToTop = () => {
  if (!props.target) {
    emit('scroll-to-top')
    return
  }
  
  const container = props.target
  const currentPosition = container.scrollTop
  let start = null
  const duration = 500 // 动画持续时间（毫秒）
  
  // 使用缓动函数，让动画有加速减速效果
  const easeInOutCubic = (t) => {
    return t < 0.5 
      ? 4 * t * t * t 
      : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }
  
  const animateScroll = (timestamp) => {
    if (!start) start = timestamp
    const progress = timestamp - start
    const percentage = Math.min(progress / duration, 1)
    const easePercentage = easeInOutCubic(percentage)
    
    container.scrollTop = currentPosition * (1 - easePercentage)
    
    if (progress < duration) {
      window.requestAnimationFrame(animateScroll)
    }
  }
  
  window.requestAnimationFrame(animateScroll)
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 16px;
  bottom: 70px;
  width: 40px;
  height: 40px;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999; /* 确保按钮在最上层 */
  border: 1px solid #f0f0f0;
}
</style> 