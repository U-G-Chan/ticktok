<template>
  <div class="side-menu">
    <div class="user-info">
      <div class="avatar">
        <!-- 用户头像 -->
      </div>
      <div class="info">
        <h3>用户名</h3>
        <p>用户简介</p>
      </div>
    </div>
    <div class="menu-list">
      <div class="menu-item" v-for="item in menuItems" :key="item.name">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SideMenu',
  setup() {
    const menuItems = [
      { name: '观看历史', icon: 'icon-history' },
      { name: '我的钱包', icon: 'icon-wallet' },
      { name: '离线缓存', icon: 'icon-download' }
    ]
    
    return { menuItems }
  }
})
</script>

<style scoped>
.side-menu {
  background: #fff;
  height: 100%;
  overflow-y: auto;
}

.user-info {
  padding: 20px 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: #eee;
  margin-right: 15px;
}

.info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.info p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.menu-list {
  padding: 10px 0;
}

.menu-item {
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item i {
  margin-right: 10px;
  font-size: 20px;
  color: #666;
}

.menu-item span {
  font-size: 14px;
  color: #333;
}
</style> 