# 大文件传输（视频上传）最佳实践笔记

面向“用户上传视频到平台”的场景，总结了在复杂网络条件下实现高可靠、高效率、可观测的大文件传输方案与落地方法，包括传输异常处理、性能优化、完整性校验、服务端存储与读取策略等。

## 目标与原则
- 高可靠：支持断点续传、去重、幂等，能在异常下安全恢复。
- 高效率：并发分片、带宽自适应、直传对象存储，降低服务端压力。
- 可验证：分片与整文件校验，确保数据完整与一致性。
- 安全合规：鉴权、最小权限、限速限流、内容合规与风控。
- 可观测：全链路指标、日志与告警，定位问题与容量规划。

## 架构与角色
- 客户端（Web/移动端）：切片、并发上传、重试与续传、进度上报。
- 上传网关/应用服务：发放 `uploadId`、记录元数据、校验并合并、触发后置流程。
- 对象存储（S3/OSS/MinIO）：分片直传/合并、ETag 支持、生命周期管理。
- 转码与分发（FFmpeg + HLS/DASH + CDN）：转码生成多码率切片，边缘分发。
- 数据库/缓存（DB + Redis）：保存上传状态、分片完成度、内容元信息。

## 端到端流程概览
1. 初始化上传：客户端请求创建上传任务，服务端返回 `uploadId`、目标桶/路径、分片大小、并发上限、预签名URL（可选）。
2. 分片切割：客户端按固定或自适应分片大小（如 5–16MB）切片，生成分片序号与校验值。
3. 并发上传：并发（如 3–6）上传分片，失败分片重试并支持续传；可直传对象存储以节省网关带宽。
4. 进度与记录：客户端上报进度；服务端/Redis 记录已完成分片与校验。
5. 合并与校验：所有分片成功后触发合并，生成整文件哈希并与客户端校验值比对。
6. 后置流程：入库元数据、触发转码（HLS/DASH）、生成封面、内容审核、CDN 刷新。
7. 可观测：记录时延、失败率、重试次数、带宽利用率等指标。

## 分片上传与断点续传设计
- 分片大小：
  - 浏览器直传：5–10MB 常见；移动端可适当减小以减少超时风险。
  - 自适应：根据 RTT/吞吐/错误率动态调节分片大小与并发度。
- 并发控制：客户端维护并发池（例如 4 个并发），服务端返回建议并发上限以避免拥塞。
- 续传与幂等：
  - `uploadId` + `chunkIndex` 作为幂等键；重复提交同一分片时直接返回成功。
  - 服务端保留“已完成分片集合”，客户端可查询并跳过已完成分片。
- 直传对象存储：服务端发放分片级预签名URL（含范围、时效与权限），客户端直接 PUT；服务端只负责状态记录与最终合并。

## 异常处理与重试策略
- 网络异常（超时/断网/重置）：指数退避（如 200ms×2^n，封顶 10s）、最多重试 3–5 次；支持从最近失败分片恢复。
- 服务端错误（5xx）：区分可重试与不可重试；不可重试返回具体原因（配额、鉴权、格式不支持）。
- 客户端中断（APP 进入后台/关闭）：持久化 `uploadId`、分片进度与已上传分片集合，恢复后继续。
- 分片校验失败：重传该分片；若多次失败，降低并发与分片大小。
- 限速与拥塞控制：服务端/对象存储侧可返回 `429/503`，客户端适度降速并重试。

## 传输效率优化
- 并发与流水线：上传-校验-提交流水线化，减少空转；避免过高并发引起丢包。
- 直传对象存储：减少应用层带宽占用与内拷贝；就近接入/边缘加速。
- HTTP/2/3：利用多路复用与拥塞优化；尽量保持长连接并避免队头阻塞。
- 分片大小自适应：基于实时吞吐与错误率动态调整；高误码率时减小分片。
- 压缩与转码：视频通常已压缩；不做额外压缩，专注稳定上传。
- 断点续传元信息：减少重复数据传输与浪费（跳过已完成分片）。

