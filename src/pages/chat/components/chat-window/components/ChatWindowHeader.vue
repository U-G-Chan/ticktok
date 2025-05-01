<template>
  <div class="chat-window-header">
    <div class="back-button" @click="onBackClick">
      <i class="icon-arrow-left"></i>
    </div>
    <div class="chat-title">{{ title }}</div>
    <div class="header-actions">
      <i class="icon-phone" @click="onPhoneClick"></i>
      <i class="icon-video" @click="onVideoClick"></i>
      <i class="icon-more" @click="onMoreClick"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChatWindowHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  emits: ['back-click', 'phone-click', 'video-click', 'more-click'],
  setup(_, { emit }) {
    const onBackClick = () => {
      emit('back-click')
    }

    const onPhoneClick = () => {
      emit('phone-click')
    }

    const onVideoClick = () => {
      emit('video-click')
    }

    const onMoreClick = () => {
      emit('more-click')
    }

    return {
      onBackClick,
      onPhoneClick,
      onVideoClick,
      onMoreClick
    }
  }
})
</script>

<style scoped>
.chat-window-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  height: 44px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-button {
  font-size: 24px;
  margin-right: 16px;
}

.chat-title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-actions i {
  font-size: 20px;
}
</style> 