<template>
  <div class="background-blur" :style="backgroundStyle"></div>
</template>

<script setup lang="ts">
defineProps<{
  backgroundStyle: {
    backgroundImage: string
    filter: string
  }
}>()
</script>

<style scoped>
.background-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}
</style> 