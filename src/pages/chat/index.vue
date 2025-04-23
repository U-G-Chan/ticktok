<template>
    <div class="chat page">
        <h1>消息</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ChatPage'
})
</script>

<style scoped>
.chat {
    color: #fff;
    padding: 20px;
}

.page {
    width: 100%;
    height: 100%;
}
</style>