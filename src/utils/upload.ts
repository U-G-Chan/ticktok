import http from './http';

/**
 * 文件上传函数
 * @param file 要上传的文件
 * @param type 文件类型，用于确定上传路径
 * @returns 上传后的文件URL
 */
export const uploadFile = async (file: File, type: 'photo' | 'video'): Promise<string> => {
  try {
    console.log('开始上传文件:', { fileName: file.name, fileSize: file.size, type });
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    console.log('FormData 创建完成，准备发送请求...');
    
    // 设置请求配置，允许发送FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    // 发送文件上传请求
    console.log('发送上传请求到: /upload/media');
    const response = await http.post('/upload/media', formData, config);
    
    console.log('收到服务器响应:', response);
    
    // 现在响应拦截器返回完整的响应数据 { path: "...", success: true }
    // 检查响应是否有效
    if (!response) {
      console.error('服务器响应为空');
      throw new Error('服务器响应为空');
    }
    
    // 检查响应中是否包含 path 属性并且是字符串类型
    if (typeof response === 'object' && response !== null && 'path' in response) {
      const pathValue = (response as any).path;
      if (typeof pathValue === 'string') {
        console.log('文件上传成功，路径:', pathValue);
        return pathValue;
      } else {
        console.error('path 属性不是字符串类型:', typeof pathValue, pathValue);
      }
    }
    
    // 如果响应结构不符合预期，抛出错误
    console.error('响应数据格式错误:', response);
    console.error('响应类型:', typeof response);
    console.error('响应键:', response && typeof response === 'object' ? Object.keys(response) : 'N/A');
    throw new Error('响应数据格式错误，缺少文件路径信息');
    
  } catch (error) {
    console.error('文件上传过程中发生错误:', error);
    
    // 提供更详细的错误信息
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
      throw new Error(`文件上传失败: ${error.message}`);
    } else {
      console.error('未知类型错误:', error);
      throw new Error('文件上传失败: 未知错误');
    }
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
  try {
    const uploadPromises = files.map(file => uploadFile(file, type));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('批量文件上传失败:', error);
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