前端状态管理笔记（Vue：Pinia/Vuex，React：Redux）

**核心概念**
- 状态是驱动 UI 的数据来源，包括表单值、列表、加载状态等。
- 单向数据流：事件触发 → 状态更新 → UI 重新渲染。
- 派生状态：由原始状态计算出的值，应使用计算属性/selector，而非重复存储。
- 副作用隔离：网络请求、定时器、WebSocket 等应放在 actions 或服务层，避免和纯状态混用。
- 区分客户端状态与服务器状态：前者是业务/交互数据，后者是远端数据的获取、缓存与失效管理。

---

## Vue 状态管理

### Pinia
**设计方式**
- 现代化的 Vue 官方推荐库，取代 Vuex 的主力选择。
- 无 `mutation` 概念，直接在 `actions` 中修改 `state`；更少样板代码。
- 原生支持 TypeScript 类型推断，`getters` 等价于计算属性。
- 支持 Options API 与 Setup Store，两种写法可选。

**基本使用**
1) 安装与注册（Vue 3）

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

2) 定义与使用 Store（Options 写法）

```ts
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

```ts
// 在组件中
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
counter.increment()
console.log(counter.double)
```

3) Setup Store（组合式写法）

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterSetupStore = defineStore('counter-setup', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})
```

**特点与实践建议**
- 更贴近组合式 API 的心智模型，代码简洁；推荐新项目优先选择。
- 把副作用（HTTP、WebSocket）放在 `actions` 或独立服务层；`getters` 只做纯计算。
- 与路由/组件事件配合良好，模块化拆分清晰（如 `user`、`chat`、`publish`、`slide`）。

> 本项目已使用 Pinia（见 `src/store/user.ts`、`src/store/slide.ts`、`src/store/publish.ts` 等），在 `src/main.ts` 中注册与初始化。

---

### Vuex
**设计方式**
- Vue 生态早期的标准方案，强调严格的“
  action → mutation → state”更新流程与可预测性。
- 支持模块化 `modules`、严格模式与时间旅行调试；但样板代码较多。

**基本使用**
1) 创建与注册 Store

```ts
// store/index.ts
import { createStore } from 'vuex'

export const store = createStore({
  state: { count: 0 },
  getters: {
    double: (state) => state.count * 2,
  },
  mutations: {
    increment(state) { state.count++ },
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => commit('increment'), 500)
    },
  },
})
```

```ts
// main.ts
import { createApp } from 'vue'
import { store } from './store'
createApp(App).use(store).mount('#app')
```

2) 组件中使用

```ts
import { useStore } from 'vuex'

const store = useStore()
store.commit('increment')
store.dispatch('incrementAsync')
console.log(store.getters.double)
```

**特点与实践建议**
- 约束更强、流程更明确；适合对变更审计/时间旅行有硬需求的旧项目。
- 新项目建议优先 Pinia；迁移时可逐步把 `mutations` 逻辑并入 Pinia `actions`。

---

## React 状态管理（Redux / Redux Toolkit）

**设计方式**
- 单一 Store（或按需分片组合），不可变更新，纯函数 Reducer；单向数据流与可预测性。
- Redux Toolkit（RTK）是官方推荐的现代封装：`createSlice`、`configureStore`、基于 Immer 简化不可变更新，减少样板代码。

**基本使用（Redux Toolkit）**
1) 定义切片与 Store

```ts
// store.ts
import { configureStore, createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment(state) { state.value++ },
    set(state, action) { state.value = action.payload },
  },
})

export const { increment, set } = counterSlice.actions

export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

2) 在组件中使用

```tsx
// index.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import { increment } from './store'

function Counter() {
  const value = useSelector((state: any) => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div>
      <p>{value}</p>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  )
}

createRoot(document.getElementById('root')!)
  .render(
    <Provider store={store}>
      <Counter />
    </Provider>
  )
```

**副作用与服务器状态**
- 异步副作用：可用 `redux-thunk`（RTK 默认内置）或 `redux-saga`；在切片外封装请求逻辑更清晰。
- 服务器状态：推荐使用 RTK Query 或 TanStack Query（React Query）管理网络数据的缓存、失效、重试，与业务状态分离。

---

## 选型与最佳实践
- 新 Vue 项目优先 Pinia；旧 Vuex 项目逐步迁移到 Pinia 简化心智与样板。
- React 项目优先使用 Redux Toolkit；复杂网络数据用 RTK Query 或 React Query。
- 模块化拆分 store，保持边界清晰（如用户、内容、聊天、发布、UI 控制）。
- 仅在 actions 更新状态；`getters`/selector 做纯计算，保持可测试性。
- 区分客户端状态与服务器状态；请求层与缓存策略交由服务器状态库管理。
- 持久化策略明确：登录态、草稿等需要持久化；临时 UI 状态不持久化。
- 调试与性能：使用 DevTools；控制订阅范围，避免全局“巨型 store”。

