import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { UserInfo, getUserInfo } from "@/api/modules/user";

// 用户状态存储
export const useUserStore = defineStore("user", () => {
  // 当前用户信息
  const currentUser = ref<UserInfo>({
    id: 0,
    uid: 0,
    username: "测试用户",
    nickname: "测试用户",
    avatar: "/avatar/me-avatar.jpg",
    status: "offline",
  });

  // 登录状态
  const isLoggedIn = computed(() => currentUser.value.uid >= 0);

  // 获取当前用户ID
  const userId = computed(() => currentUser.value.uid);

  // 设置当前用户(模拟登录)
  async function login(userId: number) {
    try {
      const userInfo = await getUserInfo(userId);
      currentUser.value = {
        ...userInfo,
        status: "online",
      };
      console.log(
        `[User] 用户已登录: ${userInfo.nickname}(ID:${userInfo.uid})`
      );
      return true;
    } catch (error) {
      console.error("[User] 登录失败:", error);
      return false;
    }
  }

  // 模拟退出登录
  function logout() {
    currentUser.value = {
      id: 0,
      uid: 0,
      username: "未登录用户",
      nickname: "未登录用户",
      avatar: "/avatar/default-avatar.png",
      status: "offline",
    };
    console.log("[User] 用户已退出登录");
  }

  // 模拟更新用户信息
  function updateUserInfo(info: Partial<UserInfo>) {
    currentUser.value = {
      ...currentUser.value,
      ...info,
    };
  }

  return {
    currentUser,
    isLoggedIn,
    userId,
    login,
    logout,
    updateUserInfo,
  };
});
