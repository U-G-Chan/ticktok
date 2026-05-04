# 从 Vue 到 React 的快速入门（含 React Native）

本文面向熟悉 Vue 的开发者，帮助你在短时间内理解 React 的核心心智模型与特性，给出一个经典组件的编写示例与详细解释，并介绍 React Native 是什么、如何从 React 快速上手并在 Windows 上搭建 RN（含 TypeScript 模板）项目。

## React 的核心思想（对比 Vue）
- 组件即函数：以函数组件为主，接收 `props`，返回 JSX。
- JSX 代替模板：UI 通过 JavaScript（JSX）直接描述与组合，没有指令语言（`v-if/v-for`），用原生 JS 表达（`if/?:/&&/map`）。
- 单向数据流：数据自上而下传递；子组件通过回调通知父组件更新，没有隐式双向绑定。
- 状态与副作用：`useState` 管本地状态；`useEffect` 管副作用（订阅、计时器、数据请求、DOM 交互）。
- 组合优先：通过 props/children 组合组件；逻辑复用用“自定义 Hook”。
- 性能心智：适度使用 `React.memo`、`useMemo`、`useCallback`，配合懒加载和并发特性（`Suspense`、`useTransition`）。

### 概念映射（Vue → React）
- 模板/指令 → JSX/原生 JS 控制；`v-if/v-for` → `condition && ...`/`array.map(...)`。
- `v-model` → 受控组件（`value` + `onChange`）。
- `computed` → `useMemo`；`watch`/`watchEffect` → `useEffect`（有/无依赖数组）。
- 插槽 → `children` 或 Render Props（函数作为子元素）。
- 全局状态 → Context 或外部状态库（Redux Toolkit、Zustand、Jotai、Recoil）。

## 常用特性与模式
- 状态提升：多个子组件共享数据时，将状态上移至最近公共父组件。
- 受控表单：用本地 `state` 驱动 `<input>`/`<select>`，所有变更通过事件处理更新。
- 派生状态：昂贵运算或缓存通过 `useMemo`；稳定回调通过 `useCallback`。
- Context：在组件树中传递主题、用户、语言等全局数据；复杂场景结合 `useReducer`。
- 异步数据：`useEffect` + 请求库（`fetch`/`axios`）；结合取消/清理避免竞态。
- 性能与并发：代码拆分（懒加载）、列表虚拟化（`react-window`）、`Suspense` 协作数据加载。

## 经典组件示范：搜索框（受控输入 + 防抖 + 列表渲染）

下例展示一个经典且常见的组件：受控搜索框，输入后防抖请求并渲染结果列表。包含输入状态管理、异步副作用、列表 key 与项选择回调。

```tsx
// SearchBar.tsx
import React, { useState, useEffect, useCallback } from 'react';

type Item = { id: string; name: string };

interface SearchBarProps {
  query?: string;
  onSelect?: (item: Item) => void;
  fetchItems: (q: string) => Promise<Item[]>;
}

export function SearchBar({ query = '', onSelect, fetchItems }: SearchBarProps) {
  const [text, setText] = useState(query);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    let canceled = false;
    if (!debouncedText.trim()) {
      setItems([]);
      return;
    }
    setLoading(true);
    fetchItems(debouncedText)
      .then(res => { if (!canceled) setItems(res); })
      .finally(() => { if (!canceled) setLoading(false); });
    return () => { canceled = true; };
  }, [debouncedText, fetchItems]);

  const handleSelect = useCallback((item: Item) => {
    onSelect?.(item);
  }, [onSelect]);

  return (
    <div className="search">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="搜索..."
      />
      {loading && <span>加载中…</span>}
      <ul>
        {items.map(item => (
          <li key={item.id} onClick={() => handleSelect(item)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
```

使用示例：

```tsx
// 父组件中使用（示意）
<SearchBar
  fetchItems={q => fetch(`/api/search?q=${encodeURIComponent(q)}`).then(r => r.json())}
  onSelect={item => console.log('选中：', item)}
/>
```

