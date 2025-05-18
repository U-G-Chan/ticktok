import { ChatMessage, FriendType, mockFriends } from './chat'

// 模拟WebSocket类
export class MockWebSocket extends EventTarget {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  url: string
  readyState: number = MockWebSocket.CONNECTING
  private messageQueue: any[] = []
  private mockServer: MockWebSocketServer
  // 添加用户ID属性
  userId: number | null = null

  constructor(url: string) {
    super()
    this.url = url
    this.mockServer = MockWebSocketServer.getInstance()
    
    // 模拟连接延迟
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN
      this.mockServer.registerClient(this)
      this.dispatchEvent(new Event('open'))
      
      // 发送所有排队的消息
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()
        this.mockServer.receiveMessage(message, this)
      }
    }, 300)
  }

  send(data: string): void {
    if (this.readyState === MockWebSocket.OPEN) {
      this.mockServer.receiveMessage(data, this)
    } else {
      this.messageQueue.push(data)
    }
  }

  close(): void {
    if (this.readyState !== MockWebSocket.CLOSED) {
      this.readyState = MockWebSocket.CLOSING
      
      this.mockServer.unregisterClient(this)
      
      setTimeout(() => {
        this.readyState = MockWebSocket.CLOSED
        this.dispatchEvent(new Event('close'))
      }, 100)
    }
  }

  // 接收来自服务器的消息
  receiveMessage(data: string): void {
    if (this.readyState === MockWebSocket.OPEN) {
      const event = new MessageEvent('message', { data })
      this.dispatchEvent(event)
    }
  }
}

// 模拟WebSocket服务器
class MockWebSocketServer {
  private static instance: MockWebSocketServer | null = null
  private clients: Map<number, MockWebSocket> = new Map() // 改为 Map，用户ID作为键
  private messageHistory: Map<string, any[]> = new Map()

  static getInstance(): MockWebSocketServer {
    if (!MockWebSocketServer.instance) {
      MockWebSocketServer.instance = new MockWebSocketServer()
    }
    return MockWebSocketServer.instance
  }

  registerClient(client: MockWebSocket): void {
    // 尝试从URL中提取用户ID
    try {
      const urlParams = new URLSearchParams(client.url.split('?')[1]);
      const userId = parseInt(urlParams.get('userId') || '0', 10);
      client.userId = userId;
      this.clients.set(userId, client);
      console.log(`[MockServer] 客户端已连接: ${client.url}, userId=${userId}`);
    } catch (error) {
      console.error(`[MockServer] 从URL解析userId失败: ${client.url}`, error);
    }
  }

  unregisterClient(client: MockWebSocket): void {
    if (client.userId) {
      this.clients.delete(client.userId);
      console.log(`[MockServer] 客户端已断开连接: ${client.url}, userId=${client.userId}`);
    }
  }

  receiveMessage(data: string, sender: MockWebSocket): void {
    console.log(`[MockServer] 收到消息: ${data}`, sender.userId ? `来自用户ID=${sender.userId}` : '未知用户');
    
    try {
      const parsedData = JSON.parse(data)
      
      // 处理不同类型的消息
      if (parsedData.type === 'message') {
        this.handleChatMessage(parsedData.message, sender)
      }
    } catch (error) {
      console.error('[MockServer] 解析消息失败:', error)
    }
  }

  // 处理聊天消息
  private handleChatMessage(message: ChatMessage, sender: MockWebSocket): void {
    // 根据senderId和receiverId创建会话ID
    const sessionId = `chat_${Math.min(message.senderId, message.receiverId)}_${Math.max(message.senderId, message.receiverId)}`
    message.sessionId = sessionId; // 添加会话ID到消息
    
    // 存储消息历史
    if (!this.messageHistory.has(sessionId)) {
      this.messageHistory.set(sessionId, [])
    }
    this.messageHistory.get(sessionId)!.push(message)
    
    // 发送消息给接收者
    const receiverId = message.receiverId;
    const receiverClient = this.clients.get(receiverId);
    
    console.log(`[MockServer] 发送消息 senderId=${message.senderId} -> receiverId=${receiverId}, sessionId=${sessionId}`);
    
    // 1. 发送消息给发送方(确认消息)
    if (sender.userId && sender.userId === message.senderId) {
      sender.receiveMessage(JSON.stringify({
        type: 'message',
        message: {
          ...message,
          isSelf: true, // 确保标记为自己发送的
          status: 'sent' // 更新状态为已发送
        }
      }));
    }
    
    // 2. 发送消息给接收方
    if (receiverClient) {
      receiverClient.receiveMessage(JSON.stringify({
        type: 'message',
        message: {
          ...message,
          isSelf: false // 确保标记为他人发送的
        }
      }));
      // console.log(`[MockServer] 消息已发送给接收者 userId=${receiverId}`);
      
      // 模拟消息已读状态更新
      setTimeout(() => {
        if (sender.userId && sender.readyState === MockWebSocket.OPEN) {
          const readStatusMessage = {
            ...message,
            status: 'read'
          };
          
          sender.receiveMessage(JSON.stringify({
            type: 'messageStatus',
            messageId: message.id,
            status: 'read',
            message: readStatusMessage
          }));
          
          // console.log(`[MockServer] 已向发送者 userId=${message.senderId} 发送消息已读状态更新`);
        }
      }, 800 + Math.random() * 1500);
    } else {
      // console.log(`[MockServer] 接收者不在线 userId=${receiverId}，消息将在下次连接时发送`);
    }
    
    // 检查接收者是否是AI机器人
    const receiverFriend = mockFriends.find(friend => friend.id === receiverId);
    const isAIBot = receiverFriend?.friendType === FriendType.AIBOT;
    
    // 模拟网络延迟，但仅在非AI机器人对话时自动回复
    setTimeout(() => {
      // 如果接收者是AI机器人，则不使用自动回复
      if (!isAIBot && message.type === 'text' && Math.random() > 0.5) {
        const replyMessage = {
          ...message,
          id: Date.now(),
          isSelf: false,
          content: this.generateAutoReply(message.content),
          senderId: message.receiverId,
          receiverId: message.senderId,
          timestamp: Date.now(),
          status: 'sent',
          sessionId: sessionId // 保持相同的会话ID
        }
        
        // 发送自动回复给发送方
        setTimeout(() => {
          const originalSender = this.clients.get(message.senderId);
          if (originalSender) {
            originalSender.receiveMessage(JSON.stringify({
              type: 'message',
              message: {
                ...replyMessage,
                isSelf: false // 确保自动回复标记为他人发送的
              }
            }));
            console.log(`[MockServer] 自动回复已发送给原发送者 userId=${message.senderId}, sessionId=${sessionId}`);
          }
        }, 1000 + Math.random() * 2000)
      }
    }, 300 + Math.random() * 700)
  }

  // 生成自动回复
  private generateAutoReply(content: string): string {
    const replies = [
      `收到了: "${content}"`,
      "好的，我知道了",
      "我稍后回复你",
      "👍",
      "正在忙，稍后回复",
      "谢谢你的消息",
      "我已经看到了"
    ]
    
    return replies[Math.floor(Math.random() * replies.length)]
  }
}

// 重写全局WebSocket
export function setupMockWebSocket(): void {
  // @ts-ignore - 重写全局WebSocket
  window.WebSocket = MockWebSocket
} 