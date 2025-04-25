<template>
  <div class="slide-item">
    <slot :isActivated="isActivated"></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  contentType: 'video' | 'picture' | 'advertisement'
  isActivated: boolean
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