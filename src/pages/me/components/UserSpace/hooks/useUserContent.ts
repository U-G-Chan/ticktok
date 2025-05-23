import { ref, reactive, computed } from 'vue'
import { ContentItem, ListType, ContentListParams } from '@/types/userContent'
import { getUserContentList } from '@/api/modules/userContent'

// 内容状态管理
interface ContentState {
  items: ContentItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
  total: number
}

// 使用用户内容的Hook
export function useUserContent(userId: string) {
  // 各个标签的状态
  const contentStates = reactive<Record<ListType, ContentState>>({
    works: {
      items: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 0,
      total: 0
    },
    recommend: {
      items: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 0,
      total: 0
    },
    collection: {
      items: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 0,
      total: 0
    },
    likes: {
      items: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 0,
      total: 0
    }
  })

  const currentTab = ref<ListType>('works')

  // 当前标签的状态
  const currentState = computed(() => contentStates[currentTab.value])

  // 加载内容列表
  const loadContent = async (listType: ListType, isRefresh = false) => {
    const state = contentStates[listType]
    
    // 如果正在加载，直接返回
    if (state.loading) return
    
    // 如果是刷新，重置状态
    if (isRefresh) {
      state.page = 0
      state.items = []
      state.hasMore = true
      state.error = null
    }
    
    // 如果没有更多数据，直接返回
    if (!state.hasMore && !isRefresh) return

    try {
      state.loading = true
      state.error = null
      
      const params: ContentListParams = {
        userId,
        listType,
        page: state.page + 1,
        pageSize: 12
      }
      
      const result = await getUserContentList(params)
      
      // 更新状态
      if (isRefresh) {
        state.items = result.items
      } else {
        state.items.push(...result.items)
      }
      
      state.page = result.page
      state.total = result.total
      state.hasMore = result.hasMore
      
    } catch (error) {
      console.error('加载内容失败:', error)
      state.error = error instanceof Error ? error.message : '加载失败'
    } finally {
      state.loading = false
    }
  }

  // 刷新当前标签内容
  const refreshCurrentContent = () => {
    return loadContent(currentTab.value, true)
  }

  // 加载更多当前标签内容
  const loadMoreCurrentContent = () => {
    return loadContent(currentTab.value, false)
  }

  // 切换标签
  const switchTab = async (listType: ListType) => {
    currentTab.value = listType
    
    // 如果该标签还没有加载过内容，则加载
    const state = contentStates[listType]
    if (state.items.length === 0 && !state.loading) {
      await loadContent(listType, true)
    }
  }

  // 获取指定标签的状态
  const getContentState = (listType: ListType) => {
    return contentStates[listType]
  }

  // 清空所有内容
  const clearAllContent = () => {
    Object.keys(contentStates).forEach(key => {
      const listType = key as ListType
      const state = contentStates[listType]
      state.items = []
      state.page = 0
      state.total = 0
      state.hasMore = true
      state.error = null
      state.loading = false
    })
  }

  // 初始化，加载第一个标签的内容
  const init = async () => {
    await loadContent('works', true)
  }

  return {
    // 状态
    currentTab,
    currentState,
    contentStates,
    
    // 方法
    switchTab,
    loadContent,
    refreshCurrentContent,
    loadMoreCurrentContent,
    getContentState,
    clearAllContent,
    init
  }
} 