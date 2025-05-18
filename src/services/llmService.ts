import { LLMModelType, LLMModelConfig, defaultLLMConfig } from '@/config/llmConfig';
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// 聊天消息类型
export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// 流式响应回调函数
export type StreamCallback = (text: string, isComplete: boolean) => void;

export class LLMService {
  private modelType: LLMModelType;
  private config: LLMModelConfig;
  private model: any;

  constructor(modelType: LLMModelType = LLMModelType.GPT) {
    this.modelType = modelType;
    this.config = defaultLLMConfig[modelType];
    this.initModel();
  }

  // 初始化模型
  private initModel() {
    try {
      switch (this.modelType) {
        case LLMModelType.GPT:
          // 检查API密钥是否存在
          if (!this.config.apiKey) {
            console.warn('OpenAI API密钥未设置，使用演示模式');
            // 在演示模式下使用模拟实现
            this.useMockModel();
            return;
          }
          
          this.model = new ChatOpenAI({
            openAIApiKey: this.config.apiKey,
            modelName: this.config.modelVersion,
            maxTokens: this.config.maxTokens,
            temperature: this.config.temperature,
          });
          break;
        case LLMModelType.CLAUDE:
          // 检查API密钥是否存在
          if (!this.config.apiKey) {
            console.warn('Claude API密钥未设置，使用演示模式');
            // 在演示模式下使用模拟实现
            this.useMockModel();
            return;
          }
          
          this.model = new ChatAnthropic({
            anthropicApiKey: this.config.apiKey,
            modelName: this.config.modelVersion,
            maxTokensToSample: this.config.maxTokens,
            temperature: this.config.temperature,
          });
          break;
        case LLMModelType.GEMINI:
          // 检查API密钥是否存在
          if (!this.config.apiKey) {
            console.warn('Gemini API密钥未设置，使用演示模式');
            // 在演示模式下使用模拟实现
            this.useMockModel();
            return;
          }
          
          this.model = new ChatGoogleGenerativeAI({
            apiKey: this.config.apiKey,
            modelName: this.config.modelVersion,
            maxOutputTokens: this.config.maxTokens,
            temperature: this.config.temperature,
          });
          break;
        case LLMModelType.QIANWEN:
          // 使用替代模型，避免报错
          console.warn("千问模型暂不可用，启用演示模式");
          this.useMockModel();
          break;
        case LLMModelType.DEEPSEEK:
          // 使用替代模型，避免报错
          console.warn("DeepSeek模型暂不可用，启用演示模式");
          this.useMockModel();
          break;
        default:
          throw new Error(`不支持的模型类型: ${this.modelType}`);
      }
    } catch (error) {
      console.error('初始化模型失败:', error);
      console.warn('启用演示模式');
      this.useMockModel();
    }
  }
  
  // 使用模拟模型（当API密钥不可用时）
  private useMockModel() {
    // 创建一个简单的模拟实现
    this.model = {
      pipe: () => this.mockPipe(),
      invoke: (messages: any) => this.mockInvoke(messages)
    };
  }
  
  // 模拟管道
  private mockPipe() {
    return {
      stream: (messages: any) => this.mockStream(messages)
    };
  }
  
  // 模拟流式输出
  private async *mockStream(messages: any) {
    // 获取最后一条用户消息
    const lastUserMessage = messages.findLast((msg: any) => msg._getType() === 'human');
    const userContent = lastUserMessage ? lastUserMessage.content : '';
    
    // 生成演示回复
    const demoResponse = `这是演示模式的回复。由于未设置API密钥，我无法连接到${this.config.name}。您的输入是：${userContent}`;
    
    // 模拟流式输出，每次返回一小部分文本
    let sentText = '';
    const words = demoResponse.split(' ');
    
    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100)); // 模拟延迟
      sentText += word + ' ';
      yield sentText.trim();
    }
  }
  
  // 模拟非流式调用
  private async mockInvoke(messages: any) {
    // 获取最后一条用户消息
    const lastUserMessage = messages.findLast((msg: any) => msg._getType() === 'human');
    const userContent = lastUserMessage ? lastUserMessage.content : '';
    
    // 生成演示回复
    const demoResponse = `这是演示模式的回复。由于未设置API密钥，我无法连接到${this.config.name}。您的输入是：${userContent}`;
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { content: demoResponse };
  }

  // 更改模型类型
  public changeModel(modelType: LLMModelType) {
    this.modelType = modelType;
    this.config = defaultLLMConfig[modelType];
    this.initModel();
  }

  // 获取当前模型配置
  public getCurrentConfig(): { type: LLMModelType; config: LLMModelConfig } {
    return {
      type: this.modelType,
      config: this.config
    };
  }

  // 转换消息格式
  private convertMessages(messages: ChatMessage[]) {
    return messages.map(msg => {
      switch (msg.role) {
        case 'system':
          return new SystemMessage(msg.content);
        case 'user':
          return new HumanMessage(msg.content);
        case 'assistant':
          return new AIMessage(msg.content);
        default:
          throw new Error(`不支持的消息类型: ${msg.role}`);
      }
    });
  }

  // 流式聊天
  public async streamChat(messages: ChatMessage[], callback: StreamCallback) {
    try {
      const langchainMessages = this.convertMessages(messages);
      const outputParser = new StringOutputParser();
      
      let fullText = '';
      
      const chain = this.model.pipe(outputParser);
      
      const stream = await chain.stream(langchainMessages);
      
      for await (const chunk of stream) {
        fullText += chunk;
        callback(fullText, false);
      }
      
      callback(fullText, true);
      return fullText;
    } catch (error: any) {
      console.error('LLM流式聊天错误:', error);
      callback(`抱歉，发生了错误：${error.message || '未知错误'}`, true);
      throw error;
    }
  }

  // 非流式聊天
  public async chat(messages: ChatMessage[]) {
    try {
      const langchainMessages = this.convertMessages(messages);
      
      const response = await this.model.invoke(langchainMessages);
      return response.content || response;
    } catch (error: any) {
      console.error('LLM聊天错误:', error);
      throw error;
    }
  }
} 