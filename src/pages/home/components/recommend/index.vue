<template>
  <div class="recommend">
    <slide-list
      :page-size="5"
      :default-index="0"
    />
  </div>
</template>

<script setup lang="ts">
import SlideList from './slide-list.vue'
</script>

<style scoped>
.recommend {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style> 