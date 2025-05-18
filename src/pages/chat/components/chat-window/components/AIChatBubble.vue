<template>
  <div class="ai-message-container" :class="{ self: isSelf }">
    <div class="ai-message-bubble"
      :class="{ self: isSelf, 'typing-effect': isGenerating || message.status === 'sending' }">
      <div class="ai-message-text" v-html="formattedContent"></div>
      <div v-if="!isSelf && message.status !== 'sending'" class="copy-button" @click="copyContent" title="复制内容">
        <icon-copy theme="outline" size="18" fill="#000000"/>
      </div>
      <div class="ai-message-status" v-if="!isSelf && message.status !== 'sending'">
        <icon-loading-one v-if="message.status === 'sending'" theme="outline" size="20" fill="#000000" />
        <icon-check-one v-else-if="message.status === 'sent'" theme="outline" size="20" fill="#000000" />
        <icon-search v-else-if="message.status === 'read'" theme="outline" size="20" fill="#000000" />
        <icon-error v-else-if="message.status === 'failed'" theme="outline" size="20" fill="red" />
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
      let content = props.message.content || '';

      // 处理Markdown格式，使用更精确的正则表达式
      
      // 处理标题 - 使用更严格的匹配模式
      // ### 标题格式（确保前后有换行或开始/结束）
      content = content.replace(/(^|\n)###\s+(.*?)($|\n)/g, '$1<h3>$2</h3>$3');
      // ## 标题格式
      content = content.replace(/(^|\n)##\s+(.*?)($|\n)/g, '$1<h2>$2</h2>$3');
      // # 标题格式
      content = content.replace(/(^|\n)#\s+(.*?)($|\n)/g, '$1<h1>$2</h1>$3');
      
      // 处理加粗文本
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // 处理链接
      content = content.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      
      // 处理换行 - 最后处理换行，避免影响其他标记
      content = content.replace(/\n/g, '<br>');
      

      return content;
    });

    // 点击图片事件
    const onImageClick = () => {
      if (props.message.type === 'image') {
        emit('image-click', props.message);
      }
    };

    // 添加复制功能
    const copyContent = () => {
      // 获取纯文本内容，移除HTML标签
      const plainText = props.message.content || '';
      navigator.clipboard.writeText(plainText)
        .then(() => {
          // 可以添加复制成功的提示
          console.log('内容已复制');
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    };

    return {
      isGenerating,
      formattedContent,
      onImageClick,
      copyContent
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

.ai-message-text, .message-text {
  user-select: text; /* 确保文本可选择 */
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
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
  left: 5px;
  bottom: -24px;
  font-size: 12px;
  color: #999;
}

@keyframes typing {
  from {
    width: 0
  }

  to {
    width: 100%
  }
}

@keyframes blink {
  50% {
    border-color: transparent
  }
}

/* 打字动画效果 */
.typing-effect::after {
  font-weight: 100;
  font-family: monospace;
  vertical-align: middle;
  border-right: 2px solid;
  display: inline-block;
  animation: blink 1s step-end infinite;
  color: #4e95f3;
  margin-left: 2px;
}

/* 添加复制按钮样式 */
.copy-button {
  position: absolute;
  right: 5px;
  bottom: -24px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

}

.ai-message-bubble:hover .copy-button {
  opacity: 1;
}

.ai-message-bubble.self .copy-button {
  background-color: rgba(255, 255, 255, 0.3);

}
</style>