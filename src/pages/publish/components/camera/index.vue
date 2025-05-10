<template>
    <div class="camera">
        <!-- 相机屏幕 -->
        <camera-screen ref="cameraScreenRef" @image-confirmed="handleImageConfirmed" />
        
        <!-- 相机工具栏 -->
        <camera-tools @flip-camera="handleFlipCamera" @toggle-flash="handleToggleFlash" />
        
        <!-- 操作区域 -->
        <operation-area 
            @capture="handleCapture" 
            @mode-change="handleModeChange" 
            :noCamera="cameraScreenRef?.noCamera" 
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { 
  getCamera, getFilesystem,
  CameraResultType, CameraSource, CameraDirection, Directory
} from '@/utils/web-capacitor-adapter'
import CameraScreen from './components/camera-screen/index.vue'
import CameraTools from './components/camera-tools/index.vue'
import OperationArea from './components/operation-area/index.vue'
import { CaptureEffectType } from './components/camera-screen/captureEffects'

export default defineComponent({
    name: 'CameraComponent',
    components: {
        CameraScreen,
        CameraTools,
        OperationArea
    },
    setup() {
        const cameraScreenRef = ref<InstanceType<typeof CameraScreen> | null>(null)
        const currentMode = ref('photo')
        const cameraDirection = ref(CameraDirection.Rear)
        const flashMode = ref(false)
        const Camera = ref<any>(null)
        const Filesystem = ref<any>(null)
        
        /**
         * 配置当前使用的拍照效果
         * 可选值: 
         * - 'zoom': 缩放效果
         * - 'flash': 闪光效果
         * - 'shutter': 快门效果 
         * - 'scan': 扫描效果
         * - 'pulse': 脉冲效果
         */
        const CAPTURE_EFFECT: CaptureEffectType = 'flash';

        // 初始化API
        onMounted(async () => {
            Camera.value = await getCamera()
            Filesystem.value = await getFilesystem()
            
            // 设置拍照效果
            if (cameraScreenRef.value && cameraScreenRef.value.setCaptureEffectType) {
                cameraScreenRef.value.setCaptureEffectType(CAPTURE_EFFECT)
            }
        })

        // 处理相机翻转
        const handleFlipCamera = () => {
            cameraDirection.value = cameraDirection.value === CameraDirection.Rear 
                ? CameraDirection.Front 
                : CameraDirection.Rear
            
            if (cameraScreenRef.value) {
                cameraScreenRef.value.switchCamera(cameraDirection.value)
            }
        }

        // 处理闪光灯开关
        const handleToggleFlash = () => {
            flashMode.value = !flashMode.value
            
            if (cameraScreenRef.value) {
                cameraScreenRef.value.toggleFlash(flashMode.value)
            }
        }

        // 处理拍摄模式变化
        const handleModeChange = (mode: string) => {
            currentMode.value = mode
        }

        // 处理拍摄
        const handleCapture = async () => {
            try {
                if (!Camera.value) {
                    Camera.value = await getCamera()
                }

                if (currentMode.value === 'photo') {
                    if (cameraScreenRef.value) {
                        // 使用自定义相机实现
                        const imageUrl = await cameraScreenRef.value.captureImage()
                        if (imageUrl) {
                            // 保存图片
                            await handleImageConfirmed(imageUrl)
                        }
                    } else {
                        // 使用Capacitor相机API
                        const image = await Camera.value.getPhoto({
                            quality: 90,
                            allowEditing: false,
                            resultType: CameraResultType.Uri,
                            source: CameraSource.Camera,
                            direction: cameraDirection.value,
                            saveToGallery: true
                        })
                        
                        if (image.webPath) {
                            await handleImageConfirmed(image.webPath)
                        }
                    }
                } else if (currentMode.value === 'video') {
                    // 录制视频的实现需要使用其他Capacitor插件
                    console.log('录制视频功能尚未实现')
                } else if (currentMode.value === 'segment') {
                    // 分段拍摄需要自定义实现
                    console.log('分段拍摄功能尚未实现')
                }
            } catch (error) {
                console.error('拍摄失败:', error)
            }
        }

        // 处理图像确认
        const handleImageConfirmed = async (imageUrl: string) => {
            try {
                // 如果需要存储到设备，可以使用以下代码
                if (Filesystem.value) {
                    const base64Data = imageUrl.split(',')[1]
                    const savedFile = await Filesystem.value.writeFile({
                        path: `photos/${new Date().getTime()}.jpeg`,
                        data: base64Data,
                        directory: Directory.Data
                    })
                    console.log('照片已保存:', savedFile.uri)
                }
            } catch (error) {
                console.error('保存图片失败:', error)
            }
        }

        return {
            cameraScreenRef,
            handleFlipCamera,
            handleToggleFlash,
            handleModeChange,
            handleCapture,
            handleImageConfirmed
        }
    }
})
</script>

<style scoped>
.camera {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style> 