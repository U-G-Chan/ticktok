# uni-app 多端适配与快速入门笔记

本文梳理 uni-app 的心智模型、架构与多端适配机制，并给出常用工程化流程、条件编译与经典页面示例，帮助你高效实现“一端开发，多端部署”。

## 心智模型与架构
- 一套源码，多端编译：以 Vue（支持 Vue2/Vue3）编写业务与组件，编译器将同一套代码转换为各平台的页面结构、样式与脚本。
- 统一 API 层：通过 `uni.*` 提供跨端能力（网络、路由、文件、设备等），在不同平台由运行时桥接到对应原生/容器能力。
- 声明式 UI：仍采用 Vue 的响应式 + 组件化思路，数据变化触发视图更新，降低端差异的心智负担。
- 运行时容器：
  - H5：浏览器 DOM 渲染。
  - 小程序：转换为各家小程序的原生描述（如微信的 `wxml/wxss/json/js`）。
  - App（App-Plus）：WebView + 原生插件的混合架构；必要时使用 `nvue`（原生渲染）或 `uni-app x`（基于 Flutter）。

## 目标平台与差异
- H5：标准 Web 生态，直接运行在浏览器。
- 小程序：`mp-weixin`、`mp-alipay`、`mp-baidu`、`mp-toutiao`、`mp-qq`、`mp-kuaishou` 等。
- App-Plus：Android/iOS 原生壳，支持相机、蓝牙、文件系统等，性能优于纯 H5 页面。
- 原生渲染：`nvue` 页面更接近原生绘制，适合高性能场景；`uni-app x` 用 Flutter 做统一原生渲染。

## 项目结构与关键配置
- `App.vue`：应用入口，定义全局样式与根组件。
- `main.js/ts`：应用启动逻辑（Vue2/Vue3 写法略有不同）。
- `pages.json`：页面路由配置、tabBar、窗口样式等多端通用配置。
- `manifest.json`：应用基础信息、各平台打包/权限配置（App、小程序、H5）。
- `components/`：通用组件。
- `pages/`：业务页面目录（按路由组织）。
- `static/`：静态资源，不经编译直接拷贝到目标平台。
- `uni_modules/`：uni 插件模块目录（生态插件与自研模块）。

示例 `pages.json`：
```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "首页" } },
    { "path": "pages/search/search", "style": { "navigationBarTitleText": "搜索" } }
  ],
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "static/home.png", "selectedIconPath": "static/home-active.png" },
      { "pagePath": "pages/search/search", "text": "搜索", "iconPath": "static/search.png", "selectedIconPath": "static/search-active.png" }
    ]
  }
}
```

## 常用跨端 API
- 网络：`uni.request`、`uni.uploadFile`、`uni.downloadFile`、`uni.connectSocket`。
- 路由：`uni.navigateTo`、`uni.redirectTo`、`uni.switchTab`、`uni.navigateBack`。
- 存储：`uni.setStorage` / `uni.getStorage` / `uni.removeStorage`。
- 设备：`uni.getSystemInfo`、`uni.scanCode`、`uni.getLocation`、`uni.chooseImage`。
- UI 反馈：`uni.showToast`、`uni.showLoading`、`uni.showModal`、`uni.showActionSheet`。

示例请求：
```js
uni.request({
  url: 'https://api.example.com/search',
  method: 'GET',
  data: { q: 'keyword' },
  success: (res) => { console.log(res.data); },
  fail: (err) => { console.error(err); }
});
```

## 页面生命周期（Vue3 写法示例）
在 Vue3 下可使用组合式 API 并从 `@dcloudio/uni-app` 引入页面生命周期：
```ts
import { ref } from 'vue'
import { onLoad, onShow, onHide, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

const keyword = ref('')

onLoad((query) => {
  console.log('页面加载', query)
})
onShow(() => console.log('页面显示'))
onHide(() => console.log('页面隐藏'))
onPullDownRefresh(() => {
  // 下拉刷新逻辑
  uni.stopPullDownRefresh()
})
onReachBottom(() => {
  // 触底加载逻辑
})
```

