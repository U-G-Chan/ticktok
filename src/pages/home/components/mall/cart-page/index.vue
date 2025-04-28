<template>
  <div class="cart-page">
    <div class="cart-header">
      <div class="back-btn" @click="goBack">
        <span class="iconfont icon-back"></span>
      </div>
      <div class="header-title">购物车</div>
      <div class="placeholder"></div>
    </div>
    
    <!-- 购物车为空状态 -->
    <div class="empty-cart" v-if="!cartItems.length">
      <div class="empty-icon">
        <span class="iconfont icon-cart-empty"></span>
      </div>
      <p class="empty-text">暂无商品，装满购物车吧</p>
      <div class="go-shopping-btn" @click="goShopping">去购物</div>
    </div>
    
    <!-- 购物车列表 -->
    <div class="cart-content" v-else>
      <div class="cart-items">
        <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
          <div class="item-checkbox">
            <input type="checkbox" :checked="item.checked" @change="toggleItemCheck(index)" />
          </div>
          <div class="item-img">
            <img :src="item.image" :alt="item.title" />
          </div>
          <div class="item-info">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-spec" v-if="item.spec">{{ item.spec }}</div>
            <div class="item-bottom">
              <div class="item-price">¥{{ item.price }}</div>
              <div class="item-quantity">
                <button @click="decreaseQuantity(index)" :disabled="item.quantity <= 1">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(index)">+</button>
              </div>
            </div>
          </div>
          <div class="item-delete" @click="removeItem(index)">
            <span class="iconfont icon-delete"></span>
          </div>
        </div>
      </div>
      
      <!-- 底部结算栏 -->
      <div class="cart-footer">
        <div class="select-all">
          <input 
            type="checkbox" 
            :checked="isAllChecked" 
            @change="toggleAllCheck" 
          />
          <span>全选</span>
        </div>
        <div class="total-info">
          <div class="total-price">
            合计: <span>¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="checkout-btn" :class="{ disabled: !hasCheckedItems }">
            结算({{ checkedCount }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟购物车数据
const cartItems = ref([])

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 跳转到商城页面
const goShopping = () => {
  router.push('/home/mall')
}

// 计算属性
const isAllChecked = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every(item => item.checked)
})

const hasCheckedItems = computed(() => {
  return cartItems.value.some(item => item.checked)
})

const checkedCount = computed(() => {
  return cartItems.value.filter(item => item.checked).length
})

const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 方法
const toggleItemCheck = (index) => {
  cartItems.value[index].checked = !cartItems.value[index].checked
}

const toggleAllCheck = () => {
  const newState = !isAllChecked.value
  cartItems.value.forEach(item => {
    item.checked = newState
  })
}

const increaseQuantity = (index) => {
  cartItems.value[index].quantity++
}

const decreaseQuantity = (index) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--
  }
}

const removeItem = (index) => {
  cartItems.value.splice(index, 1)
}
</script>

<style scoped>
.cart-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  height: 100vh;
  width: 100vw;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(to right, #ffecf4, #e6f2ff);
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 更新返回按钮图标 */
.back-btn .icon-back::before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 2px solid #333;
  border-left: 2px solid #333;
  transform: rotate(-45deg);
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.placeholder {
  width: 24px;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.empty-icon {
  font-size: 60px;
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-text {
  color: #9ca3af;
  margin-bottom: 20px;
}

.go-shopping-btn {
  padding: 8px 24px;
  background: #6366f1;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.cart-item {
  display: flex;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  position: relative;
}

.item-checkbox {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.item-img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 14px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.item-spec {
  font-size: 12px;
  color: #9ca3af;
  padding: 2px 6px;
  background: #f9fafb;
  border-radius: 4px;
  margin-bottom: 8px;
  display: inline-block;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.item-price {
  color: #f43f5e;
  font-weight: bold;
}

.item-quantity {
  display: flex;
  align-items: center;
}

.item-quantity button {
  width: 24px;
  height: 24px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}

.item-quantity span {
  width: 30px;
  text-align: center;
}

.item-delete {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 16px;
  color: #9ca3af;
  cursor: pointer;
}

.cart-footer {
  display: flex;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  align-items: center;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 12px;
}

.total-info {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.total-price {
  margin-right: 12px;
}

.total-price span {
  color: #f43f5e;
  font-weight: bold;
}

.checkout-btn {
  padding: 6px 16px;
  background: #6366f1;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
}

.checkout-btn.disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
</style> 