import { get, post, put } from '@/utils/http';

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
  friendType?: FriendType; 
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

/**
 * 获取好友列表
 * @returns 好友列表
 */
export const getFriends = (): Promise<Friend[]> => {
  return get<Friend[]>('/chat/friends');
};

/**
 * 获取消息列表
 * @returns 消息列表
 */
export const getMessages = (): Promise<Message[]> => {
  return get<Message[]>('/chat/messages');
};

/**
 * 获取聊天历史记录
 * @param userId 用户ID
 * @param currentUserId 当前用户ID
 * @returns 聊天历史记录
 */
export const getChatHistory = (userId: number, currentUserId: number = 0): Promise<ChatMessage[]> => {
  return get<ChatMessage[]>('/chat/history', { userId, currentUserId });
};

/**
 * 发送消息
 * @param message 消息内容
 * @returns 发送的消息
 */
export const sendMessage = (message: Omit<ChatMessage, 'id' | 'status'>): Promise<ChatMessage> => {
  return post<ChatMessage>('/chat/send', message);
};

/**
 * 将消息标记为已读
 * @param userId 用户ID
 * @param currentUserId 当前用户ID
 * @returns 操作结果
 */
export const markAsRead = (userId: number, currentUserId: number = 0): Promise<void> => {
  return put<void>('/chat/read', { userId, currentUserId });
};