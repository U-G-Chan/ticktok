<template>
    <div class="footer" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <div 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab', { active: activeTab === tab.id }]"
            @click="changeTab(tab.id)"
        >
            {{ tab.name }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'PublishFooter',
    props: {
        activeTab: {
            type: String,
            default: 'camera'
        }
    },
    emits: ['change-tab'],
    setup(props, { emit }) {
        const tabs = [
            { id: 'text', name: '文字' },
            { id: 'camera', name: '相机' },
            { id: 'template', name: '模板' },
            { id: 'live', name: '开直播' }
        ]

        // 触摸滑动相关变量
        const touchStartX = ref(0)
        const touchEndX = ref(0)
        const touchThreshold = 50 // 滑动阈值

        const changeTab = (tabId: string) => {
            emit('change-tab', tabId)
        }

        // 处理触摸开始
        const touchStart = (event: TouchEvent) => {
            touchStartX.value = event.touches[0].clientX
        }

        // 处理触摸移动
        const touchMove = (event: TouchEvent) => {
            touchEndX.value = event.touches[0].clientX
        }

        // 处理触摸结束
        const touchEnd = () => {
            const swipeDistance = touchEndX.value - touchStartX.value
            
            if (Math.abs(swipeDistance) > touchThreshold) {
                const currentIndex = tabs.findIndex(tab => tab.id === props.activeTab)
                let newIndex

                if (swipeDistance > 0 && currentIndex > 0) {
                    // 右滑，选择前一个标签
                    newIndex = currentIndex - 1
                } else if (swipeDistance < 0 && currentIndex < tabs.length - 1) {
                    // 左滑，选择后一个标签
                    newIndex = currentIndex + 1
                }

                if (newIndex !== undefined) {
                    changeTab(tabs[newIndex].id)
                }
            }
        }

        return {
            tabs,
            changeTab,
            touchStart,
            touchMove,
            touchEnd
        }
    }
})
</script>

<style scoped>
.footer {
    height: 10vh;
    width: 100%;
    background-color: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}

.tab {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tab.active {
    color: #fff;
    transform: scale(1.1);
    font-weight: bold;
}
</style> 