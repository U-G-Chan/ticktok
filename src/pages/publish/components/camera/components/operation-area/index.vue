<template>
    <div class="operation-area">
        <!-- 模式导航 -->
        <mode-nav :activeMode="activeMode" @change-mode="handleModeChange" />
        
        <!-- 底部操作按钮 -->
        <div class="action-buttons">
            <!-- 特效按钮 -->
            <div class="action-button effects">
                <div class="button-icon">
                    <img src="/images/effect-icon.png" alt="特效" class="placeholder-icon" />
                </div>
                <div class="button-text">特效</div>
            </div>
            
            <!-- 拍照按钮 -->
            <div class="capture-button" @click="$emit('capture')">
                <div class="inner-circle"></div>
                <div v-if="noCamera" class="upload-text">选择</div>
            </div>
            
            <!-- 相册按钮 -->
            <div class="action-button album">
                <div class="button-icon">
                    <img src="/images/album-icon.png" alt="相册" class="placeholder-icon" />
                </div>
                <div class="button-text">相册</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ModeNav from './components/mode-nav/index.vue'

export default defineComponent({
    name: 'OperationArea',
    components: {
        ModeNav
    },
    props: {
        noCamera: {
            type: Boolean,
            default: false
        }
    },
    emits: ['capture', 'mode-change'],
    setup(props, { emit }) {
        const activeMode = ref('photo')
        
        const handleModeChange = (mode: string) => {
            activeMode.value = mode
            emit('mode-change', mode)
        }
        
        return {
            activeMode,
            handleModeChange
        }
    }
})
</script>

<style scoped>
.operation-area {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: 30px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.action-buttons {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 30px;
    padding: 0 20px;
}

.action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    -webkit-tap-highlight-color: transparent;
    outline: none;
}

.button-icon {
    width: 50px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
}

.placeholder-icon {
    width: 30px;
    height: 30px;
    opacity: 0.8;
    pointer-events: none;
}

.button-text {
    font-size: 12px;
    color: #fff;
    user-select: none;
    -webkit-user-select: none;
}

.capture-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    -webkit-tap-highlight-color: transparent;
    outline: none;
}

.inner-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #fff;
}

.upload-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: #fff;
    user-select: none;
    -webkit-user-select: none;
}
</style> 