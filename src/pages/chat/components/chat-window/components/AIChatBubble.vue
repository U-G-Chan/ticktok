<template>
  <div class="ai-message-container" :class="{ self: isSelf }">
    <div class="ai-message-bubble" :class="{ self: isSelf, 'typing-effect': isGenerating || message.status === 'sending' }">
      <div class="ai-message-text" v-html="formattedContent"></div>
      <div class="ai-message-status" v-if="isSelf">
        <icon-loading-one v-if="message.status === 'sending'" theme="outline" size="2" fill="#000000"/>
        <icon-check-one v-else-if="message.status === 'sent'" theme="outline" size="2" fill="#000000"/>
        <icon-search v-else-if="message.status === 'read'" theme="outline" size="2" fill="#000000"/>
        <icon-error v-else-if="message.status === 'failed'" theme="outline" size="2" fill="red"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ChatMessage } from '@/api/chat';
import { useAIChatStore } from '@/store/aiChat';

export default defineComponent({
  name: 'AIChatBubble',
  props: {
    message: {
      type: Object as PropType<ChatMessage>,
      required: true
    },
    isSelf: {
      type: Boolean,
      default: false
    },
    streamingText: {
      type: String,
      default: ''
    },
    isLatestMessage: {
      type: Boolean,
      default: false
    }
  },
  emits: ['image-click'],
  setup(props, { emit }) {
    const aiChatStore = useAIChatStore();

    // 判断是否正在生成回复
    const isGenerating = computed(() => {
      return aiChatStore.isGenerating && !props.isSelf && props.isLatestMessage;
    });

    // 格式化消息内容，处理换行和链接
    const formattedContent = computed(() => {
      // 使用消息自己的内容，不再使用aiChatStore中的内容
      // isGenerating只用于样式，不再影响内容显示
      let content = props.message.content;

      // 处理换行
      content = content.replace(/\n/g, '<br>');
      
      // 处理链接
      content = content.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      
      return content;
    });

    // 点击图片事件
    const onImageClick = () => {
      if (props.message.type === 'image') {
        emit('image-click', props.message);
      }
    };

    return {
      isGenerating,
      formattedContent,
      onImageClick
    };
  }
});
</script>

<style scoped>
.ai-message-container {
  display: flex;
  width: 100%;
  margin: 8px 0;
  padding: 0 10px;
  box-sizing: border-box;
}

.ai-message-container.self {
  justify-content: flex-end;
}

.ai-message-container:not(.self) {
  justify-content: flex-start;
}

.ai-message-bubble {
  padding: 10px 12px;
  border-radius: 18px;
  position: relative;
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
}

.ai-message-bubble.self {
  background-color: #4e95f3;
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message-bubble.typing-effect {
  background-color: rgba(78, 149, 243, 0.1);
  border: 1px solid rgba(78, 149, 243, 0.3);
}

.ai-message-text {
  word-break: break-word;
  line-height: 1.4;
}

.ai-message-text a {
  color: #0366d6;
  text-decoration: underline;
}

.ai-message-bubble.self .ai-message-text a {
  color: #ffffff;
}

.ai-message-status {
  position: absolute;
  right: 0;
  bottom: -16px;
  font-size: 12px;
  color: #999;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink {
  50% { border-color: transparent }
}

/* 打字动画效果 */
.typing-effect::after {
  content: '▌';
  display: inline-block;
  animation: blink 1s step-end infinite;
  color: #4e95f3;
  margin-left: 2px;
}
</style> 