import { SlideItemData } from '@/types/slide'

export interface SlideQueryParams {
  startIndex: number
  pageSize: number
}


/**
 * 获取幻灯片数据
 * @param startIndex 起始索引
 * @param pageSize 每页数量
 * @returns 幻灯片项数组
 */
export const getSlideItems = async (params: SlideQueryParams): Promise<SlideItemData[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  // 动态加载数据
  const response = await fetch('/media/data.json')
  const allData: SlideItemData[] = await response.json()
  return allData.slice(params.startIndex, params.startIndex + params.pageSize)

  // return get<SlideItemData[]>('/slide/items', params)
} 