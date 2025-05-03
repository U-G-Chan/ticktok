<template>
  <div class="side-menu">
    <side-menu-header />
    <notices-board />
    <tools-board />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideMenuHeader from './Header.vue'
import NoticesBoard from './NoticesBoard.vue'
import ToolsBoard from './ToolsBoard.vue'

export default defineComponent({
  name: 'SideMenu',
  components: {
    SideMenuHeader,
    NoticesBoard,
    ToolsBoard
  }
})
</script>

<style scoped>
.side-menu {
  background: #f5f5f5;
  overflow-y: auto;
  height: 100%;
  width: 80%;
}
</style> 