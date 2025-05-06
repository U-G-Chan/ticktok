<template>
    <div class="friend-header">
        <div class="add-friend-btn" @click="handleAddFriend">
            <icon-plus theme="outline" size="20" fill="#ffffff"/>
            <span>朋友日常</span>
        </div>
        <div class="right-icons">
            <div class="icon-circle" @click="handleGroupChat">
                <icon-people-plus theme="outline" size="24" fill="#ffffff"/>
            </div>
            <div class="icon-circle" @click="handleSearch">
                <icon-search theme="outline" size="24" fill="#ffffff"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'FriendHeader',
    setup() {
        const handleAddFriend = () => {
            console.log('点击了朋友日常按钮')
        }
        
        const handleGroupChat = () => {
            console.log('点击了群聊按钮')
        }
        
        const handleSearch = () => {
            console.log('点击了搜索按钮')
        }
        
        return {
            handleAddFriend,
            handleGroupChat,
            handleSearch
        }
    }
})
</script>

<style scoped>
.friend-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
}

.add-friend-btn {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
}

.add-friend-btn:active {
    background-color: rgba(255, 255, 255, 0.2);
}

.plus-icon {
    margin-right: 4px;
    font-size: 18px;
}

.right-icons {
    display: flex;
    gap: 12px;
}

.icon-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon {
    font-size: 18px;
}
</style> 