<template>
    <div class="friend-three-part">
        <div class="friend-item wechat" @click="handleAddWechatFriend">
            <div class="item-content">
                <div class="item-logo wechat-logo">
                    <img src="@/assets/icon/three-part-logo/wechat.webp" alt="微信" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div class="item-text">快速添加微信朋友</div>
            </div>
            <icon-right theme="outline" size="20" fill="#ffffff" strokeLinejoin="bevel"/>
        </div>
        
        <div class="friend-item qq" @click="handleAddQQFriend">
            <div class="item-content">
                <div class="item-logo qq-logo">
                    <img src="@/assets/icon/three-part-logo/qq.webp" alt="QQ" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div class="item-text">快速添加QQ朋友</div>
            </div>
            <icon-right theme="outline" size="20" fill="#ffffff" strokeLinejoin="bevel"/>
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
    background-color: rgba(31, 47, 44, 0.6);
    border-radius: 15px;
    margin-bottom: 15px;
    margin: 0 15px 15px 15px;
}

.friend-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 10px;
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
    color: white;
    size:30px
}

.qq-logo {
    color: white;
    size:30px
}

.logo-icon {
    font-size: 16px;
}

.item-text {
    font-size: 15px;
}

</style> 