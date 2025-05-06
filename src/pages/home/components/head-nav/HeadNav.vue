<template>
  <nav class="head-nav">
    <side-menu-nav @click="sideMenuStore.toggle()" />
    <content-nav />
    <search-nav @click="goToSearch" />
  </nav>
</template>

<script lang="ts">
import { defineComponent} from 'vue'
import { useRouter } from 'vue-router'
import SideMenuNav from './SideMenuNav.vue'
import ContentNav from './ContentNav.vue'
import SearchNav from './SearchNav.vue'
import { useSideMenuStore } from '@/store/sideMenu'



export default defineComponent({
  name: 'HeadNav',
  components: {
    SideMenuNav,
    ContentNav,
    SearchNav
  },
  setup() {
    const router = useRouter()
    const sideMenuStore = useSideMenuStore()

    const goToSearch = () => {
      router.push('/search')
    }

    return {
      sideMenuStore,
      goToSearch
    }
  }
})
</script>

<style scoped>
.head-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 100;
}

.nav-left, .nav-right {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-center {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 