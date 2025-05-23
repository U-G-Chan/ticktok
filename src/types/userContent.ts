// 用户内容类型定义

// 列表类型枚举
export type ListType = 'works' | 'recommend' | 'collection' | 'likes';

// 作品类型枚举
export type WorkType = 'draft' | 'published' | 'private';

// 内容项基础接口
export interface ContentItem {
  itemId: string;
  listType: ListType;
  thumbnail: string;
  likes: number;
  other?: {
    workType?: WorkType;
    title?: string;
    description?: string;
    publishTime?: string;
    duration?: number;
    [key: string]: any;
  };
}

// 创建内容项参数接口
export interface CreateContentParams {
  userId: string;
  listType: ListType;
  thumbnail: string;
  likes: number;
  itemId: string;
  title?: string;
  description?: string;
  workType?: WorkType;
  duration?: number;
  tags?: string[];
  isPublic?: boolean;
  other?: {
    [key: string]: any;
  };
}

// 更新内容项参数接口
export interface UpdateContentParams {
  itemId: string;
  userId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  workType?: WorkType;
  isPublic?: boolean;
  tags?: string[];
  other?: {
    [key: string]: any;
  };
}

// 列表查询参数
export interface ContentListParams {
  userId: string;
  listType: ListType;
  page?: number;
  pageSize?: number;
}

// 列表响应结果
export interface ContentListResult {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// API响应包装器
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
} 