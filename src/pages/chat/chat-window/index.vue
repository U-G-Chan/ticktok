<template>
  <div class="chat-window">
    <!-- 聊天窗口头部 -->
    <chat-window-header 
      :title="chatTitle"
      @back-click="goBack"
      @phone-click="handlePhoneClick"
      @video-click="handleVideoClick"
      @more-click="handleMoreClick"
    />

    <!-- 聊天历史记录 -->
    <chat-history 
      :chat-history="chatHistory"
      :peer-avatar="peerAvatar"
      :peer-name="peerName"
      :self-avatar="selfAvatar"
      :has-unread-notice="hasUnreadNotice"
      @call-click="handleCallClick"
    />

    <!-- 消息输入区域 -->
    <chat-input 
      v-model:value="messageInput"
      @send="handleSendMessage"
      @photo-click="handlePhotoClick"
      @emoji-click="handleEmojiClick"
      @plus-click="handlePlusClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChatMessage, getChatHistory, sendMessage, markAsRead } from '@/api/chat'

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

    // 获取用户ID
    const userId = computed(() => {
      const id = route.params.id
      return typeof id === 'string' ? parseInt(id, 10) : 0
    })

    // 聊天标题 (对方昵称)
    const chatTitle = computed(() => {
      return route.query.userName as string || '聊天'
    })

    // 模拟数据
    const peerName = computed(() => route.query.userName as string || '未知用户')
    const peerAvatar = ref('/src/assets/images/avatar.jpg')
    const selfAvatar = ref('/src/assets/images/avatar.jpg')
    const hasUnreadNotice = ref(true)
    const chatHistory = ref<ChatMessage[]>([])
    const messageInput = ref('')
    const loading = ref(true)
    
    // 加载聊天记录
    const loadChatHistory = async () => {
      if (userId.value > 0) {
        try {
          loading.value = true
          const history = await getChatHistory(userId.value)
          chatHistory.value = history
          
          // 标记消息为已读
          await markAsRead(userId.value)
        } catch (error) {
          console.error('获取聊天记录失败:', error)
        } finally {
          loading.value = false
        }
      }
    }
    
    // 发送消息
    const handleSendMessage = async (text: string) => {
      if (!text.trim() || userId.value <= 0) return
      
      // 创建本地消息对象
      const newMessage: Omit<ChatMessage, 'id' | 'status'> = {
        senderId: 0, // 当前用户ID
        receiverId: userId.value,
        isSelf: true,
        type: 'text',
        content: text,
        timestamp: Date.now()
      }
      
      try {
        // 发送消息
        await sendMessage(newMessage)
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
    
    // 处理拨打电话点击
    const handleCallClick = () => {
      console.log('点击拨打电话按钮')
      hasUnreadNotice.value = false
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
    
    // 监听用户ID变化，重新加载聊天记录
    watch(userId, () => {
      loadChatHistory()
    }, { immediate: true })
    
    return {
      chatTitle,
      chatHistory,
      messageInput,
      peerName,
      peerAvatar,
      selfAvatar,
      hasUnreadNotice,
      goBack,
      handleSendMessage,
      handlePhoneClick,
      handleVideoClick,
      handleMoreClick,
      handleCallClick,
      handlePhotoClick,
      handleEmojiClick,
      handlePlusClick
    }
  }
})
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #333;
  background-color: white;
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
  padding: 8px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 50px;
}
</style> 