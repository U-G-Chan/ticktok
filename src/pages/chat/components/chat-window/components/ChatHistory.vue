<template>
  <div class="chat-history" ref="historyRef" :class="{ 'ai-generating': isAIGenerating }">
    <div v-for="(message, index) in messages" :key="message.id" :class="[
      'message-item',
      { 'message-self': message.isSelf, 'message-peer': !message.isSelf },
      { 'new-message': isNewMessage(message) }
    ]">
      <!-- 头像 -->
      <div class="avatar">
        <img :src="message.isSelf ? selfAvatar : peerAvatar" alt="avatar" />
      </div>

      <!-- 消息内容 -->
       
      <div v-if="!isAIChat">
        <ChatBubble :message="message" :is-self="message.isSelf" @image-click="$emit('image-click', $event)" />
      </div>
      <div v-else>
        <AIChatBubble 
          :message="message" 
          :is-self="message.isSelf" 
          :is-latest-message="isLatestAIMessage(message, index)"
          @image-click="$emit('image-click', $event)" 
        />
      </div>

      <!-- 时间戳 -->
      <!-- <div class="timestamp">
        {{ formatTime(message.timestamp) }}
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, onMounted, watch, nextTick } from 'vue'
import { ChatMessage, FriendType } from '@/api/chat'
import { useAIChatStore } from '@/store/aiChat'
import ChatBubble from './ChatBubble.vue'
import AIChatBubble from './AIChatBubble.vue'

export default defineComponent({
  name: 'ChatHistory',
  components: {
    ChatBubble,
    AIChatBubble
  },
  props: {
    messages: {
      type: Array as PropType<ChatMessage[]>,
      required: true
    },
    peerAvatar: {
      type: String,
      required: true
    },
    selfAvatar: {
      type: String,
      required: true
    },
    newMessageIds: {
      type: Set as PropType<Set<number>>,
      default: () => new Set<number>()
    },
    peerType: {
      type: String as PropType<FriendType>,
      default: FriendType.NORMAL
    }
  },
  emits: ['image-click'],
  setup(props) {
    const historyRef = ref<HTMLElement | null>(null)
    const aiChatStore = useAIChatStore()

    // 判断是否是AI聊天
    const isAIChat = computed(() => {
      return props.peerType === FriendType.AIBOT;
    });

    // 判断AI是否正在生成回复
    const isAIGenerating = computed(() => {
      return isAIChat.value && aiChatStore.isGenerating;
    });

    // 判断是否是新消息
    const isNewMessage = (message: ChatMessage) => {
      return props.newMessageIds.has(message.id)
    }

    // 判断是否是最新的AI消息
    const isLatestAIMessage = (message: ChatMessage, index: number) => {
      // 只有非用户发送的消息才能是AI消息
      if (message.isSelf) return false;
      
      // 如果是最后一条消息，则它是最新的AI消息
      if (index === props.messages.length - 1) return true;
      
      // 如果后面还有消息但当前是最后一条AI发送的消息，也认为是最新的AI消息
      for (let i = index + 1; i < props.messages.length; i++) {
        if (!props.messages[i].isSelf) return false;
      }
      
      return true;
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (historyRef.value) {
          historyRef.value.scrollTop = historyRef.value.scrollHeight
        }
      })
    }

    // 格式化时间戳
    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }

    // 监听消息变化，自动滚动到底部
    watch(() => props.messages.length, (newVal, oldVal) => {
      if (oldVal !== undefined && newVal > oldVal) {
        scrollToBottom()
      }
    })

    // 添加深度监听，确保即使数组引用不变但内容变化也能检测到
    watch(() => [...props.messages], () => {
      scrollToBottom()
    }, { deep: true })

    // 监听AI生成状态变化
    watch(() => aiChatStore.streamingText, () => {
      scrollToBottom()
    })

    onMounted(() => {
      scrollToBottom()
    })

    return {
      historyRef,
      isNewMessage,
      isLatestAIMessage,
      formatTime,
      scrollToBottom,
      isAIChat,
      isAIGenerating
    }
  }
})
</script>

<style scoped>
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
  /* 为底部输入框留出空间 */
  background-color: #f8f8f8;
  transition: background-color 0.3s ease;
}

/* AI生成时的背景效果 */
.chat-history.ai-generating {
  background-color: rgba(78, 149, 243, 0.05);
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  max-width: 90%;
  position: relative;
}

.message-peer {
  align-self: flex-start;
}

.message-self {
  align-self: flex-end;
  flex-direction: row-reverse;
  margin-left: auto;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.timestamp {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  position: absolute;
  bottom: -20px;
}

.message-self .timestamp {
  right: 50px;
}

.message-peer .timestamp {
  left: 50px;
}

/* 新消息动画 */
.new-message {
  animation: slideUp 0.5s ease;
}
</style>