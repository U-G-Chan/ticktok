import { get, post, put, del } from '@/utils/http';

// 博客文章接口
export interface Blog {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  summary?: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  createTime: string;
  updateTime: string;
  tags?: string[];
  category?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// 分页数据接口
export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 文章查询参数接口
export interface BlogQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  tagId?: number;
  authorId?: number;
  sort?: 'latest' | 'popular' | 'recommended';
}

// 评论接口
export interface Comment {
  id: number;
  blogId: number;
  parentId?: number;
  content: string;
  userId: number;
  userName: string;
  userAvatar: string;
  createTime: string;
  likeCount: number;
  replyCount: number;
  replies?: Comment[];
}

/**
 * 获取博客文章列表
 * @param params 查询参数
 * @returns 文章分页数据
 */
export const getBlogs = (params: BlogQueryParams = {}): Promise<PageData<Blog>> => {
  return get<PageData<Blog>>('/blog/articles', params);
};

/**
 * 获取文章详情
 * @param id 文章ID
 * @returns 文章详情
 */
export const getBlogDetail = (id: number): Promise<Blog> => {
  return get<Blog>(`/blog/articles/${id}`);
};

/**
 * 创建文章
 * @param blog 文章信息
 * @returns 创建的文章
 */
export const createBlog = (blog: Omit<Blog, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'createTime' | 'updateTime' | 'viewCount' | 'likeCount' | 'commentCount'>): Promise<Blog> => {
  return post<Blog>('/blog/articles', blog);
};

/**
 * 更新文章
 * @param id 文章ID
 * @param blog 文章信息
 * @returns 更新后的文章
 */
export const updateBlog = (id: number, blog: Partial<Blog>): Promise<Blog> => {
  return put<Blog>(`/blog/articles/${id}`, blog);
};

/**
 * 删除文章
 * @param id 文章ID
 * @returns 操作结果
 */
export const deleteBlog = (id: number): Promise<void> => {
  return del<void>(`/blog/articles/${id}`);
};

/**
 * 获取文章评论
 * @param blogId 文章ID
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 评论分页数据
 */
export const getComments = (blogId: number, page: number = 1, pageSize: number = 10): Promise<PageData<Comment>> => {
  return get<PageData<Comment>>(`/blog/articles/${blogId}/comments`, { page, pageSize });
};

/**
 * 发表评论
 * @param blogId 文章ID
 * @param content 评论内容
 * @param parentId 父评论ID（可选，用于回复）
 * @returns 发表的评论
 */
export const createComment = (blogId: number, content: string, parentId?: number): Promise<Comment> => {
  return post<Comment>(`/blog/articles/${blogId}/comments`, { content, parentId });
};