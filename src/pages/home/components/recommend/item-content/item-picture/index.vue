<template>
  <div class="picture-content">
    <picture-player 
      :album="pictureData.album" 
      :item-status="itemStatus"
      @index-change="handleIndexChange"
      @is-paused-change="handlePausedChange"
    />
    
    <picture-footer 
      :author="pictureData.author"
      :title="pictureData.title"
      :labels="pictureData.labels"
      :opacity="contentOpacity"
    />
    
    <picture-sidebar 
      :avatar="pictureData.avatar"
      :likes="pictureData.likes"
      :comments="pictureData.comments"
      :stars="pictureData.stars"
      :forwards="pictureData.forwards"
      :opacity="contentOpacity"
    />
    
    <picture-progress
      :current-index="currentIndex"
      :total-count="pictureData.album.length"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PicturePlayer from './components/PicturePlayer.vue'
import PictureFooter from './components/PictureFooter.vue'
import PictureSidebar from './components/PictureSidebar.vue'
import PictureProgress from './components/PictureProgress.vue'
import { SlideItemData, SlideItemStatus } from '@/types/slide'

interface PictureData extends SlideItemData {
  album: string[]
  author: string
  title: string
  avatar: string
  likes: number
  comments: number
  stars: number
  forwards: number
  labels: string[]
}

const props = defineProps<{
  data: PictureData
  itemStatus: SlideItemStatus
}>()

defineOptions({
  name: 'PictureContent'
})

const isPaused = ref(true)
const currentIndex = ref(0)
const contentOpacity = ref(1)

const pictureData = ref<PictureData>({
  ...props.data,
  album: props.data.album || [],
  author: props.data.author || '未知用户',
  title: props.data.title || '',
  avatar: props.data.avatar || '',
  likes: props.data.likes || 0,
  comments: props.data.comments || 0,
  stars: props.data.stars || 0,
  forwards: props.data.forwards || 0,
  labels: props.data.labels || []
})

// 处理索引变化
const handleIndexChange = (index: number) => {
  currentIndex.value = index
}

// 处理暂停状态变化
const handlePausedChange = (paused: boolean) => {
  isPaused.value = paused
  contentOpacity.value = paused ? 1 : 0.8
}

// 监听激活状态变化
watch(() => props.itemStatus, (newVal) => {
  if (newVal === SlideItemStatus.INACTIVE) {
    currentIndex.value = 0
    isPaused.value = true
  }
})
</script>

<style scoped>
.picture-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  /* background-color: #000; */
}
</style> 