<template>
  <div class="app">
    <div class="middle" :class="{ 'menu-open': sideMenuStore.isOpen }">
      <div class="container">
        <router-view></router-view>
      </div>
      <FootNav />
    </div>
    <div class="side-menu-container" :class="{ 'menu-open': sideMenuStore.isOpen }">
      <side-menu class="side-menu" />
      <div class="side-menu-mask" @click="sideMenuStore.close()"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FootNav from '@/components/FootNav.vue'
import SideMenu from '@/components/SideMenu'
import { useSideMenuStore } from '@/store/sideMenu'

export default defineComponent({
  name: 'App',
  components: {
    FootNav,
    SideMenu
  },
  setup() {
    // 使用侧边栏的 store
    const sideMenuStore = useSideMenuStore()
    
    return {
      sideMenuStore
    }
  }
})
</script>

<style>
.app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.middle {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.container {
  flex: 0.94;
  width: 100%;
  overflow-y: auto;
}

.side-menu-container {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.3s ease;
  z-index: 2;
}

.side-menu {
  width: 70%;
  height: 100%;
  background: #fff;
  z-index: 2;
}

.side-menu-mask {
  width: 30%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.middle.menu-open {
  transform: translateX(70%);
}

.side-menu-container.menu-open {
  transform: translateX(100%);
}
</style>
