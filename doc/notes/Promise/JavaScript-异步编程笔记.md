JavaScript 异步编程笔记：从回调到 Promise/async/await（以登录-用户信息-用户内容为例）

一、为什么需要异步
- JavaScript 在浏览器中是单线程执行，遇到网络请求、文件读写、定时器等 I/O 操作，如果采用同步方式会阻塞 UI 渲染与交互。
- 异步的核心机制是事件循环（Event Loop）：
  - 调用栈（Call Stack）执行同步代码；
  - 任务队列（Task Queue，含宏任务如 setTimeout、消息事件）与微任务队列（Microtask Queue，如 Promise.then、MutationObserver）；
  - 每次主线程空闲时先清空微任务队列，再取一个宏任务执行，这就是“微任务优先”的原因。

二、早期方案：回调与 AJAX（XMLHttpRequest）
- 回调（Callback）：把函数作为参数传入，在异步完成时通知调用者。
  - 优点：简单直接，兼容性好。
  - 缺点：
    1) 回调地狱（callback hell），层层嵌套不易维护；
    2) 反转控制（inversion of control），错误处理与流程管理分散；
    3) 容易产生“回调多次”“回调未调用”等问题。
- AJAX（XMLHttpRequest）：经典的浏览器异步请求接口。
  - 需要监听 readyState/status，手动处理序列化、超时、取消，代码样板多。

三、Promise：更可靠的异步抽象
- 三态：pending -> fulfilled/rejected，一次决议不可更改；
- then/catch/finally 链式调用，错误沿链传播；
- 组合工具：
  - Promise.all([...])：并发等待所有成功，任何一个失败就拒绝；
  - Promise.allSettled([...])：全部结束后返回每项状态与结果，不会因失败而中断；
  - Promise.race([...])：首个决议（成功或失败）即返回；
  - Promise.any([...])：任意一个成功返回，全部失败才拒绝。

四、Fetch API：基于 Promise 的现代网络请求
- 优点：API 简洁、原生支持流与取消（AbortController）、与 Promise 天然结合；
- 注意：
  - fetch 对 HTTP 4xx/5xx 不会抛异常，需要检查 response.ok；
  - 默认为不带 cookie/凭证，跨域时要设置 credentials 与服务端 CORS；
  - 取消与超时：AbortController + setTimeout；
  - 解析：response.json() / text() / blob() 等。

五、async/await：写异步像写同步
- await 是 Promise 的语法糖，让代码线性、可读性更高；
- 错误处理：try/catch，配合 finally 做收尾；
- 并发策略：
  - 顺序：逐个 await，适合强依赖场景；
  - 并发：先创建 Promise 再 Promise.all 并发等待，显著缩短总耗时；
  - 控制并发：限制同时进行的请求数（如使用 p-limit/自写队列）。

六、业务示例：用户登录 -> 获取用户信息 -> 获取用户内容
- 场景：
  1) 用户提交账号密码，服务端返回 token 与 userId；
  2) 使用 token 并发请求用户信息与用户内容；
  3) 所有数据返回后更新页面。
- 回调/XHR 伪代码示意：
  ```js
  login(data, (err, res) => {
    if (err) return handle(err);
    getUserInfo(res.token, (err2, info) => {
      if (err2) return handle(err2);
      getUserContent(res.token, (err3, content) => {
        if (err3) return handle(err3);
        render(info, content);
      });
    });
  });
  ```
- Promise + fetch 示意：
  ```js
  const check = (r) => { if (!r.ok) throw new Error(r.status); return r; };
  fetch('/api/login', { method: 'POST', body: JSON.stringify(data) })
    .then(check).then(r => r.json())
    .then(({ token }) => Promise.all([
      fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } }).then(check).then(r => r.json()),
      fetch('/api/content', { headers: { Authorization: `Bearer ${token}` } }).then(check).then(r => r.json())
    ]))
    .then(([info, content]) => render(info, content))
    .catch(handle);
  ```
