import { get, post, put, del } from '@/utils/http';

// 商品信息接口
export interface Product {
  id: number;
  image: string;
  title: string;
  headLabel?: string;
  labels?: string[];
  originalPrice: string;
  price: string;
  shopInfo: {
    name: string;
    sales: string;
  };
}

// 分页数据接口
export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 商品查询参数接口
export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: 'price' | 'sales' | 'newest';
  order?: 'asc' | 'desc';
}

// 购物车商品接口
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  selected: boolean;
}

//===============================<Mock>=========================================
const productList: Product[] = [];

// 加载mock/mall-data-product.json数据
async function loadProductData() {
  try {
    const response = await fetch('/mock/mall-data-product.json');
    const data = await response.json();
    
    // 如果是单个商品对象，将其加入数组
    if (data && !Array.isArray(data) && data.id) {
      productList.push(data);
    }
    // 如果是数组，直接添加
    else if (Array.isArray(data)) {
      productList.push(...data);
    }
    // 如果有list属性（分页数据格式）
    else if (data && Array.isArray(data.list)) {
      productList.push(...data.list);
    }

    console.log('已加载商品数据:', productList.length, '条');
  } catch (error) {
    console.error('加载商品数据失败:', error);
  }
}

// 立即加载数据
loadProductData();

//===============================</Mock>========================================


/**
 * 获取商城商品列表
 * @param params 查询参数
 * @returns 商品分页数据
 */
export const getProducts = (params: ProductQueryParams = {}): Promise<PageData<Product>> => {
  //===============================<Mock>=========================================
  // 添加数据加载状态检查
  if (productList.length === 0) {
    // 如果数据尚未加载完成，先等待数据加载
    return new Promise((resolve) => {
      const checkData = async () => {
        // 重新尝试加载数据
        if (productList.length === 0) {
          await loadProductData();
        }
        
        // 如果数据已加载或重试加载后有数据
        if (productList.length > 0) {
          const page = params.page || 1;
          const pageSize = params.pageSize || 10;
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          const pageBlogs = productList.slice(start, end);
          
          resolve({
            list: pageBlogs,
            total: productList.length,
            page,
            pageSize,
            hasMore: end < productList.length
          });
        } else {
          // 如果仍然没有数据，设置一个延迟再次检查
          setTimeout(checkData, 300);
        }
      };
      
      // 开始检查数据
      checkData();
    });
  }
  
  // 正常情况：数据已加载
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageBlogs = productList.slice(start, end);
  return Promise.resolve({
    list: pageBlogs,
    total: productList.length,
    page,
    pageSize,
    hasMore: end < productList.length
  });
  //===============================</Mock>=========================================
  // return get<PageData<Product>>('/mall/products', params);
};

/**
 * 获取商品详情
 * @param id 商品ID
 * @returns 商品详情
 */
export const getProductDetail = (id: number): Promise<Product> => {
  return get<Product>(`/mall/products/${id}`);
};

/**
 * 获取购物车列表
 * @returns 购物车商品列表
 */
export const getCartItems = (): Promise<CartItem[]> => {
  return get<CartItem[]>('/mall/cart');
};

/**
 * 添加商品到购物车
 * @param productId 商品ID
 * @param quantity 数量
 * @returns 操作结果
 */
export const addToCart = (productId: number, quantity: number = 1): Promise<CartItem> => {
  return post<CartItem>('/mall/cart', { productId, quantity });
};

/**
 * 更新购物车商品数量
 * @param cartItemId 购物车商品ID
 * @param quantity 数量
 * @returns 操作结果
 */
export const updateCartItemQuantity = (cartItemId: number, quantity: number): Promise<CartItem> => {
  return put<CartItem>(`/mall/cart/${cartItemId}`, { quantity });
};

/**
 * 从购物车中删除商品
 * @param cartItemId 购物车商品ID
 * @returns 操作结果
 */
export const removeFromCart = (cartItemId: number): Promise<void> => {
  return del<void>(`/mall/cart/${cartItemId}`);
};

/**
 * 切换购物车商品选中状态
 * @param cartItemId 购物车商品ID
 * @param selected 是否选中
 * @returns 操作结果
 */
export const toggleCartItemSelected = (cartItemId: number, selected: boolean): Promise<CartItem> => {
  return put<CartItem>(`/mall/cart/${cartItemId}/selected`, { selected });
};