// 好友类型枚举
export enum FriendType {
  NORMAL = 'normal',    // 普通好友
  AIBOT = 'aibot',      // AI助手
  SYSTEM = 'system'     // 系统通知
}

// 好友接口定义
export interface Friend {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  isOfficial?: boolean;
  lastActive?: string;
  friendType?: FriendType; // 添加好友类型字段
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
  sessionId?: string;
}

// 用户信息接口
export interface UserInfo {
  id: number;
  uid: number;
  nickname: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
  signature?: string;
}

// 模拟好友数据
export const mockFriends: Friend[] = [
  {
    id: 1,
    name: '我的好友1',
    avatar: '/avatar/vue-color-avatar-1.png',
    online: true,
    lastActive: '刚刚',
    friendType: FriendType.NORMAL
  },
  {
    id: 2,
    name: '我的好友2',
    avatar: '/avatar/vue-color-avatar-2.png',
    online: false,
    lastActive: '30分钟前',
    friendType: FriendType.NORMAL
  },
  {
    id: 3,
    name: '我的好友3',
    avatar: '/avatar/vue-color-avatar-3.png',
    online: true,
    lastActive: '刚刚',
    friendType: FriendType.NORMAL
  },
  {
    id: 4,
    name: '我的好友4',
    avatar: '/avatar/vue-color-avatar-4.png',
    online: false,
    lastActive: '2小时前',
    friendType: FriendType.NORMAL
  },
  {
    id: 5,
    name: '我的好友5',
    avatar: '/avatar/vue-color-avatar-5.png',
    online: true,
    lastActive: '刚刚',
    friendType: FriendType.NORMAL
  },
  {
    id: 6,
    name: 'AI小助手',
    avatar: '/avatar/AI-Bot-Avatar.jpg',
    online: false,
    isOfficial: true,
    friendType: FriendType.AIBOT
  },
  {
    id: 7,
    name: '系统通知',
    avatar: '/avatar/notices-avatar.png',
    online: false,
    isOfficial: true,
  }
]

// 模拟消息列表数据
export const mockMessages: Message[] = [
  {
    id: 3,
    sender: mockFriends[5],
    text: '你的AI小助手',
    time: '09-21',
    unread: 0
  },
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
    id: 4,
    sender: mockFriends[6],
    text: '协议修订通知 · 08-31',
    time: '08-31',
    unread: 1
  },
  // {
  //   id: 5,
  //   sender: {
  //     id: 8,
  //     name: '请求更新',
      
  //     online: false,
  //     isOfficial: true
  //   },
  //   text: '你收到过1次求更新 · 10-09',
  //   time: '10-09',
  //   unread: 1
  // }
]

// 创建会话ID的辅助函数
export function createSessionId(uid1: number, uid2: number): string {
  return `chat_${Math.min(uid1, uid2)}_${Math.max(uid1, uid2)}`;
}

// 修改模拟聊天记录存储结构，从用户ID映射改为会话ID映射
export const mockChatHistories: Record<string, ChatMessage[]> = {};

// 初始化一些模拟聊天记录
// 用户0与用户1的会话
const session_0_1 = createSessionId(0, 1);
mockChatHistories[session_0_1] = [
  {
    id: 1,
    senderId: 1,
    receiverId: 0,
    isSelf: false,
    type: 'text',
    content: '你看最近抖音上有个挺火的视频',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    status: 'read',
    sessionId: session_0_1
  },
  {
    id: 2,
    senderId: 0,
    receiverId: 1,
    isSelf: true,
    type: 'text',
    content: '哪个视频呀',
    timestamp: Date.now() - 1000 * 60 * 60 * 1.9,
    status: 'read',
    sessionId: session_0_1
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 0,
    isSelf: false,
    type: 'text',
    content: '就是那个...',
    timestamp: Date.now() - 1000 * 60 * 60 * 1.8,
    status: 'read',
    sessionId: session_0_1
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
    status: 'read',
    sessionId: session_0_1
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
    status: 'read',
    sessionId: session_0_1
  }
];

// 用户0与用户3的会话
const session_0_3 = createSessionId(0, 3);
mockChatHistories[session_0_3] = [
  {
    id: 1,
    senderId: 3,
    receiverId: 0,
    isSelf: false,
    type: 'voice',
    content: '',
    timestamp: Date.now() - 1000 * 60 * 5,
    duration: '5\'',
    status: 'read',
    sessionId: session_0_3
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
    status: 'read',
    sessionId: session_0_3
  },
  {
    id: 3,
    senderId: 0,
    receiverId: 3,
    isSelf: true,
    type: 'text',
    content: '又在刷抖音',
    timestamp: Date.now() - 1000 * 60 * 3,
    status: 'read',
    sessionId: session_0_3
  },
  {
    id: 4,
    senderId: 0,
    receiverId: 3,
    isSelf: true,
    type: 'text',
    content: '我昨天@你那个视频发给我下',
    timestamp: Date.now() - 1000 * 60 * 2,
    status: 'read',
    sessionId: session_0_3
  },
  {
    id: 5,
    senderId: 3,
    receiverId: 0,
    isSelf: false,
    type: 'text',
    content: '我找不到了',
    timestamp: Date.now() - 1000 * 60 * 1,
    status: 'read',
    sessionId: session_0_3
  },
  {
    id: 6,
    senderId: 0,
    receiverId: 3,
    isSelf: true,
    type: 'text',
    content: '我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了我也找不到了',
    timestamp: Date.now() - 1000 * 30,
    status: 'read',
    sessionId: session_0_3
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
    status: 'sent',
    sessionId: session_0_3
  }
];

