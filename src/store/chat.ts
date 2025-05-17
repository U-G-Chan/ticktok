import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Friend, Message, ChatMessage, getChatHistory, sendMessage, markAsRead } from '@/api/chat'

// 聊天参与者接口
interface ChatParticipant {
  uid: number
  nickname: string
  avatar: string
}

// 聊天会话接口
interface ChatSession {
  sessionId: string
  peer: ChatParticipant
  messages: ChatMessage[]
  unreadCount: number
  lastMessage?: ChatMessage
}

export const useChatStore = defineStore('chat', () => {
  // 当前用户信息
  const currentUser = ref<ChatParticipant>({
    uid: 0,
    nickname: '当前用户',
    avatar: '/avatar/me-avatar.jpg'
  })

  // 当前选中的聊天会话ID
  const activeSessionId = ref<string>('')

  // 所有聊天会话
  const chatSessions = ref<Map<string, ChatSession>>(new Map())

  // WebSocket连接
  const ws = ref<WebSocket | null>(null)

  // 计算属性：获取当前活跃的聊天会话
  const activeSession = computed(() => {
    if (!activeSessionId.value) return null
    return chatSessions.value.get(activeSessionId.value) || null
  })

  // 计算属性：获取当前聊天对象
  const currentPeer = computed(() => {
    return activeSession.value?.peer || null
  })

  // 计算属性：获取当前会话的消息
  const currentMessages = computed(() => {
    return activeSession.value?.messages || []
  })

  // 计算属性：所有未读消息总数
  const totalUnreadCount = computed(() => {
    let count = 0
    for (const session of chatSessions.value.values()) {
      count += session.unreadCount
    }
    return count
  })

  // 初始化WebSocket连接
  function initWebSocket() {
    if (ws.value) {
      ws.value.close()
    }

    // 连接到WebSocket服务器（实际开发中替换为真实后端地址）
    ws.value = new WebSocket('ws://localhost:8080/chat')

    ws.value.onopen = () => {
      console.log('WebSocket连接已建立')
    }

    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          receiveMessage(data.message)
        }
      } catch (error) {
        console.error('处理WebSocket消息时出错:', error)
      }
    }

    ws.value.onclose = () => {
      console.log('WebSocket连接已关闭')
      // 尝试重新连接
      setTimeout(() => {
        initWebSocket()
      }, 3000)
    }

    ws.value.onerror = (error) => {
      console.error('WebSocket错误:', error)
    }
  }

  // 设置当前用户信息
  function setCurrentUser(user: ChatParticipant) {
    currentUser.value = user
  }

  // 根据用户ID创建或获取聊天会话
  async function createOrGetSession(peerId: number, peerInfo?: ChatParticipant) {
    const sessionId = `chat_${Math.min(currentUser.value.uid, peerId)}_${Math.max(currentUser.value.uid, peerId)}`
    
    if (!chatSessions.value.has(sessionId)) {
      // 获取对方用户信息
      try {
        // 如果提供了peerInfo，则使用它，否则通过API获取用户信息
        const userInfo = peerInfo || await getUserInfo(peerId)
        
        // 创建新会话
        chatSessions.value.set(sessionId, {
          sessionId,
          peer: userInfo,
          messages: [],
          unreadCount: 0
        })
        
        // 加载历史消息
        await loadChatHistory(sessionId, peerId)
      } catch (error) {
        console.error('创建聊天会话失败:', error)
        throw error
      }
    }
    
    // 设置当前活跃会话
    activeSessionId.value = sessionId
    
    // 标记该会话的消息为已读
    markSessionAsRead(sessionId)
    
    return sessionId
  }

  // 从API获取用户信息
  async function getUserInfo(userId: number): Promise<ChatParticipant> {
    // 模拟API调用，实际应用中替换为真实API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uid: userId,
          nickname: `用户${userId}`,
          avatar: `/avatar/vue-color-avatar-${userId % 5 + 1}.png`
        })
      }, 200)
    })
  }

  // 加载聊天历史记录
  async function loadChatHistory(sessionId: string, peerId: number) {
    try {
      // 获取历史消息
      const history = await getChatHistory(peerId)
      
      // 更新会话消息
      const session = chatSessions.value.get(sessionId)
      if (session) {
        session.messages = history
        
        // 更新最后一条消息
        if (history.length > 0) {
          session.lastMessage = history[history.length - 1]
        }
      }
    } catch (error) {
      console.error('加载聊天历史记录失败:', error)
      throw error
    }
  }

  // 发送消息
  async function sendChatMessage(content: string, type: 'text' | 'voice' | 'image' = 'text') {
    if (!activeSession.value || !content.trim()) return null
    
    const peerId = activeSession.value.peer.uid
    // 创建消息对象
    const newMessage: Omit<ChatMessage, 'id' | 'status'> = {
      senderId: currentUser.value.uid,
      receiverId: peerId,
      isSelf: true,
      type,
      content,
      timestamp: Date.now()
    }
    try {
      // 发送消息到后端（mock API生成id/status）
      const sentMessage = await sendMessage(newMessage)
      // 通过WebSocket通知对方（自己也会收到）
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({
          type: 'message',
          message: sentMessage
        }))
      }
      // 不在这里本地push消息，所有消息都通过receiveMessage统一处理
      return sentMessage
    } catch (error) {
      console.error('发送消息失败:', error)
      throw error
    }
  }

  // 接收消息
  function receiveMessage(message: ChatMessage) {
    // 确定会话ID
    const senderId = message.senderId
    const receiverId = message.receiverId
    const selfId = currentUser.value.uid
    const sessionId = `chat_${Math.min(selfId, senderId === selfId ? receiverId : senderId)}_${Math.max(selfId, senderId === selfId ? receiverId : senderId)}`
    // 查找或创建会话
    if (!chatSessions.value.has(sessionId)) {
      // 异步获取用户信息并创建会话
      getUserInfo(senderId === selfId ? receiverId : senderId).then(peerInfo => {
        chatSessions.value.set(sessionId, {
          sessionId,
          peer: peerInfo,
          messages: [message],
          unreadCount: message.isSelf ? 0 : 1,
          lastMessage: message
        })
      })
    } else {
      // 更新现有会话
      const session = chatSessions.value.get(sessionId)!
      // 避免重复添加（根据id去重）
      if (!session.messages.find(m => m.id === message.id)) {
        session.messages.push(message)
        session.lastMessage = message
        // 如果不是当前活跃会话，增加未读计数
        if (sessionId !== activeSessionId.value && !message.isSelf) {
          session.unreadCount++
        }
      }
    }
  }

  // 标记会话为已读
  function markSessionAsRead(sessionId: string) {
    const session = chatSessions.value.get(sessionId)
    if (session) {
      session.unreadCount = 0
      
      // 如果有最后一条消息且是对方发送的，调用API标记为已读
      if (session.lastMessage && !session.lastMessage.isSelf) {
        markAsRead(session.peer.uid)
      }
    }
  }

  // 清除聊天历史
  function clearChatHistory(sessionId: string) {
    const session = chatSessions.value.get(sessionId)
    if (session) {
      session.messages = []
      session.lastMessage = undefined
    }
  }

  return {
    currentUser,
    activeSessionId,
    chatSessions,
    activeSession,
    currentPeer,
    currentMessages,
    totalUnreadCount,
    setCurrentUser,
    createOrGetSession,
    loadChatHistory,
    sendChatMessage,
    receiveMessage,
    markSessionAsRead,
    clearChatHistory,
    initWebSocket
  }
}) 