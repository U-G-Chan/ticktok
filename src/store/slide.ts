import { defineStore } from 'pinia'
import type { SlideItemData } from '@/types/slide'
import { SlideItemStatus } from '@/types/slide'

export const useSlideStore = defineStore('slide', {
  state: () => ({
    currentIndex: 0,
    slideItems: [] as SlideItemData[],
    maxBufferSize: 15, // 默认缓冲区大小
    menuOpen: false,   // 侧边栏是否打开
    systemPaused: false // 系统暂停（如页面不可见）
  }),
  
  getters: {
    // 获取指定索引的item状态
    getItemStatus: (state) => (index: number): SlideItemStatus => {
      // 如果不是当前索引，则为非激活状态
      if (index !== state.currentIndex) {
        return SlideItemStatus.INACTIVE;
      }
      
      // 如果是当前索引
      if (state.menuOpen) {
        // 侧边栏打开时，暂停但保持状态
        return SlideItemStatus.PAUSED_BY_MENU;
      } else if (state.systemPaused) {
        // 系统原因暂停
        return SlideItemStatus.PAUSED_BY_SYSTEM;
      } else {
        // 正常激活
        return SlideItemStatus.ACTIVE;
      }
    },
    
    currentItem: (state) => {
      return state.slideItems[state.currentIndex] || null
    }
  },
  
  actions: {
    setCurrentIndex(index: number) {
      this.currentIndex = index
    },
    
    setSlideItems(items: SlideItemData[]) {
      this.slideItems = items
    },
    
    setMaxBufferSize(size: number) {
      this.maxBufferSize = size
    },
    
    // 设置菜单开关状态
    setMenuOpen(isOpen: boolean) {
      this.menuOpen = isOpen
    },
    
    // 设置系统暂停状态
    setSystemPaused(isPaused: boolean) {
      this.systemPaused = isPaused
    },
    
    moveNext() {
      if (this.currentIndex < this.slideItems.length - 1) {
        this.currentIndex++
        return true
      }
      return false
    },
    
    movePrevious() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        return true
      }
      return false
    },
    
    addItems(items: SlideItemData[]) {
      // 如果超过最大缓存大小，移除头部数据
      if (this.slideItems.length + items.length > this.maxBufferSize) {
        // 计算需要移除的数据量
        const removeCount = (this.slideItems.length + items.length) - this.maxBufferSize
        // 移除头部数据
        this.slideItems = [...this.slideItems.slice(removeCount), ...items]
        // 保持当前显示位置不变
        this.currentIndex = Math.max(0, this.currentIndex - removeCount)
      } else {
        // 直接追加新数据
        this.slideItems = [...this.slideItems, ...items]
      }
    },
    
    reset() {
      this.currentIndex = 0
      this.slideItems = []
      this.menuOpen = false
      this.systemPaused = false
    }
  }
}) 