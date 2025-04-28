<template>
  <div class="mall">
    <!-- 头部占位div，高度与head-nav一致 -->
    <div class="head-nav-placeholder"></div>
    
    <div class="mall-content">
      <!-- 粘性搜索栏和购物车 -->
      <div class="mall-sticky-bar">
        <goods-search-bar />
        <shopping-cart />
      </div>
      <!-- 商城菜单和商品区 -->
      <div class="mall-main" ref="mallMainRef" @scroll="handleScroll">
        <mall-menu />
        <goods-masonry-layout />
      </div>
    </div>
    
    <!-- 回到顶部按钮组件 -->
    <back-to-top 
      :visible="showBackToTop" 
      :target="mallMainRef" 
      @scroll-to-top="scrollToTop"
    />
    
    <!-- 商城子路由，添加过渡动画 -->
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GoodsSearchBar from './goods-search-bar.vue'
import ShoppingCart from './shopping-cart.vue'
import MallMenu from './mall-menu/index.vue'
import GoodsMasonryLayout from './goods-masonry-layout/index.vue'
import BackToTop from './back-to-top/index.vue'

// 回到顶部按钮的显示控制和滚动区域引用
const showBackToTop = ref(false)
const mallMainRef = ref(null)

// 监听滚动事件 - 监听mall-main的滚动
const handleScroll = () => {
  // 当mall-main滚动超过300px时显示回到顶部按钮
  if (mallMainRef.value) {
    showBackToTop.value = mallMainRef.value.scrollTop > 300
  }
}

// 平滑滚动到顶部功能 - 在组件自己处理，这里只是备用
const scrollToTop = () => {
  if (!mallMainRef.value) return
  
  mallMainRef.value.scrollTop = 0
}

// 生命周期钩子
onMounted(() => {
  // 初始化时检查是否需要显示按钮
  if (mallMainRef.value) {
    showBackToTop.value = mallMainRef.value.scrollTop > 300
  }
})
</script>

<style scoped>
/* 路由过渡动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.mall {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%);
  overflow: hidden;
  position: relative;
}

.head-nav-placeholder {
  width: 100%;
  height: 52px;
  background: transparent;
}

.mall-content {
  width: 100%;
  height: calc(100% - 52px);
  background: #fff;
  position: relative;
}

.mall-sticky-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 8px 12px;
}

.mall-main {
  width: 100%;
  height: calc(100% - 56px);
  overflow-y: auto;
  position: relative; /* 添加相对定位 */
}
</style> 