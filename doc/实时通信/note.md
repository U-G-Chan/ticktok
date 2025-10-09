# WebSocket 实时通信技术笔记

## 1. WebSocket 概念介绍

### 什么是 WebSocket？

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。它是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

### 核心特点

- **全双工通信**：客户端和服务器可以同时发送和接收数据
- **持久连接**：一旦建立连接，保持连接状态直到主动关闭
- **低延迟**：相比传统的 HTTP 轮询，延迟更低
- **协议轻量**：相比 HTTP 请求，协议开销更小
- **跨域支持**：支持跨域通信

### WebSocket vs HTTP

| 特性 | HTTP | WebSocket |
|------|------|-----------|
| 通信方式 | 请求-响应模式 | 全双工通信 |
| 连接状态 | 无状态，每次请求独立 | 有状态，持久连接 |
| 实时性 | 需要轮询，实时性差 | 真正的实时通信 |
| 服务器推送 | 不支持 | 原生支持 |
| 协议开销 | 每次请求都有完整的 HTTP 头 | 握手后只有少量帧开销 |

### WebSocket 连接过程

1. **握手阶段**：客户端发送 HTTP 升级请求
2. **协议升级**：服务器响应升级确认
3. **数据传输**：使用 WebSocket 协议进行双向通信
4. **连接关闭**：任一方可主动关闭连接

## 2. WebSocket 应用场景

### 2.1 实时聊天应用
- **即时消息**：微信、QQ、钉钉等聊天工具
- **在线客服**：网站客服系统
- **群组聊天**：多人聊天室

### 2.2 实时数据推送
- **股票行情**：实时股价、交易数据推送
- **体育赛事**：比分实时更新
- **新闻推送**：突发新闻实时通知

### 2.3 在线游戏
- **多人在线游戏**：实时同步游戏状态
- **棋牌游戏**：实时对战
- **实时策略游戏**：多玩家协作

### 2.4 协作工具
- **在线文档编辑**：Google Docs、腾讯文档
- **代码协作**：VS Code Live Share
- **白板协作**：在线画板工具

### 2.5 监控系统
- **系统监控**：服务器状态实时监控
- **日志监控**：实时日志查看
- **性能监控**：实时性能指标展示

### 2.6 直播应用
- **视频直播**：弹幕实时显示
- **音频直播**：实时互动
- **屏幕共享**：远程协作

## 3. WebSocket 简单示例

### 3.1 客户端示例（JavaScript）

```javascript
// 创建 WebSocket 连接
const socket = new WebSocket('ws://localhost:8080');

// 连接打开时的回调
socket.onopen = function(event) {
    console.log('WebSocket 连接已建立');
    
    // 发送消息到服务器
    socket.send(JSON.stringify({
        type: 'greeting',
        message: 'Hello Server!'
    }));
};

// 接收服务器消息的回调
socket.onmessage = function(event) {
    console.log('收到服务器消息:', event.data);
    
    try {
        const data = JSON.parse(event.data);
        handleMessage(data);
    } catch (error) {
        console.error('解析消息失败:', error);
    }
};

// 连接关闭时的回调
socket.onclose = function(event) {
    console.log('WebSocket 连接已关闭', event.code, event.reason);
    
    // 可以在这里实现重连逻辑
    if (event.code !== 1000) {
        setTimeout(() => {
            console.log('尝试重新连接...');
            // 重新创建连接
        }, 3000);
    }
};

// 连接错误时的回调
socket.onerror = function(error) {
    console.error('WebSocket 错误:', error);
};

// 处理不同类型的消息
function handleMessage(data) {
    switch (data.type) {
        case 'chat':
            displayChatMessage(data.message, data.user);
            break;
        case 'notification':
            showNotification(data.message);
            break;
        case 'userList':
            updateUserList(data.users);
            break;
        default:
            console.log('未知消息类型:', data.type);
    }
}

// 发送聊天消息
function sendChatMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'chat',
            message: message,
            timestamp: Date.now()
        }));
    } else {
        console.error('WebSocket 连接未打开');
    }
}

// 优雅关闭连接
function closeConnection() {
    if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, '用户主动关闭连接');
    }
}
```

### 3.2 服务端示例（Node.js + ws）

