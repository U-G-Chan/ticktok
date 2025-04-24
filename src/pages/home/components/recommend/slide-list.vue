<template>
  <div class="slide-list" ref="slideListRef">
    <div class="slide-container" :style="containerStyle">
      <slide-item
        v-for="(item, index) in items"
        :key="item.id"
        :content-type="item.contentType"
        :style="getItemStyle(index)"
      >
        <template #default>
          <component :is="getContentComponent(item.contentType)" :data="item" />
        </template>
      </slide-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
const SlideItem = defineAsyncComponent(() => import('./slide-item.vue'))
const VideoContent = defineAsyncComponent(() => import('./video-content.vue'))
const PictureContent = defineAsyncComponent(() => import('./picture-content.vue'))
const AdvertisementContent = defineAsyncComponent(() => import('./advertisement-content.vue'))

interface SlideItemData {
  id: string
  contentType: 'video' | 'picture' | 'advertisement'
  title: string
  [key: string]: any
}

export default defineComponent({
  name: 'SlideList',
  components: {
    SlideItem,
    VideoContent,
    PictureContent,
    AdvertisementContent
  },
  props: {
    cacheSize: {
      type: Number,
      default: 5
    },
    defaultIndex: {
      type: Number,
      default: 2
    },
    items: {
      type: Array as () => SlideItemData[],
      required: true
    }
  },
  setup(props) {
    const slideListRef = ref<HTMLElement | null>(null)
    const currentIndex = ref(props.defaultIndex)
    const startY = ref(0)
    const currentY = ref(0)
    const isDragging = ref(false)
    const startX = ref(0)
    const itemHeight = ref(0)

    const containerStyle = computed(() => ({
      transform: `translateY(${-currentIndex.value * 100 + (isDragging.value ? (currentY.value - startY.value) : 0)}%)`,
      transition: isDragging.value ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
    }))

    const getItemStyle = (index: number) => ({
      transform: `translateY(${index * 100}%)`
    })

    const getContentComponent = (type: 'video' | 'picture' | 'advertisement') => {
      switch (type) {
        case 'video':
          return VideoContent
        case 'picture':
          return PictureContent
        case 'advertisement':
          return AdvertisementContent
        default:
          return null
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.value = true
      startY.value = e.touches[0].clientY
      currentY.value = startY.value
      startX.value = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.value) return
      
      const deltaY = e.touches[0].clientY - startY.value
      const deltaX = Math.abs(e.touches[0].clientX - startX.value)
      
      if (deltaX > Math.abs(deltaY)) return
      
      const sensitivity = 0.5
      currentY.value = startY.value + deltaY * sensitivity
    }

    const handleTouchEnd = () => {
      if (!isDragging.value) return
      
      const deltaY = currentY.value - startY.value
      const singleItemHeight = (slideListRef.value?.clientHeight || 0) / 5
      
      if (Math.abs(deltaY) > singleItemHeight * 0.5) {
        if (deltaY > 0 && currentIndex.value > 0) {
          currentIndex.value--
        } else if (deltaY < 0 && currentIndex.value < props.items.length - 1) {
          currentIndex.value++
        }
      }
      
      isDragging.value = false
    }

    onMounted(() => {
      if (slideListRef.value) {
        itemHeight.value = slideListRef.value.clientHeight
        slideListRef.value.addEventListener('touchstart', handleTouchStart)
        slideListRef.value.addEventListener('touchmove', handleTouchMove)
        slideListRef.value.addEventListener('touchend', handleTouchEnd)
      }
    })

    onUnmounted(() => {
      if (slideListRef.value) {
        slideListRef.value.removeEventListener('touchstart', handleTouchStart)
        slideListRef.value.removeEventListener('touchmove', handleTouchMove)
        slideListRef.value.removeEventListener('touchend', handleTouchEnd)
      }
    })

    return {
      slideListRef,
      currentIndex,
      containerStyle,
      getItemStyle,
      getContentComponent
    }
  }
})
</script>

<style scoped>
.slide-list {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.slide-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style> 