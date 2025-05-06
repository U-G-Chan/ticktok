<template>
  <div class="user-stats">
    <div class="stat-item">
      <div class="stat-num">0</div>
      <div class="stat-label">获赞</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">0</div>
      <div class="stat-label">互关</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">3</div>
      <div class="stat-label">关注</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">0</div>
      <div class="stat-label">粉丝</div>
    </div>
    <div class="edit-profile-btn" @click="handleEditProfile">编辑主页</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserStats',
  setup() {
    const handleEditProfile = () => {
      console.log('编辑主页按钮点击')
    }

    return {
      handleEditProfile
    }
  }
})
</script>

<style scoped>
.user-stats {
  display: flex;
  padding: 5px 15px;
  font-size: 18px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0px 10px;
}

.stat-item:first-child {
  padding-left: 0;
}


.stat-num {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.edit-profile-btn {
  background-color: #f8f8f8;
  color: black;
  height: 30px;
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
}
</style> 