```javascript
const WebSocket = require('ws');
const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer();

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

// 存储所有连接的客户端
const clients = new Set();

// 处理新的 WebSocket 连接
wss.on('connection', function connection(ws, request) {
    console.log('新的客户端连接');
    
    // 将新连接添加到客户端集合
    clients.add(ws);
    
    // 发送欢迎消息
    ws.send(JSON.stringify({
        type: 'notification',
        message: '欢迎连接到 WebSocket 服务器！'
    }));
    
    // 广播当前在线用户数
    broadcastUserCount();
    
    // 处理客户端消息
    ws.on('message', function incoming(message) {
        console.log('收到消息:', message.toString());
        
        try {
            const data = JSON.parse(message);
            handleClientMessage(ws, data);
        } catch (error) {
            console.error('解析消息失败:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: '消息格式错误'
            }));
        }
    });
    
    // 处理连接关闭
    ws.on('close', function close(code, reason) {
        console.log('客户端断开连接:', code, reason.toString());
        clients.delete(ws);
        broadcastUserCount();
    });
    
    // 处理连接错误
    ws.on('error', function error(err) {
        console.error('WebSocket 错误:', err);
        clients.delete(ws);
    });
});

// 处理客户端消息
function handleClientMessage(ws, data) {
    switch (data.type) {
        case 'chat':
            // 广播聊天消息给所有客户端
            broadcastMessage({
                type: 'chat',
                message: data.message,
                user: data.user || 'Anonymous',
                timestamp: Date.now()
            });
            break;
            
        case 'greeting':
            // 回复问候消息
            ws.send(JSON.stringify({
                type: 'notification',
                message: 'Hello Client! 服务器收到了你的问候。'
            }));
            break;
            
        default:
            console.log('未知消息类型:', data.type);
    }
}

// 广播消息给所有连接的客户端
function broadcastMessage(message) {
    const messageStr = JSON.stringify(message);
    
    clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
        }
    });
}

// 广播当前在线用户数
function broadcastUserCount() {
    broadcastMessage({
        type: 'userCount',
        count: clients.size
    });
}

// 启动服务器
const PORT = process.env.PORT || 8080;
server.listen(PORT, function listening() {
    console.log(`WebSocket 服务器运行在端口 ${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('正在关闭服务器...');
    
    // 通知所有客户端服务器即将关闭
    broadcastMessage({
        type: 'notification',
        message: '服务器即将关闭，请保存您的工作。'
    });
    
    // 关闭所有连接
    clients.forEach(client => {
        client.close(1001, '服务器关闭');
    });
    
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});
```

### 3.3 简单的聊天室 HTML 示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket 聊天室</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        #messages {
            border: 1px solid #ccc;
            height: 400px;
            overflow-y: auto;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #f9f9f9;
        }
        
        .message {
            margin-bottom: 10px;
            padding: 5px;
            border-radius: 5px;
        }
        
        .chat-message {
            background-color: #e3f2fd;
        }
        
        .notification {
            background-color: #fff3e0;
            font-style: italic;
        }
        
        #inputContainer {
            display: flex;
            gap: 10px;
        }
        
        #messageInput {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        
        #sendButton {
            padding: 10px 20px;
            background-color: #2196f3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        
        #sendButton:hover {
            background-color: #1976d2;
        }
        
        #status {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
        }
        
        .connected {
            background-color: #c8e6c9;
            color: #2e7d32;
        }
        
        .disconnected {
            background-color: #ffcdd2;
            color: #c62828;
        }
    </style>
</head>
<body>
    <h1>WebSocket 聊天室演示</h1>
    
    <div id="status" class="disconnected">未连接</div>
    
    <div id="messages"></div>
    
    <div id="inputContainer">
        <input type="text" id="messageInput" placeholder="输入消息..." disabled>
        <button id="sendButton" disabled>发送</button>
    </div>
    
    <script>
        let socket = null;
        const messagesDiv = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const statusDiv = document.getElementById('status');
        
        // 连接到 WebSocket 服务器
        function connect() {
            socket = new WebSocket('ws://localhost:8080');
            
            socket.onopen = function(event) {
                updateStatus('已连接', true);
                messageInput.disabled = false;
                sendButton.disabled = false;
                addMessage('系统', '连接成功！', 'notification');
            };
            
            socket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                
                switch (data.type) {
                    case 'chat':
                        addMessage(data.user, data.message, 'chat-message');
                        break;
                    case 'notification':
                        addMessage('系统', data.message, 'notification');
                        break;
                    case 'userCount':
                        updateStatus(`已连接 (在线用户: ${data.count})`, true);
                        break;
                }
            };
            
            socket.onclose = function(event) {
                updateStatus('连接已断开', false);
                messageInput.disabled = true;
                sendButton.disabled = true;
                addMessage('系统', '连接已断开', 'notification');
                
                // 3秒后尝试重连
                setTimeout(connect, 3000);
            };
            
            socket.onerror = function(error) {
                console.error('WebSocket 错误:', error);
                addMessage('系统', '连接错误', 'notification');
            };
        }
        
        // 发送消息
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'chat',
                    message: message,
                    user: '用户' + Math.floor(Math.random() * 1000)
                }));
                messageInput.value = '';
            }
        }
        
        // 添加消息到聊天区域
        function addMessage(user, message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            
            const timestamp = new Date().toLocaleTimeString();
            messageDiv.innerHTML = `<strong>${user}</strong> [${timestamp}]: ${message}`;
            
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        // 更新连接状态
        function updateStatus(text, connected) {
            statusDiv.textContent = text;
            statusDiv.className = connected ? 'connected' : 'disconnected';
        }
        
        // 事件监听
        sendButton.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        
        // 页面加载时自动连接
        connect();
    </script>
</body>
</html>
```

## 4. WebSocket 最佳实践

### 4.1 连接管理
- **心跳检测**：定期发送 ping/pong 消息保持连接活跃
- **重连机制**：网络断开时自动重连
- **连接池管理**：服务端合理管理连接数量

### 4.2 消息处理
- **消息格式标准化**：使用 JSON 格式，定义统一的消息结构
- **消息队列**：处理消息积压和顺序问题
- **错误处理**：完善的错误处理和异常恢复机制

### 4.3 性能优化
- **消息压缩**：对大消息进行压缩传输
- **批量处理**：合并多个小消息减少网络开销
- **负载均衡**：多服务器部署时的负载均衡策略

### 4.4 安全考虑
- **身份验证**：连接建立时进行身份验证
- **消息验证**：验证消息来源和内容合法性
- **防止攻击**：防范 DDoS、消息洪水等攻击

## 5. 总结

WebSocket 是现代 Web 应用中实现实时通信的重要技术，它提供了高效、低延迟的双向通信能力。通过合理使用 WebSocket，可以构建出响应迅速、用户体验良好的实时应用。

在实际开发中，需要根据具体的业务需求选择合适的实现方案，并注意连接管理、性能优化和安全防护等方面的最佳实践。