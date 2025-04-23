<template>
    <div class="me page">
        <h1>我</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'MePage'
})
</script>

<style scoped>
.me {
    color: #fff;
    padding: 20px;
}

.page {
    width: 100%;
    height: 100%;
}
</style>