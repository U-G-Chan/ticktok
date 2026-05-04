Canvas + WebGL 视频流滤镜处理与展示流程（以滤镜为例）

概述
- 目标：使用浏览器的摄像头采集视频流，借助 Canvas 的 WebGL 渲染管线对每帧进行实时滤镜处理，并在界面展示与拍照导出合成图（滤镜层 + 装饰层）。
- 优势：WebGL 在 GPU 上进行并行像素计算，适合高分辨率/高帧率场景，效果丰富且性能更优于 2D Canvas 的逐像素处理。

流程总览
- 捕获：通过 `navigator.mediaDevices.getUserMedia` 获取摄像头视频流并设置到 `<video>`。
- 初始化：创建两个 `<canvas>`（滤镜层、装饰层），为滤镜层获取 WebGL 上下文并初始化着色器、缓冲区与纹理。
- 渲染：每帧将 `<video>` 图像上传到纹理，执行片元着色器完成滤镜效果并绘制到滤镜层 `canvas`。
- 叠加：装饰元素在单独的 `canvas`（可同样使用 WebGL）绘制，与滤镜层平铺对齐。
- 展示：页面将 `<video>` 作为背景参考，前景显示两个 `canvas` 覆盖，用户看到实时特效画面。
- 导出：拍照时创建临时 2D `canvas`，按层叠加绘制滤镜层与装饰层，再 `toDataURL`/`toBlob` 输出图片。

代码骨架（示意）
```ts
// 1) 捕获视频流
const video = document.querySelector('video') as HTMLVideoElement
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } }
})
video.srcObject = stream
await new Promise(res => { video.onloadedmetadata = () => res(null) })

// 2) 初始化滤镜层 WebGL
const filterCanvas = document.querySelector('#filter') as HTMLCanvasElement
const gl = filterCanvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: true })
// 创建着色器、program、buffer、texture ...（见下文细节）

// 3) 每帧渲染：上传视频帧为纹理并绘制
function render() {
  if (gl) {
    gl.viewport(0, 0, filterCanvas.width, filterCanvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // 顶点 + 纹理坐标数据 ...
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
  requestAnimationFrame(render)
}
requestAnimationFrame(render)

// 4) 导出图片：将滤镜层与装饰层合成
function capture() {
  const w = filterCanvas.width, h = filterCanvas.height
  const tmp = document.createElement('canvas')
  tmp.width = w; tmp.height = h
  const ctx = tmp.getContext('2d')!
  const glCtx = filterCanvas.getContext('webgl')
  if (glCtx && glCtx.flush) glCtx.flush() // 确保可读
  ctx.drawImage(filterCanvas, 0, 0, w, h)
  const decorationCanvas = document.querySelector('#decoration') as HTMLCanvasElement
  if (decorationCanvas) ctx.drawImage(decorationCanvas, 0, 0, w, h)
  return tmp.toDataURL('image/jpeg', 0.9)
}
```

片元着色器示例（滤镜）
```glsl
// 顶点着色器（示例）
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}

// 片元着色器：灰度滤镜
precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D u_image;
void main() {
  vec4 color = texture2D(u_image, v_texCoord);
  float g = (color.r + color.g + color.b) / 3.0;
  gl_FragColor = vec4(g, g, g, color.a);
}

// 可切换到不同滤镜：暖色、冷色、复古等（通过重编译片元着色器或设置 uniform）
```

宽高比与纹理坐标
- 视频尺寸与画布尺寸可能不同，需计算等比裁剪或留黑边。
- 做法：在顶点缓冲存储四个顶点与对应纹理坐标（`s,t`），根据 `videoRatio` 与 `canvasRatio` 调整 `s/t` 以保证不变形。

导出与合成
- 为避免 WebGL 画布不可读，创建上下文时启用 `preserveDrawingBuffer: true` 并在导出前调用 `gl.flush()`。
- 在临时 2D 画布中依次 `drawImage(filterCanvas)`、`drawImage(decorationCanvas)`，然后 `toDataURL('image/jpeg', quality)` 或 `toBlob(...)`。

性能优化建议
- 只在滤镜变化时重建着色器与 program，其他帧重用 `buffer/texture`。
- 使用 `LINEAR` 滤波与 `CLAMP_TO_EDGE` 包裹模式；开启 `gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)` 处理 Y 翻转。
- 控制画布分辨率与帧率，移动端避免过高开销；必要时采用 `OffscreenCanvas + Web Worker`（兼容性需评估）。
- 2D Canvas 逐像素处理仅适合低分辨率或低帧率场景。

常见问题与排查
- 画面倒置：未设置 `UNPACK_FLIP_Y_WEBGL` 导致纹理 Y 轴翻转。
- 拉伸/变形：纹理坐标与画布比例未对齐。按比率裁剪 `s/t`。
- 拍照空白：未启用 `preserveDrawingBuffer` 或未 `gl.flush()`。
- 闪光灯控制：基于 `MediaStreamTrack.applyConstraints`，部分设备不支持 `torch` 能力。

与项目实现的对应关系
- 捕获与初始化：`src/pages/publish/components/camera/components/camera-screen/index.vue` 的 `initializeCamera`。
- 滤镜渲染：`src/services/filterEffectService.ts` 与 `src/services/faceEffectService.ts` 负责 WebGL 初始化与片元着色器切换。
- 装饰层：`src/services/decorationEffectService.ts` 单独 WebGL 画布渲染装饰元素。
- 合成导出：`camera-screen/index.vue` 的 `captureImage` 先后叠加滤镜层与装饰层再导出。

扩展方向
- 新滤镜：添加片元着色器分支（如电影胶片/胶片颗粒/反色等），或通过 uniform 传参调节强度。
- 人脸特效：结合人脸关键点（如 MediaPipe FaceMesh），在装饰层进行定位与变换。
- 录制视频：使用 `MediaRecorder` 录制合成后的 `canvas` 流（需将合成过程实时绘制到单一 `canvas`）。