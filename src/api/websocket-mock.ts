import { ChatMessage } from './chat'

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
  private clients: Set<MockWebSocket> = new Set()
  private messageHistory: Map<string, any[]> = new Map()

  static getInstance(): MockWebSocketServer {
    if (!MockWebSocketServer.instance) {
      MockWebSocketServer.instance = new MockWebSocketServer()
    }
    return MockWebSocketServer.instance
  }

  registerClient(client: MockWebSocket): void {
    this.clients.add(client)
    console.log(`[MockServer] 客户端已连接: ${client.url}`)
  }

  unregisterClient(client: MockWebSocket): void {
    this.clients.delete(client)
    console.log(`[MockServer] 客户端已断开连接: ${client.url}`)
  }

  receiveMessage(data: string, sender: MockWebSocket): void {
    console.log(`[MockServer] 收到消息: ${data}`)
    
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
    
    // 存储消息历史
    if (!this.messageHistory.has(sessionId)) {
      this.messageHistory.set(sessionId, [])
    }
    this.messageHistory.get(sessionId)!.push(message)
    
    // 模拟发送给接收者
    // 在实际应用中，应该根据receiverId找到对应的WebSocket连接

    
    // 模拟网络延迟
    setTimeout(() => {
      // 创建一个回复消息(在实际应用中，这应该是真实用户发送的消息)
      if (message.type === 'text' && Math.random() > 0.5) {
        const replyMessage = {
          ...message,
          id: Date.now(),
          isSelf: false,
          content: this.generateAutoReply(message.content),
          senderId: message.receiverId,
          receiverId: message.senderId,
          timestamp: Date.now(),
          status: 'sent'
        }
        
        // 发送自动回复
        setTimeout(() => {
          for (const client of this.clients) {
            client.receiveMessage(JSON.stringify({
              type: 'message',
              message: replyMessage
            }))
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