代码要点解释：
- 受控输入：`value` + `onChange` 明确管理输入状态，对应 Vue 的 `v-model` 思想但更显式。
- 防抖请求：`useDebounce` 延迟状态变化，降低高频输入触发的网络请求。
- 副作用与清理：`useEffect` 依据依赖触发请求；return 清理函数防止竞态（组件卸载或依赖变化）。
- 稳定回调：`useCallback` 保持 `onSelect` 引用稳定，降低子树不必要的重渲染。
- 列表渲染与 key：`items.map(...)` 使用稳定业务 ID 作为 `key`，帮助 Diff 与状态保持。

## React Native 是什么？

React Native（RN）是使用 React 心智模型构建原生移动应用的框架：
- 原理：JS 线程与原生（Android/iOS）通过桥或新架构（TurboModule + Fabric）通信，UI 由原生视图渲染。
- 组件与样式：没有 DOM，使用 RN 组件（`View`、`Text`、`Image` 等）与类 CSS 的 `StyleSheet`（Flexbox 布局）。
- 能力：可调用相机、文件、定位等平台能力；性能接近原生，复杂场景可写原生模块。
- 与 Web React 差异：路由需第三方（`@react-navigation/native`），没有浏览器 API，样式与布局语义更接近原生。

### 何时选 Expo vs 原生 CLI？
- Expo：上手快、打包与 OTA 更新便利、跨平台 API 丰富；适合中小型与快速迭代。
- 原生 RN CLI：更接近原生工程，可自由接入原生库与自定义模块；适合复杂业务与深度原生集成。

## 从 React 快速上手并在 Windows 搭建 RN/TS 项目

### 环境准备（Windows）
- 安装 Node.js ≥ 18 与 `npm` 或 `pnpm`。
- 安装 JDK 17（RN 新版本推荐 17）。
- 安装 Android Studio（含 SDK, Platform-tools）；配置环境变量 `ANDROID_HOME` 指向 SDK 路径，并将 `platform-tools`（含 `adb`）加入 `PATH`。
- 创建并启动 Android 虚拟设备（AVD）或使用真机（启用开发者模式与 USB 调试）。
- iOS 仅在 macOS 可构建运行（需要 Xcode）；在 Windows 可主要开发 Android 与共享逻辑。

### 方案一：Expo（最快上手）
```bash
npx create-expo-app my-app
cd my-app
npm run android   # 在已启动的 Android 模拟器或真机上运行
# npm run web / npm run ios（ios 需 macOS）
```
- TypeScript：初始化后运行 `npm i -D typescript @types/react @types/react-native` 并添加 `tsconfig.json`，或选择官方 TS 模板。

### 方案二：React Native CLI（原生工程）
```bash
# 使用社区 CLI 初始化（推荐 TS 模板）
npx @react-native-community/cli@latest init MyApp --template react-native-template-typescript
cd MyApp

# 启动 Metro 与运行 Android（确保 AVD/真机在线）
npx react-native start   # 另开终端保持运行
npx react-native run-android

# iOS（需 macOS）
npx react-native run-ios
```
- 常见问题：
  - 端口占用：Metro 默认 8081，冲突时在启动命令中指定其他端口或释放占用。
  - Gradle/JDK 版本：确保 JDK 17，Gradle 缓存异常可清理 `.gradle` 缓存并重试。
  - ANDROID_HOME/SDK 工具缺失：检查环境变量与 SDK 组件安装（Platform-tools、Build-tools、API Level）。

### 项目结构（CLI 初始化后）
- `android/`：Gradle 与原生 Android 工程。
- `ios/`：Xcode 与原生 iOS 工程（Windows 不可编译）。
- `app.json/metro.config.js`：应用配置与打包器配置。
- `index.js`：入口注册；业务放在 `src/` 更整洁（可手动创建）。

### 从 React 迁移的实践建议
- 保持 Hook 心智：状态管理（`useState/useReducer`）、副作用（`useEffect`）、上下文共享（`Context`）。
- 路由导航：使用 `@react-navigation/native`（Stack/Bottom Tabs），与 Web Router 心智相似但更原生化。
- 样式与布局：统一用 Flexbox；避免绝对定位滥用；常用样式库如 `NativeWind`、`Dripsy`。
- 状态管理：中大型可用 Redux Toolkit 或 Zustand；配合 RTK Query 管理数据请求与缓存。
- 网络与存储：`fetch`/`axios` + `AsyncStorage`；图片与媒体用 `react-native-fast-image` 等。
- 调试与检查：Metro、React DevTools、Flipper（含网络、布局与性能插件）。