<template>
  <div class="shopping-cart" @click="goCart">
    <span class="iconfont icon-cart"></span>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goCart = () => {
  router.push('/home/mall/cart')
  console.log('跳转到购物车页面', router.currentRoute.value)
}
</script>
<style scoped>
.shopping-cart {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.icon-cart {
  font-size: 22px;
  color: #6366f1;
}
</style> 