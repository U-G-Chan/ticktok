

# 仿抖音短视频社交 APP（TickTok）

一个全栈开发练习项目。

参考抖音的产品形态，尝试在可控范围内还原其核心功能；受限于精力与个人技术水平，对部分技术细节进行了有意识的取舍与简化。

## 项目架构

采用前后端分离架构：

- 前端：Vue 3 + TypeScript + Vite + Pinia + Vue Router
- 后端：Go(Gin/GORM/Viper/Zap) + MySQL/Redis/MinIO

本仓库为前端代码，后端代码请参考 [https://github.com/U-G-Chan/ticktok-service](https://github.com/U-G-Chan/ticktok-service)。

采用本地离线数据，不请求官方 API。

## 效果预览
<!-- 
https://github.com/user-attachments/assets/014e1384-15e1-4cd0-9f3b-e8f548d51f39
https://github.com/user-attachments/assets/acf9fb86-b036-483f-ac87-2b2e1fc486e3
https://github.com/user-attachments/assets/2d70f15a-67e3-44f3-9e21-96eb154abe61
https://github.com/user-attachments/assets/f0053509-65c3-4103-b27e-3ab920d4518b
https://github.com/user-attachments/assets/0d17a55e-cab6-4afc-9312-71beec1ed224
https://github.com/user-attachments/assets/0e48dd77-6234-4f47-8a84-c9c153657972
--> 
<table>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/014e1384-15e1-4cd0-9f3b-e8f548d51f39" autoplay controls muted width="240"></video>
      <div>1. 主页推荐</div>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/acf9fb86-b036-483f-ac87-2b2e1fc486e3" autoplay controls muted width="240"></video>
      <div>2. 侧栏/商城/博客</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/2d70f15a-67e3-44f3-9e21-96eb154abe61" autoplay controls muted width="240"></video>
      <div>3. 点赞收藏</div>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/f0053509-65c3-4103-b27e-3ab920d4518b" autoplay controls muted width="240"></video>
      <div>4. Chatbot</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/0d17a55e-cab6-4afc-9312-71beec1ed224" autoplay controls muted width="240"></video>
      <div>5. 拍摄/滤镜</div>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/0e48dd77-6234-4f47-8a84-c9c153657972" autoplay controls muted width="240"></video>
      <div>6. 发表作品</div>
    </td>
  </tr>
</table>

## 快速开始

### 拉取项目代码

```bash
git clone https://github.com/U-G-Chan/ticktok.git
git clone https://github.com/U-G-Chan/ticktok-service.git
```

### 运行后端服务

确保已安装 Go 环境，确保已安装 Docker。

```bash
cd ticktok-service
go mod download
task docker-up
task run-all
```

### 运行前端服务

确保已安装 Node.js 环境。

```bash
cd ticktok
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)，键入 `F12` + `Ctrl+Shift+M` 切换至移动设备视图， 即可查看项目效果。

## 前端设计

### 菜单与路由布局

- 一级导航（底部）：首页Home | 朋友Friend | 发表Publish | 消息Chat | 我的Me
- 二级内容导航（首页内部）：推荐Recommend | 商城Mall | 经验Blog

### 核心功能与实现亮点

- 架构与工程实践
  - 移动端布局与交互：Flex/Grid 自适应布局；滑块播放流与瀑布流布局组件化封装
  - 组件化/模块化：侧边栏、顶部/底部导航、二级内容导航、内容卡片、详情页、互动条等
  - 路由懒加载：页面与子模块按需加载，优化首屏与路由切换性能
  - 跨端适配：Capacitor 能力的 Web 回退封装，可在浏览器端调试拍摄/相册/存储核心流程

- 多媒体与特效
  - 相机拍摄与预览：拍照/录像模式切换、翻转摄像头、闪光灯开关、相册入口
  - Canvas/WebGL 特效：
    - 滤镜：实时应用多种滤镜（WebGL Shader 动态切换）
    - 装饰：基于人脸关键点的贴纸/装饰（如墨镜、帽子、猫耳等）
    - 拍摄动效：快门、闪光、扫描等拍摄特效
  - 人脸跟踪：Mediapipe FaceMesh 实时跟踪关键点，驱动装饰定位与动画
  - 媒体处理（FFmpeg WASM）：
    - 格式转码：视频/音频格式转换
    - 片段裁剪：按时间段截取片段
    - 封面截图：按时间点生成截图作为缩略图
  - 文件上传/下载：统一封装媒体上传、前端生成文件并触发下载

- 内容与交互
  - 推荐流：浏览图片/视频内容，支持播放控制、滑动切换
  - 博客/经验：搜索/列表瀑布流；详情页包含相册、正文、评论；支持点赞、收藏、关注等互动
  - 商城：商品列表瀑布流、搜索、购物车/结算入口（Mock 数据）
  - 聊天：会话列表、消息收发（文本/图片/语音类型扩展位）、未读计数与演示模式
  - AI 对话：基于 LangChain 的多模型接入（未配置密钥时自动进入演示/Mock 流程）

- 网络与数据
  - Axios 实例与拦截器：统一 baseURL、超时、Content-Type、token 注入与错误处理
  - 本地缓存：
    - Web 相册与文件：IndexedDB 存储拍摄文件，便于 Web 环境模拟移动端相册
    - 通用存储：localStorage 封装，统一管理
  - 跨域与代理：结合 Vite 与 Axios，按需配置代理解决跨域问题

## 后续开发计划

- 性能优化
  - 媒体展示：图片/视频懒加载、预加载、占位与骨架屏
  - 缓存策略：更细粒度的 IndexedDB/CacheStorage 缓存与过期策略
  - 列表优化：长列表虚拟化与分片渲染

- 工程化
  - 质量与流程：ESLint/Prettier、单元/E2E 测试、CI/CD
  - 构建探索：在现有 Vite 的基础上，补充 Webpack（或 Rspack）方案的对比与可选配置
  - 可观测性：埋点、性能指标上报、日志采集

- 多端与生态
  - Capacitor 真机打包与原生能力拓展
  - Flutter 等多端技术方案探索，统一设计与交互规范
  - PWA 支持：离线缓存、安装到桌面
