export interface VideoItemData {
  id: string
  title: string
  author: string
  videoUrl: string
  avatar: string
  likes: number
  comments: number
  stars: number
  forwards: number
  labels: string[]
  description?: string
  [key: string]: any
} 