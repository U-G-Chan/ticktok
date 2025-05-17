<template>
  <div class="chat-input">
    <div class="input-actions-camera" @click="onPhotoClick">
      <icon-camera theme="outline" size="22" fill="#fff"/>
    </div>
    <div class="input-field">
      <input 
        type="text" 
        placeholder="发送消息..." 
        v-model="inputValue"
        @keyup.enter="sendMessage"
      >
    </div>
    <div class="input-actions">
      <icon-voice-message theme="outline" size="28" fill="#000000" @click="onVoiceClick"/>
      <icon-grinning-face-with-open-mouth theme="outline" size="28" fill="#000000" @click="onEmojiClick"/>
      <icon-add-one theme="outline" size="28" fill="#000000" @click="onPlusClick"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'ChatInput',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['update:value', 'send', 'photo-click', 'emoji-click', 'voice-click', 'plus-click'],
  setup(props, { emit }) {
    const inputValue = ref(props.value)
    
    // 单向监听prop变化
    watch(() => props.value, (newVal) => {
      if (newVal !== inputValue.value) {
        inputValue.value = newVal
      }
    })
    
    // 向父组件发送更新事件
    watch(inputValue, (newVal) => {
      emit('update:value', newVal)
    })
    
    // 发送消息
    const sendMessage = () => {
      if (inputValue.value.trim()) {
        emit('send', inputValue.value)
      }
    }
    
    // 点击照片图标
    const onPhotoClick = () => {
      emit('photo-click')
    }
    
    // 点击语音图标
    const onVoiceClick = () => {
      emit('voice-click')
    }
    
    // 点击表情图标
    const onEmojiClick = () => {
      emit('emoji-click')
    }
    
    // 点击更多图标
    const onPlusClick = () => {
      emit('plus-click')
    }
    
    return {
      inputValue,
      sendMessage,
      onPhotoClick,
      onVoiceClick,
      onEmojiClick,
      onPlusClick
    }
  }
})
</script>

<style scoped>
.chat-input {
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #e9e9e9;
  border-radius: 30px;
  padding: 0 16px;
}

.input-field {
  flex: 1;
  padding: 0 12px;
}

.input-field input {
  height: 100%;
  width: 100%;
  border: none;
  color: #000;
  font-size: 18px;
  background:transparent;
}

.input-field input:focus {
  outline: none;
  box-shadow: none;
  border: none;
}

.input-actions-camera{
  padding: 5px;
  display: flex;
  gap: 10px;
  background-color: #7cbbff;
  border-radius: 50%;
  cursor: pointer;
}

.input-actions {
  font-size: 22px;
  color: #999;
  cursor: pointer;
  display: flex;
  gap: 10px;
}

.input-actions > * {
  cursor: pointer;
}
</style> 