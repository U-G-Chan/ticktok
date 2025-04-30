<template>
  <div class="function-area">
    <div class="function-item" @click="handleFunction('mall')">
      <i class="icon-shop func-icon"></i>
      <div class="func-name">抖音商城</div>
    </div>
    <div class="function-item" @click="handleFunction('wallet')">
      <i class="icon-wallet func-icon"></i>
      <div class="func-name">我的钱包</div>
    </div>
    <div class="function-item" @click="handleFunction('service')">
      <i class="icon-service func-icon"></i>
      <div class="func-name">我的客服</div>
    </div>
    <div class="function-item" @click="handleFunction('mini-program')">
      <i class="icon-mini-program func-icon"></i>
      <div class="func-name">我的小程序</div>
    </div>
    <div class="function-item" @click="handleFunction('more')">
      <i class="icon-more func-icon"></i>
      <div class="func-name">全部功能</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FunctionArea',
  setup() {
    const handleFunction = (type: string) => {
      console.log(`功能按钮点击: ${type}`)
    }

    return {
      handleFunction
    }
  }
})
</script>

<style scoped>
.function-area {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.func-icon {
  font-size: 24px;
  color: #666;
  margin-bottom: 5px;
}

.func-name {
  font-size: 12px;
  color: #666;
}
</style> 