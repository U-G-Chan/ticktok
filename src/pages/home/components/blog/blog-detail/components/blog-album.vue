<template>
  <div class="album">
    <template v-if="!useFallbackGallery">
      <swiper 
        :slides-per-view="1" 
        :pagination="{ clickable: true }" 
        :modules="[SwiperPagination]"
        class="album-swiper"
      >
        <swiper-slide v-for="(image, index) in images" :key="index">
          <img :src="image" alt="blog image" @error="handleImgError" />
        </swiper-slide>
      </swiper>
    </template>
    
    <!-- 回退相册 - 当swiper不可用时 -->
    <template v-else>
      <div class="fallback-gallery">
        <div class="fallback-image-container">
          <img 
            :src="images[currentImageIndex]" 
            alt="blog image" 
            @error="handleImgError"
            class="fallback-image"
          />
        </div>
        <div class="fallback-pagination" v-if="images.length > 1">
          <span 
            v-for="(_, index) in images" 
            :key="index" 
            :class="['fallback-dot', { active: index === currentImageIndex }]"
            @click="currentImageIndex = index"
          ></span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

// 状态
const useFallbackGallery = ref(true) // 默认使用回退相册
const currentImageIndex = ref(0) // 用于回退相册

// swiper相关
let Swiper = null
let SwiperSlide = null
let SwiperPagination = null

// 加载swiper（如可用）
onMounted(async () => {
  try {
    // 动态导入swiper
    const swiperVueModule = await import('swiper/vue')
    const swiperModulesModule = await import('swiper/modules')
    
    // 设置组件
    Swiper = swiperVueModule.Swiper
    SwiperSlide = swiperVueModule.SwiperSlide
    SwiperPagination = swiperModulesModule.Pagination
    
    // 导入样式
    await import('swiper/css')
    await import('swiper/css/pagination')
    
    // 加载成功，使用swiper
    useFallbackGallery.value = false
  } catch (error) {
    console.warn('Swiper库不可用，使用回退相册', error)
    useFallbackGallery.value = true
  }
})

// 处理图片加载错误
const handleImgError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x400?text=图片不见了'
}
</script>

<style scoped>
/* 相册样式 */
.album {
  width: 100%;
  background: #000;
}

.album-swiper {
  width: 100%;
  aspect-ratio: 3/4;
}

.album img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 回退相册样式 */
.fallback-gallery {
  width: 100%;
  background: #000;
  position: relative;
}

.fallback-image-container {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.fallback-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fallback-pagination {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.fallback-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.fallback-dot.active {
  width: 16px;
  border-radius: 3px;
  background: #fff;
}
</style> 