
# Vite 笔记

一、Vite 是什么
- 新一代前端构建工具：开发阶段基于原生 ESM 提供按需加载与极速 HMR；生产阶段使用 Rollup 打包输出高质量静态资源。
- 目标：更快的冷启动、更稳定的热更新、更轻的配置成本、与现代浏览器能力深度协同。

二、核心原理（Dev 与 Build）
- 开发（Dev Server）：
  - 原生 ESM：浏览器以模块请求为驱动，Vite 按需转换并返回模块。
  - 依赖预构建：使用 esbuild 将第三方依赖预打包为 ESM，减少模块深链与请求开销。
  - HMR：精准到模块级别的热更新，仅更新受影响的模块与其依赖边界。
- 构建（Build）：
  - Rollup 打包：Tree-Shaking、代码分割（动态 import）、静态资源处理、Chunk 命名与长效缓存策略。
  - 产物优化：压缩（terser/esbuild）、Scope Hoisting、预加载与懒加载协同。

三、关键能力与特性
- 极速体验：冷启动快、HMR 稳定、依赖预构建高效。
- 插件体系：Vite 插件 + 兼容大多数 Rollup 插件，便于扩展（如 PWA、legacy、压缩等）。
- 环境变量与模式：.env.[mode]、import.meta.env、envPrefix 过滤与注入。
- 资源处理：
  - 静态资源导入（图片、字体、媒体、Worker、WASM）统一为模块。
  - public 目录静态拷贝（保持原路径与文件名）。
- CSS 能力：PostCSS、CSS Modules、预处理器（Sass/Less/Stylus）、按需提取与代码分割。
- TypeScript：默认用 esbuild 转换 TS；类型检查可用 tsc/vue-tsc 单独执行。
- SSR 与库模式：支持服务端渲染（框架层解决方案）与库打包（build.lib）。

四、常用配置要点（vite.config.ts）
- 基础：root、base（部署子路径）、resolve.alias（路径别名）。
- 开发服务器：server.port、open、proxy（后端代理与跨域处理）。
- 构建：build.outDir、assetsDir、sourcemap、target、cssCodeSplit、rollupOptions（manualChunks 分包策略）。
- 插件：@vitejs/plugin-vue / react、@vitejs/plugin-legacy（兼容老浏览器）、压缩与 PWA 等。
- 环境：envDir、envPrefix、自定义 define 常量。

五、本项目实践（TickTok）
- 脚本命令：
  - dev：Vite 开发服务器
  - build：tsc -b + vite build（先类型检查与产出，再构建产物）
  - preview：vite preview 预览构建产物
  来源：`d:\project\ticktok\package.json`
- 入口文件：
  - `d:\project\ticktok\index.html` 使用 `<script type="module" src="/src/main.ts"></script>` 作为入口（原生 ESM）。
- 配置文件：根据需要在 `d:\project\ticktok\vite.config.ts` 中开启别名、Source Map、分包与插件。

六、调试与 Source Map（上线安全）
- 目的：在浏览器 DevTools 中还原源码与断点调试。
- 常见策略：
  - source-map：完整映射，开发/灰度环境友好，线上注意源码泄露。
  - hidden-source-map：不在产物中暴露 map，结合错误上报平台离线解析。
  - nosources-source-map：只暴露位置信息，不包含源码，兼顾安全。
- 建议：生产环境按需开启并配合监控平台使用；内部环境可完整开启以提升定位效率。

七、性能优化清单
- 依赖预构建：optimizeDeps.include/exclude 精准控制，减少冷启动代价。
- 分包策略：rollupOptions.output.manualChunks 将大依赖拆分（如 vendor、ui、editor 等）。
- 缓存与命名：hash 命名 + immutable 缓存头，优化二次访问。
- 图片与字体：合理使用体积更小的格式（如 webp/avif），并控制 inlining（assetsInlineLimit）。
- 兼容策略：仅在必须时启用 legacy 插件，避免无谓的 polyfill 负担。

八、从 Webpack 迁移到 Vite 的要点（与 Vite 使用相关）
- 入口切换：以 index.html 为入口，移除历史多入口配置；静态资源按 Vite 规则组织（public 与源码内导入）。
- 别名与环境变量：将 webpack alias/DefinePlugin 对应到 resolve.alias 与 define/import.meta.env。
- Loader/Plugin 替换：优先使用 Vite/社区插件；若无等价插件，考虑 Rollup 插件或自定义插件。
- TS 与类型检查：保持 esbuild 转换速度，同时用 tsc/vue-tsc 保证类型安全。

九、常见问题排查
- 路径报错/无法解析：检查 resolve.alias 与 tsconfig 路径映射是否一致。
- HMR 不生效：确认状态边界（如全局单例）、缓存与依赖预构建；删除 node_modules/.vite 重试。
- CJS 依赖兼容：通过 optimizeDeps 或插件进行预构建/转译，必要时锁定版本或手动分包。
- 生产体积偏大：检查动态 import 是否生效、manualChunks 是否合理、是否引入开发调试代码。

十、关键知识点（Q&A）
- 问：Vite 为什么比 Webpack 冷启动快？
  答：开发阶段基于原生 ESM 按需转换，省去打包构建依赖图的过程；同时用 esbuild 预构建第三方依赖，解析更快。
- 问：Vite 的 HMR 原理？
  答：模块级热更新，变更触发依赖图的受影响模块重载，通过 ESM 接口在浏览器端替换模块并保持状态边界。
- 问：Vite 开发与构建路径分别是什么？
  答：开发走 Dev Server（即时转换、无打包）；构建走 Rollup（打包优化、代码分割、生成静态资源）。
- 问：Vite 如何处理第三方依赖？
  答：通过 esbuild 进行依赖预构建，将 CJS/UMD 转为 ESM，减少请求与深链；构建阶段再交给 Rollup。
- 问：如何在 Vite 中启用 Source Map，线上如何做安全防护？
  答：设置 build.sourcemap；线上使用 hidden-source-map 或 nosources-source-map，并在错误上报平台关联解析。
- 问：Vite 与 Rollup 插件的关系？
  答：Vite 有自己的插件系统，同时兼容大多数 Rollup 插件（在构建阶段生效），便于生态复用。
- 问：TypeScript 在 Vite 下如何工作？
  答：开发用 esbuild 高速转译 TS 到 JS；类型检查不在热路径，使用 tsc/vue-tsc 在构建或 CI 阶段进行。
- 问：如何做分包与长效缓存？
  答：使用动态 import 与 rollupOptions.output.manualChunks 控制拆分；产物使用 content hash 与 immutable 缓存策略。
