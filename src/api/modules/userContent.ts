import { get, post, put, del } from "@/utils/http";
import { ContentListParams, ContentListResult, ContentItem, CreateContentParams, UpdateContentParams, ApiResponse } from "@/types/userContent";

/**
 * 获取用户内容列表
 * @param params 查询参数
 * @returns 内容列表
 */
export const getUserContentList = async (params: ContentListParams): Promise<ContentListResult> => {
  const response = await get<ApiResponse<ContentListResult>>('/user/content/list', params);
  return response.data;
};

/**
 * 创建内容项
 * @param params 创建参数
 * @returns 创建的内容项
 */
export const createContentItem = async (params: CreateContentParams): Promise<ContentItem> => {
  const response = await post<ApiResponse<ContentItem>>('/user/content/create', params);
  return response.data;
};

/**
 * 更新内容项
 * @param params 更新参数
 * @returns 更新后的内容项
 */
export const updateContentItem = async (params: UpdateContentParams): Promise<ContentItem> => {
  const response = await put<ApiResponse<ContentItem>>('/user/content/update', params);
  return response.data;
};

/**
 * 删除内容项
 * @param itemId 内容项ID
 * @param userId 用户ID
 * @returns 删除结果
 */
export const deleteContentItem = async (itemId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  const response = await del<ApiResponse<{ success: boolean; message: string }>>('/user/content/delete', { itemId, userId });
  return response.data;
};

/**
 * 切换内容项的喜欢状态
 * @param itemId 内容项ID
 * @param userId 用户ID
 * @param isLiked 是否喜欢
 * @returns 更新后的喜欢数
 */
export const toggleContentLike = async (itemId: string, userId: string, isLiked: boolean): Promise<{ likes: number; isLiked: boolean }> => {
  const response = await post<ApiResponse<{ likes: number; isLiked: boolean }>>('/user/content/toggle-like', { itemId, userId, isLiked });
  return response.data;
}; 