- async/await（并发优化）示意：
  ```js
  const check = (r) => { if (!r.ok) throw new Error(r.status); return r; };
  async function main() {
    const loginRes = await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) }).then(check).then(r => r.json());
    const headers = { Authorization: `Bearer ${loginRes.token}` };
    const userInfoPromise = fetch('/api/user', { headers }).then(check).then(r => r.json());
    const userContentPromise = fetch('/api/content', { headers }).then(check).then(r => r.json());
    const [info, content] = await Promise.all([userInfoPromise, userContentPromise]);
    render(info, content);
  }
  ```

七、常见问题与最佳实践
- 检查 response.ok，构造统一的错误对象，便于上层处理；
- 封装请求：统一 baseURL、headers、错误处理与重试策略；
- 取消/超时：AbortController + setTimeout，避免长时间悬挂；
- 重试与退避：对临时错误（网络抖动、429、5xx）采用指数退避（如 200ms、400ms、800ms）；
- 避免 await 阻塞循环：批量并发用 Promise.all，或控制并发；
- 竞态处理：快速切换页面或多次点击时，采用“最后一次结果生效”策略（记录请求序号/路由版本）；
- 微任务/宏任务：then 微任务优先于 setTimeout 宏任务，影响到 UI 刷新与回调时机；
- 处理未捕获拒绝：window.onunhandledrejection 上报日志。

八、Q&A
1) 事件循环中微任务与宏任务的区别？
   - 微任务（Promise.then）在当前宏任务结束后、渲染前立即清空；宏任务（setTimeout）按队列一次取一个执行。微任务优先导致 then 的回调往往早于定时器。
2) 为什么说 Promise 改善了回调地狱？
   - 通过链式与错误传播统一流程管理，避免层层嵌套；组合函数（all、race 等）让并发控制更清晰。
3) fetch 遇到 404/500 会不会抛错？
   - 不会。需要检查 response.ok，自行抛出错误或分支处理。
4) async/await 如何并发执行多个请求？
   - 先创建 Promise 再使用 Promise.all 并发等待：const [a,b] = await Promise.all([pa, pb])。
5) Promise.all 与 Promise.allSettled 的差异与适用场景？
   - all 任一失败整体失败，适合“必须全部成功”的场景；allSettled 收集全部结果，适合“尽量成功、逐项分析”的场景。
6) race 与 any 的差异？
   - race 返回第一个决议（成功或失败）；any 返回第一个成功，只有全部失败才拒绝。
7) 如何为 fetch 实现取消与超时？
   - 使用 AbortController：const c = new AbortController(); fetch(url, { signal: c.signal }); setTimeout(() => c.abort(), ms)。
8) 如何统一处理接口错误并保留业务错误信息？
   - 封装 check/parse，抛出含 status/message/code 的 Error，或返回 { ok:false, error } 的结构化结果。
9) async/await 中 try/catch 的最佳实践？
   - 按层级进行：业务边界统一捕获，内部函数尽量抛出语义化错误；使用 finally 做资源清理。
10) 避免“await 阻塞循环”的办法？
   - 收集任务为数组并 Promise.all，或使用并发限制器控制最大并行数。
11) XHR 与 fetch 的核心区别？
   - fetch 基于 Promise、API 更简洁，支持流与取消；XHR 事件驱动、样板多、但在某些老环境兼容性更好。
12) 什么是反转控制（Inversion of Control）？
   - 把流程交给外部回调管理，调用方失去对时机与错误处理的掌控；Promise/async 让控制权回到调用方。
13) 如何实现登录 -> 信息 -> 内容的并发优化？
   - 登录成功后同时发起“信息/内容”两个请求，用 Promise.all 并发等待，减少总耗时。
14) 微任务“饿死”宏任务可能带来什么问题？
   - 大量微任务连续执行可能推迟渲染与定时器触发，影响 UI 响应；需在设计上避免过度链式 then。
15) 如何设计重试策略避免雪崩？
   - 指数退避 + 随机抖动（jitter），限定最大重试次数，感知 429/503 等拥塞信号。


十、宏任务与微任务

1) 事件循环的简化流程图（浏览器）
- 初始化同步代码（第一个宏任务：整个 script 执行）。
- 每一轮循环：
  1. 取一个宏任务执行（如 setTimeout 回调、用户点击事件回调、网络回调等）；
  2. 批量清空微任务队列（Promise.then、queueMicrotask、MutationObserver 等）；
  3. 如果到了下一帧渲染时机，执行 requestAnimationFrame 回调；
  4. 浏览器进行一次绘制（渲染）；
  5. 进入下一轮循环。

