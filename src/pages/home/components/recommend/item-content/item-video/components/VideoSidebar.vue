<template>
  <div class="video-sidebar" :style="{ opacity: opacityStyle }">
    <div class="sidebar-item avatar-container">
      <div class="avatar">
        <img :src="avatar" alt="avatar" />
      </div>
      <div class="follow-btn">+</div>
    </div>
    <div class="sidebar-item">
      <div class="icon like-icon" @click="toggleLike">
        <i class="iconfont icon-heart" :class="{ active: isLiked }" :style="{ color: isLiked ? '#ff4040' : '#fff' }"></i>
      </div>
      <span class="count">{{ formatCount(likes) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon">
        <i class="iconfont icon-comment"></i>
      </div>
      <span class="count">{{ formatCount(comments) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon">
        <i class="iconfont icon-star"></i>
      </div>
      <span class="count">{{ formatCount(stars) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon">
        <i class="iconfont icon-forward"></i>
      </div>
      <span class="count">{{ formatCount(forwards) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon music-icon">
        <i class="iconfont icon-music"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import '@/components/Icon/iconfont.css'

export default defineComponent({
  name: 'VideoSidebar',
  props: {
    avatar: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      required: true
    },
    comments: {
      type: Number,
      required: true
    },
    stars: {
      type: Number,
      required: true
    },
    forwards: {
      type: Number,
      required: true
    },
    opacity: {
      type: Number,
      required: false
    }
  },
  setup(props) {
    const isLiked = ref(false)

    const opacityStyle = computed(() => {
      if (props.opacity === undefined) return 1
      return Math.max(0.5, props.opacity)
    })

    const formatCount = (count: number) => {
      if (count >= 10000) {
        return (count / 10000).toFixed(1) + '万'
      }
      return count.toString()
    }

    const toggleLike = () => {
      isLiked.value = !isLiked.value
    }

    return {
      isLiked,
      opacityStyle,
      formatCount,
      toggleLike
    }
  }
})
</script>

<style scoped>
.video-sidebar {
  position: absolute;
  right: 12px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 1;
}

.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.avatar-container {
  position: relative;
  margin-bottom: 15px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid #fff;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.follow-btn {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 22px;
  background-color: #ff4040;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.icon:active {
  transform: scale(0.9);
}

.count {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.iconfont {
  font-size: 24px;
  color: #fff;
}
</style> 