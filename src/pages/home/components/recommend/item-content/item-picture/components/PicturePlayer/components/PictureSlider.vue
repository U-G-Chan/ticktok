<template>
  <div class="picture-container">
    <div 
      class="picture-slider"
      :style="{ 
        transform: `translateX(${translateX}px)`, 
        transition: isAnimating ? `transform ${transitionDuration}ms cubic-bezier(0.33, 1, 0.68, 1)` : 'none' 
      }"
    >
      <!-- 添加最后一张图片的克隆（放在最前面） -->
      <div 
        v-if="album.length > 1"
        class="picture-item"
        :style="{ left: `-100%` }"
      >
        <img 
          :src="getImageUrl(album[album.length - 1])" 
          alt="图片" 
          class="picture"
        />
      </div>
      
      <!-- 原始图片列表 -->
      <div 
        v-for="(url, index) in album" 
        :key="index" 
        class="picture-item"
        :class="{ 'active': displayIndex === index }"
        :style="{ left: `${index * 100}%` }"
      >
        <img 
          :src="getImageUrl(url)" 
          alt="图片" 
          class="picture"
          @load="onImageLoad(index)"
        />
      </div>
      
      <!-- 添加第一张图片的克隆（放在最后面） -->
      <div 
        v-if="album.length > 1"
        class="picture-item"
        :style="{ left: `${album.length * 100}%` }"
      >
        <img 
          :src="getImageUrl(album[0])" 
          alt="图片" 
          class="picture"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  album: string[]
  translateX: number
  isAnimating: boolean
  transitionDuration: number
  displayIndex: number
  getImageUrl: (url: string) => string
  onImageLoad: (index: number) => void
}>()
</script>

<style scoped>
.picture-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.picture-slider {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.picture-item {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picture {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style> 