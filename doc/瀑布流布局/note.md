# 流式/瀑布流布局 前端实践笔记

本文系统整理流式（响应式）与瀑布流（Masonry）长列表的前端实现方法与工程化实践，覆盖概念、性能优化、数据获取与管理策略，以及与图片懒加载、虚拟滚动的协同方案，并提供关键代码片段。

## 1. 基本概念与优势

- 流式布局：页面内容随容器尺寸流动（响应式），列数/宽度动态调整，适应手机、平板和桌面端。
- 瀑布流（Masonry）：多列不等高卡片的网格布局，按照最短列优先分发，减少空隙、提升视觉密度。
- 长列表/无限滚动：持续加载下一页内容，避免一次性加载过多数据导致卡顿或白屏。
- 核心优势：
  - 更好的性能与内存占用（只渲染/持有必要数据）。
  - 更顺畅的体验（预加载、懒加载、虚拟化）与视觉密度更高的展示。
  - 适配多终端、多屏尺寸。

## 2. 技术实现要素

- 单一滚动容器：将滚动限定在一个容器中，便于测量和控制（`overflow: auto`）。
- 列数自适应：根据容器宽度动态计算列数（手机2列，平板/Web 3–5列）。
- 固定列宽、内容自适应高度：卡片宽度固定，高度由内容决定，列内卡片顺序稳定。
- 尺寸预测与占位：提前估算卡片高度或提供占位高度，减少滚动时的回流/重排。
- 触底与预加载：接近底部阈值时提前发起下一页请求，避免空白等待。
- 状态管理与窗口化：在内存压力较大时使用“窗口”策略只保留当前可视区附近的数据；否则默认保留历史数据以支持自由回滑。

## 3. 性能优化方法（含关键代码）

### 3.1 图片懒加载

- 原生属性：`<img loading="lazy">`（现代浏览器支持）。
- IntersectionObserver（更可控，可统一处理占位/错误）：

```ts
// 懒加载图片（示例）
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const img = entry.target as HTMLImageElement
    if (entry.isIntersecting) {
      const src = img.dataset.src
      if (src) {
        img.src = src
        observer.unobserve(img)
      }
    }
  }
}, { rootMargin: '200px', threshold: 0.1 })

// 使用：<img data-src="/path.jpg" alt="" />
// 在挂载后：document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))
```

- 建议：提供占位图/骨架屏；错误时回退到默认图；URL稳定且配置合理的 `Cache-Control`，让浏览器缓存命中回滑场景。

### 3.2 虚拟滚动（Virtual Scrolling）

- 概念：只渲染可见区域的项，复用 DOM；不直接管理业务数据的缓存/丢弃。
- Vue 推荐库：`vue-virtual-scroller`（`RecycleScroller`、`DynamicScroller`、`DynamicScrollerItem`）。

```vue
<!-- 固定高度项：RecycleScroller 示例 -->
<RecycleScroller
  :items="items"
  :item-size="160"
  key-field="id"
>
  <template #default="{ item, index }">
    <Card :data="item" />
  </template>
  <!-- 可选：页脚/加载指示器 -->
</RecycleScroller>
```

```vue
<!-- 动态高度项：DynamicScroller 示例 -->
<DynamicScroller :items="items" :min-item-size="100" key-field="id">
  <template #default="{ item, index }">
    <DynamicScrollerItem :item="item" :index="index">
      <Card :data="item" @measured="(h) => item.size = h" />
    </DynamicScrollerItem>
  </template>
</DynamicScroller>
```

- 关键点：
  - 固定高度优先；动态高度需正确测量并回填。
  - 设置 `key-field` 保持稳定复用；根据场景调整缓冲区（如 `:buffer`）。
  - 虚拟滚动负责 DOM 渲染数量；数据是否保留由你的 store 决定。

### 3.3 请求与渲染优化

- 合并/批量请求；滚动事件节流/去抖；分页触底采用 IO 触发而非高频 `scroll`。
- 使用 CSS `contain`, `will-change` 提升渲染性能；避免复杂阴影/滤镜在滚动区域大量出现。
- 提供骨架屏、渐进增强动画；降低首屏白屏与闪烁。

### 3.4 使用第三方 Masonry 库（masonry-layout）

- 说明：`masonry-layout` 使用绝对定位将不等高卡片按“最短列优先”进行堆叠，适合图片瀑布流。配合 `imagesloaded` 在图片加载完成后触发布局，避免高度未知引起的抖动。

```bash
# 安装
npm i masonry-layout imagesloaded
```

```html
<!-- HTML 结构示例 -->
<div class="grid">
  <div class="grid-sizer"></div>
  <div class="grid-item">
    <img data-src="/cover/7368424897091046665.jpeg" alt="" />
  </div>
  <!-- 更多 .grid-item ... -->
  <div class="loading-indicator" id="sentinel"></div>
  
  <!-- 建议配合图片懒加载（data-src + IntersectionObserver） -->
}</div>
```

```css
/* 响应式列宽（示例：两列），Masonry 以 .grid-sizer 作为列宽基准 */
.grid { margin: 0 auto; }
.grid-sizer, .grid-item { width: calc(50% - 8px); }
.grid-item { margin-bottom: 8px; }
@media (min-width: 768px) {
  .grid-sizer, .grid-item { width: calc(25% - 8px); } /* 四列 */
}
```

