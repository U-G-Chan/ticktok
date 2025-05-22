import { generateBlogList } from '../src/api/blog.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function saveBlogPostsToJson() {
  try {
    // 获取所有博客数据，设置较大的pageSize来获取所有数据
    const result = await generateBlogList();
    
    // 将数据转换为JSON格式，使用缩进以便于阅读
    const jsonData = JSON.stringify(result, null, 2);
    
    // 保存到文件
    const outputPath = path.join(__dirname, '..', 'public', 'blog-posts.json');
    fs.writeFileSync(outputPath, jsonData, 'utf8');
    
    console.log(`博客数据已成功保存到: ${outputPath}`);
    console.log(`共获取 ${result.list.length} 条博客数据`);
  } catch (error) {
    console.error('保存博客数据时出错:', error);
  }
}


saveBlogPostsToJson();