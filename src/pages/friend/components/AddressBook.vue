<template>
    <div class="address-book">
        <div class="profile-image">
            <div class="avatar-circles">
                <div class="avatar-circle left">
                    <icon-people theme="filled" size="40" fill="#d6a6cb"/>
                </div>
                <div class="avatar-circle middle">
                    <icon-peoples-two theme="multi-color" size="40" :fill="['#333' ,'#ad4ee2' ,'#ffffff' ,'#ffffff']"/>
                </div>
                <div class="avatar-circle right">
                    <icon-people theme="filled" size="40" fill="#d6a6cb"/>
                </div>
            </div>
        </div>
        <div class="text-container">
            <h3 class="title">发现通讯录朋友</h3>
            <p class="description">你身边的朋友在用TickTok，快去看看吧</p>
        </div>
        <button class="view-button" @click="handleViewContacts">查看</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'AddressBook',
    setup() {
        const handleViewContacts = () => {
            console.log('点击了查看按钮，将展示通讯录朋友')
        }
        
        return {
            handleViewContacts
        }
    }
})
</script>

<style scoped>
.address-book {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.profile-image {
    margin-bottom: 20px;
}

.avatar-circles {
    position: relative;
    width: 120px;
    height: 60px;
    display: flex;
    justify-content: center;
}

.avatar-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ffcce5;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-circle.left {
    left: 0;
    z-index: 1;
    transform: translateX(-10px);
}

.avatar-circle.middle {
    width: 70px;
    height: 70px;
    background-color: rgb(239, 228, 241);
    transform: translateY(-8px);
    z-index: 3;
}

.avatar-circle.right {
    right: 0;
    z-index: 1;
    transform: translateX(10px);
}

.text-container {
    text-align: center;
    margin-bottom: 20px;
}

.title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
}

.view-button {
    width: 80%;
    padding: 10px 0;
    background-color: rgb(255, 69, 69);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
}
</style> 