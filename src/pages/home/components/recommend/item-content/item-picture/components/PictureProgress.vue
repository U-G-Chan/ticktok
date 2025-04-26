<template>
  <div class="picture-progress" :class="{ 'show': true }">
    <div class="progress-bar">
      <div 
        v-for="(_, index) in totalCount" 
        :key="index" 
        class="progress-dot" 
        :class="{ 'active': index <= currentIndex }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentIndex: number,
  totalCount: number
}>()

defineOptions({
  name: 'PictureProgress'
})
</script>

<style scoped>
.picture-progress {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
  gap: 0;
  padding: 0 12px;
}

.progress-dot {
  flex: 1 1 0;
  margin: 0 2px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 0.5;
  transition: all 0.3s ease;
  border-radius: 1.5px;
}

.progress-dot.active {
  background-color: rgba(255, 255, 255, 1);
  opacity: 1;
}
</style> 