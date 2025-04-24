<template>
  <nav class="content-nav">
    <router-link 
      v-for="item in navItems" 
      :key="item.path"
      :to="item.path"
      class="nav-item"
      active-class="active"
    >
      {{ item.name }}
    </router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const navItems = [
  { name: '经验', path: '/home/blog' },
  { name: '商城', path: '/home/mall' },
  { name: '推荐', path: '/home/recommend' }
]

export default defineComponent({
  name: 'ContentNav',
  data() {
    return {
      navItems
    }
  }
})
</script>

<style scoped>
.content-nav {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-size: 20px;
  padding: 5px 10px;
  line-height: 20px;
  display: flex;
  align-items: center;
}

.active {
  color: #007AFF;
  font-weight: bold;
}
</style> 