// 定义幻灯片项的状态枚举
export enum SlideItemStatus {
  INACTIVE = 0,        // 未激活
  ACTIVE = 1,          // 激活且播放中
  PAUSED_BY_USER = 2,  // 用户手动暂停
  PAUSED_BY_MENU = 3,  // 因菜单打开而暂停
  PAUSED_BY_SYSTEM = 4,// 因系统原因暂停（如页面不可见）
  BUFFERING = 5,       // 缓冲中
  ERROR = 6            // 错误状态
}

// 幻灯片项数据接口
export interface SlideItemData {
  id: string
  contentType: 'video' | 'picture' | 'advertisement'
  title: string
  [key: string]: any
}

// 扩展一些实用函数
export const SlideItemStatusHelper = {
  // 是否处于激活状态（包括暂停）
  isActive(status: SlideItemStatus): boolean {
    return status !== SlideItemStatus.INACTIVE;
  },
  
  // 是否应该播放
  shouldPlay(status: SlideItemStatus): boolean {
    return status === SlideItemStatus.ACTIVE;
  },
  
  // 状态是否为暂停
  isPaused(status: SlideItemStatus): boolean {
    return status === SlideItemStatus.PAUSED_BY_USER ||
           status === SlideItemStatus.PAUSED_BY_MENU ||
           status === SlideItemStatus.PAUSED_BY_SYSTEM;
  },
  
  // 是否应该保持状态（不重置）
  shouldPreserveState(status: SlideItemStatus): boolean {
    return status === SlideItemStatus.PAUSED_BY_MENU;
  },
  
  // 状态转换：从暂停恢复
  resumeFrom(status: SlideItemStatus): SlideItemStatus {
    if (status === SlideItemStatus.PAUSED_BY_USER ||
        status === SlideItemStatus.PAUSED_BY_MENU ||
        status === SlideItemStatus.PAUSED_BY_SYSTEM) {
      return SlideItemStatus.ACTIVE;
    }
    return status;
  }
} 