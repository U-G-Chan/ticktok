<template>
  <div class="chat-window-header">
    <div class="back-button" @click="onBackClick">
      <icon-left theme="outline" size="25" fill="#000000"/>
    </div>
    <div class="avatar">
      <img src="@/assets/images/avatar.jpg">
    </div>
    <div class="chat-title">{{ title }}</div>
    <div class="header-actions">
      <!-- <i class="icon-phone" @click="onPhoneClick"></i> -->
      <!-- <i class="icon-video" @click="onVideoClick"></i> -->
      <icon-more theme="outline" size="25" fill="#000000"/>
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
  height: 55px;
}

.back-button {
  font-size: 24px;
  margin-right: 16px;
}

.chat-title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  padding-left:10px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-actions i {
  font-size: 20px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 