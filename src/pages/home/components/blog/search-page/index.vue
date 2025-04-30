<template>
  <div class="blog-search-page">
    <!-- 顶部搜索栏 -->
    <div class="search-header">
      <div class="return-btn" @click="goBack">
        <i class="iconfont icon-arrow-left"></i>
      </div>
      <div class="search-input-wrapper">
        <i class="iconfont icon-search"></i>
        <input 
          ref="searchInput"
          class="search-input" 
          type="text" 
          v-model="keyword"
          placeholder="搜索你感兴趣的内容" 
          @input="onSearch"
        />
        <i 
          v-if="keyword" 
          class="iconfont icon-close" 
          @click="clearKeyword"
        ></i>
      </div>
      <div class="search-btn" @click="onSearch">搜索</div>
    </div>
    
    <!-- 搜索建议 -->
    <div class="search-suggestions" v-if="!keyword">
      <div class="suggestion-header">
        <span>猜你想搜</span>
        <span class="refresh-btn" @click="refreshSuggestions">换一换<i class="iconfont icon-refresh"></i></span>
      </div>
      <div class="suggestion-list">
        <div 
          v-for="(suggestion, index) in suggestions" 
          :key="index" 
          class="suggestion-item"
          @click="useKeyword(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
    
    <!-- 搜索结果 -->
    <div class="search-results" v-else>
      <!-- 瀑布流布局 -->
      <div class="masonry-container" v-if="searchResults.length > 0">
        <!-- 左栏 -->
        <div class="masonry-column">
          <blog-item 
            v-for="blog in leftColumnResults" 
            :key="blog.id" 
            :blog="blog" 
            @click="goToBlogDetail(blog.id)"
            class="masonry-item" 
          />
        </div>
        
        <!-- 右栏 -->
        <div class="masonry-column">
          <blog-item 
            v-for="blog in rightColumnResults" 
            :key="blog.id" 
            :blog="blog" 
            @click="goToBlogDetail(blog.id)"
            class="masonry-item" 
          />
        </div>
      </div>
      
      <!-- 空结果提示 -->
      <div class="empty-results" v-else-if="!loading">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">没有找到相关内容</div>
      </div>
      
      <!-- 加载指示器 -->
      <div ref="loadingIndicator" class="loading-indicator" v-if="hasMore || loading">
        <div class="loading-spinner" v-if="loading"></div>
        <div class="loading-text" v-if="loading">加载中...</div>
      </div>
      
      <!-- 没有更多数据的提示 -->
      <div class="no-more" v-if="!hasMore && searchResults.length > 0">
        没有更多内容了
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BlogItem from '../components/blog-masonry-layout/blog-item.vue'
import { searchBlogs } from '@/api/blog'

// 路由
const router = useRouter()

// 搜索相关
const keyword = ref('')
const searchInput = ref(null)
const searchResults = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)
const loadingIndicator = ref(null)

// 瀑布流左右两栏博客
const leftColumnResults = computed(() => {
  return searchResults.value.filter((_, index) => index % 2 === 0)
})

const rightColumnResults = computed(() => {
  return searchResults.value.filter((_, index) => index % 2 === 1)
})

// 搜索建议
const allSuggestions = [
  '旅行攻略', '氛围感拍照', '护肤技巧', '烘焙教程', 
  '穿搭分享', '咖啡打卡', '减脂餐', '摄影技巧',
  '家居装饰', '手工DIY', '音乐推荐', '电影解说',
  '读书笔记', '健身打卡', '宠物日常', '川菜做法'
]
const suggestions = ref([])

// 刷新搜索建议
const refreshSuggestions = () => {
  suggestions.value = []
  const used = new Set()
  
  while (suggestions.value.length < 6) {
    const randomIndex = Math.floor(Math.random() * allSuggestions.length)
    const suggestion = allSuggestions[randomIndex]
    
    if (!used.has(suggestion)) {
      suggestions.value.push(suggestion)
      used.add(suggestion)
    }
  }
}

// 使用搜索建议作为关键词
const useKeyword = (suggestion) => {
  keyword.value = suggestion
  onSearch()
}

// 清除关键词
const clearKeyword = () => {
  keyword.value = ''
  searchResults.value = []
  hasMore.value = true
  currentPage.value = 1
}

// 搜索博客
const onSearch = () => {
  if (!keyword.value.trim()) return
  
  // 重置搜索状态
  searchResults.value = []
  hasMore.value = true
  currentPage.value = 1
  
  // 执行搜索
  fetchSearchResults()
}

// 加载搜索结果
const fetchSearchResults = async () => {
  if (loading.value || !hasMore.value || !keyword.value.trim()) return
  
  loading.value = true
  try {
    const res = await searchBlogs(keyword.value, currentPage.value, pageSize.value)
    searchResults.value = [...searchResults.value, ...res.list]
    hasMore.value = res.hasMore
    
    // 成功加载后递增页码
    if (res.hasMore) {
      currentPage.value++
    }
  } catch (error) {
    console.error('Failed to search blogs:', error)
  } finally {
    loading.value = false
  }
}

// 跳转到博客详情页
const goToBlogDetail = (id) => {
  router.push(`/home/blog/detail/${id}`)
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 使用 Intersection Observer API 监控加载指示器
let observer = null
const setupIntersectionObserver = () => {
  if (!loadingIndicator.value) return
  
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    // 当加载指示器进入视口时加载更多数据
    if (entry.isIntersecting && hasMore.value && !loading.value && keyword.value) {
      fetchSearchResults()
    }
  }, {
    rootMargin: '200px',
    threshold: 0.1
  })
  
  observer.observe(loadingIndicator.value)
}

// 初始化
onMounted(() => {
  // 生成建议
  refreshSuggestions()
  
  // 自动聚焦输入框
  nextTick(() => {
    searchInput.value?.focus()
  })
  
  // 设置交叉观察器
  setupIntersectionObserver()
})
</script>

<style scoped>
.blog-search-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

/* 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.return-btn {
  margin-right: 12px;
  font-size: 20px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 8px 12px;
  margin-right: 12px;
}

.search-input-wrapper i {
  color: #999;
  font-size: 16px;
}

.search-input-wrapper i.icon-search {
  margin-right: 8px;
}

.search-input-wrapper i.icon-close {
  cursor: pointer;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  color: #333;
}

.search-btn {
  color: #ff2442;
  font-size: 14px;
  font-weight: 500;
}

/* 搜索建议 */
.search-suggestions {
  padding: 16px;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.suggestion-header span {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.refresh-btn {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}

.refresh-btn i {
  margin-left: 4px;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.suggestion-item {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

/* 搜索结果 */
.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
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

.empty-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #999;
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
  border: 3px solid #f0f0f0;
  border-top-color: #ff2442;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  color: #ff2442;
  font-size: 14px;
}

.no-more {
  text-align: center;
  padding: 16px 0;
  color: #999;
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 