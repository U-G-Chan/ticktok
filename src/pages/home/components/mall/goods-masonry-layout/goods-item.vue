<template>
  <div class="goods-item">
    <!-- 商品图片 -->
    <div class="goods-img">
      <img :src="product.image" :alt="product.title" @error="handleImgError" />
    </div>
    
    <!-- 商品信息区域 -->
    <div class="goods-info">
      <!-- 品牌标签和标题 -->
      <div class="goods-header">
        <div v-if="product.headLabel" class="head-label">{{ product.headLabel }}</div>
        <h3 class="goods-title">{{ product.title }}</h3>
      </div>
      
      <!-- 商品标签 -->
      <div v-if="product.labels && product.labels.length" class="goods-labels">
        <span 
          v-for="(label, index) in product.labels" 
          :key="index" 
          class="label"
        >{{ label }}</span>
      </div>
      
      <!-- 价格和店铺信息 -->
      <div class="goods-footer">
        <div class="price-box">
          <span class="price-symbol">¥</span>
          <span class="price">{{ product.price }}</span>
          <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
        </div>
        <div class="shop-info">{{ product.shopInfo.sales }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// 默认图片，当图片加载失败时显示
const defaultImg = 'https://via.placeholder.com/200x200?text=商品图片'

// 处理图片加载错误
const handleImgError = (e) => {
  e.target.src = defaultImg
}
</script>

<style scoped>
.goods-item {
  width: 100%;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

.goods-img {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.goods-img img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.goods-img img:hover {
  transform: scale(1.05);
}

.goods-info {
  padding: 8px 10px;
}

.goods-header {
  margin-bottom: 6px;
}

.head-label {
  display: inline-block;
  padding: 2px 6px;
  background: #f0f7ff;
  color: #3b82f6;
  border-radius: 4px;
  font-size: 10px;
  margin-bottom: 4px;
}

.goods-title {
  font-size: 13px;
  font-weight: normal;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  line-clamp: 2;
}

.goods-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.label {
  padding: 1px 4px;
  background: #fff0f6;
  color: #f43f5e;
  border-radius: 2px;
  font-size: 10px;
  border: 1px solid rgba(244, 63, 94, 0.2);
}

.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-box {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 12px;
  color: #f43f5e;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #f43f5e;
}

.original-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
  margin-left: 4px;
}

.shop-info {
  font-size: 11px;
  color: #666;
}
</style> 