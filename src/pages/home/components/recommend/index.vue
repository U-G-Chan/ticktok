<template>
  <div class="recommend">
    <slide-list
      :items="items"
      :cache-size="5"
      :default-index="2"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SlideList from './slide-list.vue'

interface SlideItemData {
  id: string
  contentType: 'video' | 'picture' | 'advertisement'
  title: string
  [key: string]: any
}

// Mock 数据
const items = ref<SlideItemData[]>([
  {
    id: '1',
    contentType: 'video',
    title: '视频内容 1'
  },
  {
    id: '2',
    contentType: 'picture',
    title: '图片内容 1'
  },
  {
    id: '3',
    contentType: 'video',
    title: '视频内容 2'
  },
  {
    id: '4',
    contentType: 'advertisement',
    title: '广告内容 1'
  },
  {
    id: '5',
    contentType: 'video',
    title: '视频内容 3'
  }
])
</script>

<style scoped>
.recommend {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style> 