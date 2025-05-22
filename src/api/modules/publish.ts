import axios from 'axios';
import { Message } from '@/types/publish';
import { post } from '@/utils/http';

// 模拟API基础URL
const API_BASE_URL = '/mock/publish';

// 保存草稿
export const saveDraft = async (data: Message): Promise<{ success: boolean; draftId?: string }> => {
  try {
    // 确保只提交路径而非资源本身
    const submissionData = {
      ...data,
      mediaItems: data.mediaItems.map(item => ({
        id: item.id,
        type: item.type,
        path: item.path, // 只提交服务器路径
        url: item.url     // url已经替换为服务器路径
      }))
    };

    // 调用API保存草稿
    const response = await post<{ success: boolean; draftId: string }>('/publish/drafts', submissionData);
    return {
      success: true,
      draftId: response.draftId
    };
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