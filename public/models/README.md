# face-api.js 模型文件

此目录需要放置 face-api.js 所需的人脸检测和特征点检测模型文件。模型下载地址：https://github.com/justadudewhohacks/face-api.js-models

## 必需的模型文件

请确保以下目录和文件存在：

### 1. Tiny Face Detector 模型

目录路径：`/public/models/tiny_face_detector/`

文件：
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`

### 2. Face Landmark 68 模型

目录路径：`/public/models/face_landmark_68/`

文件：
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`

## 下载方法

1. 访问 [face-api.js 模型库](https://github.com/justadudewhohacks/face-api.js-models)
2. 下载 tiny_face_detector 和 face_landmark_68 目录中的文件
3. 将文件放入对应的目录中

或者使用以下命令直接下载到相应目录：

```bash
# 下载 Tiny Face Detector 模型文件
curl -o public/models/tiny_face_detector/tiny_face_detector_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-weights_manifest.json
curl -o public/models/tiny_face_detector/tiny_face_detector_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-shard1

# 下载 Face Landmark 68 模型文件
curl -o public/models/face_landmark_68/face_landmark_68_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-weights_manifest.json
curl -o public/models/face_landmark_68/face_landmark_68_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-shard1
``` 