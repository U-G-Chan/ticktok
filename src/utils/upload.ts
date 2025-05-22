import http from './http';

/**
 * 文件上传函数
 * @param file 要上传的文件
 * @param type 文件类型，用于确定上传路径
 * @returns 上传后的文件URL
 */
export const uploadFile = async (file: File, type: 'photo' | 'video'): Promise<string> => {
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
    const response = await http.post('/upload/media', formData, config);
    
    // 返回服务器响应的文件路径
    return response.data.path;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw new Error('文件上传失败');
  }
};

/**
 * 上传多个文件
 * @param files 要上传的文件数组
 * @param type 文件类型
 * @returns 上传后的文件URL数组
 */
export const uploadMultipleFiles = async (
  files: File[], 
  type: 'photo' | 'video'
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadFile(file, type));
  return Promise.all(uploadPromises);
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