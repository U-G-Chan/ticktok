<template>
  <div class="friends-list">
    <div 
      class="friend" 
      v-for="friend in friends" 
      :key="friend.id" 
      @click="onFriendClick(friend)"
    >
      <div class="friend-avatar">
        <img :src="friend.avatar" :alt="friend.name">
        <div class="online-indicator" v-if="friend.online"></div>
      </div>
      <div class="friend-name">{{ friend.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Friend } from '@/api/chat'

export default defineComponent({
  name: 'FriendList',
  props: {
    friends: {
      type: Array as PropType<Friend[]>,
      required: true
    }
  },
  emits: ['friend-click'],
  setup(_, { emit }) {
    const onFriendClick = (friend: Friend) => {
      emit('friend-click', friend)
    }

    return {
      onFriendClick
    }
  }
})
</script>

<style scoped>
.friends-list {
  display: flex;
  overflow-x: auto;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 12px;
  min-width: 60px;
  cursor: pointer;
}

.friend-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4caf50;
  border: 2px solid #000;
}

.friend-name {
  width: 100%;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 