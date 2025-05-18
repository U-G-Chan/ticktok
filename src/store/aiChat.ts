import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LLMModelType, defaultLLMConfig } from '@/config/llmConfig';
import { LLMService, ChatMessage as LLMChatMessage } from '@/services/llmService';

export const useAIChatStore = defineStore('aiChat', () => {
  // 当前选择的模型类型
  const currentModelType = ref<LLMModelType>(LLMModelType.GPT);
  
  // 是否正在生成回复
  const isGenerating = ref(false);
  
  // 当前的流式输出文本
  const streamingText = ref('');
  
  // 聊天历史
  const chatHistory = ref<LLMChatMessage[]>([
    {
      role: 'system',
      content: '你是一个友好、专业的AI助手，准确回答用户问题。'
    }
  ]);
  
  // LLM服务实例
  const llmService = new LLMService(currentModelType.value);
  
  // 计算属性：所有可用的模型类型
  const availableModels = computed(() => {
    // 只返回标记为可用的模型
    return Object.entries(defaultLLMConfig)
      .filter(([_, config]) => config.available)
      .map(([type]) => ({
        type: type as LLMModelType,
        name: getLLMName(type as LLMModelType)
      }));
  });

  // 获取模型名称
  function getLLMName(type: LLMModelType): string {
    return defaultLLMConfig[type].name;
  }
  
  // 更改模型
  function changeModel(modelType: LLMModelType) {
    // 检查模型是否可用
    if (!defaultLLMConfig[modelType].available) {
      console.warn(`模型 ${modelType} 当前不可用`);
      return;
    }
    
    currentModelType.value = modelType;
    llmService.changeModel(modelType);
  }
  
  // 添加用户消息
  function addUserMessage(content: string) {
    chatHistory.value.push({
      role: 'user',
      content
    });
  }
  
  // 添加助手消息
  function addAssistantMessage(content: string) {
    chatHistory.value.push({
      role: 'assistant',
      content
    });
  }
  
  // 清空聊天历史
  function clearChat() {
    chatHistory.value = [
      {
        role: 'system',
        content: '你是一个友好、专业的AI助手，准确回答用户问题。'
      }
    ];
  }
  
  // 发送消息并获取回复
  async function sendMessage(content: string) {
    if (!content.trim() || isGenerating.value) return;
    
    // 添加用户消息
    addUserMessage(content);
    
    // 设置状态为正在生成
    isGenerating.value = true;
    streamingText.value = '';
    
    try {
      // 流式生成回复
      await llmService.streamChat(chatHistory.value, (text, isComplete) => {
        streamingText.value = text;
        
        if (isComplete) {
          // 生成完成，添加到聊天历史
          addAssistantMessage(text);
          isGenerating.value = false;
          streamingText.value = '';
        }
      });
    } catch (error: any) {
      console.error('AI回复生成错误:', error);
      // 出错时添加错误消息
      addAssistantMessage(`抱歉，出现了错误：${error.message || '未知错误'}`);
      isGenerating.value = false;
      streamingText.value = '';
    }
  }
  
  return {
    currentModelType,
    isGenerating,
    streamingText,
    chatHistory,
    availableModels,
    changeModel,
    sendMessage,
    clearChat
  };
}); 