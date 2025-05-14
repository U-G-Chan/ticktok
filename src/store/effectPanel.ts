import { defineStore } from 'pinia'
import { decorationEffectService } from '@/services/decorationEffectService'
import { faceEffectService } from '@/services/faceEffectService'

// 定义特效类型接口
export interface EffectOptions {
  type: 'decoration' | 'filter'
  name: string
}

// 定义特效面板的 store
export const useEffectPanelStore = defineStore('effectPanel', {
  state: () => ({
    isVisible: false,
    currentDecoration: 'none',
    currentFilter: 'none',
    activeTab: 'filter'
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
        // 直接调用装饰服务设置装饰
        decorationEffectService.setDecoration(options.name === 'none' ? null : options.name)
        console.log(`设置装饰特效: ${options.name}`)
      } else if (options.type === 'filter') {
        this.currentFilter = options.name
        // 设置滤镜特效
        if (options.name === 'none') {
          // 使用默认滤镜替代null
          faceEffectService.setEffect({
            type: 'filter',
            name: 'none'
          })
        } else {
          faceEffectService.setEffect({
            type: 'filter',
            name: options.name
          })
        }
        console.log(`设置滤镜特效: ${options.name}`)
      }
    },
    
    // 重置特效
    resetEffects() {
      this.currentDecoration = 'none'
      this.currentFilter = 'none'
      // 重置两个服务
      decorationEffectService.setDecoration(null)
      // 使用默认滤镜替代null
      faceEffectService.setEffect({
        type: 'filter',
        name: 'none'
      })
      console.log('重置所有特效')
    }
  }
}) 