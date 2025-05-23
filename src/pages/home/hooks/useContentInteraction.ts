import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useSlideStore } from '@/store/slide'
import { createContentItem } from '@/api/modules/userContent'
import { CreateContentParams, ListType } from '@/types/userContent'

// 内容交互状态管理
interface InteractionState {
  isLiked: boolean
  isStarred: boolean
  isLikePop: boolean
  isStarPop: boolean
  loading: boolean
}

export function useContentInteraction() {
  const userStore = useUserStore()
  const slideStore = useSlideStore()
  
  // 交互状态
  const state = ref<InteractionState>({
    isLiked: false,
    isStarred: false,
    isLikePop: false,
    isStarPop: false,
    loading: false
  })

  // 获取当前用户ID
  const currentUserId = computed(() => userStore.userId.toString())

  // 获取当前内容项
  const currentItem = computed(() => slideStore.currentItem)

  // 格式化点赞数显示
  const formatCount = (count: number | undefined) => {
    if (count === undefined || count === null) return '0'
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万'
    }
    return count.toString()
  }

  // 创建ContentItem参数
  const createContentParams = (listType: ListType): CreateContentParams | null => {
    const item = currentItem.value
    if (!item) return null

    return {
      userId: currentUserId.value,
      listType,
      thumbnail: item.cover || '', // 使用data.json中的cover字段
      likes: item.likes || 0, // 添加点赞数
      itemId: item.itemId || item.id, // 添加itemId
      title: item.title || '',
      description: item.title || '',
      other: {
        sourceItemId: item.itemId || item.id, // 原始内容ID
        sourceContentType: item.contentType,
        sourceAuthor: item.author,
        sourceLikes: item.likes,
        sourceComments: item.comments,
        sourceStars: item.stars,
        sourceForwards: item.forwards,
        sourceLabels: item.labels,
        sourceVideoUrl: item.videoUrl,
        sourceAvatar: item.avatar,
        interactionTime: new Date().toISOString()
      }
    }
  }

  // 处理点赞
  const handleLike = async () => {
    if (state.value.loading) return
    
    try {
      state.value.loading = true
      
      // 切换点赞状态
      const newLikedState = !state.value.isLiked
      state.value.isLiked = newLikedState
      
      // 播放点赞动画
      state.value.isLikePop = true
      setTimeout(() => {
        state.value.isLikePop = false
      }, 300)

      // 如果是点赞操作，向后端添加到喜欢列表
      if (newLikedState) {
        const params = createContentParams('likes')
        if (params) {
          await createContentItem(params)
          console.log('已添加到喜欢列表')
        }
      }
      
      // 这里可以调用更新点赞数的API
      // await updateLikeCount(currentItem.value.itemId, newLikedState)
      
    } catch (error) {
      console.error('点赞操作失败:', error)
      // 回滚状态
      state.value.isLiked = !state.value.isLiked
    } finally {
      state.value.loading = false
    }
  }

  // 处理收藏
  const handleStar = async () => {
    if (state.value.loading) return
    
    try {
      state.value.loading = true
      
      // 切换收藏状态
      const newStarredState = !state.value.isStarred
      state.value.isStarred = newStarredState
      
      // 播放收藏动画
      state.value.isStarPop = true
      setTimeout(() => {
        state.value.isStarPop = false
      }, 300)

      // 如果是收藏操作，向后端添加到收藏列表
      if (newStarredState) {
        const params = createContentParams('collection')
        if (params) {
          await createContentItem(params)
          console.log('已添加到收藏列表')
        }
      }
      
      // 这里可以调用更新收藏数的API
      // await updateStarCount(currentItem.value.itemId, newStarredState)
      
    } catch (error) {
      console.error('收藏操作失败:', error)
      // 回滚状态
      state.value.isStarred = !state.value.isStarred
    } finally {
      state.value.loading = false
    }
  }

  // 重置状态（切换内容时调用）
  const resetState = () => {
    state.value.isLiked = false
    state.value.isStarred = false
    state.value.isLikePop = false
    state.value.isStarPop = false
    state.value.loading = false
  }

  // 初始化状态（根据用户历史记录）
  const initializeState = async () => {
    // 这里可以根据用户历史记录初始化点赞和收藏状态
    // const userInteractions = await getUserInteractions(currentUserId.value, currentItem.value?.itemId)
    // state.value.isLiked = userInteractions.isLiked
    // state.value.isStarred = userInteractions.isStarred
  }

  return {
    // 状态
    state,
    currentUserId,
    currentItem,
    
    // 方法
    formatCount,
    handleLike,
    handleStar,
    resetState,
    initializeState
  }
} 