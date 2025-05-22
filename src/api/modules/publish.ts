import axios from 'axios';
import { Message } from '@/types/publish';

// 模拟API基础URL
const API_BASE_URL = '/mock/publish';

// 保存草稿
export const saveDraft = async (data: Message): Promise<{ success: boolean; draftId?: string }> => {
  try {
    // 在实际环境中会使用axios发送请求
    // 这里我们模拟将数据写入到public/mock/publish/drafts.json
    const response = await axios.post(`${API_BASE_URL}/drafts`, data);
    return { success: true, draftId: response.data.draftId };
  } catch (error) {
    console.error('保存草稿失败:', error);
    return { success: false };
  }
};

// 发布作品
export const publishContent = async (data: Message): Promise<{ success: boolean; publishId?: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contents`, data);
    return { success: true, publishId: response.data.publishId };
  } catch (error) {
    console.error('发布作品失败:', error);
    return { success: false };
  }
};

// 获取话题列表
export const getTopics = async (): Promise<string[]> => {
  return ['记录生活', '旅行足迹', '世界那么大我想去', '美食分享', '宠物日常'];
  try {
    const response = await axios.get(`${API_BASE_URL}/topics`);
    return response.data.topics || [];
  } catch (error) {
    console.error('获取话题失败:', error);
    return ['记录生活', '旅行足迹', '世界那么大我想去', '美食分享', '宠物日常'];
  }
};