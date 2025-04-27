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
    
    <!-- 商城子路由 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
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
.mall {
  width: 100%;
  height: 100%;
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
  background: transparent;
  position: relative;
  
}

.mall-sticky-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 8px 12px;
  
}

.mall-main {
  width: 100%;
  height: calc(100% - 56px);
  overflow-y: auto;
  background: transparent;
}
</style> 