<template>
  <div class="container">
    <router-view></router-view>
  </div>
  <FootNav />
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
.container {
  flex: 0.94;
  width: 100%;
  overflow-y: auto;
}
</style>
