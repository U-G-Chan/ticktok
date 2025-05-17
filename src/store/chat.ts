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

  // WebSocket连接状态
  const isWebSocketConnected = computed(() => {
    return ws.value !== null && ws.value.readyState === WebSocket.OPEN;
  });

  // 计算会话ID的辅助函数，确保一致性
  function calculateSessionId(uid1: number, uid2: number): string {
    return `chat_${Math.min(uid1, uid2)}_${Math.max(uid1, uid2)}`;
  }

  // 初始化WebSocket连接
  function initWebSocket() {
    if (ws.value) {
      ws.value.close();
    }
    
    // 创建WebSocket连接并添加当前用户ID参数
    const wsUrl = `ws://localhost:8080/chat?userId=${currentUser.value.uid}`;
    ws.value = new WebSocket(wsUrl);
    
    console.log(`[Chat] 初始化WebSocket连接: ${wsUrl}`);
    
    ws.value.onopen = () => {
      console.log(`[Chat] WebSocket连接已打开, 用户ID=${currentUser.value.uid}`);
    };
    
    ws.value.onmessage = (event) => {
      try {
        console.log(`[Chat] 收到WebSocket消息:`, event.data);
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          receiveMessage(data.message);
        } 
        else if (data.type === 'messageStatus') {
          // 处理消息状态更新
          updateMessageStatus(data.messageId, data.status, data.message);
        }
      } catch (error) {
        console.error('[Chat] 处理WebSocket消息失败:', error);
      }
    };
    
    ws.value.onclose = () => {
      console.log('[Chat] WebSocket连接已关闭，将在3秒后重新连接');
      setTimeout(() => {
        initWebSocket();
      }, 3000);
    };
    
    ws.value.onerror = (error) => {
      console.error('[Chat] WebSocket连接错误:', error);
    };
  }

  // 更新消息状态
  function updateMessageStatus(messageId: number, status: string, updatedMessage: ChatMessage) {
    console.log(`[Chat] 更新消息状态: messageId=${messageId}, status=${status}`);
    
    // 查找包含该消息的会话
    for (const session of chatSessions.value.values()) {
      const messageIndex = session.messages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        // 更新消息状态
        session.messages[messageIndex] = {
          ...session.messages[messageIndex],
          status: updatedMessage.status
        };
        console.log(`[Chat] 消息状态已更新: sessionId=${session.sessionId}, messageId=${messageId}, status=${status}`);
        break;
      }
    }
  }

  // 设置当前用户信息
  function setCurrentUser(user: ChatParticipant) {
    currentUser.value = user
    // 用户变更时重新初始化WebSocket连接
    if (user.uid > 0) {
      console.log(`[Chat] 用户已设置 uid=${user.uid}，正在重新初始化WebSocket连接`);
      initWebSocket();
    }
  }

  // 根据用户ID创建或获取聊天会话
  async function createOrGetSession(peerId: number, peerInfo?: ChatParticipant) {
    const sessionId = calculateSessionId(currentUser.value.uid, peerId);
    if (!chatSessions.value.has(sessionId)) {
      try {
        const userInfo = peerInfo || await getUserInfo(peerId);
        chatSessions.value.set(sessionId, {
          sessionId,
          peer: userInfo,
          messages: [],
          unreadCount: 0
        });
        await loadChatHistory(sessionId, peerId);
      } catch (error) {
        throw error;
      }
    }
    activeSessionId.value = sessionId;
    markSessionAsRead(sessionId);
    return sessionId;
  }

  // 从API获取用户信息
  async function getUserInfo(userId: number): Promise<ChatParticipant> {
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
      const selfId = currentUser.value.uid;
      
      // 使用修改后的API获取会话消息
      console.log(`[Chat] 请求会话历史记录: sessionId=${sessionId}, peerId=${peerId}, selfId=${selfId}`);
      const sessionMessages = await getChatHistory(peerId, selfId);
      
      console.log(`[Chat] 加载会话历史记录: sessionId=${sessionId}, 收到${sessionMessages.length}条消息`);
      
      // 确保消息按时间排序
      sessionMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      // 处理消息的isSelf标记，确保显示正确
      const processedMessages = sessionMessages.map(msg => ({
        ...msg,
        isSelf: msg.senderId === selfId
      }));
      
      const session = chatSessions.value.get(sessionId);
      if (session) {
        session.messages = processedMessages;
        if (processedMessages.length > 0) {
          session.lastMessage = processedMessages[processedMessages.length - 1];
        }
      }
    } catch (error) {
      console.error('[Chat] 加载聊天历史记录失败:', error);
      throw error;
    }
  }

  // 发送消息
  async function sendChatMessage(content: string, type: 'text' | 'voice' | 'image' = 'text') {
    if (!activeSession.value || !content.trim()) return null;
    const peerId = activeSession.value.peer.uid;
    const selfId = currentUser.value.uid;
    const newMessage: Omit<ChatMessage, 'id' | 'status'> = {
      senderId: selfId,
      receiverId: peerId,
      isSelf: true,
      type,
      content,
      timestamp: Date.now()
    };
    try {
      const sentMessage = await sendMessage(newMessage);
      if (activeSession.value) {
        if (!activeSession.value.messages.find(m => m.id === sentMessage.id)) {
          activeSession.value.messages = [...activeSession.value.messages, sentMessage];
          activeSession.value.lastMessage = sentMessage;
        }
      }
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({
          type: 'message',
          message: sentMessage
        }));
      }
      return sentMessage;
    } catch (error) {
      throw error;
    }
  }

  // 接收消息
  function receiveMessage(message: ChatMessage) {
    const senderId = message.senderId;
    const receiverId = message.receiverId;
    const selfId = currentUser.value.uid;
    const sessionId = calculateSessionId(
      selfId, 
      senderId === selfId ? receiverId : senderId
    );
    if (!chatSessions.value.has(sessionId)) {
      getUserInfo(senderId === selfId ? receiverId : senderId).then(peerInfo => {
        chatSessions.value.set(sessionId, {
          sessionId,
          peer: peerInfo,
          messages: [message],
          unreadCount: message.isSelf ? 0 : 1,
          lastMessage: message
        });
      });
    } else {
      const session = chatSessions.value.get(sessionId)!;
      if (!session.messages.find(m => m.id === message.id)) {
        session.messages = [...session.messages, message];
        session.lastMessage = message;
        if (sessionId !== activeSessionId.value && !message.isSelf) {
          session.unreadCount++;
        }
      }
    }
  }

  // 标记会话为已读
  function markSessionAsRead(sessionId: string) {
    const session = chatSessions.value.get(sessionId)
    if (session) {
      session.unreadCount = 0
      if (session.lastMessage && !session.lastMessage.isSelf) {
        markAsRead(session.peer.uid, currentUser.value.uid)
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
    ws,
    isWebSocketConnected,
    setCurrentUser,
    createOrGetSession,
    loadChatHistory,
    sendChatMessage,
    receiveMessage,
    markSessionAsRead,
    clearChatHistory,
    initWebSocket,
    updateMessageStatus
  }
}) 