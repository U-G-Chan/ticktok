<template>
    <nav class="foot-nav">
        <router-link to="/home" class="nav-item" active-class="active">
            <span>首页</span>
        </router-link>
        <router-link to="/friend" class="nav-item" active-class="active">
            <span>朋友</span>
        </router-link>
        <router-link to="/upload" class="nav-item upload-btn" active-class="active">
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
    flex: 0.06;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #000;
    z-index: 100;
}

.nav-item {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 100%;
    padding: 0 15px;
    flex: 1;
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
}

.nav-item:active {
    opacity: 0.7;
}

.upload-btn {
    width: 24px;
    height: 30px;
    border: 2px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 0 2px;
    margin: 0 10px;
    transition: all 0.3s ease;
}

.upload-icon {
    font-size: 24px;
    font-weight: bold;
}

.active {
    color: #fe2c55;
    transform: scale(1.1);
}

.upload-btn.active {
    border-color: #fe2c55;
    transform: scale(1.1);
}
</style>