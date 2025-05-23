<template>
  <div class="function-area">
    <div class="function-item" @click="handleFunction('mall')">
      <div class="func-icon">
        <icon-shopping  theme="outline" size="24" fill="#1e1e1e"/>
      </div>
      <div class="func-name">TiTo商城</div>
    </div>
    <div class="function-item" @click="handleFunction('history')">
      <div class="func-icon">
        <icon-time theme="outline" size="24" fill="#1e1e1e"/>
      </div>
      <div class="func-name">观看历史</div>
    </div>
    <div class="function-item" @click="handleFunction('wallet')">
      <div class="func-icon">
        <icon-wallet  theme="outline" size="24" fill="#1e1e1e"/>
      </div>
      <div class="func-name">我的钱包</div>
    </div>
    <div class="function-item" @click="handleFunction('service')">
      <div class="func-icon">
        <icon-headset-one theme="outline" size="24" fill="#1e1e1e"/>
      </div>
      <div class="func-name">我的客服</div>
    </div>
    
    <div class="function-item" @click="handleFunction('more')">
      <div class="func-icon">
        <icon-system  theme="outline" size="24" fill="#1e1e1e"/>
      </div>
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
  margin-bottom: 5px;
}

.func-name {
  font-size: 12px;
  color: black;
}
</style> 