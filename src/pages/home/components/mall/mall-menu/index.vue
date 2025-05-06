<template>
  <div class="mall-menu">
    <div class="menu-page-wrapper" :class="{ 'first-page': currentPage === 0, 'second-page': currentPage === 1 }">
      <div class="menu-swiper" :style="{ transform: `translateX(-${currentPage * 50}%)` }"
        @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <!-- 第一页菜单 -->
        <div class="menu-page menu-page-1">
          <div class="menu-item" v-for="(item, index) in menuItems.slice(0, 5)" :key="index">
            <div class="menu-icon">
              <component :is="item.icon" theme="outline" size="30" fill="black" />
            </div>
            <div class="menu-text">{{ item.text }}</div>
          </div>
        </div>

        <!-- 第二页菜单 -->
        <div class="menu-page menu-page-2">
          <div class="menu-grid">
            <div class="menu-item" v-for="(item, index) in menuItems.slice(5)" :key="index + 5">
              <div class="menu-icon">
                <component :is="item.icon" theme="outline" size="30" fill="black" />
              </div>
              <div class="menu-text">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页指示器 -->
    <div class="menu-indicator">
      <span v-for="n in 2" :key="n" :class="['indicator-dot', { active: currentPage === n - 1 }]"
        @click="setPage(n - 1)"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 菜单数据
const menuItems = [
  { text: '我的订单', icon: 'icon-order' },
  { text: '充值中心', icon: 'icon-recharge' },
  { text: '券红包', icon: 'icon-coupon' },
  { text: '抖音超市', icon: 'icon-supermarket' },
  { text: '小时达', icon: 'icon-clock' },
  { text: '国家补贴', icon: 'icon-subsidy' },
  { text: '品牌馆', icon: 'icon-brand' },
  { text: '大牌试用', icon: 'icon-try' },
  { text: '跟榜买', icon: 'icon-ranking' },
  { text: '附近美食', icon: 'icon-food' },
  { text: '抖音月付', icon: 'icon-pay' },
  { text: '关注店铺', icon: 'icon-follow' },
  { text: '全球购', icon: 'icon-global' },
  { text: '品牌会员', icon: 'icon-vip' },

  { text: '限时秒杀', icon: 'icon-flash' },
  { text: '满减活动', icon: 'icon-discount' },
  { text: '借钱', icon: 'icon-loan' },
  { text: '游戏', icon: 'icon-game' },
  { text: '书城', icon: 'icon-book' },
  { text: '更多', icon: 'icon-more' },
]

// 当前页面
const currentPage = ref(0)

// 设置页面
const setPage = (page) => {
  currentPage.value = page
}

// 滑动处理
let startX = 0
let isDragging = false

const handleTouchStart = (e) => {
  startX = e.touches[0].clientX
  isDragging = true
}

const handleTouchMove = (e) => {
  if (!isDragging) return
  const currentX = e.touches[0].clientX
  const diff = startX - currentX

  // 阻止浏览器默认滚动行为
  if (Math.abs(diff) > 10) {
    e.preventDefault()
  }
}

const handleTouchEnd = (e) => {
  if (!isDragging) return
  const endX = e.changedTouches[0].clientX
  const diff = startX - endX

  // 向左滑（显示下一页）
  if (diff > 50 && currentPage.value === 0) {
    currentPage.value = 1
  }
  // 向右滑（显示上一页）
  else if (diff < -50 && currentPage.value === 1) {
    currentPage.value = 0
  }

  isDragging = false
}
</script>

<style scoped>
.mall-menu {
  width: calc(100% - 24px);
  position: relative;
  overflow: hidden;
  background: white;
  padding: 15px 0;
  border-radius: 12px;
  margin: 0 12px;
}

.menu-page-wrapper {
  width: 100%;
  overflow: hidden;
  transition: height 0.3s ease;

}

.menu-page-wrapper.first-page {
  height: 90px !important;
}

.menu-page-wrapper.second-page {
  height: 240px !important;
}

.menu-swiper {
  display: flex;
  width: 200%;
  transition: transform 0.3s ease;
}

.menu-page {
  width: 50%;
  flex-shrink: 0;
}

.menu-page-1 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 0;
  height: 80px;
}

.menu-page-2 .menu-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  padding: 5px 10px;
  height: 220px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 60px;
  height: 70px;
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon .iconfont {
  font-size: 22px;
  color: #6366f1;
}

.menu-text {
  font-size: 12px;
  color: #333;
}

.menu-indicator {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  position: relative;
  z-index: 5;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
  cursor: pointer;
}

.indicator-dot.active {
  width: 16px;
  border-radius: 3px;
  background: #6366f1;
}
</style>