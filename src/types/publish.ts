// 媒体类型
export type MediaType = 'photo' | 'video';

// 媒体项
export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  duration?: number;
  path: string;
}

// 位置信息
export interface Location {
  name: string;
  address?: string;
  longitude?: number;
  latitude?: number;
}

// 发布的消息类型
export interface Message {
  id?: string;
  title: string;
  description: string;
  mediaItems: MediaItem[];
  topics: string[];
  mentions: string[];
  location?: Location;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  isDaily: boolean;
  createdAt?: number;
  updatedAt?: number;
} 