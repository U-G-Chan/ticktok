<template>
  <div class="chat-page">
    <!-- 头部区域 -->
    <chat-header 
      @sidebar-click="handleSidebarClick"
      @search-click="handleSearchClick"
      @more-click="handleMoreClick"
    />

    <!-- 滚动内容区域 -->
    <div class="scroll-container">
      <!-- 好友列表 -->
      <friend-list 
        :friends="friends" 
        @friend-click="handleFriendClick"
      />

      <!-- 消息列表 -->
      <message-list 
        :messages="messages" 
        @message-click="handleMessageClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Friend, Message, getFriends, getMessages } from '@/api/chat'

// 导入组件
import ChatHeader from './components/ChatHeader.vue'
import FriendList from './components/FriendList.vue'
import MessageList from './components/MessageList.vue'

export default defineComponent({
  name: 'ChatPage',
  components: {
    ChatHeader,
    FriendList,
    MessageList
  },
  setup() {
    const router = useRouter()
    const friends = ref<Friend[]>([])
    const messages = ref<Message[]>([])
    const loading = ref(true)
    
    // 获取数据
    onMounted(async () => {
      try {
        // 并行获取好友列表和消息列表
        const [friendsData, messagesData] = await Promise.all([
          getFriends(),
          getMessages()
        ])
        
        friends.value = friendsData
        messages.value = messagesData
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        loading.value = false
      }
    })
    
    // 进入聊天窗口
    const handleFriendClick = (friend: Friend) => {
      router.push({
        path: `/chat/window/${friend.id}`,
        query: { userName: friend.name }
      })
    }
    
    // 点击消息进入聊天窗口
    const handleMessageClick = (user: Friend) => {
      router.push({
        path: `/chat/window/${user.id}`,
        query: { userName: user.name }
      })
    }
    
    // 点击侧栏按钮
    const handleSidebarClick = () => {
      console.log('点击侧栏按钮')
    }
    
    // 点击搜索按钮
    const handleSearchClick = () => {
      console.log('点击搜索按钮')
    }
    
    // 点击更多按钮
    const handleMoreClick = () => {
      console.log('点击更多按钮')
    }
    
    return {
      friends,
      messages,
      loading,
      handleFriendClick,
      handleMessageClick,
      handleSidebarClick,
      handleSearchClick,
      handleMoreClick
    }
  }
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000;
  color: #fff;
}

/* 滚动容器 */
.scroll-container {
  flex: 1;
  overflow-y: auto;
}
</style>