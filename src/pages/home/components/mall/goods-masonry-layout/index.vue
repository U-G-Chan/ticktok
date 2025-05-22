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
    
    <!-- 加载指示器 -->
    <div ref="loadingIndicator" class="loading-indicator" v-if="hasMore">
      <div class="loading-spinner" v-if="loading"></div>
      <div class="loading-text" v-if="loading">加载中...</div>
    </div>
    
    <!-- 没有更多数据的提示 -->
    <div class="no-more" v-if="!hasMore && products.length > 0">
      没有更多商品了
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import GoodsItem from './goods-item.vue'
import { getProducts } from '@/api/modules/mall'

// 商品数据
const products = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)
const masonryContainer = ref(null)
const loadingIndicator = ref(null)

// 瀑布流左右两栏商品
const leftColumnProducts = computed(() => {
  return products.value.filter((_, index) => index % 2 === 0)
})

const rightColumnProducts = computed(() => {
  return products.value.filter((_, index) => index % 2 === 1)
})

// 加载商品数据
const fetchProducts = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    // 延迟300ms，模拟网络请求
    const res = await getProducts(currentPage.value, pageSize.value)
    products.value = [...products.value, ...res.list]
    hasMore.value = res.hasMore
    
    // 成功加载后递增页码
    if (res.hasMore) {
      currentPage.value++
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

// 使用 Intersection Observer API 监控加载指示器
let observer = null
const setupIntersectionObserver = () => {
  if (!loadingIndicator.value) return
  
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    // 当加载指示器进入视口时加载更多数据
    if (entry.isIntersecting && hasMore.value && !loading.value) {
      fetchProducts()
    }
  }, {
    rootMargin: '200px', // 提前200px触发
    threshold: 0.1 // 只需要10%可见度就触发
  })
  
  observer.observe(loadingIndicator.value)
}

// 初始化
onMounted(() => {
  // 首次加载数据
  fetchProducts()
  
  // 设置交叉观察器
  setupIntersectionObserver()
  
  // 备用滚动监听（用于不支持IntersectionObserver的浏览器）
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时清理
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('scroll', handleScroll)
})

// 滚动事件处理（备用方案）
const handleScroll = () => {
  if (!hasMore.value || loading.value) return
  
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const windowHeight = window.innerHeight
  const scrollHeight = document.documentElement.scrollHeight
  
  // 滚动到底部前200px时加载更多
  if (scrollTop + windowHeight >= scrollHeight - 200) {
    fetchProducts()
  }
}
</script>

<style scoped>
.goods-masonry-layout {
  padding: 12px;
  background: transparent;
  min-height: 200px;
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

.loading-indicator {
  text-align: center;
  padding: 20px 0;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  color: #6366f1;
  font-size: 14px;
}

.no-more {
  text-align: center;
  padding: 16px 0;
  color: #9ca3af;
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 