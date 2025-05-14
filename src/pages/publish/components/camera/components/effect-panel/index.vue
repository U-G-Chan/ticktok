<template>
    <div class="effect-panel" :class="{ 'active': effectPanelStore.isVisible }">
        <div class="panel-header">
            <div class="tab-container">
                <div class="tab-item" :class="{ 'active': effectPanelStore.activeTab === 'filter' }"
                    @click="effectPanelStore.setActiveTab('filter')">
                    滤镜
                </div>
                <div class="tab-item" :class="{ 'active': effectPanelStore.activeTab === 'decoration' }"
                    @click="effectPanelStore.setActiveTab('filter')">
                    装饰
                </div>
                <!-- @TODO: 禁用装饰，后续完善 -->
            </div>
            <div class="panel-close" @click="effectPanelStore.close()">
                <icon-close theme="outline" size="16" fill="#fff"/>
            </div>
        </div>

        <div class="panel-content">
            <!-- 滤镜特效选项 -->
            <div v-if="effectPanelStore.activeTab === 'filter'" class="effect-list">
                <div
                  v-for="item in filterEffects"
                  :key="item.name"
                  class="effect-item"
                  :class="{ 'active': effectPanelStore.currentFilter === item.name }"
                  @click="selectFilter(item.name as FilterType)"
                >
                  <div class="filter-preview" :class="item.previewClass"></div>
                  <div class="effect-name">{{ item.label }}</div>
                </div>
            </div>

            <!-- 装饰特效选项 -->
            <div v-else-if="effectPanelStore.activeTab === 'decoration'" class="effect-list">
                <div
                  v-for="item in decorationEffects"
                  :key="item.name"
                  class="effect-item"
                  :class="{ 'active': effectPanelStore.currentDecoration === item.name }"
                  @click="selectEffect(item.name)"
                >
                  <div class="effect-icon">{{ item.icon }}</div>
                  <div class="effect-name">{{ item.label }}</div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useEffectPanelStore } from '@/store/effectPanel'
import { filterEffectService, type FilterType } from '@/services/filterEffectService'
import { decorationEffectService } from '@/services/decorationEffectService'

export default defineComponent({
    name: 'EffectPanel',
    setup() {
        const effectPanelStore = useEffectPanelStore()

        const decorationEffects = [
            { name: 'none', icon: '🙂', label: '无特效' },
            { name: 'sunglasses', icon: '😎', label: '墨镜' },
            { name: 'cat-ears', icon: '😺', label: '猫耳' },
            { name: 'mustache', icon: '👨', label: '胡子' },
            { name: 'hat', icon: '🎩', label: '帽子' }
        ]

        const filterEffects = [
            { name: 'none', previewClass: 'normal', label: '原图' },
            { name: 'warm', previewClass: 'warm', label: '暖色' },
            { name: 'cool', previewClass: 'cool', label: '冷色' },
            { name: 'grayscale', previewClass: 'grayscale', label: '黑白' },
            { name: 'vintage', previewClass: 'vintage', label: '复古' }
        ]

        const selectEffect = (effect: string) => {
            effectPanelStore.setEffect({ type: 'decoration', name: effect })
            decorationEffectService.setDecoration(effect)
        }

        const selectFilter = (filter: FilterType) => {
            effectPanelStore.setEffect({ type: 'filter', name: filter })
            filterEffectService.setFilter({ type: 'filter', name: filter })
        }

        return {
            effectPanelStore,
            selectEffect,
            selectFilter,
            decorationEffects,
            filterEffects
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