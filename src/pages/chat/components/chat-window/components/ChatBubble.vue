<template>
  <div class="message-container" :class="{ self: isSelf }">
    <div class="message-bubble" :class="{ self: isSelf }">
      <div v-if="message.type === 'text'" class="message-text">{{ message.content }}</div>
      <div v-else-if="message.type === 'voice'" class="message-voice">
        <template v-if="!isSelf">
          <i class="icon-voice"></i>
          <span>{{ message.duration }}</span>
        </template>
        <template v-else>
          <span>{{ message.duration }}</span>
          <i class="icon-voice"></i>
        </template>
      </div>
      <div v-else-if="message.type === 'image'" class="message-image">
        <img :src="message.content" alt="图片消息" @click="onImageClick">
        <div class="image-caption" v-if="message.caption">{{ message.caption }}</div>
      </div>
      
      <div class="message-status" v-if="isSelf">
        <i v-if="message.status === 'sending'" class="icon-sending"></i>
        <i v-else-if="message.status === 'sent'" class="icon-sent"></i>
        <i v-else-if="message.status === 'read'" class="icon-read"></i>
        <i v-else-if="message.status === 'failed'" class="icon-failed"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ChatMessage } from '@/api/chat'

export default defineComponent({
  name: 'ChatBubble',
  props: {
    message: {
      type: Object as PropType<ChatMessage>,
      required: true
    },
    isSelf: {
      type: Boolean,
      default: false
    }
  },
  emits: ['image-click'],
  setup(props, { emit }) {
    const onImageClick = () => {
      emit('image-click', props.message)
    }
    
    return {
      onImageClick
    }
  }
})
</script>

<style scoped>
.message-container {
  display: flex;
  width: 100%;
  margin: 8px 0;
  padding: 0 10px; 
  box-sizing: border-box;
}

.message-container.self {
  justify-content: flex-end;
}

.message-container:not(.self) {
  justify-content: flex-start;
}

.message-bubble {
  /* max-width: 70%; */
  padding: 10px 12px;
  border-radius: 18px;
  position: relative;
  background-color: white;
}

.message-bubble.self {
  background-color: #4e95f3; /* 蓝色 */
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble:not(.self) {
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 16px;
  line-height: 1.4;
  word-break: break-word;
}

.message-voice {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 60px;
}

.message-image {
  max-width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.message-image img {
  max-width: 100%;
  display: block;
  cursor: pointer;
}

.image-caption {
  padding: 8px;
  font-size: 14px;
}

.message-status {
  position: absolute;
  bottom: -18px;
  right: 8px;
  font-size: 12px;
  color: #999;
}
</style> 