<template>
    <div class="home page">
       <h1 class="title">首页</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'HomePage'
})
</script>

<style scoped>
.home {
    color: #fff;
    padding: 20px;
}

.page {
    width: 100%;
    height: 100%;
}
</style>