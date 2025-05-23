import { defineStore } from 'pinia'

// 媒体项接口定义
export interface MediaItem {
  id: string
  type: 'photo' | 'video'
  url: string  // IndexedDB中的路径
  thumbnail?: string
  date: Date
  duration?: number
  path: string  // 完整路径
}

// 发布状态管理
export const usePublishStore = defineStore('publish', {
  state: () => ({
    selectedItems: [] as MediaItem[]
  }),

  getters: {
    // 获取选中的媒体项
    getSelectedItems: (state) => state.selectedItems,
    
    // 获取选中项的数量
    selectedCount: (state) => state.selectedItems.length,
    
    // 检查是否有选中项
    hasSelectedItems: (state) => state.selectedItems.length > 0
  },

  actions: {
    // 设置选中的媒体项
    setSelectedItems(items: MediaItem[]) {
      this.selectedItems = items
    },

    // 清空选中项
    clearSelectedItems() {
      this.selectedItems = []
    },

    // 添加媒体项
    addSelectedItem(item: MediaItem) {
      const exists = this.selectedItems.find(i => i.id === item.id)
      if (!exists) {
        this.selectedItems.push(item)
      }
    },

    // 移除媒体项
    removeSelectedItem(itemId: string) {
      this.selectedItems = this.selectedItems.filter(item => item.id !== itemId)
    }
  }
})
