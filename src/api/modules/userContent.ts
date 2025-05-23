import { get, post, put, del } from "@/utils/http";
import { ContentListParams, ContentListResult, ContentItem, CreateContentParams, UpdateContentParams } from "@/types/userContent";

/**
 * 获取用户内容列表
 * @param params 查询参数
 * @returns 内容列表
 */
export const getUserContentList = (params: ContentListParams): Promise<ContentListResult> => {
  return get<ContentListResult>('/user/content/list', params);
};

/**
 * 创建内容项
 * @param params 创建参数
 * @returns 创建的内容项
 */
export const createContentItem = (params: CreateContentParams): Promise<ContentItem> => {
  return post<ContentItem>('/user/content/create', params);
};

/**
 * 更新内容项
 * @param params 更新参数
 * @returns 更新后的内容项
 */
export const updateContentItem = (params: UpdateContentParams): Promise<ContentItem> => {
  return put<ContentItem>('/user/content/update', params);
};

/**
 * 删除内容项
 * @param itemId 内容项ID
 * @param userId 用户ID
 * @returns 删除结果
 */
export const deleteContentItem = (itemId: string, userId: string): Promise<{ success: boolean; message: string }> => {
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
  return post<{ likes: number; isLiked: boolean }>('/user/content/toggle-like', { itemId, userId, isLiked });
}; 