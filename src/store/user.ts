import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { LoginResult, UserInfo, getCurrentUserInfo, getUserInfo, login as apiLogin, logout as apiLogout, register as apiRegister } from "@/api/modules/user";
import { clearAuth, getAccessToken, getStoredUserId, setAuth } from "@/utils/auth";

// 用户状态存储
export const useUserStore = defineStore("user", () => {
  // 当前用户信息
  const currentUser = ref<UserInfo>({
    id: 0,
    uid: 0,
    username: "未登录用户",
    nickname: "未登录用户",
    avatar: "/avatar/default-avatar.png",
    status: "offline",
  });

  const ready = ref(false);
  const accessToken = ref<string | null>(getAccessToken());

  const syncAuth = () => {
    accessToken.value = getAccessToken();
  };

  window.addEventListener("auth-changed", syncAuth);

  // 登录状态
  const isLoggedIn = computed(() => Boolean(accessToken.value));

  // 获取当前用户ID
  const userId = computed(() => currentUser.value.uid);

  async function bootstrap() {
    syncAuth();
    const token = getAccessToken();
    const uid = getStoredUserId();
    if (!token || !uid) {
      ready.value = true;
      return;
    }

    currentUser.value = {
      ...currentUser.value,
      id: uid,
      uid,
      status: "online",
    };

    try {
      const userInfo = await getCurrentUserInfo();
      currentUser.value = {
        ...userInfo,
        status: "online",
      };
    } catch {
      clearAuth();
      currentUser.value = {
        id: 0,
        uid: 0,
        username: "未登录用户",
        nickname: "未登录用户",
        avatar: "/avatar/default-avatar.png",
        status: "offline",
      };
    } finally {
      ready.value = true;
    }
  }

  async function loginWithPassword(username: string, password: string) {
    try {
      await apiRegister({ username, password });
    } catch {
    }

    const resp: LoginResult = await apiLogin({ username, password });
    const code = (resp as any)?.code ?? 0;
    if (!resp || code !== 0) {
      throw new Error(resp?.msg || "登录失败");
    }

    setAuth({
      accessToken: resp.access_token,
      refreshToken: resp.refresh_token,
      userId: resp.user_id,
    });
    syncAuth();

    try {
      const userInfo = await getCurrentUserInfo();
      currentUser.value = {
        ...userInfo,
        status: "online",
      };
      return true;
    } catch (error) {
      clearAuth();
      return false;
    }
  }

  async function login(userId: number) {
    try {
      const userInfo = await getUserInfo(userId);
      currentUser.value = {
        ...userInfo,
        status: "online",
      };
      return true;
    } catch {
      return false;
    }
  }

  async function logout() {
    try {
      await apiLogout();
    } catch {
    }
    clearAuth();
    syncAuth();
    currentUser.value = {
      id: 0,
      uid: 0,
      username: "未登录用户",
      nickname: "未登录用户",
      avatar: "/avatar/default-avatar.png",
      status: "offline",
    };
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
    ready,
    bootstrap,
    loginWithPassword,
    login,
    logout,
    updateUserInfo,
  };
});
