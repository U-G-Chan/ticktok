<template>
  <div class="model-selector">
    <div class="model-selector-toggle" @click="toggleDropdown">
      <div class="current-model">
        <img :src="currentModelConfig.icon" alt="模型图标" class="model-icon" />
        <span>{{ currentModelConfig.name }}</span>
      </div>
      <div class="toggle-icon" :class="{ 'is-open': isOpen }">
        <i class="arrow-down">▼</i>
      </div>
    </div>
    
    <div class="model-dropdown" v-if="isOpen">
      <div 
        v-for="model in availableModels" 
        :key="model.type"
        class="model-item"
        :class="{ active: model.type === currentModelType }"
        @click="selectModel(model.type)"
      >
        <img :src="getModelIcon(model.type)" alt="模型图标" class="model-icon" />
        <span>{{ model.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useAIChatStore } from '@/store/aiChat';
import { LLMModelType, defaultLLMConfig } from '@/config/llmConfig';

export default defineComponent({
  name: 'ModelSelector',
  setup() {
    const aiChatStore = useAIChatStore();
    const isOpen = ref(false);
    
    // 获取当前模型类型
    const currentModelType = computed(() => aiChatStore.currentModelType);
    
    // 获取所有可用模型
    const availableModels = computed(() => aiChatStore.availableModels);
    
    // 获取当前模型配置
    const currentModelConfig = computed(() => {
      return defaultLLMConfig[currentModelType.value];
    });
    
    // 切换下拉菜单
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };
    
    // 选择模型
    const selectModel = (modelType: LLMModelType) => {
      aiChatStore.changeModel(modelType);
      isOpen.value = false;
    };
    
    // 获取模型图标
    const getModelIcon = (modelType: LLMModelType) => {
      return defaultLLMConfig[modelType].icon;
    };
    
    // 点击外部关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.model-selector')) {
        isOpen.value = false;
      }
    };
    
    // 组件挂载时添加点击事件监听
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    // 组件卸载时移除点击事件监听
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      isOpen,
      currentModelType,
      availableModels,
      currentModelConfig,
      toggleDropdown,
      selectModel,
      getModelIcon
    };
  }
});
</script>

<style scoped>
.model-selector {
  position: absolute;
  top: 6px;
  right: 15px;
  z-index: 10;
}

.model-selector-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.current-model {
  display: flex;
  align-items: center;
}

.model-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 50%;
}

.toggle-icon {
  margin-left: 10px;
  transition: transform 0.3s ease;
}

.toggle-icon.is-open {
  transform: rotate(180deg);
}

.arrow-down {
  font-size: 10px;
}

.model-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  width: 160px;
  z-index: 11;
  overflow: hidden;
}

.model-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.model-item:hover {
  background-color: #f5f5f5;
}

.model-item.active {
  background-color: #e6f0ff;
  font-weight: 500;
}

.model-item span {
  font-size: 15px;
}

.current-model span {
  font-size: 15px;
}

</style>