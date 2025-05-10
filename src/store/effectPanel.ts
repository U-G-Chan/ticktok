import { defineStore } from 'pinia'
import type { EffectOptions } from '@/pages/publish/components/camera/components/face-effect-service'

// 定义特效面板的 store
export const useEffectPanelStore = defineStore('effectPanel', {
  state: () => ({
    isVisible: false,
    currentDecoration: 'none',
    currentFilter: 'none',
    activeTab: 'decoration'
  }),
  
  getters: {
    // 获取当前特效配置
    getCurrentEffect(): EffectOptions {
      if (this.activeTab === 'decoration') {
        return {
          type: 'decoration',
          name: this.currentDecoration
        }
      } else {
        return {
          type: 'filter',
          name: this.currentFilter
        }
      }
    }
  },
  
  actions: {
    // 切换面板显示状态
    toggle() {
      this.isVisible = !this.isVisible
    },
    
    // 打开面板
    open() {
      this.isVisible = true
    },
    
    // 关闭面板
    close() {
      this.isVisible = false
    },
    
    // 切换标签页
    setActiveTab(tab: 'decoration' | 'filter') {
      this.activeTab = tab
    },
    
    // 设置特效
    setEffect(options: EffectOptions) {
      if (options.type === 'decoration') {
        this.currentDecoration = options.name
      } else if (options.type === 'filter') {
        this.currentFilter = options.name
      }
    },
    
    // 重置特效
    resetEffects() {
      this.currentDecoration = 'none'
      this.currentFilter = 'none'
    }
  }
}) 