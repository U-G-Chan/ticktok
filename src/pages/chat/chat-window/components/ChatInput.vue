<template>
  <div class="chat-input">
    <div class="input-actions">
      <i class="icon-photo" @click="onPhotoClick"></i>
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
      <i class="icon-emoji" @click="onEmojiClick"></i>
      <i class="icon-plus" @click="onPlusClick"></i>
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
  emits: ['update:value', 'send', 'photo-click', 'emoji-click', 'plus-click'],
  setup(props, { emit }) {
    const inputValue = ref(props.value)
    
    // 双向绑定
    watch(() => props.value, (newVal) => {
      inputValue.value = newVal
    })
    
    watch(inputValue, (newVal) => {
      emit('update:value', newVal)
    })
    
    // 发送消息
    const sendMessage = () => {
      if (inputValue.value.trim()) {
        emit('send', inputValue.value)
        inputValue.value = ''
      }
    }
    
    // 点击照片图标
    const onPhotoClick = () => {
      emit('photo-click')
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
  padding: 10px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-field {
  flex: 1;
  margin: 0 10px;
}

.input-field input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 20px;
  border: none;
  color: #fff;
  font-size: 16px;
}

.input-actions {
  display: flex;
  gap: 16px;
}

.input-actions i {
  font-size: 22px;
  color: #999;
  cursor: pointer;
}
</style> 