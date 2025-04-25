import { SlideItemData } from '../types/slide'

// 模拟后端数据
const mockData: SlideItemData[] = [
  {
    id: '1',
    contentType: 'video',
    title: '汤姆和杰瑞的日常',
    author: '大漂亮',
    videoUrl: '/src/assets/data/video-demo.mp4',
    avatar: '/src/assets/images/avatar.jpg',
    likes: 347,
    comments: 89,
    stars: 1523,
    forwards: 19000,
    labels: ['猫和老鼠', '汤姆和杰瑞', '童年动画', '我在抖音看动画', '我的汤姆猫短片动画']
  },
  {
    id: '2',
    contentType: 'picture',
    title: '图片内容 1'
  },
  {
    id: '3',
    contentType: 'video',
    title: '视频内容 2'
  },
  {
    id: '4',
    contentType: 'advertisement',
    title: '广告内容 1'
  },
  {
    id: '5',
    contentType: 'video',
    title: '视频内容 3'
  },
  {
    id: '6',
    contentType: 'picture',
    title: '图片内容 2'
  },
  {
    id: '7',
    contentType: 'video',
    title: '视频内容 4'
  },
  {
    id: '8',
    contentType: 'advertisement',
    title: '广告内容 2'
  },
  {
    id: '9',
    contentType: 'video',
    title: '视频内容 5'
  },
  {
    id: '10',
    contentType: 'picture',
    title: '图片内容 3'
  },
  {
    id: '11',
    contentType: 'video',
    title: '视频内容 6'
  },
  {
    id: '12',
    contentType: 'advertisement',
    title: '广告内容 3'
  },
  {
    id: '13',
    contentType: 'video',
    title: '视频内容 7'
  },
  {
    id: '14',
    contentType: 'picture',
    title: '图片内容 4'
  },
  {
    id: '15',
    contentType: 'video',
    title: '视频内容 8'
  },
  {
    id: '16',
    contentType: 'advertisement',
    title: '广告内容 4'
  },
  {
    id: '17',
    contentType: 'video',
    title: '视频内容 9'
  },
  {
    id: '18',
    contentType: 'picture',
    title: '图片内容 5'
  },
  {
    id: '19',
    contentType: 'video',
    title: '视频内容 10'
  },
  {
    id: '20',
    contentType: 'advertisement',
    title: '广告内容 5'
  },
  {
    id: '21',
    contentType: 'video',
    title: '视频内容 11'
  },
  {
    id: '22',
    contentType: 'picture',
    title: '图片内容 6'
  },
  {
    id: '23',
    contentType: 'video',
    title: '视频内容 12'
  },
  {
    id: '24',
    contentType: 'advertisement',
    title: '广告内容 6'
  },
  {
    id: '25',
    contentType: 'video',
    title: '视频内容 13'
  }
]

// 模拟从后端获取数据
export const getSlideItems = async (startIndex: number, pageSize: number): Promise<SlideItemData[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockData.slice(startIndex, startIndex + pageSize)
} 