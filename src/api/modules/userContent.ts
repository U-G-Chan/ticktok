import { get } from "@/utils/http";
import { ContentListParams, ContentListResult, ContentItem } from "@/types/userContent";

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