# 仿抖音短视频社交 APP（TickTok）

一个用于前端综合能力练习的个人项目，参考抖音的产品形态，围绕“短视频/图片浏览、内容发布、商城、社交聊天”等场景，系统性实践移动端 Web 的工程化、组件化与多媒体特效能力。


一、项目简介与技术栈

- 项目定位：个人练习项目，仿抖音的移动端短视频社交应用（前端部分）。
- 核心技术：
  - 框架与语言：Vue 3、TypeScript、Vite、Pinia、Vue Router
  - UI/交互：IconPark（icon-park/vue-next）、Swiper（滑动/轮播）、自定义组件（侧边栏、底部导航、二级导航等）
  - 网络与数据：Axios（统一封装/拦截器）、本地缓存（localStorage、IndexedDB）
  - 多媒体与能力：
    - 相机能力：Capacitor Camera（浏览器端提供 Web 适配回退：input capture + IndexedDB 相册模拟）
    - 特效与滤镜：Canvas/WebGL、Mediapipe FaceMesh（人脸关键点）、自定义滤镜与装饰图层
    - 媒体处理：@ffmpeg/ffmpeg（WASM 转码/裁剪/截图）
  - AI/扩展：基于 LangChain 的多模型接入（未配置密钥时走演示模式）
- 说明：本项目前端以模块化为主，部分业务使用 Mock 数据（博客/商城），便于在无后端依赖环境下完成演示。


二、运行与构建

- 环境准备：
  - Node.js（建议 18+）
  - 包管理器（npm / pnpm / yarn 均可）

- 安装依赖：
  - 进入项目根目录后执行：
    - yarn install（或 npm install / pnpm install）

- 启动开发服务器：
  - 如果 package.json 配置了脚本：
    - yarn dev（或 npm run dev / pnpm dev）
  - 若未配置脚本，可直接使用 Vite：
    - npx vite --host

- 生产构建与本地预览：
  - 构建：yarn build（或 npm run build / pnpm build）
  - 预览：npx vite preview --host

- 可选说明：
  - 聊天模块默认使用演示/本地模式；如需接入真实后端，请在对应 Store/Service 中将 WebSocket 地址替换为你的服务地址。
  - 需要相机能力时，Web 会自动回退到浏览器实现（基于 input capture + IndexedDB），无需真机即可调试拍摄/相册核心流程。


三、菜单与路由布局

- 一级导航（底部）：
  - 首页（Home）
  - 朋友（Friend）
  - 消息（Chat）
  - 我（Me）

- 二级内容导航（首页内部）：
  - 推荐（Recommend）：主信息流，浏览多媒体内容
  - 商城（Mall）：商品瀑布流、搜索、购物车等
  - 经验（Blog/Experience）：图文/博文的瀑布流与详情页

- 主要路由：
  - /home：包含 /home/recommend、/home/mall、/home/blog 等子路由
  - /search：全局搜索或子模块搜索入口
  - /publish：发布页，含相册（/publish/album）与编辑器（/publish/editor）
  - /chat：聊天页，含动态会话窗口 /chat/window/:id
  - /me：个人主页


四、核心功能与实现亮点

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


五、后续开发计划

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




CORS跨域问题
