import { defineStore } from 'pinia'
import type { SlideItemData } from '@/types/slide'
import { SlideItemStatus } from '@/types/slide'

// 默认最大数据量
const MAX_ITEMS_COUNT = 15

export const useSlideStore = defineStore('slide', {
  state: () => ({
    currentIndex: 0,
    slideItems: [] as SlideItemData[],
    menuOpen: false,   // 侧边栏是否打开
    systemPaused: false, // 系统暂停（如页面不可见）
    maxItemsCount: MAX_ITEMS_COUNT, // 最大数据量
    isDataTrimming: false // 是否正在裁剪数据
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
    
    setMaxItemsCount(count: number) {
      this.maxItemsCount = count
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
      // 保存当前项的id
      const currentItemId = this.slideItems[this.currentIndex]?.id
      
      // 追加新数据
      this.slideItems = [...this.slideItems, ...items]
      
      // 如果超过最大数据量，需要裁剪
      if (this.slideItems.length > this.maxItemsCount) {
        // 标记正在裁剪数据
        this.isDataTrimming = true
        
        // 保留当前元素的索引位置
        const currentIndex = this.currentIndex
        
        // 计算需要保留的数据起始位置
        // 保证当前项及其前后都有足够的数据
        const startIndex = Math.max(0, currentIndex - Math.floor(this.maxItemsCount / 3))
        
        // 裁剪数据，保留当前查看区域和未来数据
        this.slideItems = this.slideItems.slice(startIndex, startIndex + this.maxItemsCount)
        
        // 更新当前索引位置
        if (currentItemId) {
          const newIndex = this.slideItems.findIndex(item => item.id === currentItemId)
          this.currentIndex = newIndex !== -1 ? newIndex : currentIndex - startIndex
        } else {
          this.currentIndex = currentIndex - startIndex
        }
        
        // 使用setTimeout确保DOM更新后再清除标记
        setTimeout(() => {
          this.isDataTrimming = false
        }, 50)
      }
    },
    
    reset() {
      this.currentIndex = 0
      this.slideItems = []
      this.menuOpen = false
      this.systemPaused = false
      this.isDataTrimming = false
    }
  }
}) 