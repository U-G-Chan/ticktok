<template>
    <div class="camera-tools">
        <!-- @TODO: 动态icon -->
        <div class="tools-group">
            <div class="tool-item" @click="$emit('flip-camera')">
                <div class="tool-icon">
                    <icon-refresh theme="outline" size="30" fill="#ffffff"/>
                </div>         
                <div class="tool-text">翻转</div>
            </div>
            <div class="tool-item" @click="toggleFlash">
                <div class="tool-icon">
                    <icon-flashlamp theme="outline" size="30" fill="#ffffff"/>
                </div>
                <div class="tool-text">闪光灯</div>
            </div>
            <div class="tool-item">
                <div class="tool-icon">
                    <icon-setting-two theme="outline" size="30" fill="#ffffff"/>
                </div>
                <div class="tool-text">设置</div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="tools-group">
            <div class="tool-item">
                <div class="tool-icon">
                    <icon-halo theme="outline" size="30" fill="#ffffff"/>
                </div>
                <div class="tool-text">动图</div>
            </div>
            <div class="tool-item">
                <div class="tool-icon">
                    <icon-stopwatch theme="outline" size="30" fill="#ffffff"/>
                </div>
                <div class="tool-text">倒计时</div>
            </div>
            <div class="tool-item">
                <div class="tool-icon">
                    <icon-magic-wand theme="outline" size="30" fill="#ffffff"/>
                </div>
                <div class="tool-text">美颜</div>
            </div>
            <div class="tool-item">
                <div class="tool-icon more">
                    <icon-down theme="outline" size="30" fill="#ffffff"/>
                </div>
                <div class="tool-text">更多</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'CameraTools',
    emits: ['flip-camera', 'toggle-flash'],
    setup(_, { emit }) {
        const flashEnabled = ref(false)

        const toggleFlash = () => {
            flashEnabled.value = !flashEnabled.value
            emit('toggle-flash', flashEnabled.value)
        }

        return {
            flashEnabled,
            toggleFlash
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
    -webkit-tap-highlight-color: transparent;
    outline: none;
}

.tool-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
}

.tool-icon.more {
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
}


.tool-text {
    font-size: 12px;
    color: #fff;
}
</style> 