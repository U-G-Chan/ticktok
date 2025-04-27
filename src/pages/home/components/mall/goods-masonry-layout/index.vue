<template>
  <div class="goods-masonry-layout">
    <div ref="masonryContainer" class="masonry-container">
      <!-- 左栏 -->
      <div class="masonry-column">
        <goods-item 
          v-for="product in leftColumnProducts" 
          :key="product.id" 
          :product="product" 
          class="masonry-item" 
        />
      </div>
      
      <!-- 右栏 -->
      <div class="masonry-column">
        <goods-item 
          v-for="product in rightColumnProducts" 
          :key="product.id" 
          :product="product" 
          class="masonry-item" 
        />
      </div>
    </div>
    
    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore" @click="loadMore">
      <span v-if="!loading">加载更多</span>
      <span v-else>加载中...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import GoodsItem from './goods-item.vue'
import { getMallProducts } from '@/api/mall'

// 商品数据
const products = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)

// 瀑布流左右两栏商品
const leftColumnProducts = computed(() => {
  return products.value.filter((_, index) => index % 2 === 0)
})

const rightColumnProducts = computed(() => {
  return products.value.filter((_, index) => index % 2 === 1)
})

// 加载商品数据
const fetchProducts = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    const res = await getMallProducts(currentPage.value, pageSize.value)
    products.value = [...products.value, ...res.list]
    hasMore.value = res.hasMore
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多商品
const loadMore = () => {
  if (loading.value || !hasMore.value) return
  
  currentPage.value++
  fetchProducts()
}

// 初始加载
onMounted(() => {
  fetchProducts()
  
  // 滚动到底部自动加载更多
  window.addEventListener('scroll', handleScroll)
})

// 监听滚动事件，实现无限滚动
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const windowHeight = window.innerHeight
  const scrollHeight = document.documentElement.scrollHeight
  
  // 滚动到底部前100px时加载更多
  if (scrollTop + windowHeight >= scrollHeight - 100 && hasMore.value && !loading.value) {
    loadMore()
  }
}
</script>

<style scoped>
.goods-masonry-layout {
  padding: 12px;
  background: transparent;
}

.masonry-container {
  display: flex;
  gap: 8px;
}

.masonry-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.masonry-item {
  margin-bottom: 8px;
}

.load-more {
  text-align: center;
  padding: 12px 0;
  color: #6366f1;
  font-size: 14px;
  background: #f3f4f6;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
}
</style> 