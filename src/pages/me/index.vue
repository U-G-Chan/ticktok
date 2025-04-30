<template>
  <div
    class="me-page"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @click="handleBackgroundClick"
  >
    <!-- 背景图 -->
    <div 
      class="background" 
      :style="{ 
        transform: `scale(${1 + Math.min(0.2, pullDistance / 1000)})`,
        height: `${backgroundHeight}px` 
      }"
    ></div>
    
    <!-- 顶部操作栏 -->
    <TopBar />
    
    <!-- 滚动内容区域 -->
    <div 
      class="scroll-container" 
      ref="scrollContainer"
      :style="{ transform: `translateY(${pullDistance}px)` }"
    >
      <!-- 用户信息区 -->
      <UserInfo />
      
      <!-- 用户空间 -->
      <UserSpace />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import TopBar from './components/TopBar.vue'
import UserInfo from './components/UserInfo.vue'
import UserSpace from './components/UserSpace.vue'

export default defineComponent({
  name: 'MePage',
  components: {
    TopBar,
    UserInfo,
    UserSpace
  },
  setup() {
    const windowHeight = ref(window.innerHeight)
    const backgroundHeight = computed(() => windowHeight.value * 0.3)
    
    const touchStartY = ref(0)
    const pullDistance = ref(0)
    const scrollContainer = ref<HTMLElement | null>(null)
    const isAnimating = ref(false)
    
    // 监听窗口大小变化
    onMounted(() => {
      window.addEventListener('resize', () => {
        windowHeight.value = window.innerHeight
      })
    })
    
    // 触摸开始
    const handleTouchStart = (e: TouchEvent) => {
      if (isAnimating.value) return
      touchStartY.value = e.touches[0].clientY
    }
    
    // 触摸移动
    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating.value) return
      
      const currentY = e.touches[0].clientY
      const diff = currentY - touchStartY.value
      
      // 只有向下拉才有效果，且容器滚动到顶部才能触发
      if (diff > 0 && scrollContainer.value && scrollContainer.value.scrollTop <= 0) {
        pullDistance.value = Math.min(200, diff * 0.5) // 限制最大下拉距离为200px
        e.preventDefault() // 阻止默认滚动
      } else {
        pullDistance.value = 0
      }
    }
    
    // 触摸结束，开始回弹
    const handleTouchEnd = () => {
      if (pullDistance.value > 0) {
        isAnimating.value = true
        
        // 使用CSS动画实现丝滑回弹
        const startTime = Date.now()
        const startDistance = pullDistance.value
        const duration = 500 // 动画持续时间(ms)
        
        const animate = () => {
          const elapsed = Date.now() - startTime
          if (elapsed < duration) {
            // 使用缓动函数使回弹更丝滑
            const progress = 1 - Math.pow(1 - elapsed / duration, 3)
            pullDistance.value = startDistance * (1 - progress)
            requestAnimationFrame(animate)
          } else {
            pullDistance.value = 0
            isAnimating.value = false
          }
        }
        
        requestAnimationFrame(animate)
      }
    }
    
    // 点击背景
    const handleBackgroundClick = (e: MouseEvent) => {
      // 检查点击位置是否在背景区域
      const target = e.target as HTMLElement
      if (target.classList.contains('background')) {
        console.log('点击背景进入设置页面')
      }
    }
    
    return {
      windowHeight,
      backgroundHeight,
      pullDistance,
      scrollContainer,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleBackgroundClick
    }
  }
})
</script>

<style scoped>
.me-page {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(180deg, #409EFF 0%, #1989FA 100%);
  transition: transform 0.1s;
  z-index: 1;
}

.scroll-container {
  position: relative;
  z-index: 2;
  height: 100vh;
  overflow-y: auto;
  will-change: transform;
  transition: transform 0.1s;
}
</style>