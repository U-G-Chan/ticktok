<template>
  <div class="advertisement-content">
    <h3>广告内容</h3>
    <p>{{ data.title }}</p>
  </div>
</template>

<script setup lang="ts">
interface AdvertisementData {
  id: string
  title: string
  [key: string]: any
}

const props = defineProps<{
  data: AdvertisementData
}>()

defineOptions({
  name: 'AdvertisementContent'
})
</script>

<style scoped>
.advertisement-content {
  width: 100%;
  height: 100%;
  background-color: #ffeb3b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style> 