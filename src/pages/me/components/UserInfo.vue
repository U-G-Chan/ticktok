<template>
  <div class="user-info">
    <div class="avatar-container">
      <img src="@/assets/images/avatar.jpg" alt="头像" class="avatar" />
    </div>
    <div class="user-info-right">
      <div class="username">
        <span>用户名</span>
        <i class="arrow-down"></i>
      </div>
      <div class="user-id">
        <span>抖音号：00000000000</span>
        <i class="icon-copy"></i>
      </div>
    </div>
    <div class="qr-code">
      <i class="icon-qrcode"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserInfo',
  setup() {
    return {}
  }
})
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  position: relative;
  margin-top: 60px;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info-right {
  margin-left: 15px;
  flex: 1;
}

.username {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
  margin-left: 5px;
}

.user-id {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.icon-copy {
  font-size: 14px;
  margin-left: 5px;
  color: rgba(255, 255, 255, 0.6);
}

.qr-code {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.icon-qrcode {
  font-size: 26px;
}
</style> 