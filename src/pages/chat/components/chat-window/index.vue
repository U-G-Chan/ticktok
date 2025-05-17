<template>
  <div class="chat-window">
    <!-- 聊天窗口头部 -->
    <chat-window-header 
      :title="peerInfo?.nickname || '聊天'"
      @back-click="goBack"
      @phone-click="handlePhoneClick"
      @video-click="handleVideoClick"
      @more-click="handleMoreClick"
    />

    <!-- 聊天历史记录 -->
    <chat-history 
      :messages="currentMessages"
      :peer-avatar="peerAvatar"
      :self-avatar="selfAvatar"
      :new-message-ids="newMessages"
    />

    <!-- 消息输入区域 -->
    <chat-input 
      v-model:value="messageInput"
      @send="handleSendMessage"
      @photo-click="handlePhotoClick"
      @voice-click="handleVoiceClick"
      @emoji-click="handleEmojiClick"
      @plus-click="handlePlusClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/store/chat'


// 导入组件
import ChatWindowHeader from './components/ChatWindowHeader.vue'
import ChatHistory from './components/ChatHistory.vue'
import ChatInput from './components/ChatInput.vue'

export default defineComponent({
  name: 'ChatWindow',
  components: {
    ChatWindowHeader,
    ChatHistory,
    ChatInput
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const chatStore = useChatStore()
    const messageInput = ref('')
    const newMessages = ref<Set<number>>(new Set())
    
    // 获取用户ID
    const userId = computed(() => {
      const id = route.params.id
      return typeof id === 'string' ? parseInt(id, 10) : 0
    })

    // 从store获取当前消息
    const currentMessages = computed(() => chatStore.currentMessages)
    
    // 当前聊天对象信息
    const peerInfo = computed(() => chatStore.currentPeer)
    
    // 头像信息
    const peerAvatar = computed(() => peerInfo.value?.avatar || '/avatar/default-avatar.png')
    const selfAvatar = computed(() => chatStore.currentUser.avatar)
    
    // 加载聊天会话
    const loadChatSession = async () => {
      if (userId.value > 0) {
        try {
          await chatStore.createOrGetSession(userId.value)
        } catch (error) {
          console.error('加载聊天会话失败:', error)
        }
      }
    }
    
    // 标记新消息
    const markNewMessage = (messageId: number) => {
      newMessages.value.add(messageId)
      // 3秒后移除新消息标记
      setTimeout(() => {
        newMessages.value.delete(messageId)
      }, 3000)
    }
    
    // 发送消息
    const handleSendMessage = async (text: string) => {
      if (!text.trim() || userId.value <= 0) return
      
      try {
        // 先清空输入，避免重复发送
        messageInput.value = ''
        
        const message = await chatStore.sendChatMessage(text)
        if (message) {
          markNewMessage(message.id)
        }
      } catch (error) {
        console.error('发送消息失败:', error)
      }
    }
    
    // 返回上一页
    const goBack = () => {
      router.back()
    }
    
    // 处理电话点击
    const handlePhoneClick = () => {
      console.log('点击电话按钮')
    }
    
    // 处理视频点击
    const handleVideoClick = () => {
      console.log('点击视频按钮')
    }
    
    // 处理更多点击
    const handleMoreClick = () => {
      console.log('点击更多按钮')
    }
    
    // 处理照片点击
    const handlePhotoClick = () => {
      console.log('点击照片按钮')
    }
    
    // 处理表情点击
    const handleEmojiClick = () => {
      console.log('点击表情按钮')
    }
    
    // 处理更多功能点击
    const handlePlusClick = () => {
      console.log('点击更多功能按钮')
    }
    
    // 处理语音点击
    const handleVoiceClick = () => {
      console.log('点击语音按钮')
    }
    
    // 监听当前消息变化，标记新消息
    watch(currentMessages, (newVal, oldVal) => {
      if (oldVal && newVal.length > oldVal.length) {
        // 找出新增的消息
        const lastMessage = newVal[newVal.length - 1]
        if (lastMessage) {
          markNewMessage(lastMessage.id)
        }
      }
    })
    
    // 监听用户ID变化，加载聊天会话
    watch(userId, () => {
      loadChatSession()
    }, { immediate: true })
    
    // 确保WebSocket已初始化
    onMounted(() => {
      // 首先确保当前用户ID已设置
      if (chatStore.currentUser.uid === 0) {
        // 为测试设置一个默认用户ID
        chatStore.setCurrentUser({
          uid: 10000, // 使用一个固定的ID作为当前用户
          nickname: '当前用户',
          avatar: '/avatar/me-avatar.jpg'
        });
        console.log(`[ChatWindow] 已设置当前用户ID: ${chatStore.currentUser.uid}`);
      }
      
      // 等待用户设置完成后再初始化WebSocket
      setTimeout(() => {
        if (!chatStore.isWebSocketConnected) {
          console.log('[ChatWindow] WebSocket未初始化或已关闭，正在重新初始化');
          chatStore.initWebSocket();
        } else {
          console.log('[ChatWindow] WebSocket已连接');
        }
        
        // 添加消息事件监听器，以防主监听器失效
        if (chatStore.ws) {
          chatStore.ws.addEventListener('message', (event: MessageEvent) => {
            try {
              console.log('[ChatWindow] 通过事件监听器收到消息:', event.data);
              const data = JSON.parse(event.data);
              if (data.type === 'message') {
                // 检查消息是否属于当前会话
                const msgSessionId = data.message.sessionId || '';
                const currentSessionId = chatStore.activeSessionId;
                
                console.log(`[ChatWindow] 收到消息: sessionId=${msgSessionId}, currentSessionId=${currentSessionId}`);
                
                chatStore.receiveMessage(data.message);
              }
            } catch (error) {
              console.error('[ChatWindow] 处理WebSocket事件消息失败:', error);
            }
          });
        }
      }, 100);
      
      console.log('[ChatWindow] 聊天窗口已加载，当前用户ID:', chatStore.currentUser.uid);
    });
    
    return {
      userId,
      currentMessages,
      peerInfo,
      peerAvatar,
      selfAvatar,
      messageInput,
      newMessages,
      goBack,
      handleSendMessage,
      handlePhoneClick,
      handleVideoClick,
      handleMoreClick,
      handlePhotoClick,
      handleEmojiClick,
      handlePlusClick,
      handleVoiceClick
    }
  }
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #333;
  background-color: white;
  animation: fadeIn 0.3s ease;
}

.chat-window-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 为底部输入框留出空间 */
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 60px;
  margin-left: 5px;
  margin-right: 5px;
}
</style> 