<template>
    <header class="album-header">
        <div class="left" @click="goBack">
            <icon-close theme="outline" size="18" fill="#000000"/>
        </div>
        <div class="center">
            <span class="page-title">所有照片</span>
            <icon-down theme="outline" size="18" fill="#000000"/>
        </div>
        <div class="right"></div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'AlbumHeader',
    setup() {
        const router = useRouter()
        const goBack = () => {
            router.back()
        }
        return { goBack }
    }
})
</script>

<style scoped>
.album-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    padding: 0 16px;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
}
.left, .right {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.center {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
}
.page-title {
    font-size: 18px;
    font-weight: bold;
}

</style> 
