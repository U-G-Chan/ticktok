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

/**
 * 获取商城商品列表
 * @param params 查询参数
 * @returns 商品分页数据
 */
export const getProducts = (params: ProductQueryParams = {}): Promise<PageData<Product>> => {
  return get<PageData<Product>>('/mall/products', params);
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