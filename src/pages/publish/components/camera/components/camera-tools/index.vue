<template>
    <div class="camera-tools">
        <div class="tools-group">
            <div v-for="(tool, index) in topTools" :key="index" class="tool-item">
                <div class="tool-icon">{{ tool.icon }}</div>
                <div class="tool-text">{{ tool.name }}</div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="tools-group">
            <div v-for="(tool, index) in bottomTools" :key="index" class="tool-item">
                <div class="tool-icon">{{ tool.icon }}</div>
                <div class="tool-text">{{ tool.name }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'CameraTools',
    setup() {
        const topTools = ref([
            { icon: '↺', name: '翻转' },
            { icon: '◎', name: '闪光灯' },
            { icon: '⚙', name: '设置' }
        ])
        
        const bottomTools = ref([
            { icon: '❖', name: '动图' },
            { icon: '⏱', name: '倒计时' },
            { icon: '✿', name: '美颜' },
            { icon: '⋯', name: '更多' }
        ])

        return {
            topTools,
            bottomTools
        }
    }
})
</script>

<style scoped>
.camera-tools {
    position: absolute;
    top: 1%;
    right: 10px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.tools-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.divider {
    width: 25px;
    height: 2px;
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.3);
}

.tool-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.tool-icon {
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.tool-text {
    font-size: 12px;
    color: #fff;
}
</style> 