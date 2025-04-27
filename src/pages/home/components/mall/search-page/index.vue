<template>
  <div class="search-page">
    <div class="search-header">
      <div class="back-btn" @click="goBack">
        <span class="iconfont icon-back"></span>
      </div>
      <div class="search-input-wrapper">
        <span class="iconfont icon-search"></span>
        <input 
          ref="searchInput"
          class="search-input" 
          v-model="keyword"
          placeholder="搜索商品" 
          @keyup.enter="handleSearch"
          autofocus
        />
        <span v-if="keyword" class="clear-btn" @click="clearKeyword">×</span>
      </div>
      <div class="search-btn" @click="handleSearch">搜索</div>
    </div>
    
    <div class="search-content">
      <!-- 热门搜索 -->
      <div class="hot-search" v-if="!keyword">
        <div class="section-title">猜你想搜</div>
        <div class="hot-tags">
          <div 
            v-for="(tag, index) in hotSearchTags" 
            :key="index"
            class="hot-tag"
            @click="selectTag(tag)"
          >
            {{ tag }}
          </div>
        </div>
      </div>
      
      <!-- 搜索结果为空 -->
      <div class="empty-result" v-if="keyword && searched && !searchResults.length">
        <img src="@/assets/images/empty.png" alt="没有结果" class="empty-img">
        <p>没有找到相关商品</p>
      </div>
      
      <!-- 搜索结果 -->
      <div class="search-results" v-if="searchResults.length">
        <div class="result-item" v-for="item in searchResults" :key="item.id">
          <div class="item-img">
            <img :src="item.image" :alt="item.title" />
          </div>
          <div class="item-info">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-price">¥{{ item.price }}</div>
            <div class="item-shop">{{ item.shopInfo.name }} · {{ item.shopInfo.sales }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')
const searchInput = ref(null)
const searched = ref(false)
const searchResults = ref([])

// 热门搜索标签
const hotSearchTags = [
  '二胡', '男短袖T恤', '男款裤子', '休闲小零食',
  '蓝牙耳机', '日本裸妆神器', '洋气夏装', '泡面',
  '夏季穿搭套装', '万花筒', '夏天穿搭上衣', '神印王座'
]

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 选择热门标签
const selectTag = (tag) => {
  keyword.value = tag
  handleSearch()
}

// 清空关键词
const clearKeyword = () => {
  keyword.value = ''
  searchResults.value = []
  searched.value = false
}

// 处理搜索
const handleSearch = () => {
  if (!keyword.value.trim()) return
  
  searched.value = true
  searchResults.value = [] // 清空之前的结果
  
  // 模拟搜索请求
  setTimeout(() => {
    // TODO: 对接真实搜索API
    // 这里模拟返回空结果
    searchResults.value = []
  }, 500)
}

onMounted(() => {
  // 自动聚焦搜索框
  searchInput.value && searchInput.value.focus()
})
</script>

<style scoped>
.search-page {
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.back-btn {
  padding: 6px 10px;
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 6px 12px;
  position: relative;
}

.icon-search {
  color: #999;
  margin-right: 6px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.clear-btn {
  font-size: 18px;
  color: #999;
  padding: 0 6px;
  cursor: pointer;
}

.search-btn {
  padding: 0 12px;
  color: #6366f1;
  font-size: 14px;
  cursor: pointer;
}

.search-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.section-title {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-tag {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}

.hot-tag:hover {
  background: #e5e7eb;
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.empty-img {
  width: 120px;
  margin-bottom: 16px;
}

.empty-result p {
  color: #999;
  font-size: 14px;
}

.search-results {
  margin-top: 12px;
}

.result-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
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
  justify-content: space-between;
}

.item-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.item-price {
  font-size: 16px;
  color: #f43f5e;
  font-weight: bold;
}

.item-shop {
  font-size: 12px;
  color: #999;
}
</style> 