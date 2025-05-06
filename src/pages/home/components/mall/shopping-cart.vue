<template>
  <div class="shopping-cart" @click="goCart">
    <icon-shopping theme="outline" size="22" fill="#333"/>
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
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

</style> 