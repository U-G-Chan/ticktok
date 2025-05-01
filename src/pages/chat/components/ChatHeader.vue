<template>
  <div class="chat-header">
    <div class="sidebar-icon" @click="onSidebarClick">
      <i class="icon-menu"></i>
    </div>
    <div class="title">消息</div>
    <div class="header-actions">
      <div class="search-icon" @click="onSearchClick">
        <i class="icon-search"></i>
      </div>
      <div class="more-icon" @click="onMoreClick">
        <i class="icon-more"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSideMenuStore } from '@/store/sideMenu'

export default defineComponent({
  name: 'ChatHeader',
  emits: ['sidebar-click', 'search-click', 'more-click'],
  setup(_, { emit }) {
    const sideMenuStore = useSideMenuStore()

    const onSidebarClick = () => {
      emit('sidebar-click')
      sideMenuStore.toggle()
    }

    const onSearchClick = () => {
      emit('search-click')
    }

    const onMoreClick = () => {
      emit('more-click')
    }

    return {
      onSidebarClick,
      onSearchClick,
      onMoreClick
    }
  }
})
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  height: 44px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-icon {
  font-size: 24px;
  margin-right: 16px;
}

.title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.search-icon, .more-icon {
  font-size: 22px;
  margin-left: 16px;
}
</style> 