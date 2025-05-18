// LLM模型类型
export enum LLMModelType {
  GPT = 'gpt',
  CLAUDE = 'claude',
  GEMINI = 'gemini',
  // 暂时保留但不使用
  QIANWEN = 'qianwen',
  DEEPSEEK = 'deepseek'
}

// 模型配置接口
export interface LLMModelConfig {
  name: string;         // 模型名称
  apiKey: string;       // API密钥
  baseUrl: string;      // API基础URL
  modelVersion: string; // 模型版本
  maxTokens: number;    // 最大token数
  temperature: number;  // 温度参数
  icon: string;         // 图标
  available: boolean;   // 是否可用
}

// 默认模型配置
export const defaultLLMConfig: Record<LLMModelType, LLMModelConfig> = {
  [LLMModelType.GPT]: {
    name: 'OpenAI GPT',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    modelVersion: 'gpt-3.5-turbo',
    maxTokens: 500,
    temperature: 0.7,
    icon: '/images/llm-icon/gpt-icon.png',
    available: true
  },
  [LLMModelType.CLAUDE]: {
    name: 'Anthropic Claude',
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
    baseUrl: 'https://api.anthropic.com/v1',
    modelVersion: 'claude-3-sonnet-20240229',
    maxTokens: 500,
    temperature: 0.7,
    icon: '/images/llm-icon/claude-icon.png',
    available: true
  },
  [LLMModelType.GEMINI]: {
    name: 'Google Gemini',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    modelVersion: 'gemini-pro',
    maxTokens: 500,
    temperature: 0.7,
    icon: '/images/llm-icon/gemini-icon.png',
    available: true
  },
  [LLMModelType.QIANWEN]: {
    name: '阿里千问',
    apiKey: 'sk-ec6393dfd40143d6b3d64b1c66a55c4e',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelVersion: 'qwen-max',
    maxTokens: 500,
    temperature: 0.7,
    icon: '/images/llm-icon/qwen-icon.png',
    available: true  
  },
  [LLMModelType.DEEPSEEK]: {
    name: 'DeepSeek',
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    baseUrl: 'https://api.deepseek.com/v1',
    modelVersion: 'deepseek-chat',
    maxTokens: 500,
    temperature: 0.7,
    icon: '/images/llm-icon/deepseek-icon.png',
    available: true  
  }
}; 