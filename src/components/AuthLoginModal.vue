<template>
  <div v-if="visible" class="auth-mask">
    <div class="auth-modal" @click.stop>
      <div class="auth-title">登录</div>
      <div class="auth-subtitle">首次进入请先登录（测试账号已预填）</div>

      <div class="auth-form">
        <label class="auth-label">
          <div class="auth-label-text">用户名</div>
          <input v-model="username" class="auth-input" autocomplete="username" />
        </label>

        <label class="auth-label">
          <div class="auth-label-text">密码</div>
          <input v-model="password" class="auth-input" type="password" autocomplete="current-password" />
        </label>

        <div v-if="errorText" class="auth-error">{{ errorText }}</div>

        <button class="auth-btn" :disabled="loading" @click="handleLogin">
          {{ loading ? "登录中..." : "登录" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useUserStore } from "@/store/user";
import { defaultAuth } from "@/config/auth.config";

export default defineComponent({
  name: "AuthLoginModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const username = ref(defaultAuth.username);
    const password = ref(defaultAuth.password);
    const loading = ref(false);
    const errorText = ref("");

    watch(
      () => props.visible,
      (v) => {
        if (!v) {
          errorText.value = "";
          loading.value = false;
        }
      }
    );

    const handleLogin = async () => {
      if (loading.value) return;
      errorText.value = "";
      loading.value = true;
      try {
        const ok = await userStore.loginWithPassword(username.value.trim(), password.value);
        if (!ok) {
          errorText.value = "登录失败";
        }
      } catch (e: any) {
        errorText.value = e?.message || "登录失败";
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      loading,
      errorText,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.auth-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.auth-modal {
  width: min(420px, 100%);
  background: #1c1c1c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
  color: #fff;
}

.auth-title {
  font-size: 18px;
  font-weight: 700;
}

.auth-subtitle {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.auth-form {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-label-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.auth-input {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 0 12px;
  outline: none;
}

.auth-input:focus {
  border-color: rgba(255, 255, 255, 0.28);
}

.auth-error {
  font-size: 12px;
  color: #ff6b6b;
}

.auth-btn {
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  color: #111;
  font-weight: 700;
  cursor: pointer;
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
