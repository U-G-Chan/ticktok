<template>
  <nav class="head-nav">
    <side-menu-nav @click="toggleSideMenu" />
    <content-nav />
    <search-nav @click="goToSearch" />
  </nav>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import SideMenuNav from './SideMenuNav.vue'
import ContentNav from './ContentNav.vue'
import SearchNav from './SearchNav.vue'

export default defineComponent({
  name: 'HeadNav',
  components: {
    SideMenuNav,
    ContentNav,
    SearchNav
  },
  setup() {
    const router = useRouter()
    const toggleSideMenu = inject('toggleSideMenu') as () => void

    const goToSearch = () => {
      router.push('/search')
    }

    return {
      toggleSideMenu,
      goToSearch
    }
  }
})
</script>

<style scoped>
.head-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  width: 100%;
  height: 44px;
}
</style> 