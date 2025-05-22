

// 创建会话ID的辅助函数
export function createSessionId(uid1: number, uid2: number): string {
    return `chat_${Math.min(uid1, uid2)}_${Math.max(uid1, uid2)}`;
  }