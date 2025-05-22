// 导入生成产品列表函数
import { generateProductList } from '../src/api/mall.js';
import fs from 'fs';
import path from 'path';

// 生成100个商品数据
const products = generateProductList(50);

// 将数据保存到JSON文件
const outputPath = path.resolve('public/mock/mall-data-product.json');

// 确保目录存在
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 写入文件
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');

console.log(`商品数据已成功生成，共 ${products.length} 条记录`);
console.log(`文件已保存至: ${outputPath}`); 