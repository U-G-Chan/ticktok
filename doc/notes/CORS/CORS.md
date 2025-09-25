# 跨域与 CORS 笔记

## 1. 基本概念

- 同源策略（SOP）：只有协议、域名、端口三者都相同，前端页面才能不受限制地访问资源；任一不同即“跨域”。
- 跨域限制只发生在“浏览器端的脚本访问”；服务端与服务端之间不存在同源限制。

## 2. CORS 是什么

- CORS（Cross-Origin Resource Sharing）是一套浏览器与服务器约定的“放行机制”。
- 核心思想：由服务器在响应头里明确告诉浏览器“允许哪些来源访问我”。浏览器验证这些响应头后决定是否放行给前端脚本读取。

## 3. 简单请求 vs 预检请求

- 简单请求（不会预检）：方法为 GET/HEAD/POST，且请求头“简单”，如：
  - Content-Type 仅限 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
  - 无自定义请求头（如 `Authorization`、`X-Token` 等）
- 预检请求（OPTIONS）：如果使用了非常见方法（PUT/DELETE/PATCH…）、或带了自定义头、或 Content-Type 为 `application/json` 等，浏览器会先发一个 `OPTIONS` 请求询问服务端是否允许，服务端同意后才会发送真正请求。

## 4. 关键响应头

- `Access-Control-Allow-Origin`: 允许访问的 Origin（如 `https://example.com`），或使用 `*`（与凭证不兼容）。
- `Access-Control-Allow-Methods`: 允许的方法（如 `GET, POST, PUT, DELETE`）。
- `Access-Control-Allow-Headers`: 允许的自定义请求头（必须覆盖预检中的 `Access-Control-Request-Headers`）。
- `Access-Control-Allow-Credentials`: `true` 表示允许携带 Cookie/HTTP 认证等凭证。
- `Access-Control-Expose-Headers`: 允许前端读取的响应头（不在默认可读清单里的头需要在此暴露）。
- `Access-Control-Max-Age`: 预检结果的缓存时间（秒），减少频繁预检。

## 5. 携带 Cookie/凭证的特殊规则

- 前端需显式声明：
  - fetch：`credentials: 'include'`
  - Axios：`withCredentials: true`
- 服务端必须返回：`Access-Control-Allow-Credentials: true`
- 同时 `Access-Control-Allow-Origin` 不能是 `*`，必须是具体 Origin。
- Cookie 需满足：`SameSite=None; Secure`，并在 HTTPS 下传输。

## 6. 常见错误与成因

- `No 'Access-Control-Allow-Origin' header`：服务端没返回允许的 Origin，或值与实际 Origin 不匹配。
- 预检 `OPTIONS` 报 404/405/500：后端未处理预检路由或中间件顺序不正确。
- 使用凭证但 `Allow-Origin` 为 `*`：浏览器拒绝，需改成具体 Origin。
- `Request header field Authorization is not allowed by Access-Control-Allow-Headers`：带了自定义头，后端未在 `Allow-Headers` 放行。
- 重定向导致失败：若接口发生 301/302 跳转，最终落地响应也必须带上正确的 CORS 头；否则浏览器拦截。
- 本地 `file://` 打开页面 Origin 为 `null`：需后端允许 `null` 或改用本地开发服务器。

## 7. 解决方案（从根本到权宜）

### 7.1 在后端正确开启并配置 CORS（推荐）

- 放行所需的 Origin、Methods、Headers，并正确处理 `OPTIONS` 预检。
- 携带凭证时，使用具体 Origin，返回 `Access-Control-Allow-Credentials: true`。

示例（Node.js/Express，使用 `cors` 中间件）：

```js
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowList = ['http://localhost:5173', 'https://example.com'];
    if (!origin || allowList.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600,
}));

app.options('*', cors());

app.get('/api/data', (req, res) => {
  res.json({ ok: 1 });
});

app.listen(3000);
```

### 7.2 开发期代理（把跨域“同源化”，推荐）

- 使用 Vite 开发服务器的 `server.proxy`：前端访问同源路径（如 `/api`），由代理转发到后端，避免浏览器跨域检查。