## 文件完整性校验
- 分片级校验：每个分片携带 `crc32` 或 `md5`；服务端校验后标记通过。
- 整文件校验：客户端与服务端计算 `sha256`（若端上成本过高，可服务端计算并返回校验结果给客户端比对）。
- 对象存储 ETag：利用 S3 Multipart Upload 的 ETag 或自定义清单校验，避免误合并。
- 校验失败处理：
  - 分片失败：重传该分片。
  - 整文件失败：回滚合并结果，重新触发校验或提示用户重试。

## 安全与权限
- 身份鉴权：短期 Token（JWT/OAuth2）绑定 `uploadId` 与用户ID，最小权限原则。
- 预签名URL：只允许特定分片范围的 PUT/POST，设置过期时间与 Content-MD5。
- 防刷与配额：账号/设备/IP 维度限速、限并发与日配额；异常行为告警与封禁。
- 内容合规：上传完成后触发敏感内容检测（图像/音频/文本），决定上线状态。

## 服务端存储与读取
- 对象存储建议：S3/OSS/MinIO，启用生命周期管理与版本控制；分层存储（热/温/冷）。
- 路径与命名：`/{tenant}/{userId}/{date}/{uploadId}/{originalName}`；避免长目录，使用 UUID。
- 元数据表：
  - `video_assets`: `id`, `user_id`, `upload_id`, `object_key`, `status`, `size`, `duration`, `hash`, `mime`, `created_at`。
  - `upload_sessions`: `upload_id`, `user_id`, `chunk_size`, `chunk_count`, `completed_chunks`, `state`, `created_at`, `updated_at`。
- 读取与分发：
  - 点播：FFmpeg 转码为 HLS（`.m3u8` + `ts`/`fmp4` 切片），按需多码率。
  - CDN：启用范围请求与缓存；大文件直接走 CDN，源站限速。
  - 预览与封面：上传后生成多帧封面与 GIF 预览，提升发现与交互体验。

## API 设计建议（REST 示例）
- `POST /uploads/init`
  - 请求：`fileName`, `fileSize`, `mime`
  - 响应：`uploadId`, `chunkSize`, `maxConcurrency`, `presigned?: boolean`, `parts?: [{index, url, expiresAt}]`
- `PUT /uploads/{uploadId}/parts/{index}`（若非直传，走网关）
  - 头信息：`Content-MD5`, `Content-Range`
  - 响应：`ok`, `etag`
- `POST /uploads/{uploadId}/complete`
  - 请求：分片清单与整文件 `sha256`
  - 响应：`assetId`, `objectKey`, `finalEtag`
- `GET /uploads/{uploadId}/status`
  - 响应：`completedParts`, `pendingParts`, `state`
- `DELETE /uploads/{uploadId}`（取消/清理）

## 客户端实现要点（Web/移动）
- 能力检测：选择 File API/Blob.slice/Fetch/XHR；移动端注意前后台切换与系统上传限制。
- 并发管理：基于队列/池的并发上传；失败分片放回队列重试。
- 续传存储：LocalStorage/IndexedDB 持久化 `uploadId` 与完成分片集合。
- 进度反馈：总进度=已完成分片大小/总大小；细粒度到分片级回调。
- 资源节流：在 CPU 高占用或电量低时自动降并发；弱网下减小分片大小。

## 可观测性与告警
- 关键指标：初始化失败率、分片失败率、平均重试次数、时延分位数（P50/P95）、带宽利用率、直传比例。
- 日志与追踪：`uploadId` 贯穿全链路；记录异常代码与重试细节；开放查询接口。
- 告警：达到阈值自动告警（如分片失败率>5% 或 P95 时延>10s）。

