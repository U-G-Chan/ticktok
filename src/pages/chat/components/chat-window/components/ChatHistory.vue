<template>
  <div class="chat-history" ref="chatHistoryRef">
    <!-- 聊天消息项 -->
    <div 
      v-for="(message, index) in chatHistory" 
      :key="index" 
      :class="['message-item', message.isSelf ? 'message-self' : 'message-other']"
    >
      <!-- 对方消息 - 左侧头像 + 气泡 -->
      <template v-if="!message.isSelf">
        <div class="avatar">
          <img :src="peerAvatar" :alt="peerName">
        </div>
        <chat-bubble 
          :message="message" 
          :is-self="false" 
        />
      </template>
      
      <!-- 自己消息 - 气泡 + 右侧头像 -->
      <template v-else>
        <chat-bubble 
          :message="message" 
          :is-self="true" 
        />
        <div class="avatar">
          <img :src="selfAvatar" alt="我">
        </div>
      </template>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch } from 'vue'
import { ChatMessage } from '@/api/chat'
import ChatBubble from './ChatBubble.vue'

export default defineComponent({
  name: 'ChatHistory',
  components: {
    ChatBubble
  },
  props: {
    chatHistory: {
      type: Array as PropType<ChatMessage[]>,
      required: true
    },
    peerAvatar: {
      type: String,
      required: true
    },
    peerName: {
      type: String,
      required: true
    },
    selfAvatar: {
      type: String,
      required: true
    },
    hasUnreadNotice: {
      type: Boolean,
      default: false
    }
  },
  emits: ['call-click'],
  setup(props, { emit }) {
    const chatHistoryRef = ref<HTMLElement | null>(null)
    
    // 滚动到底部
    const scrollToBottom = () => {
      if (chatHistoryRef.value) {
        chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
      }
    }
    
    // 监听聊天记录变化，自动滚动到底部
    watch(() => props.chatHistory.length, () => {
      setTimeout(scrollToBottom, 50)
    })
    
    onMounted(() => {
      scrollToBottom()
    })
    
    const onCallClick = () => {
      emit('call-click')
    }
    
    return {
      chatHistoryRef,
      onCallClick
    }
  }
})
</script>

<style scoped>
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8f8f8;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  position: relative;
}

.message-self {
  justify-content: flex-end;
}

.message-other {
  justify-content: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 未读提示 */
.unread-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b5cd9;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 20px 0;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.call-button {
  margin-left: 16px;
  background-color: #fff;
  color: #2b5cd9;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
}
</style> 