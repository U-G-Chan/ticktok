<template>
  <div class="messages-list">
    <div 
      class="message" 
      v-for="message in messages" 
      :key="message.id" 
      @click="onMessageClick(message)"
    >
      <div class="message-avatar">
        <img :src="message.sender.avatar" :alt="message.sender.name">
        <div class="online-indicator" v-if="message.sender.online"></div>
      </div>
      <div class="message-content">
        <div class="message-header">
          <div class="message-name">{{ message.sender.name }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
        <div class="message-text">{{ message.text }}</div>
      </div>
      <div class="message-badge" v-if="message.unread">{{ message.unread }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Message } from '@/api/chat'

export default defineComponent({
  name: 'MessageList',
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true
    }
  },
  emits: ['message-click'],
  setup(_, { emit }) {
    const onMessageClick = (message: Message) => {
      emit('message-click', message.sender)
    }

    return {
      onMessageClick
    }
  }
})
</script>

<style scoped>
.messages-list {
  padding: 0 16px;
}

.message {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  cursor: pointer;
}

.message-avatar {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4caf50;
  border: 2px solid #000;
}

.message-content {
  flex: 1;
  overflow: hidden;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.message-name {
  font-weight: bold;
  font-size: 16px;
}

.message-time {
  color: #999;
  font-size: 12px;
}

.message-text {
  color: #aaa;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-badge {
  position: absolute;
  top: 35px;
  right: 0;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #ff4757;
  color: white;
  font-size: 12px;
  text-align: center;
  line-height: 18px;
  padding: 0 5px;
}
</style> 