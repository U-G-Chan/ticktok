<template>
    <div class="mode-nav">
        <div 
            v-for="mode in modes" 
            :key="mode.id"
            :class="['mode-item', { active: activeMode === mode.id }]"
            @click="changeMode(mode.id)"
        >
            {{ mode.name }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ModeNav',
    props: {
        activeMode: {
            type: String,
            default: 'photo'
        }
    },
    emits: ['change-mode'],
    setup(props, { emit }) {
        const modes = [
            { id: 'segment', name: '分段拍' },
            { id: 'photo', name: '照片' },
            { id: 'video', name: '视频' }
        ]
        
        const changeMode = (modeId: string) => {
            if (modeId !== props.activeMode) {
                emit('change-mode', modeId)
            }
        }
        
        return {
            modes,
            changeMode
        }
    }
})
</script>

<style scoped>
.mode-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 10px;
    width: 100%;
}

.mode-item {
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    user-select: none;
    -webkit-user-select: none;
}

.mode-item.active {
    color: #000;
    background-color: #fff;
    font-weight: bold;
}
</style> 