import { get } from "@/utils/http";
import { SlideItemData } from "@/types/slide";

export interface SlideQueryParams {
  startIndex: number;
  pageSize: number;
}

interface BackendFeedAuthor {
  id: number;
  name?: string;
  avatar?: string;
}

interface BackendFeedVideo {
  id: number;
  author?: BackendFeedAuthor;
  play_url: string;
  cover_url: string;
  favorite_count?: number;
  comment_count?: number;
  title?: string;
}

interface BackendFeedResponse {
  code?: number;
  msg?: string;
  video_list?: BackendFeedVideo[];
  next_score?: number;
  next_id?: number;
}

let nextScore = 0;
let nextId = 0;
let hasMore = true;
let localSequence = 1;

export const resetSlideFeedCursor = () => {
  nextScore = 0;
  nextId = 0;
  hasMore = true;
  localSequence = 1;
};

const toSlideItem = (
  video: BackendFeedVideo,
  isFirstVideo: boolean,
): SlideItemData => {
  return {
    id: String(localSequence++),
    itemId: String(video.id),
    contentType: "video",
    title: video.title || "",
    author: video.author?.name || "未知作者",
    videoUrl: video.play_url,
    avatar: video.author?.avatar || "/avatar/me-avatar.jpg",
    likes: video.favorite_count || 0,
    comments: video.comment_count || 0,
    stars: 0,
    forwards: 0,
    labels: [],
    cover: video.cover_url,
    isFirstVideo,
  };
};

/**
 * 获取幻灯片数据
 * @param startIndex 起始索引
 * @param pageSize 每页数量
 * @returns 幻灯片项数组
 */
export const getSlideItems = async (
  params: SlideQueryParams,
): Promise<SlideItemData[]> => {
  if (!hasMore && params.startIndex > 0) {
    return [];
  }

  if (params.startIndex === 0) {
    resetSlideFeedCursor();
  }

  const resp = await get<BackendFeedResponse>("/feed", {
    last_score: nextScore,
    last_id: nextId,
  });

  const code = resp?.code ?? 0;
  if (code !== 0) {
    throw new Error(resp?.msg || "获取 Feed 失败");
  }

  const videos = resp?.video_list || [];
  if (videos.length === 0) {
    hasMore = false;
    return [];
  }

  nextScore = resp?.next_score || 0;
  nextId = resp?.next_id || 0;
  hasMore = nextId > 0;

  const isInitialPage = params.startIndex === 0;
  return videos.map((video, index) =>
    toSlideItem(video, isInitialPage && index === 0),
  );
};
