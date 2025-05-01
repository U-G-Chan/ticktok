import { defineStore } from 'pinia'

// 定义侧边菜单的 store
export const useSideMenuStore = defineStore('sideMenu', {
  state: () => ({
    isOpen: false
  }),
  
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    
    open() {
      this.isOpen = true
    },
    
    close() {
      this.isOpen = false
    }
  }
}) 