import { SlideItemData } from '../types/slide'

// 动态加载 public/media/data.json 数据
export const getSlideItems = async (startIndex: number, pageSize: number): Promise<SlideItemData[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 动态加载数据
  const response = await fetch('/media/data.json')
  const allData: SlideItemData[] = await response.json()
  return allData.slice(startIndex, startIndex + pageSize)
} 