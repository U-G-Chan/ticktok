<template>
    <div class="publish">
        <!-- 路由视图 - 用于显示子路由内容 (album) -->
        <router-view />

        <!-- 当路径为/publish时显示发布页面主体内容 -->
        <template v-if="$route.path === '/publish'">
            <!-- 左上角关闭按钮 -->
            <div class="close-btn" @click="handleClose">
                <icon-close theme="outline" size="20" fill="#ffffff"/>
            </div>

            <!-- 顶部选择音乐按钮 -->
            <div class="music-select">
                <icon-music theme="outline" size="18" fill="#ffffff"/>
                <span style="font-size:16px">选择音乐</span>
            </div>

            <!-- 主内容容器 -->
            <div class="container">
                <component :is="currentComponent" />
            </div>

            <!-- 底部导航栏 -->
            <app-footer 
                :activeTab="activeTab" 
                @change-tab="handleTabChange" 
            />
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, markRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from './components/footer/index.vue'
import Camera from './components/camera/index.vue'

export default defineComponent({
    name: 'PublishPage',
    components: {
        AppFooter
    },
    setup() {
        const router = useRouter()
        const activeTab = ref('camera')
        const currentComponent = ref(markRaw(Camera))
        // 记录进入页面前的路径
        const fromRoute = ref('')

        const handleTabChange = (tab: string) => {
            activeTab.value = tab
            switch (tab) {
                case 'camera':
                    currentComponent.value = markRaw(Camera)
                    break
                // 其他标签对应的组件可以在这里添加
                default:
                    currentComponent.value = markRaw(Camera)
            }
        }

        const handleClose = () => {
            // 根据记录的路径返回到之前的页面
            if (fromRoute.value) {
                router.push(fromRoute.value)
            } else {
                // 如果没有记录，默认返回首页
                router.push('/home/recommend')
            }
        }

        onMounted(() => {
            // 默认激活相机标签
            handleTabChange('camera')
            // 记录来源路径（如果存在）
            if (router.options.history.state.back) {
                fromRoute.value = String(router.options.history.state.back)
            }
        })

        return {
            activeTab,
            currentComponent,
            handleTabChange,
            handleClose,
            fromRoute
        }
    }
})
</script>

<style scoped>
.publish {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    color: #fff;
    z-index: 9999;
}

.container {
    height: 95vh;
    width: 100%;
    overflow: hidden;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    left: 20px;
    z-index: 100;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.icon-close {
    font-size: 24px;
    color: #fff;
}

.music-select {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 6px 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.icon-music {
    margin-right: 5px;
    display: flex;
    align-items: center;
}


</style> 