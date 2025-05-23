<template>
  <div class="video-sidebar" :style="{ opacity: opacityStyle }">
    <div class="sidebar-item avatar-container">
      <div class="avatar">
        <img :src="avatar" alt="avatar" />
      </div>
      <div class="follow-btn">+</div>
    </div>
    <div class="sidebar-item">
      <div class="icon like-icon" @click="handleLike" :class="{ loading: interaction.state.value.loading }">
        <icon-like 
          theme="filled" 
          size="35" 
          :fill="interaction.state.value.isLiked ? '#ff4040' : '#fff'" 
          :class="{ 'icon-pop': interaction.state.value.isLikePop }" 
        />
      </div>
      <span class="count">{{ interaction.formatCount(likes) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon">
        <!-- <icon-message theme="outline" size="35" fill="#ffffff"/> -->
        <icon-comment theme="filled" size="35" fill="#ffffff"/>
      </div>
      <span class="count">{{ interaction.formatCount(comments) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon" @click="handleStar" :class="{ loading: interaction.state.value.loading }">
        <icon-star 
          theme="filled" 
          size="35" 
          :fill="interaction.state.value.isStarred ? '#ffc107' : '#fff'" 
          :class="{ 'icon-pop': interaction.state.value.isStarPop }" 
        />
      </div>
      <span class="count">{{ interaction.formatCount(stars) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon">
        <icon-share-two theme="filled" size="35" fill="#ffffff" strokeLinejoin="bevel"/>
      </div>
      <span class="count">{{ interaction.formatCount(forwards) }}</span>
    </div>
    <div class="sidebar-item">
      <div class="icon music-icon">
        <icon-music theme="outline" size="35" fill="#ffffff"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useContentInteraction } from '@/pages/home/hooks/useContentInteraction'

const props = withDefaults(defineProps<{
  avatar: string
  likes?: number
  comments?: number
  stars?: number
  forwards?: number
  opacity?: number
}>(), {
  likes: 0,
  comments: 0,
  stars: 0,
  forwards: 0
})

defineOptions({
  name: 'PictureSidebar'
})

// 使用内容交互hook
const interaction = useContentInteraction()

const opacityStyle = computed(() => {
  if (props.opacity === undefined) return 1
  return Math.max(0.5, props.opacity)
})

// 处理点赞
const handleLike = async () => {
  await interaction.handleLike()
}

// 处理收藏
const handleStar = async () => {
  await interaction.handleStar()
}

// 监听当前内容变化，重置状态
watch(() => interaction.currentItem.value?.id, (newId, oldId) => {
  if (newId !== oldId) {
    interaction.resetState()
    interaction.initializeState()
  }
})

// 组件挂载时初始化状态
onMounted(() => {
  interaction.initializeState()
})

// 组件卸载时清理
onUnmounted(() => {
  interaction.resetState()
})
</script>

<style scoped>
.video-sidebar {
  position: absolute;
  right: 12px;
  bottom: 3%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
}

.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.avatar-container {
  position: relative;
  margin-bottom: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
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
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: #ff4040;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.icon:active {
  transform: scale(0.9);
}

.icon.loading {
  pointer-events: none;
}

.icon.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.count {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  min-width: 30px;
  text-align: center;
}

.icon-pop {
  animation: pop-effect 0.3s ease;
}

@keyframes pop-effect {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style> 