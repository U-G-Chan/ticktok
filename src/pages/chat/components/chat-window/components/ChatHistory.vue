<template>
  <div class="chat-history" ref="historyRef">
    <div v-for="(message, _) in messages" 
         :key="message.id" 
         :class="[
           'message-item', 
           {'message-self': message.isSelf, 'message-peer': !message.isSelf},
           {'new-message': isNewMessage(message)}
         ]">
      <!-- 头像 -->
      <div class="avatar">
        <img :src="message.isSelf ? selfAvatar : peerAvatar" alt="avatar" />
      </div>
      
      <!-- 消息内容 -->
      <div class="message-content" :class="message.type">
        <!-- 文本消息 -->
        <template v-if="message.type === 'text'">
          <div class="text-message">{{ message.content }}</div>
        </template>
        
        <!-- 语音消息 -->
        <template v-else-if="message.type === 'voice'">
          <div class="voice-message">
            <i class="voice-icon">🔊</i>
            <span>{{ message.duration || '0"' }}</span>
          </div>
        </template>
        
        <!-- 图片消息 -->
        <template v-else-if="message.type === 'image'">
          <div class="image-message">
            <img :src="message.content" alt="image" />
            <div v-if="message.caption" class="caption">{{ message.caption }}</div>
          </div>
        </template>
      </div>
      
      <!-- 时间戳 -->
      <div class="timestamp">
        {{ formatTime(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch, nextTick } from 'vue'
import { ChatMessage } from '@/api/chat'

export default defineComponent({
  name: 'ChatHistory',
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
    }
  },
  setup(props) {
    const historyRef = ref<HTMLElement | null>(null)
    
    // 判断是否是新消息
    const isNewMessage = (message: ChatMessage) => {
      return props.newMessageIds.has(message.id)
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
      console.log('消息数组内容变化，滚动到底部')
      scrollToBottom()
    }, { deep: true })
    
    onMounted(() => {
      scrollToBottom()
    })
    
    return {
      historyRef,
      isNewMessage,
      formatTime,
      scrollToBottom
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
  padding-bottom: 80px; /* 为底部输入框留出空间 */
  background-color: #f8f8f8;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  max-width: 80%;
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

.message-content {
  margin: 0 12px;
  padding: 10px 14px;
  border-radius: 18px;
  background-color: #f5f5f5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-self .message-content {
  background-color: #0084ff;
  color: white;
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

.text-message {
  word-break: break-word;
}

.voice-message {
  display: flex;
  align-items: center;
  padding: 4px 8px;
}

.voice-icon {
  margin-right: 8px;
}

.image-message img {
  max-width: 200px;
  max-height: 300px;
  border-radius: 8px;
}

.caption {
  margin-top: 4px;
  font-size: 14px;
}

/* 新消息动画 */
.new-message {
  animation: slideUp 0.5s ease;
}
</style> 