```ts
// 初始化 Masonry，并在图片加载进度中触发布局
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'

const grid = document.querySelector('.grid') as HTMLElement
const msnry = new Masonry(grid, {
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true,
  gutter: 8
})

// 图片加载后重排，避免高度未知导致的跳动
imagesLoaded(grid).on('progress', () => msnry.layout())

// 触底加载更多并追加到网格（简化示例）
async function fetchNextPage() {
  const { list } = await fetch('/api/items?cursor=...').then(r => r.json())
  const frag = document.createDocumentFragment()
  const appended: Element[] = []
  for (const item of list) {
    const el = document.createElement('div')
    el.className = 'grid-item'
    el.innerHTML = `<img data-src="${item.cover}" alt="" />`
    frag.appendChild(el)
    appended.push(el)
  }
  grid.appendChild(frag)
  msnry.appended(appended)
  // 懒加载图片：进入视口再赋值 src
  appended.forEach(el => {
    const img = el.querySelector('img') as HTMLImageElement
    if (img?.dataset.src) img.src = img.dataset.src!
  })
  imagesLoaded(appended).on('progress', () => msnry.layout())
}
```

```vue
<!-- 在 Vue 组件中使用（简版） -->
<template>
  <div ref="gridRef" class="grid">
    <div class="grid-sizer"></div>
    <div v-for="item in items" :key="item.id" class="grid-item">
      <img :data-src="item.cover" alt="" />
    </div>
    <div ref="sentinelRef" class="loading-indicator" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref } from 'vue'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'

const gridRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)
let msnry: Masonry | null = null

onMounted(async () => {
  await nextTick()
  if (!gridRef.value) return
  msnry = new Masonry(gridRef.value, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    gutter: 8
  })
  imagesLoaded(gridRef.value).on('progress', () => msnry?.layout())
})
</script>
```

- 关键点与注意事项：
  - Masonry 本身不负责数据获取/缓存；只做定位与重排。长列表场景仍需触底预加载、分页与懒加载。
  - 图片高度未知时必须在加载完成后 `layout()`，或为图片容器提供占位比例盒减少回流。
  - 追加数据用 `msnry.appended(elems)` 并触发一次 `layout()`；删除用 `msnry.remove(elems)`。
  - 与虚拟滚动并用时，建议按列分别虚拟化或切换为 `DynamicScroller` + 高度测量，以减少重排开销。

## 4. 后端数据获取与管理策略

### 4.1 预加载（Pre-loading）

- 在距离底部 N 像素（如 `rootMargin: '200px'`）时提前请求下一页，确保滚动不中断：

```ts
const sentinel = ref<HTMLElement | null>(null)
const io = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting && hasMore && !loading) fetchNextPage()
}, { rootMargin: '200px', threshold: 0.1 })

onMounted(() => sentinel.value && io.observe(sentinel.value))
onUnmounted(() => io.disconnect())
```

### 4.2 游标分页（Cursor-based Pagination）

- 使用上一页最后一条记录的唯一标识（ID/时间戳）作为游标，请求下一页；天然适配动态数据与去重。

```ts
// GET /items?cursor=lastId&pageSize=20
async function fetchNextPage(cursor?: string) {
  const res = await fetch(`/api/items?cursor=${cursor ?? ''}&pageSize=20`)
  const { list, nextCursor, hasMore } = await res.json()
  items.push(...list)
  state.cursor = nextCursor
  state.hasMore = hasMore
}
```

### 4.3 历史数据保存策略

- 默认保留历史数据，支持自由回滑与搜索；在移动端或超长会话可采用“窗口化”裁剪（当前索引±N）。
- 分层缓存：近期数据保存在内存；远期数据写入 IndexedDB/LocalStorage，回滑时按需回填。
- 估算内存：卡片体积×条数×图像缓存策略，设置安全上限与告警（如 50–200 条依据卡片体积）。

### 4.4 最新数据获取（顶部插入）

- 非实时列表：下拉刷新获取最新数据，插入列表顶部。
- 实时列表：WebSocket/轮询/长轮询，消息到达时插入顶部并去重。

```ts
// WebSocket 示例（简化）
const ws = new WebSocket('wss://example.com/stream')
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (!seen.has(msg.id)) {
    items.unshift(msg)
    seen.add(msg.id)
  }
}
```

## 5. 协同策略：虚拟滚动 × 图片懒加载

- 职责边界：虚拟滚动减少渲染的 DOM；懒加载控制图片何时加载。两者互补，建议同时启用。
- 回滑行为：如果数据仍在窗口/缓存中，图片多半命中浏览器缓存而不重新下载；若数据被裁剪，需要重新请求数据与图片（通常仍可受 HTTP 缓存保护）。
- 建议：
  - 保持图片 URL 稳定，配置 `Cache-Control`。
  - 动态高度时在图片加载前提供占位高度；加载后回填真实高度并通知虚拟滚动。

## 6. 工程化与监控

- 性能指标：FPS、长任务、内存占用、图片命中率、渲染耗时（Perf 面板）。
- 观测与埋点：触底次数、分页大小、失败率、重试次数、平均首屏时间。
- 容错与重试：指数退避、离线提示、降级到“点击加载更多”。
- 无障碍与 SEO：为图片提供 `alt`；SSR/预渲染页面使用占位与渐进增强；避免无限滚动阻碍到达页尾内容。
