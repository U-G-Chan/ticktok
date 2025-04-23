<template>
  <div class="app">
    <router-view class="container"></router-view>
    <FootNav />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FootNav from '@/components/FootNav.vue'

export default defineComponent({
  name: 'App',
  components: {
    FootNav
  }
})
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  width: 100%;
  height: 100vh;
  background-color: #121212;
  position: relative;
}

.container {
  width: 100%;
  min-height: 94vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}
</style>
