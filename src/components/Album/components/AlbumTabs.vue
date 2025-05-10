<template>
    <div class="tabs" ref="tabsRef">
        <div 
            v-for="(tab, idx) in tabs" 
            :key="tab.value"
            class="tab" 
            :class="{ 'active': modelValue === tab.value }" 
            @click="$emit('update:modelValue', tab.value)"
            ref="tabRefs"
        >{{ tab.label }}</div>
        <div
            class="tab-underline"
            :style="underlineStyle"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, onMounted } from 'vue'

export default defineComponent({
    name: 'AlbumTabs',
    props: {
        modelValue: {
            type: String,
            required: true
        }
    },
    emits: ['update:modelValue'],
    setup(props) {
        const tabs = [
            { label: '全部', value: 'all' },
            { label: '视频', value: 'videos' },
            { label: '图片', value: 'photos' }
        ]
        const tabRefs = ref<HTMLElement[]>([])
        const tabsRef = ref<HTMLElement | null>(null)
        const underlineStyle = ref({})

        const updateUnderline = () => {
            nextTick(() => {
                const idx = tabs.findIndex(tab => tab.value === props.modelValue)
                const tabEl = tabRefs.value[idx]
                if (tabEl && tabsRef.value) {
                    const { offsetLeft, offsetWidth } = tabEl
                    underlineStyle.value = {
                        width: offsetWidth + 'px',
                        transform: `translateX(${offsetLeft}px)`
                    }
                }
            })
        }

        watch(() => props.modelValue, updateUnderline)
        onMounted(updateUnderline)

        return {
            tabs,
            tabRefs,
            tabsRef,
            underlineStyle
        }
    }
})
</script>

<style scoped>
.tabs {
    display: flex;
    width: 100%;
    border-bottom: 1.5px solid #eee;
    background: #fff;
    position: relative;
}

.tab {
    flex: 1;
    text-align: center;
    font-size: 16px;
    color: #888;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s;
    letter-spacing: 1px;
    position: relative;
    padding: 12px 0;
}

.tab.active {
    color: #222;
    font-weight: bold;
    background: #fff;
}

.tab-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2.5px;
    background: #222;
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1);
    will-change: transform, width;
}
</style> 