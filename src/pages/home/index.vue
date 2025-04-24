<template>
  <div class="home">
    <head-nav class="head-nav" />
    <router-view class="content" />
  </div>
</template>

<script setup lang="ts">
import HeadNav from './components/head-nav/HeadNav.vue'
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
}

.head-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
}

.content {
  width: 100%;
  height: 100%;
}
</style>