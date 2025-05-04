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
            <div class="capture-button" @click="handleCapture">
                <div class="inner-circle"></div>
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
    setup() {
        const activeMode = ref('photo')
        
        const handleModeChange = (mode: string) => {
            activeMode.value = mode
        }
        
        const handleCapture = () => {
            // 根据当前模式执行不同的拍摄操作
            switch (activeMode.value) {
                case 'segment':
                    console.log('执行分段拍摄')
                    break
                case 'photo':
                    console.log('拍照')
                    break
                case 'video':
                    console.log('录制视频')
                    break
            }
        }
        
        return {
            activeMode,
            handleModeChange,
            handleCapture
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
}

.button-icon {
    width: 50px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder-icon {
    width: 30px;
    height: 30px;
    opacity: 0.8;
}

.button-text {
    font-size: 12px;
    color: #fff;
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
}

.inner-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #fff;
}
</style> 