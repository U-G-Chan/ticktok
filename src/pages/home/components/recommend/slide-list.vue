<template>
  <div class="slide-list" ref="slideListRef">
    <div class="slide-container" :style="containerStyle">
      <slide-item v-for="(item, index) in slideItemBuffer" :key="item.id" :content-type="item.contentType"
        :style="getItemStyle(index)">
        <template #default>
          <component :is="getContentComponent(item.contentType)" :data="item" />
        </template>
      </slide-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { getSlideItems } from '@/api/slide'
import type { SlideItemData } from '@/types/slide'

const SlideItem = defineAsyncComponent(() => import('./slide-item.vue'))
const VideoContent = defineAsyncComponent(() => import('./item-content/item-video/index.vue'))
const PictureContent = defineAsyncComponent(() => import('./item-content/item-picture/index.vue'))
const AdvertisementContent = defineAsyncComponent(() => import('./item-content/item-advertisement/index.vue'))

export default defineComponent({
  name: 'SlideList',
  components: {
    SlideItem,
    VideoContent,
    PictureContent,
    AdvertisementContent
  },
  props: {
    pageSize: {
      type: Number,
      default: 5
    },
    defaultIndex: {
      type: Number,
      default: 0
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
    const slideItemBuffer = ref<SlideItemData[]>([])
    const maxBufferSize = ref(props.pageSize * 3)

    // 获取滑动项数据
    const getSlideItemsData = async (startIndex: number) => {
      return await getSlideItems(startIndex, props.pageSize)
    }

    // 刷新滑动列表
    const refreshSlideList = async () => {
      slideItemBuffer.value = []
      const items = await getSlideItemsData(0)
      slideItemBuffer.value = items
    }

    // 获取更多滑动项
    const getMoreSlideItems = async () => {
      if (slideItemBuffer.value.length === 0) return

      // 获取最后一个元素的 id，并转换为数字
      const lastItemId = parseInt(slideItemBuffer.value[slideItemBuffer.value.length - 1].id)
      const newItems = await getSlideItemsData(lastItemId)

      // 如果超过最大缓存大小，移除头部数据
      if (slideItemBuffer.value.length + newItems.length > maxBufferSize.value) {
        // 计算需要移除的数据量
        const removeCount = (slideItemBuffer.value.length + newItems.length) - maxBufferSize.value
        // 移除头部数据
        slideItemBuffer.value = [...slideItemBuffer.value.slice(removeCount), ...newItems]
        // 保持当前显示位置不变
        currentIndex.value = Math.max(0, currentIndex.value - removeCount)
      } else {
        // 直接追加新数据
        slideItemBuffer.value = [...slideItemBuffer.value, ...newItems]
      }
    }

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
        } else if (deltaY < 0 && currentIndex.value < slideItemBuffer.value.length - 1) {
          currentIndex.value++
          // 当滑动到最后一个item时，加载更多数据
          if (currentIndex.value === slideItemBuffer.value.length - 1) {
            getMoreSlideItems()
          }
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
      // 初始化加载数据
      refreshSlideList()
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
      getContentComponent,
      slideItemBuffer
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