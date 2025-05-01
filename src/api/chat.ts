

// 好友接口定义
export interface Friend {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  isOfficial?: boolean;
  lastActive?: string;
}

// 消息接口定义
export interface Message {
  id: number;
  sender: Friend;
  text: string;
  time: string;
  unread: number;
}

// 聊天消息接口定义
export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  isSelf: boolean;
  type: 'text' | 'voice' | 'image';
  content: string;
  timestamp: number;
  duration?: string;
  caption?: string;
  status: 'sending' | 'sent' | 'read' | 'failed';
}

// 模拟好友数据
export const mockFriends: Friend[] = [
  {
    id: 1,
    name: '何以为家',
    avatar: '/src/assets/images/avatar.jpg',
    online: true,
    lastActive: '刚刚'
  },
  {
    id: 2,
    name: '浅唱＼我心',
    avatar: '/src/assets/images/avatar.jpg',
    online: false,
    lastActive: '30分钟前'
  },
  {
    id: 3,
    name: '心 之痕',
    avatar: '/src/assets/images/avatar.jpg',
    online: true,
    lastActive: '刚刚'
  },
  {
    id: 4,
    name: '铁 _保镖',
    avatar: '/src/assets/images/avatar.jpg',
    online: false,
    lastActive: '2小时前'
  },
  {
    id: 5,
    name: '好好先生',
    avatar: '/src/assets/images/avatar.jpg',
    online: true,
    lastActive: '刚刚'
  }
]

// 模拟消息列表数据
export const mockMessages: Message[] = [
  {
    id: 1,
    sender: mockFriends[0],
    text: '你好',
    time: '10-10',
    unread: 0
  },
  {
    id: 2,
    sender: mockFriends[2],
    text: '我找不到了',
    time: '10-10',
    unread: 2
  },
  {
    id: 3,
    sender: {
      id: 6,
      name: '抖音小助手',
      avatar: '/src/assets/images/avatar.jpg',
      online: false,
      isOfficial: true
    },
    text: '#今天谁请客呢 · 星期四',
    time: '09-21',
    unread: 1
  },
  {
    id: 4,
    sender: {
      id: 7,
      name: '系统通知',
      avatar: '/src/assets/images/avatar.jpg',
      online: false,
      isOfficial: true
    },
    text: '协议修订通知 · 08-31',
    time: '08-31',
    unread: 1
  },
  {
    id: 5,
    sender: {
      id: 8,
      name: '求更新',
      avatar: '/src/assets/images/avatar.jpg',
      online: false,
      isOfficial: true
    },
    text: '你收到过1次求更新 · 10-09',
    time: '10-09',
    unread: 1
  }
]

// 模拟聊天记录数据
export const mockChatHistories: Record<number, ChatMessage[]> = {
  // 与何以为家的聊天记录
  1: [
    {
      id: 1,
      senderId: 1,
      receiverId: 0,
      isSelf: false,
      type: 'text',
      content: '你看最近抖音上有个挺火的视频',
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      status: 'read'
    },
    {
      id: 2,
      senderId: 0,
      receiverId: 1,
      isSelf: true,
      type: 'text',
      content: '哪个视频呀',
      timestamp: Date.now() - 1000 * 60 * 60 * 1.9,
      status: 'read'
    },
    {
      id: 3,
      senderId: 1,
      receiverId: 0,
      isSelf: false,
      type: 'text',
      content: '就是那个...',
      timestamp: Date.now() - 1000 * 60 * 60 * 1.8,
      status: 'read'
    },
    {
      id: 4,
      senderId: 0,
      receiverId: 1,
      isSelf: true,
      type: 'voice',
      content: '',
      duration: '12\'',
      timestamp: Date.now() - 1000 * 60 * 60 * 1.7,
      status: 'read'
    },
    {
      id: 5,
      senderId: 1,
      receiverId: 0,
      isSelf: false,
      type: 'image',
      content: '/src/assets/images/me-background.jpg',
      caption: '是这个',
      timestamp: Date.now() - 1000 * 60 * 60 * 1.6,
      status: 'read'
    }
  ],
  
  // 与心之痕的聊天记录
  3: [
    {
      id: 1,
      senderId: 3,
      receiverId: 0,
      isSelf: false,
      type: 'voice',
      content: '',
      timestamp: Date.now() - 1000 * 60 * 5,
      duration: '5\'',
      status: 'read'
    },
    {
      id: 2,
      senderId: 0,
      receiverId: 3,
      isSelf: true,
      type: 'voice',
      content: '',
      timestamp: Date.now() - 1000 * 60 * 4,
      duration: '10\'',
      status: 'read'
    },
    {
      id: 3,
      senderId: 0,
      receiverId: 3,
      isSelf: true,
      type: 'text',
      content: '又在刷抖音',
      timestamp: Date.now() - 1000 * 60 * 3,
      status: 'read'
    },
    {
      id: 4,
      senderId: 0,
      receiverId: 3,
      isSelf: true,
      type: 'text',
      content: '我昨天@你那个视频发给我下',
      timestamp: Date.now() - 1000 * 60 * 2,
      status: 'read'
    },
    {
      id: 5,
      senderId: 3,
      receiverId: 0,
      isSelf: false,
      type: 'text',
      content: '我找不到了',
      timestamp: Date.now() - 1000 * 60 * 1,
      status: 'read'
    },
    {
      id: 6,
      senderId: 0,
      receiverId: 3,
      isSelf: true,
      type: 'text',
      content: '我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了',
      timestamp: Date.now() - 1000 * 30,
      status: 'read'
    },
    {
      id: 7,
      senderId: 3,
      receiverId: 0,
      isSelf: false,
      type: 'image',
      content: '/src/assets/images/me-background.jpg',
      caption: '服了asd',
      timestamp: Date.now(),
      status: 'sent'
    }
  ]
}

// API函数：获取好友列表
export function getFriends() {
  return new Promise<Friend[]>((resolve) => {
    setTimeout(() => {
      resolve(mockFriends)
    }, 300)
  })
}

// API函数：获取消息列表
export function getMessages() {
  return new Promise<Message[]>((resolve) => {
    setTimeout(() => {
      resolve(mockMessages)
    }, 300)
  })
}

// API函数：获取与特定用户的聊天记录
export function getChatHistory(userId: number) {
  return new Promise<ChatMessage[]>((resolve) => {
    setTimeout(() => {
      resolve(mockChatHistories[userId] || [])
    }, 300)
  })
}

// API函数：发送消息
export function sendMessage(message: Omit<ChatMessage, 'id' | 'status'>) {
  return new Promise<ChatMessage>((resolve) => {
    setTimeout(() => {
      const newMessage = {
        ...message,
        id: Date.now(),
        status: 'sent' as const
      }
      
      // 将新消息添加到聊天记录中
      if (mockChatHistories[message.receiverId]) {
        mockChatHistories[message.receiverId].push(newMessage)
      } else {
        mockChatHistories[message.receiverId] = [newMessage]
      }
      
      resolve(newMessage)
    }, 500)
  })
}

// API函数：标记消息为已读
export function markAsRead(userId: number) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      // 更新消息列表中的未读计数
      mockMessages.forEach(message => {
        if (message.sender.id === userId) {
          message.unread = 0
        }
      })
      
      // 更新聊天记录中的消息状态
      if (mockChatHistories[userId]) {
        mockChatHistories[userId].forEach(message => {
          if (!message.isSelf) {
            message.status = 'read'
          }
        })
      }
      
      resolve(true)
    }, 200)
  })
} 