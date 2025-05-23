import { post } from '@/utils/http';

// 媒体项接口
export interface MediaItem {
  id?: string; // 后端生成的ID
  type: 'photo' | 'video';
  url: string; // 后端的访问路径
}

// 发布消息接口
export interface PublishMessage {
  title: string;
  description: string;
  mediaItems: MediaItem[];
  topics: string[];
  mentions: string[];
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  isDaily: boolean;
  createdAt?: number;
  updatedAt?: number;
}

// 保存草稿
export const saveDraft = async (data: PublishMessage): Promise<{ success: boolean; draftId?: string }> => {
  try {
    // 确保数据格式正确
    const submissionData: PublishMessage = {
      title: data.title,
      description: data.description,
      mediaItems: data.mediaItems.map(item => ({
        id: item.id || "", // 如果没有ID则为空，后端会生成
        type: item.type,
        url: item.url
      })),
      topics: data.topics || [],
      mentions: data.mentions || [],
      tags: data.tags || [],
      visibility: data.visibility,
      isDaily: data.isDaily,
      createdAt: data.createdAt || Date.now(),
      updatedAt: Date.now()
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
export const publishContent = async (data: PublishMessage): Promise<{ success: boolean; publishId?: string }> => {
  try {
    // 确保数据格式正确
    const submissionData: PublishMessage = {
      title: data.title,
      description: data.description,
      mediaItems: data.mediaItems.map(item => ({
        id: item.id || "",
        type: item.type,
        url: item.url
      })),
      topics: data.topics || [],
      mentions: data.mentions || [],
      tags: data.tags || [],
      visibility: data.visibility,
      isDaily: data.isDaily,
      createdAt: data.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    const response = await post<{ success: boolean; publishId: string }>('/publish/contents', submissionData);
    return { 
      success: true, 
      publishId: response.publishId 
    };
  } catch (error) {
    console.error('发布作品失败:', error);
    return { success: false };
  }
};

// 获取话题列表
export const getTopics = async (): Promise<string[]> => {
  try {
    const response = await post<{ topics: string[] }>('/publish/topics', {});
    return response.topics || [];
  } catch (error) {
    console.error('获取话题失败:', error);
    return ['记录生活', '旅行足迹', '世界那么大我想去', '美食分享', '宠物日常'];
  }
};