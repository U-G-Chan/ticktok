// 模拟商城商品数据API
import { ref } from 'vue'

// 商品标签数据
const labelOptions = ['满减', '包邮', '特价', '新品', '立减', '品牌', '好店', '立减券', '满200减20', '次日达']

// 品牌标签数据
const brandLabels = ['品牌正品', '好店合集', '官方旗舰', '优选好物', '精选']

// 模拟商品图片URL
const productImages = [
  '/product/product1.jpg',
  '/product/product2.jpg',
  '/product/product3.jpg',
  '/product/product4.jpg',
  '/product/product5.jpg',
  '/product/product6.jpg',
  '/product/product7.jpg',
  '/product/product8.jpg',
  '/product/product9.jpg',
  '/product/product10.jpg'
]

// 生成随机销量 (1k-100k)
const generateSales = () => {
  const num = Math.floor(Math.random() * 99) + 1
  return num > 9 ? `${num}万` : `${num}.${Math.floor(Math.random() * 9)}万`
}

// 生成随机价格 (1-1000)
const generatePrice = () => {
  return (Math.random() * 999 + 1).toFixed(2)
}

// 生成随机折扣价 (原价的0.1-0.9)
const generateDiscountPrice = (originalPrice) => {
  const discount = Math.random() * 0.8 + 0.1
  return (originalPrice * discount).toFixed(2)
}

// 生成随机标签数组
const generateLabels = () => {
  const count = Math.floor(Math.random() * 3)
  const result = []
  for (let i = 0; i < count; i++) {
    const label = labelOptions[Math.floor(Math.random() * labelOptions.length)]
    if (!result.includes(label)) {
      result.push(label)
    }
  }
  return result
}

// 生成随机品牌标签
const generateBrandLabel = () => {
  const showBrandLabel = Math.random() > 0.5
  return showBrandLabel ? brandLabels[Math.floor(Math.random() * brandLabels.length)] : ''
}

// 商品名称前缀
const productPrefixes = [
  '新款', '时尚', '高端', '轻薄', '舒适', '百搭', '精选', '热卖', '复古', '简约',
  'ins风', '高颜值', '超值', '日系', '韩版', '2023新款', '限量版', '独家', '爆款'
]

// 商品类别
const productCategories = [
  '手机', '笔记本电脑', '智能手表', '蓝牙耳机', '平板电脑', 
  'T恤', '连衣裙', '牛仔裤', '夹克', '卫衣', '短裤', '衬衫',
  '零食', '坚果', '饼干', '面包', '水果', '巧克力',
  '护肤品', '面膜', '洗发水', '沐浴露', '化妆品',
  '运动鞋', '休闲鞋', '拖鞋', '高跟鞋', '靴子',
  '背包', '钱包', '太阳镜', '帽子', '手表', '项链'
]

// 品牌名称
const brandNames = [
  '悦臻', '锐步', '星光', '雅致', '品悦', '优优', '臻美', '乐活', '优选', 
  '舒适家', '品质优', '花漾', '简约', '艾米', '千寻', '乐享', '宜家',
  '美丽说', '优衣', '百丽', '贝壳', '咔咔', '七彩', '尚品'
]

// 店铺名称
const shopNames = [
  '旗舰店', '专卖店', '直营店', '品牌店', '优选店', '精品店',
  '家居馆', '时尚坊', '优品汇', '生活馆', '折扣店', '进口店'
]

// 生成随机商品标题
const generateTitle = () => {
  const prefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)]
  const category = productCategories[Math.floor(Math.random() * productCategories.length)]
  const brand = brandNames[Math.floor(Math.random() * brandNames.length)]
  return `${prefix} ${brand}${category}`
}

// 生成随机店铺信息
const generateShopInfo = () => {
  const brand = brandNames[Math.floor(Math.random() * brandNames.length)]
  const shop = shopNames[Math.floor(Math.random() * shopNames.length)]
  const sales = generateSales()
  return {
    name: `${brand}${shop}`,
    sales
  }
}

// 生成商品列表数据
const generateProductList = (count = 50) => {
  const products = []
  for (let i = 0; i < count; i++) {
    const originalPrice = generatePrice()
    const discountPrice = generateDiscountPrice(originalPrice)
    
    products.push({
      id: i + 1,
      image: productImages[Math.floor(Math.random() * productImages.length)],
      title: generateTitle(),
      headLabel: generateBrandLabel(),
      labels: generateLabels(),
      originalPrice,
      price: discountPrice,
      shopInfo: generateShopInfo()
    })
  }
  return products
}

// 模拟商品数据
const productList = ref(generateProductList())

// 分页获取商品数据
export const getMallProducts = (page = 1, pageSize = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const pageProducts = productList.value.slice(start, end)
      
      resolve({
        list: pageProducts,
        total: productList.value.length,
        page,
        pageSize,
        hasMore: end < productList.value.length
      })
    }, 100) // 模拟网络延迟
  })
}

// 导出生成商品列表函数，供脚本使用
export { generateProductList } 