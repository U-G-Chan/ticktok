<template>
  <div class="slide-item">
    <slot :itemStatus="itemStatus"></slot>
  </div>
</template>

<script setup lang="ts">
import { SlideItemStatus } from '@/types/slide'

const props = defineProps<{
  contentType: 'video' | 'picture' | 'advertisement'
  itemStatus: SlideItemStatus
}>()

console.log(props.contentType)

defineOptions({
  name: 'SlideItem'
})
</script>

<style scoped>
.slide-item {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style> 