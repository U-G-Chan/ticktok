
/**
 * 文件上传函数
 * @param file 要上传的文件
 * @param type 文件类型，用于确定上传路径
 * @returns 上传后的文件URL
 */
export const uploadFile = async (file: File, _: 'photo' | 'video'): Promise<string> => {
  try {
    // 实际环境中这里会使用FormData上传文件
    // 这里我们模拟上传成功，返回一个模拟的URL
    
    // 创建一个随机ID作为文件名
    const fileId = Math.random().toString(36).substring(2, 15);
    const fileName = file.name;
    // const fileExt = fileName.split('.').pop();
    
    // 模拟上传路径
    const uploadPath = `/media/${fileId}/${fileName}`;
    
    // 在实际环境中，这里会发送文件到服务器
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await axios.post('/api/upload', formData);
    // return response.data.url;
    
    // 模拟上传成功后返回路径
    console.log(`模拟上传文件: ${fileName} 到 ${uploadPath}`);
    
    // 返回模拟的URL
    return uploadPath;
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