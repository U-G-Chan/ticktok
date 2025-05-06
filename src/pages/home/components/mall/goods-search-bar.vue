<template>
  <div class="goods-search-bar" @click="goSearch">
    <icon-search theme="outline" size="18" fill="#333"/>
    <input class="search-input" placeholder="搜索商品" readonly />
    <button class="camera-btn">
      <icon-camera theme="outline" size="18" fill="#333"/>
    </button>
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
  border: 1px solid #ff2727;
  border-radius: 20px;
  padding: 3px 3px;
  flex: 1;
  margin-right: 12px;
  min-width: 0;
  background: white;
}

.camera-btn {
  background: transparent;
  padding: 0 5px;
  border: none;
}

.search-input {
  border: none;
  background: transparent;
  flex: 1;
  margin: 0 8px;
  outline: none;
  font-size: 15px;
  min-width: 100px;
  width: auto;
}

.search-btn {
  background: #ff2727;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 2px 12px;
  font-size: 14px;
  cursor: pointer;
}
</style> 