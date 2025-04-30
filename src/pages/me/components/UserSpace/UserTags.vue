<template>
  <div class="user-tags" @click="handleAddTags">
    <div class="add-tag-btn">
      <i class="icon-plus"></i>
      <span>添加所在地、学校等标签</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserTags',
  setup() {
    const handleAddTags = () => {
      console.log('添加标签按钮点击')
    }

    return {
      handleAddTags
    }
  }
})
</script>

<style scoped>
.user-tags {
  display: flex;
  justify-content: flex-start;
  padding: 0px 20px 10px;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 13px;
}

.icon-plus {
  margin-right: 3px;
  font-size: 12px;
}
</style> 