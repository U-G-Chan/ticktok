<template>
  <div class="goods-search-bar" @click="goSearch">
    <span class="iconfont icon-search"></span>
    <input class="search-input" placeholder="搜索商品" readonly />
    <button class="iconfont icon-camera"></button>
    <button class="search-btn">搜索</button>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goSearch = () => {
  router.push('/home/mall/search')
}
</script>
<style scoped>
.goods-search-bar {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 20px;
  padding: 4px 12px;
  flex: 1;
  margin-right: 12px;
  min-width: 0;
}
.iconfont {
  font-size: 18px;
  color: #6366f1;
}
.search-input {
  border: none;
  background: transparent;
  flex: 1;
  margin: 0 8px;
  outline: none;
  font-size: 15px;
}
.icon-camera {
  margin-right: 8px;
}
.search-btn {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 2px 12px;
  font-size: 14px;
  cursor: pointer;
}
</style> 