## 示例：TypeScript 客户端伪代码
```ts
async function uploadVideo(file: File) {
  // 1) 初始化
  const init = await fetch('/uploads/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, fileSize: file.size, mime: file.type })
  }).then(r => r.json());

  const { uploadId, chunkSize = 8 * 1024 * 1024, maxConcurrency = 4, parts } = init;

  // 2) 分片
  const chunks: Blob[] = [];
  for (let offset = 0; offset < file.size; offset += chunkSize) {
    chunks.push(file.slice(offset, Math.min(offset + chunkSize, file.size)));
  }

  // 3) 并发上传
  let inFlight = 0, index = 0; const completed: Set<number> = new Set();
  async function uploadPart(i: number) {
    const chunk = chunks[i];
    const url = parts?.find(p => p.index === i)?.url; // 预签名直传
    for (let retry = 0; retry < 4; retry++) {
      try {
        const res = await fetch(url || `/uploads/${uploadId}/parts/${i}`, { method: 'PUT', body: chunk });
        if (!res.ok) throw new Error(String(res.status));
        completed.add(i);
        break;
      } catch (e) {
        await new Promise(r => setTimeout(r, Math.min(1000 * (2 ** retry), 10000)));
      }
    }
  }

  const queue: Promise<void>[] = [];
  while (index < chunks.length || inFlight > 0) {
    while (inFlight < maxConcurrency && index < chunks.length) {
      inFlight++;
      const current = uploadPart(index++).finally(() => inFlight--);
      queue.push(current);
    }
    await Promise.race(queue);
  }

  // 4) 完成合并
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  const sha256 = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  const complete = await fetch(`/uploads/${uploadId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parts: Array.from(completed).sort(), sha256 })
  }).then(r => r.json());
  return complete;
}
```

## 示例：Node.js（Express）服务端伪代码
```js
// 初始化上传
app.post('/uploads/init', async (req, res) => {
  const { fileName, fileSize, mime } = req.body;
  const uploadId = uuid();
  const chunkSize = 8 * 1024 * 1024; // 8MB
  const maxConcurrency = 4;
  // 可选：为每个分片生成预签名URL
  const parts = await genPresignedUrls(uploadId, fileSize, chunkSize);
  await redis.set(`upload:${uploadId}`, JSON.stringify({ fileName, fileSize, mime, chunkSize, completed: [] }));
  res.json({ uploadId, chunkSize, maxConcurrency, parts });
});

// 非直传：网关接收分片
app.put('/uploads/:uploadId/parts/:index', async (req, res) => {
  const { uploadId, index } = req.params;
  const key = `uploads/${uploadId}/parts/${index}`;
  // 将分片写入对象存储或临时磁盘
  await writePartToStorage(key, req);
  await markPartCompleted(uploadId, Number(index));
  res.json({ ok: true });
});

// 完成合并
app.post('/uploads/:uploadId/complete', async (req, res) => {
  const { uploadId } = req.params;
  const { parts, sha256 } = req.body;
  // 校验分片是否齐全
  const ok = await verifyAllParts(uploadId, parts);
  if (!ok) return res.status(400).json({ error: 'parts mismatch' });
  // 合并并计算整文件hash
  const { objectKey, finalHash } = await mergeParts(uploadId);
  if (finalHash !== sha256) return res.status(409).json({ error: 'hash mismatch' });
  // 入库并异步触发转码
  const assetId = await saveAssetMetadata(uploadId, objectKey, finalHash);
  triggerTranscode(assetId);
  res.json({ assetId, objectKey });
});
```

## 常见问题与排查
- 上传卡在 99%：通常是最后分片或合并校验失败；检查服务端合并与哈希比对。
- 弱网频繁失败：降低并发与分片大小，启用更激进的退避策略。
- 直传超时/签名过期：缩短分片上传耗时或延长 URL 有效期；避免生成过多未使用的URL。
- 合并后损坏：检查分片顺序与边界对齐；开启分片级与整文件双重校验。

## 最佳实践清单（Checklist）
- 采用分片上传与断点续传，基于 `uploadId` 幂等。
- 客户端并发上传，直传对象存储，带宽自适应。
- 分片级 `crc32/md5` 与整文件 `sha256` 双重校验。
- 服务端持久化上传状态（Redis/DB），支持查询与恢复。
- 失败重试使用指数退避，区分可重试/不可重试错误。
- 预签名URL最小权限、短时效，启用限速与防刷策略。
- 合并完成后入库元信息，触发转码与内容审核。
- 打通可观测性：埋点、日志、追踪与告警。
- CDN 分发与缓存策略，支持范围请求与稳定播放。

—— 以上方案在 Web、移动端与跨平台（如 Capacitor/React Native/Flutter）场景均可落地，可根据具体业务与基础设施（对象存储、CDN、转码集群）做参数调优与模块裁剪。