示例（Vite 配置片段）：

```ts
import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

- 配置文件路径：`d:\project\ticktok\vite.config.ts`。

### 7.3 生产环境反向代理（Nginx 等，推荐）

- 让前端与 API 以“同域不同路径”的方式对外，代理转发到真实后端，并由代理统一设置 CORS（若确需跨域）。

示例（Nginx 片段，仅供思路参考）：

```nginx
server {
  listen 443 ssl;
  server_name example.com;

  location /api/ {
    proxy_pass http://backend:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    add_header Access-Control-Allow-Origin "https://example.com" always;
    add_header Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type,Authorization" always;
    add_header Access-Control-Allow-Credentials "true" always;
    if ($request_method = OPTIONS) { return 204; }
  }
}
```

### 7.4 网关统一 CORS（API Gateway）

- 在网关层集中处理 CORS，减少各服务重复配置，保证策略一致。

### 7.5 降级以避免预检（适度使用）

- 尽量使用“简单请求”：
  - 方法用 GET/POST
  - Content-Type 使用 `application/x-www-form-urlencoded`
  - 不携带自定义头（如必须带 `Authorization`，就不可避免预检）

### 7.6 非 CORS 方案（根据场景选择）

- 服务端转发（BFF/中间层）：前端只请求同源服务，由该服务与第三方交互。
- JSONP（仅 GET，不推荐）：安全性与适用性较差。
- `postMessage`（iframe/多域通信）：同页面内跨域通信的策略，不是 HTTP 请求的跨域方案。
- `mode: 'no-cors'`（不推荐）：会得到“不透明”响应，前端拿不到真正数据。

## 8. 重定向、缓存与 CDN 注意事项

- 有重定向时，最终落地响应也必须包含正确的 CORS 头。
- 预检缓存：合理设置 `Access-Control-Max-Age`，可降低频繁预检负载。
- CDN/缓存：确保 `Vary: Origin` 等头的使用，避免缓存污染不同来源的 CORS 响应。

## 9. 调试与排查清单

- 浏览器 Network 面板：
  - 查看是否有 `OPTIONS` 预检？状态码是否 200/204？是否带 `Allow-Origin/Allow-Methods/Allow-Headers`？
  - 正式请求的响应头是否包含正确的 `Allow-Origin`（与页面 Origin 一致）、`Allow-Credentials`（若携带凭证）。
  - 若发送了自定义头（如 `Authorization`），确认服务器的 `Allow-Headers` 已放行。
  - 出现重定向时检查最终响应头。
- 携带 Cookie：
  - 前端设置 `credentials/include` 或 `withCredentials`。
  - 服务端 `Allow-Credentials: true` 且 `Allow-Origin` 不为 `*`。
  - Cookie 的 `SameSite=None; Secure` 且 HTTPS。
- 区分“网络成功但被浏览器拦截”与“请求未到服务端”：前者 Network 有响应但 Console 报 CORS 错；后者网络直接报错或超时。

## 10. FAQ

- 跨域只在浏览器端发生吗？
  - 是。服务端调用第三方不会被浏览器同源策略限制。
- 能不能靠前端单方面解决？
  - 真正可靠的方案需要服务端或代理配合；仅靠前端参数（如 `no-cors`）无法读取有效数据。
- 为什么本地调试经常遇到跨域？
  - 开发服务器端口/协议与后端不同，构成跨域。建议使用代理或统一后端 CORS。

## 11. 术语表

- Origin：来源（协议+域名+端口）。
- 预检（Preflight）：浏览器发出的 `OPTIONS` 请求，用于探测是否允许跨域。
- 凭证（Credentials）：Cookie、HTTP 认证信息等。
- BFF：Backend For Frontend，中间层服务，常用于转发与聚合。

---

建议实践顺序：
1) 开发期优先用代理（Vite/Nginx）；
2) 生产环境在后端或网关统一开启 CORS；
3) 涉及 Cookie/登录态时，严格遵循凭证规则；
4) 使用 Network 面板与日志双向验证，确保预检与正式请求都正确。