<template>
  <div class="blog">
    <!-- 头部占位div，高度与head-nav一致 -->
    <head-nav-placeholder />
    
    <!-- 搜索栏 -->
    <blog-search-bar />
    
    <!-- 瀑布流布局 -->
    <blog-masonry-layout />
    
    <!-- 子路由 -->
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import HeadNavPlaceholder from './components/head-nav-placeholder'
import BlogSearchBar from './components/blog-search-bar'
import BlogMasonryLayout from './components/blog-masonry-layout'
</script>

<style scoped>
.blog {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

.zoom-in-enter-active,
.zoom-in-leave-active {
  transition: all 0.3s ease;
}
.zoom-in-enter-from {
  transform: scale(0.9);
  opacity: 0;
}
.zoom-in-leave-to {
  transform: scale(1.1);
  opacity: 0;
}
</style> 