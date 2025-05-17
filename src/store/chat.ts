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

  // 计算会话ID的辅助函数，确保一致性
  function calculateSessionId(uid1: number, uid2: number): string {
    return `chat_${Math.min(uid1, uid2)}_${Math.max(uid1, uid2)}`;
  }

  // 初始化WebSocket连接
  function initWebSocket() {
    if (ws.value) {
      ws.value.close();
    }
    ws.value = new WebSocket('ws://localhost:8080/chat');
    ws.value.onopen = () => {};
    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          receiveMessage(data.message);
        }
      } catch (error) {}
    };
    ws.value.onclose = () => {
      setTimeout(() => {
        initWebSocket();
      }, 3000);
    };
    ws.value.onerror = () => {};
  }

  // 设置当前用户信息
  function setCurrentUser(user: ChatParticipant) {
    currentUser.value = user
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
      let messages = await getChatHistory(peerId);
      const selfMessages = await getChatHistory(currentUser.value.uid);
      const allMessages = [...messages, ...selfMessages];
      const uniqueMessages = Array.from(
        new Map(allMessages.map(msg => [msg.id, msg])).values()
      );
      uniqueMessages.sort((a, b) => a.timestamp - b.timestamp);
      const session = chatSessions.value.get(sessionId);
      if (session) {
        session.messages = uniqueMessages;
        if (uniqueMessages.length > 0) {
          session.lastMessage = uniqueMessages[uniqueMessages.length - 1];
        }
      }
    } catch (error) {
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