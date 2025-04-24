<template>
  <div class="picture-content">
    <h3>图片内容</h3>
    <p>{{ data.title }}</p>
  </div>
</template>

<script setup lang="ts">
interface PictureData {
  id: string
  title: string
  [key: string]: any
}

const props = defineProps<{
  data: PictureData
}>()

defineOptions({
  name: 'PictureContent'
})
</script>

<style scoped>
.picture-content {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style> 