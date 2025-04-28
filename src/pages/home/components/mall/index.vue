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
      <div class="mall-main">
        <mall-menu />
        <goods-masonry-layout />
      </div>
    </div>
    
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
import GoodsSearchBar from './goods-search-bar.vue'
import ShoppingCart from './shopping-cart.vue'
import MallMenu from './mall-menu/index.vue'
import GoodsMasonryLayout from './goods-masonry-layout/index.vue'
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
}

/* 头部占位，高度与head-nav一致 */
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
}
</style> 