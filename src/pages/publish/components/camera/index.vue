<template>
    <div class="camera">
        <!-- 相机屏幕 -->
        <camera-screen />
        
        <!-- 相机工具栏 -->
        <camera-tools />
        
        <!-- 操作区域 -->
        <operation-area />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CameraScreen from './components/camera-screen/index.vue'
import CameraTools from './components/camera-tools/index.vue'
import OperationArea from './components/operation-area/index.vue'

export default defineComponent({
    name: 'CameraComponent',
    components: {
        CameraScreen,
        CameraTools,
        OperationArea
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