<template>
    <div class="no-media">
        <div class="empty-icon">📷</div>
        <div class="empty-text">还没有任何媒体文件</div>
        <div class="empty-subtext">拍照或录制视频后将在这里显示</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'EmptyState'
})
</script>

<style scoped>
.no-media {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: #999;
    text-align: center;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
    margin: 20px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #ccc;
}

.empty-text {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #666;
}

.empty-subtext {
    font-size: 14px;
    color: #999;
}
</style> 