<template>
  <blog-loading-state 
    v-if="!blog || loading"
    :loading="loading"
  />
  
  <div class="blog-detail" v-else>
    <!-- 顶部 -->
    <blog-header 
      :blog="blog" 
      @go-back="goBack"
      @go-search="goToSearch"
      @toggle-follow="toggleFollow"
    />
    
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 博客内容 -->
      <blog-album :images="blog.images" />
      <blog-content :blog="blog" />
      
      <!-- 分隔线 -->
      <div class="divider"></div>
      
      <!-- 评论区 -->
      <blog-comments :comments="blog.comments" />
    </div>
    
    <!-- 底部互动栏 -->
    <blog-interaction-bar 
      :blog="blog"
      :is-liked="isLiked"
      :is-starred="isStarred" 
      @toggle-like="toggleLike"
      @toggle-star="toggleStar"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBlogDetail } from '@/api/blog'

// 导入组件
import BlogHeader from './components/blog-header.vue'
import BlogAlbum from './components/blog-album.vue'
import BlogContent from './components/blog-content.vue'
import BlogComments from './components/blog-comments.vue'
import BlogInteractionBar from './components/blog-interaction-bar.vue'
import BlogLoadingState from './components/blog-loading-state.vue'

// 路由
const route = useRoute()
const router = useRouter()

// 博客数据和状态
const blog = ref(null)
const loading = ref(true)
const isLiked = ref(false)
const isStarred = ref(false)

// 获取博客详情
const fetchBlogDetail = async () => {
  loading.value = true
  try {
    const blogId = route.params.id
    const result = await getBlogDetail(blogId)
    blog.value = result
  } catch (error) {
    console.error('Failed to fetch blog detail:', error)
  } finally {
    loading.value = false
  }
}

// 点赞/取消点赞
const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    blog.value.likes++
  } else {
    blog.value.likes--
  }
}

// 收藏/取消收藏
const toggleStar = () => {
  isStarred.value = !isStarred.value
  if (isStarred.value) {
    blog.value.stars++
  } else {
    blog.value.stars--
  }
}

// 关注/取消关注
const toggleFollow = () => {
  blog.value.isFollowing = !blog.value.isFollowing
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 跳转到搜索页面
const goToSearch = () => {
  router.push('/home/blog/search')
}

// 初始化
onMounted(() => {
  fetchBlogDetail()
})
</script>

<style scoped>
.blog-detail {
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

/* 内容区域 */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
}

/* 分隔线 */
.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0 16px;
}
</style> 