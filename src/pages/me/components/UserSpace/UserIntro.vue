<template>
  <div class="user-intro" @click="handleEditIntro">
    <div class="intro-text">点击添加介绍，让大家认识你...</div>
    <icon-write theme="outline" size="14" fill="#999"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserIntro',
  setup() {
    const handleEditIntro = () => {
      console.log('编辑介绍按钮点击')
    }

    return {
      handleEditIntro
    }
  }
})
</script>

<style scoped>
.user-intro {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #999;
  justify-content: flex-start;
}

.intro-text {
  font-size: 14px;
}

.icon-edit {
  margin-left: 5px;
  font-size: 14px;
}
</style> 