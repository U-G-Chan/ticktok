<template>
    <div class="effect-panel" :class="{ 'active': effectPanelStore.isVisible }">
        <div class="panel-header">
            <div class="tab-container">
                <div class="tab-item" :class="{ 'active': effectPanelStore.activeTab === 'decoration' }"
                    @click="effectPanelStore.setActiveTab('decoration')">
                    装饰
                </div>
                <div class="tab-item" :class="{ 'active': effectPanelStore.activeTab === 'filter' }"
                    @click="effectPanelStore.setActiveTab('filter')">
                    滤镜
                </div>
            </div>
            <div class="panel-close" @click="effectPanelStore.close()">
                <icon-close theme="outline" size="16" fill="#fff"/>
            </div>
        </div>

        <div class="panel-content">
            <!-- 装饰特效选项 -->
            <div v-if="effectPanelStore.activeTab === 'decoration'" class="effect-list">
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentDecoration === 'none' }"
                    @click="selectEffect('none')">
                    <div class="effect-icon">🙂</div>
                    <div class="effect-name">无特效</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentDecoration === 'sunglasses' }"
                    @click="selectEffect('sunglasses')">
                    <div class="effect-icon">😎</div>
                    <div class="effect-name">墨镜</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentDecoration === 'cat-ears' }"
                    @click="selectEffect('cat-ears')">
                    <div class="effect-icon">😺</div>
                    <div class="effect-name">猫耳</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentDecoration === 'mustache' }"
                    @click="selectEffect('mustache')">
                    <div class="effect-icon">👨</div>
                    <div class="effect-name">胡子</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentDecoration === 'hat' }"
                    @click="selectEffect('hat')">
                    <div class="effect-icon">🎩</div>
                    <div class="effect-name">帽子</div>
                </div>
            </div>

            <!-- 滤镜特效选项 -->
            <div v-else-if="effectPanelStore.activeTab === 'filter'" class="effect-list">
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentFilter === 'none' }"
                    @click="selectFilter('none')">
                    <div class="filter-preview normal"></div>
                    <div class="effect-name">原图</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentFilter === 'warm' }"
                    @click="selectFilter('warm')">
                    <div class="filter-preview warm"></div>
                    <div class="effect-name">暖色</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentFilter === 'cool' }"
                    @click="selectFilter('cool')">
                    <div class="filter-preview cool"></div>
                    <div class="effect-name">冷色</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentFilter === 'grayscale' }"
                    @click="selectFilter('grayscale')">
                    <div class="filter-preview grayscale"></div>
                    <div class="effect-name">黑白</div>
                </div>
                <div class="effect-item" :class="{ 'active': effectPanelStore.currentFilter === 'vintage' }"
                    @click="selectFilter('vintage')">
                    <div class="filter-preview vintage"></div>
                    <div class="effect-name">复古</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useEffectPanelStore } from '@/store/effectPanel'
import { faceEffectService } from '@/services/faceEffectService'

export default defineComponent({
    name: 'EffectPanel',
    setup() {
        const effectPanelStore = useEffectPanelStore()

        const selectEffect = (effect: string) => {
            const effectOption = { type: 'decoration' as const, name: effect }
            effectPanelStore.setEffect(effectOption)
            faceEffectService.setEffect(effectOption)
        }

        const selectFilter = (filter: string) => {
            const filterOption = { type: 'filter' as const, name: filter }
            effectPanelStore.setEffect(filterOption)
            faceEffectService.setEffect(filterOption)
        }

        return {
            effectPanelStore,
            selectEffect,
            selectFilter
        }
    }
})
</script>

<style scoped>
.effect-panel {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    bottom: 0;
    width: 90%;
    max-width: 450px;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    z-index: 20;
    transition: transform 0.3s ease-in-out;
    overflow: hidden;
}

.effect-panel.active {
    transform: translateX(-50%) translateY(0%);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 0;
}

.tab-container {
    display: flex;
    gap: 16px;
    margin-left: 10px;
}

.tab-item {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    padding: 10px 5px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
}

.tab-item.active {
    color: #fff;
    border-bottom: 2px solid #fe2c55;
}

.panel-close {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.close-icon {
    color: #fff;
    font-size: 12px;
}

.panel-content {
    padding: 20px;
}

.effect-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.effect-item {
    width: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease;
    padding: 10px;
    border-radius: 12px;
}

.effect-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.effect-item.active {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.effect-icon {
    font-size: 36px;
    margin-bottom: 8px;
}

.effect-name {
    color: #fff;
    font-size: 12px;
    text-align: center;
}

.filter-preview {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-bottom: 8px;
    background-image: url('/images/filter-preview.jpg');
    background-size: cover;
    background-position: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.filter-preview.normal {
    filter: none;
}

.filter-preview.warm {
    filter: sepia(30%) saturate(140%) brightness(110%);
}

.filter-preview.cool {
    filter: saturate(110%) hue-rotate(10deg) brightness(105%);
}

.filter-preview.grayscale {
    filter: grayscale(100%);
}

.filter-preview.vintage {
    filter: sepia(50%) contrast(110%) brightness(90%) saturate(85%);
}
</style> 