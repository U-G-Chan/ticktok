<template>
    <div class="friend-page">
        <friend-header />
        <address-book />
        <friend-three-part />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FriendHeader from './components/FriendHeader.vue'
import AddressBook from './components/AddressBook.vue'
import FriendThreePart from './components/FriendThreePart.vue'

export default defineComponent({
    name: 'FriendPage',
    components: {
        FriendHeader,
        AddressBook,
        FriendThreePart
    }
})
</script>

<style scoped>
.friend-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #000000;
    background-image: 
        radial-gradient(circle at top left, rgba(114, 13, 54, 0.4), transparent),
        radial-gradient(circle at bottom right, rgba(5, 59, 50, 0.4), transparent);
    color: #fff;
}
</style>