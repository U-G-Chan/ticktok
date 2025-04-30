<template>
  <div class="user-space">
    <!-- 用户数据统计区域 -->
    <UserStats />
    
    <!-- 用户介绍区域 -->
    <UserIntro />
    
    <!-- 用户标签区域 -->
    <UserTags />
    
    <!-- 功能区域 -->
    <FunctionArea />
    
    <!-- 内容区域 -->
    <ContentArea />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserStats from './UserStats.vue'
import UserIntro from './UserIntro.vue'
import UserTags from './UserTags.vue'
import FunctionArea from './FunctionArea.vue'
import ContentArea from './ContentArea.vue'

export default defineComponent({
  name: 'UserSpace',
  components: {
    UserStats,
    UserIntro,
    UserTags,
    FunctionArea,
    ContentArea
  }
})
</script>

<style scoped>
.user-space {
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  /* margin-top: 10px; */
}
</style> 