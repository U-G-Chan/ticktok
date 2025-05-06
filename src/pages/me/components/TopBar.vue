<template>
  <div class="top-bar">
    <div class="add-friend-btn" @click="handleAddFriend">
      <icon-people-plus theme="outline" size="20" fill="#fff"/>
      <span>添加朋友</span>
    </div>
    <div class="right-actions">
      <div class="icon-btn visitors" @click="handleVisitors">
        <icon-peoples theme="outline" size="22" fill="#ffffff"/>
      </div>
      <div class="icon-btn search" @click="handleSearch">
        <icon-search theme="outline" size="22" fill="#ffffff"/>
      </div>
      <div class="icon-btn menu" @click="handleMenu">
        <icon-hamburger-button theme="outline" size="22" fill="#ffffff"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TopBar',
  setup() {
    const handleAddFriend = () => {
      console.log('添加朋友按钮点击')
    }

    const handleVisitors = () => {
      console.log('访客按钮点击')
    }

    const handleSearch = () => {
      console.log('搜索按钮点击')
    }

    const handleMenu = () => {
      console.log('菜单按钮点击')
    }

    return {
      handleAddFriend,
      handleVisitors,
      handleSearch,
      handleMenu
    }
  }
})
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.add-friend-btn {
  display: flex;
  align-items: center;
  background-color: rgba(50, 50, 50, 0.4);
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  color: #fff;
}

.add-friend-btn i {
  margin-right: 5px;
  font-size: 16px;
}

.right-actions {
  display: flex;
  gap: 15px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  background-color: rgba(50, 50, 50, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.icon-btn i {
  font-size: 18px;
}
</style> 