<template>
    <div class="friend-three-part">
        <div class="friend-item wechat" @click="handleAddWechatFriend">
            <div class="item-content">
                <div class="item-logo wechat-logo">
                    <span class="logo-icon">微</span>
                </div>
                <div class="item-text">快速添加微信朋友</div>
            </div>
            <div class="arrow-icon">›</div>
        </div>
        
        <div class="friend-item qq" @click="handleAddQQFriend">
            <div class="item-content">
                <div class="item-logo qq-logo">
                    <span class="logo-icon">Q</span>
                </div>
                <div class="item-text">快速添加QQ朋友</div>
            </div>
            <div class="arrow-icon">›</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'FriendThreePart',
    setup() {
        const handleAddWechatFriend = () => {
            console.log('添加微信好友')
        }
        
        const handleAddQQFriend = () => {
            console.log('添加QQ好友')
        }
        
        return {
            handleAddWechatFriend,
            handleAddQQFriend
        }
    }
})
</script>

<style scoped>
.friend-three-part {
    padding: 0 16px 24px;
}

.friend-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 10px;
    margin-bottom: 1px;
    background-color: #222;
    border-radius: 8px;
    margin-bottom: 12px;
}

.item-content {
    display: flex;
    align-items: center;
}

.item-logo {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 12px;
    font-weight: bold;
}

.wechat-logo {
    background-color: #2dc100;
    color: white;
}

.qq-logo {
    background-color: #12b7f5;
    color: white;
}

.logo-icon {
    font-size: 16px;
}

.item-text {
    font-size: 15px;
}

.arrow-icon {
    color: #666;
    font-size: 20px;
}
</style> 