## 经典页面示例：搜索页（受控输入 + 防抖 + 列表）
`pages/search/search.vue`
```vue
<template>
  <view class="page">
    <view class="search-bar">
      <input class="input" :value="text" placeholder="搜索..." @input="onInput" />
      <button class="btn" @click="triggerSearch">搜索</button>
    </view>
    <view v-if="loading" class="loading">加载中…</view>
    <scroll-view scroll-y class="list">
      <view v-for="item in items" :key="item.id" class="item" @click="select(item)">
        {{ item.name }}
      </view>
      <view v-if="!loading && items.length === 0" class="empty">无结果</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

type Item = { id: string; name: string }

const text = ref('')
const items = ref<Item[]>([])
const loading = ref(false)
let debounceId: number | null = null

onLoad(() => {
  // 初始逻辑
})

function onInput(e: any) {
  text.value = e.detail.value
  if (debounceId) clearTimeout(debounceId)
  debounceId = setTimeout(triggerSearch, 300) as unknown as number
}

function triggerSearch() {
  const q = text.value.trim()
  if (!q) { items.value = []; return }
  loading.value = true
  uni.request({
    url: 'https://api.example.com/search',
    method: 'GET',
    data: { q },
    success: (res) => { items.value = (res.data || []) as Item[] },
    complete: () => { loading.value = false }
  })
}

function select(item: Item) {
  uni.showToast({ title: `选中：${item.name}`, icon: 'none' })
}
</script>

<style scoped>
.page { padding: 12rpx; }
.search-bar { display: flex; gap: 12rpx; align-items: center; }
.input { flex: 1; height: 72rpx; border: 1px solid #ddd; padding: 0 12rpx; }
.btn { height: 72rpx; line-height: 72rpx; padding: 0 24rpx; background: #3cc51f; color: #fff; border-radius: 8rpx; }
.loading { padding: 12rpx; color: #999; }
.list { height: 70vh; }
.item { padding: 16rpx; border-bottom: 1px solid #eee; }
.empty { padding: 24rpx; text-align: center; color: #aaa; }
</style>
```

代码要点：
- 受控输入与防抖：输入事件中延迟触发搜索，降低高频请求。
- `scroll-view`：跨端滚动容器，适合列表与懒加载场景。
- 统一请求：`uni.request` 屏蔽端差异；结果渲染使用 `v-for` 与稳定 `key`。
- 样式单位：使用 `rpx`（或 `upx`）适配不同屏幕密度。

## 条件编译与差异化处理
在 SFC 或脚本中使用条件编译以处理不同平台差异：
```vue
<view>
  <!-- #ifdef H5 -->
  <view>当前为 H5</view>
  <!-- #endif -->

  <!-- #ifdef MP-WEIXIN -->
  <view>当前为微信小程序</view>
  <!-- #endif -->

  <!-- #ifdef APP-PLUS -->
  <view>当前为 App-Plus</view>
  <!-- #endif -->
</view>
```

脚本差异化示例：
```js
// #ifdef APP-PLUS
const systemInfo = plus.device
// #endif

// #ifdef H5
console.log('H5 环境：', window.location.href)
// #endif
```

## 样式与组件库
- 单位：`rpx/upx` 自适应单位；注意不同平台的边距与安全区域处理（如 iOS 刘海屏）。
- 组件库：`uni-ui` 官方组件；常见第三方如 `uView`、`ThorUI` 等，提升页面开发效率与一致性。

## 性能与优化建议
- 高性能页面选型：复杂动画或大列表优先考虑 `nvue` 或 `uni-app x`；普通业务页面使用 H5/小程序足够。
- 分包与懒加载：合理拆分路由与静态资源，降低首屏体积。
- 避免过度频繁的状态更新：合并请求与批量更新，减少重渲染。
- 列表优化：分页/虚拟列表、占位与图片缓存（小程序端注意域名白名单与图片缓存策略）。
- 调试工具：使用各端开发者工具（微信/支付宝/抖音等）、HBuilderX 控制台、`uni-app` 提供的日志与性能面板。

## 构建与运行（常见命令）
基于 Vite 的 uni-app 工程通常提供以下脚本（具体以模板为准）：
```bash
npm run dev:h5          # 开发 H5
npm run dev:mp-weixin   # 开发微信小程序
npm run dev:app         # 开发 App-Plus（需 HBuilderX 或 CLI 打包）

npm run build:h5        # 构建 H5
npm run build:mp-weixin # 构建微信小程序
npm run build:app       # 构建 App-Plus 安装包
```

## 原生能力与插件
- App-Plus 原生插件：通过 `uni_modules` 引入或使用 `requireNativePlugin`（nvue）访问原生接口。
- 小程序端：遵循各平台权限与白名单（如微信的域名白名单、用户授权弹窗）。
- 能力边界：当跨端统一 API 无法满足时，编写适配层并在内部使用条件编译调用各端专用实现。

## 常见坑与规避
- 环境差异：H5 有 `window`/DOM；小程序与 App-Plus 无 DOM，谨慎使用仅限浏览器的库。
- 权限与白名单：小程序网络/文件域名需在平台配置；App 需在 `manifest` 声明权限。
- 资源路径：使用相对路径或 `@/static` 规范，避免跨端路径不一致。
- 时间与动画：不同端的渲染管线差异；复杂动画尽量使用原生渲染页面或轻量实现。

## 学习与迁移路径
- 从 H5/小程序任一端开始调试，快速验证业务；逐步接入其它端并补齐差异。
- 把能力封装到统一服务层（如 `services/`），页面只依赖抽象接口；差异在服务层内部消化。
- 优先使用官方组件与 API；特殊需求通过条件编译与插件解决；业务-端差分尽量靠配置而非分叉代码。

---

如需，我可以基于你的现有页面（如 `src/components/Search.vue` 或发布列表）在 `uni-app` 下搭建等价页，并补充 `pages.json`/`manifest.json` 的最小配置，帮助你直接运行到 H5/小程序/App 三端进行对照与验证。