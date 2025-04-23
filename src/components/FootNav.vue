<template>
    <nav class="foot-nav">
        <router-link to="/home" class="nav-item" active-class="active">
            <span>首页</span>
        </router-link>
        <router-link to="/friend" class="nav-item" active-class="active">
            <span>朋友</span>
        </router-link>
        <router-link to="/upload" class="nav-item" active-class="active">
            <span class="upload-icon">+</span>
        </router-link>
        <router-link to="/chat" class="nav-item" active-class="active">
            <span>消息</span>
        </router-link>
        <router-link to="/me" class="nav-item" active-class="active">
            <span>我</span>
        </router-link>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'FootNav',
    setup() {
        const router = useRouter()
        return { router }
    }
})
</script>

<style scoped>
.foot-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #000;
    z-index: 100;
}

.nav-item {
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

.upload-icon {
    font-size: 24px;
    font-weight: bold;
}

.active {
    color: #fe2c55;
}
</style>