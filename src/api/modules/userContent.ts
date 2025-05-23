import { get, post, put, del } from "@/utils/http";
import { ContentListParams, ContentListResult, ContentItem, CreateContentParams, UpdateContentParams } from "@/types/userContent";

/**
 * 获取用户内容列表
 * @param params 查询参数
 * @returns 内容列表
 */
export const getUserContentList = (params: ContentListParams): Promise<ContentListResult> => {
  // 开发环境下使用Mock数据
  if (import.meta.env.DEV) {
    return new Promise<ContentListResult>((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        const mockData = generateMockData(params);
        resolve(mockData);
      }, 300);
    });
  }
  
  return get<ContentListResult>('/user/content/list', params);
};

/**
 * 创建内容项
 * @param params 创建参数
 * @returns 创建的内容项
 */
export const createContentItem = (params: CreateContentParams): Promise<ContentItem> => {
  // 开发环境下使用Mock数据
  if (import.meta.env.DEV) {
    return new Promise<ContentItem>((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        const mockItem = generateMockContentItem(params);
        resolve(mockItem);
      }, 500);
    });
  }
  
  return post<ContentItem>('/user/content/create', params);
};

/**
 * 更新内容项
 * @param params 更新参数
 * @returns 更新后的内容项
 */
export const updateContentItem = (params: UpdateContentParams): Promise<ContentItem> => {
  // 开发环境下使用Mock数据
  if (import.meta.env.DEV) {
    return new Promise<ContentItem>((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        const mockItem = generateMockUpdatedItem(params);
        resolve(mockItem);
      }, 400);
    });
  }
  
  return put<ContentItem>('/user/content/update', params);
};

/**
 * 删除内容项
 * @param itemId 内容项ID
 * @param userId 用户ID
 * @returns 删除结果
 */
export const deleteContentItem = (itemId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  // 开发环境下使用Mock数据
  if (import.meta.env.DEV) {
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        resolve({ success: true, message: '删除成功' });
      }, 300);
    });
  }
  
  return del<{ success: boolean; message: string }>('/user/content/delete', { itemId, userId });
};

/**
 * 切换内容项的喜欢状态
 * @param itemId 内容项ID
 * @param userId 用户ID
 * @param isLiked 是否喜欢
 * @returns 更新后的喜欢数
 */
export const toggleContentLike = (itemId: string, userId: string, isLiked: boolean): Promise<{ likes: number; isLiked: boolean }> => {
  // 开发环境下使用Mock数据
  if (import.meta.env.DEV) {
    return new Promise<{ likes: number; isLiked: boolean }>((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        const likes = Math.floor(Math.random() * 1000000) + (isLiked ? 1 : -1);
        resolve({ likes, isLiked });
      }, 200);
    });
  }
  
  return post<{ likes: number; isLiked: boolean }>('/user/content/toggle-like', { itemId, userId, isLiked });
};

/**
 * 生成Mock创建的内容项
 */
const generateMockContentItem = (params: CreateContentParams): ContentItem => {
  const now = new Date();
  const itemId = `${params.listType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    itemId,
    listType: params.listType,
    thumbnail: params.thumbnail,
    likes: 0, // 新创建的内容项初始点赞数为0
    other: {
      workType: params.workType || 'published',
      title: params.title || '未命名作品',
      description: params.description || '',
      publishTime: now.toISOString(),
      duration: params.duration || 0,
      tags: params.tags || [],
      isPublic: params.isPublic !== false, // 默认为公开
      createTime: now.toISOString(),
      updateTime: now.toISOString(),
      ...params.other
    }
  };
};

/**
 * 生成Mock更新后的内容项
 */
const generateMockUpdatedItem = (params: UpdateContentParams): ContentItem => {
  const now = new Date();
  
  return {
    itemId: params.itemId,
    listType: 'works', // 假设更新的都是作品
    thumbnail: params.thumbnail || `https://picsum.photos/200/300?random=${Date.now()}`,
    likes: Math.floor(Math.random() * 100000),
    other: {
      workType: params.workType || 'published',
      title: params.title || '更新的作品',
      description: params.description || '',
      publishTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      duration: Math.floor(Math.random() * 120) + 15,
      tags: params.tags || [],
      isPublic: params.isPublic !== false,
      updateTime: now.toISOString(),
      ...params.other
    }
  };
};

/**
 * 生成Mock数据
 */
const generateMockData = (params: ContentListParams): ContentListResult => {
  const { listType, page = 1, pageSize = 12 } = params;
  
  // 根据不同的listType生成不同的数据
  let items: ContentItem[] = [];
  
  switch (listType) {
    case 'works':
      items = generateWorksData(page, pageSize);
      break;
    case 'recommend':
      items = generateRecommendData(page, pageSize);
      break;
    case 'collection':
      items = generateCollectionData(page, pageSize);
      break;
    case 'likes':
      items = generateLikesData(page, pageSize);
      break;
  }
  
  return {
    items,
    total: page === 1 ? items.length + 10 : items.length, // 模拟总数
    page,
    pageSize,
    hasMore: page < 3 // 模拟最多3页数据
  };
};

// 生成作品数据
const generateWorksData = (page: number, pageSize: number): ContentItem[] => {
  const items: ContentItem[] = [];
  const start = (page - 1) * pageSize;
  
  for (let i = 0; i < pageSize; i++) {
    const index = start + i;
    const isDraft = index % 5 === 0; // 每5个有一个草稿
    
    items.push({
      itemId: `work_${index}`,
      listType: 'works',
      thumbnail: `https://picsum.photos/200/300?random=${index}`,
      likes: Math.floor(Math.random() * 1000000),
      other: {
        workType: isDraft ? 'draft' : 'published',
        title: `作品 ${index + 1}`,
        publishTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        duration: Math.floor(Math.random() * 60) + 15
      }
    });
  }
  
  return items;
};

// 生成推荐数据
const generateRecommendData = (page: number, pageSize: number): ContentItem[] => {
  const items: ContentItem[] = [];
  const start = (page - 1) * pageSize;
  
  for (let i = 0; i < pageSize; i++) {
    const index = start + i;
    items.push({
      itemId: `recommend_${index}`,
      listType: 'recommend',
      thumbnail: `https://picsum.photos/200/300?random=${index + 1000}`,
      likes: Math.floor(Math.random() * 5000000),
      other: {
        title: `推荐内容 ${index + 1}`,
        description: `这是一个推荐的内容 ${index + 1}`,
        publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }
  
  return items;
};

// 生成收藏数据
const generateCollectionData = (page: number, pageSize: number): ContentItem[] => {
  const items: ContentItem[] = [];
  const start = (page - 1) * pageSize;
  
  for (let i = 0; i < pageSize; i++) {
    const index = start + i;
    items.push({
      itemId: `collection_${index}`,
      listType: 'collection',
      thumbnail: `https://picsum.photos/200/300?random=${index + 2000}`,
      likes: Math.floor(Math.random() * 2000000),
      other: {
        title: `收藏内容 ${index + 1}`,
        collectTime: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }
  
  return items;
};

// 生成喜欢数据
const generateLikesData = (page: number, pageSize: number): ContentItem[] => {
  const items: ContentItem[] = [];
  const start = (page - 1) * pageSize;
  
  for (let i = 0; i < pageSize; i++) {
    const index = start + i;
    items.push({
      itemId: `likes_${index}`,
      listType: 'likes',
      thumbnail: `https://picsum.photos/200/300?random=${index + 3000}`,
      likes: Math.floor(Math.random() * 3000000),
      other: {
        title: `喜欢内容 ${index + 1}`,
        likeTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }
  
  return items;
}; 