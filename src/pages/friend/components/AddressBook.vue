<template>
    <div class="address-book">
        <div class="profile-image">
            <div class="avatar-circles">
                <div class="avatar-circle left"></div>
                <div class="avatar-circle middle">
                    <div class="avatar-face">
                        <div class="face-detail"></div>
                    </div>
                </div>
                <div class="avatar-circle right"></div>
            </div>
        </div>
        <div class="text-container">
            <h3 class="title">发现通讯录朋友</h3>
            <p class="description">你身边的朋友在用抖音，快去看看吧</p>
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
}

.avatar-circle.left {
    left: 0;
    z-index: 1;
}

.avatar-circle.middle {
    background-color: #333;
    z-index: 3;
}

.avatar-circle.right {
    right: 0;
    z-index: 1;
}

.avatar-face {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.face-detail {
    width: 40px;
    height: 20px;
    background-color: #ff4081;
    border-radius: 10px;
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
    padding: 12px 0;
    background-color: #ff4081;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
}
</style> 