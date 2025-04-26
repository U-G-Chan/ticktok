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
    // labels: ['猫和老鼠', '汤姆和杰瑞']
  },
  {
    id: '2',
    contentType: 'picture',
    title: '美丽风景',
    author: '旅行摄影师',
    avatar: '/src/assets/images/avatar.jpg',
    likes: 2365,
    comments: 152,
    stars: 658,
    forwards: 423,
    labels: ['风景摄影', '自然风光', '旅行日记'],
    album: [
      '/src/assets/images/album1/album1_1.jpg',
      '/src/assets/images/album1/album1_2.jpg',
      '/src/assets/images/album1/album1_3.jpg'
    ]
  },
  {
    id: '3',
    contentType: 'video',
    title: '视频内容 2',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '4',
    contentType: 'advertisement',
    title: '广告内容 1',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '5',
    contentType: 'video',
    title: '视频内容 3',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '6',
    contentType: 'picture',
    title: '城市建筑集',
    author: '城市观察者',
    avatar: '/src/assets/images/avatar.jpg',
    likes: 1897,
    comments: 78,
    stars: 432,
    forwards: 189,
    labels: ['城市建筑', '摄影艺术', '建筑设计'],
    album: [
      '/src/assets/images/album2/album2_1.jpg',
      '/src/assets/images/album2/album2_2.jpg',
      '/src/assets/images/album2/album2_3.jpg',
      '/src/assets/images/album2/album2_4.jpg',
      '/src/assets/images/album2/album2_5.jpg'
    ]
  },
  {
    id: '7',
    contentType: 'video',
    title: '视频内容 4',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '8',
    contentType: 'advertisement',
    title: '广告内容 2',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '9',
    contentType: 'video',
    title: '视频内容 5',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '10',
    contentType: 'picture',
    title: '创意设计',
    author: '设计师小明',
    avatar: '/src/assets/images/avatar.jpg',
    likes: 3421,
    comments: 267,
    stars: 1023,
    forwards: 578,
    labels: ['创意设计', '艺术插画', '灵感分享'],
    album: [
      '/src/assets/images/album3/album3_1.png',
      '/src/assets/images/album3/album3_2.gif'
    ]
  },
  {
    id: '11',
    contentType: 'video',
    title: '视频内容 6',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '12',
    contentType: 'advertisement',
    title: '广告内容 3',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '13',
    contentType: 'video',
    title: '视频内容 7',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '14',
    contentType: 'picture',
    title: '图片内容 4',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '15',
    contentType: 'video',
    title: '视频内容 8',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '16',
    contentType: 'advertisement',
    title: '广告内容 4',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '17',
    contentType: 'video',
    title: '视频内容 9',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '18',
    contentType: 'picture',
    title: '图片内容 5',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '19',
    contentType: 'video',
    title: '视频内容 10',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '20',
    contentType: 'advertisement',
    title: '广告内容 5',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '21',
    contentType: 'video',
    title: '视频内容 11',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '22',
    contentType: 'picture',
    title: '图片内容 6',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '23',
    contentType: 'video',
    title: '视频内容 12',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '24',
    contentType: 'advertisement',
    title: '广告内容 6',
    avatar: '/src/assets/images/avatar.jpg',
  },
  {
    id: '25',
    contentType: 'video',
    title: '视频内容 13',
    avatar: '/src/assets/images/avatar.jpg',
  }
]

// 模拟从后端获取数据
export const getSlideItems = async (startIndex: number, pageSize: number): Promise<SlideItemData[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockData.slice(startIndex, startIndex + pageSize)
} 