2) 常见来源清单
- 宏任务（常见）：script 整体执行、setTimeout/setInterval、I/O、message 事件（postMessage/MessageChannel）、用户交互事件（click/input 等）。
- 微任务（常见）：Promise.then/catch/finally、queueMicrotask、MutationObserver（浏览器）。
- Node.js 特别说明：process.nextTick 优先级高于微任务队列，且 Node 的事件循环阶段与浏览器不同（面试知道即可，前端以浏览器模型为主）。

3) 经典输出题与详解
- 题 1：为什么 Promise 回调先于 setTimeout(0)？
```js
console.log('A');
setTimeout(() => console.log('B'), 0); // 宏任务
Promise.resolve().then(() => console.log('C')); // 微任务
console.log('D');
// 输出：A D C B
```
解释：先执行当前宏任务中的同步 A、D；随后清空微任务输出 C；最后才开始下一轮宏任务，输出 B。

- 题 2：多个微任务的顺序和“微任务内再丢微任务”
```js
Promise.resolve().then(() => {
  console.log(1);
  Promise.resolve().then(() => console.log(2));
});
Promise.resolve().then(() => console.log(3));
// 输出：1 3 2
```
解释：第一个 then 入队，执行它打印 1；它创建的新 then（打印 2）会排在队列末尾；随后执行原本就排队的“打印 3”，最后才轮到“打印 2”。

- 题 3：微任务会把渲染推迟吗？
```js
btn.addEventListener('click', () => {
  // 进行一段很长的微任务链
  let i = 0;
  const big = () => {
    if (i++ < 50000) Promise.resolve().then(big); // 连续排微任务
  };
  big();
  // 期望立刻看到按钮变红？
  btn.style.background = 'red';
});
```
解释：点击事件是一个宏任务，结束后浏览器会清空所有微任务。若微任务链很长，清空过程会占用很久，渲染被推迟，你可能“暂时看不到变红”。
解决：把长任务切片，给浏览器喘息机会，例如：
```js
const sleep = () => new Promise(r => setTimeout(r)); // 让出一次宏任务
// 或：const tick = () => Promise.resolve(); // 让出到下一轮微任务，但仍可能延迟渲染
```

- 题 4：requestAnimationFrame 与微任务的关系
```js
requestAnimationFrame(() => console.log('rAF'));
Promise.resolve().then(() => console.log('micro'));
// 常见输出：micro 在 rAF 之前
```
解释：本轮宏任务结束后会先清空微任务（打印 micro），rAF 通常在下一帧渲染前回调，因此常见顺序是 micro -> rAF -> 绘制（不同浏览器实现细节略有差异，但理解这个大致顺序即可）。

- 题 5：0ms 的 setTimeout 不是“立刻执行”
```js
setTimeout(() => console.log('T'), 0);
console.log('S');
// 输出：S 然后 T（T 至少要等到下一轮宏任务）
```
解释：即便是 0ms，回调也只能在下一轮宏任务中被取出执行。

5) 常见“坑位图”与实战建议
- 不要在微任务里形成无界递归链（会阻塞渲染与交互）。
- UI 改动与动画：需要尽快呈现时，避免堆积过多微任务；可以考虑在 rAF 中做 DOM 读/写，或者把大计算切片到多个宏任务。
- 并发请求要注意“最后一次结果生效”的竞态策略，否则早返回的旧请求可能覆盖 UI。
- 定时器不是精确定时器，受到页面可见性、线程负载、最小阈值限制。
- 在 Node.js 里，process.nextTick 比微任务优先级更高，过度使用会“饿死”其他任务（面试常问）。

附：一个把长任务切片的简单模板
```js
async function chunkRun(total, chunk = 1000) {
  for (let i = 0; i < total; i += chunk) {
    // 执行一小块
    for (let j = 0; j < chunk && i + j < total; j++) {
      // ... 处理第 (i + j) 个任务
    }
    // 把控制权还给浏览器，避免卡顿：
    await new Promise(r => setTimeout(r)); // 让出到下一轮宏任务
    // 或者：await Promise.resolve(); // 让出到下一轮微任务（不一定能立刻渲染）
  }
}
```