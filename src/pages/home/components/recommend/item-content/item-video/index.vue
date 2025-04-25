<template>
  <div class="video-content">
    <h3>视频内容</h3>
    <p>{{ data.title }}</p>
  </div>
</template>

<script setup lang="ts">
interface VideoData {
  id: string
  title: string
  [key: string]: any
}

const props = defineProps<{
  data: VideoData
}>()

console.log(props.data)

defineOptions({
  name: 'VideoContent'
})
</script>

<style scoped>
.video-content {
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style> 