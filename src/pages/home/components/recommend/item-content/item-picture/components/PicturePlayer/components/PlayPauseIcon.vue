<template>
  <div class="play-pause-icon" v-if="isPaused && isUserPaused && !isUserInteracting">
    <div class="play-triangle"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isPaused: boolean
  isUserInteracting: boolean
  isUserPaused: boolean
}>()
</script>

<style scoped>
.play-pause-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.play-triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12px 0 12px 20px;
  border-color: transparent transparent transparent rgba(255, 255, 255, 0.8);
  margin-left: 4px;
}
</style> 