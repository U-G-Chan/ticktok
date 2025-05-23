import http from './http';

// 上传响应接口
export interface UploadResponse {
  code: number;
  msg: string;
  data: Array<{
    id?: string; // 由后端生成，前端不需要提供
    type: 'photo' | 'video';
    url: string; // 图片在后端的访问路径
  }>;
}

/**
 * 文件上传函数
 * @param file 要上传的文件
 * @param type 文件类型，'photo' 或 'video'
 * @returns 上传后的响应数据
 */
export const uploadFile = async (file: File, type: 'photo' | 'video'): Promise<UploadResponse['data'][0]> => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    // 设置请求配置，允许发送FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    // 发送文件上传请求
    const response = await http.post('/upload/media', formData, config) as UploadResponse;

    // 检查响应格式
    if (response && response.code === 200 && response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error(response?.msg || '上传失败');
    }
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`文件上传失败: ${error.message}`);
    } else {
      throw new Error('文件上传失败: 未知错误');
    }
  }
};

/**
 * 上传多个文件
 * @param files 要上传的文件数组
 * @param type 文件类型
 * @returns 上传后的文件数据数组
 */
export const uploadMultipleFiles = async (
  files: File[], 
  type: 'photo' | 'video'
): Promise<UploadResponse['data']> => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, type));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error('批量文件上传失败');
  }
};

/**
 * 从URL获取File对象
 * @param url 文件URL
 * @returns File对象
 */
export const urlToFile = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = url.split('/').pop() || 'file';
  return new File([blob], filename, { type: blob.type });
}; 