// 模拟用户数据
export const mockUsers: Record<number, UserInfo> = {
  0: {
    id: 0,
    uid: 0,
    nickname: '测试用户',
    avatar: '/avatar/me-avatar.jpg',
    status: 'online',
    lastSeen: '刚刚',
    signature: '这是我的个性签名'
  },
  1: {
    id: 1,
    uid: 1,
    nickname: '我的好友1',
    avatar: '/avatar/vue-color-avatar-1.png',
    status: 'online',
    lastSeen: '刚刚',
    signature: '相逢的人会再相逢'
  },
  2: {
    id: 2,
    uid: 2,
    nickname: '我的好友2',
    avatar: '/avatar/vue-color-avatar-2.png',
    status: 'offline',
    lastSeen: '30分钟前',
    signature: '此生无悔入四月，来世愿做友人A'
  },
  3: {
    id: 3,
    uid: 3,
    nickname: '我的好友3',
    avatar: '/avatar/vue-color-avatar-3.png',
    status: 'online',
    lastSeen: '刚刚',
    signature: '愿你眼中有星辰，身后有靠山'
  },
  4: {
    id: 4,
    uid: 4,
    nickname: '我的好友4',
    avatar: '/avatar/vue-color-avatar-4.png',
    status: 'offline',
    lastSeen: '2小时前',
    signature: '所有的不期而遇，都是命中注定'
  },
  5: {
    id: 5,
    uid: 5,
    nickname: '我的好友5',
    avatar: '/avatar/vue-color-avatar-5.png',
    status: 'online',
    lastSeen: '刚刚',
    signature: '我不是不想联系你，只是不知道找什么理由'
  },
  6: {
    id: 6,
    uid: 6,
    nickname: 'AI小助手',
    avatar: '/avatar/AI-Bot-Avatar.jpg',
    status: 'online',
  },
  7: {
    id: 7,
    uid: 7,
    nickname: '系统通知',
    avatar: '/avatar/notices-avatar.png',
    status: 'online',
  },
};

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
export function getChatHistory(userId: number, currentUserId: number = 0) {
  return new Promise<ChatMessage[]>((resolve) => {
    setTimeout(() => {
      // 计算会话ID
      const sessionId = createSessionId(userId, currentUserId);
      // console.log(`[API] 获取聊天历史记录: userId=${userId}, currentUserId=${currentUserId}, sessionId=${sessionId}`);
      
      // 返回该会话的所有消息
      const messages = mockChatHistories[sessionId] || [];
      // console.log(`[API] 找到${messages.length}条消息`);
      
      resolve(messages);
    }, 300)
  })
}

// API函数：发送消息
export function sendMessage(message: Omit<ChatMessage, 'id' | 'status'>) {
  return new Promise<ChatMessage>((resolve) => {
    setTimeout(() => {
      const senderId = message.senderId;
      const receiverId = message.receiverId;
      // 计算会话ID
      const sessionId = createSessionId(senderId, receiverId);
      
      const newMessage = {
        ...message,
        id: Date.now(),
        status: 'sent' as const,
        sessionId: sessionId
      }
      
      // console.log(`[API] 发送消息: senderId=${senderId}, receiverId=${receiverId}, sessionId=${sessionId}`);
      
      // 将新消息添加到会话记录中
      if (mockChatHistories[sessionId]) {
        mockChatHistories[sessionId].push(newMessage);
      } else {
        mockChatHistories[sessionId] = [newMessage];
      }
      
      resolve(newMessage)
    }, 500)
  })
}

// API函数：标记消息为已读
export function markAsRead(userId: number, currentUserId: number = 0) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      // 更新消息列表中的未读计数
      mockMessages.forEach(message => {
        if (message.sender.id === userId) {
          message.unread = 0
        }
      })
      
      // 计算会话ID
      const sessionId = createSessionId(userId, currentUserId);
      
      // 更新聊天记录中的消息状态
      if (mockChatHistories[sessionId]) {
        mockChatHistories[sessionId].forEach(message => {
          if (!message.isSelf && message.senderId === userId) {
            message.status = 'read'
          }
        })
      }
      
      resolve(true)
    }, 200)
  })
}

/**
 * 获取用户信息
 * @param userId 用户ID
 */
export function getUserInfo(userId: number): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers[userId];
      if (user) {
        resolve(user);
      } else {
        reject(new Error(`用户不存在: ${userId}`));
      }
    }, 300);
  });
}

/**
 * 批量获取用户信息
 * @param userIds 用户ID数组
 */
export function getUsersInfo(userIds: number[]): Promise<UserInfo[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = userIds
        .map(id => mockUsers[id])
        .filter(user => user) as UserInfo[];
      resolve(users);
    }, 500);
  });
} 