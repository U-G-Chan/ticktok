<template>
  <div class="media-previewer">
    <!-- 大缩略图预览区域 -->
    <div class="large-thumbnail">
      <img 
        v-if="selectedMedia && selectedMedia.type === 'photo'" 
        :src="selectedMedia.url" 
        alt="预览图" 
      />
      <video 
        v-else-if="selectedMedia && selectedMedia.type === 'video'" 
        :src="selectedMedia.url" 
        controls
      ></video>
    </div>
    
    <!-- 小缩略图滑动区域 -->
    <div class="thumbnail-scrollbar" ref="thumbnailContainer">
      <div 
        class="thumbnail-list" 
        :class="{ 'centered': shouldCenterThumbnails }"
      >
        <div 
          v-for="(media, index) in mediaList" 
          :key="media.id" 
          class="thumbnail-item" 
          :class="{ active: selectedIndex === index }"
          @click="selectMedia(index)"
        >
          <img 
            v-if="media.type === 'photo'" 
            :src="media.thumbnail || media.url" 
            alt="缩略图" 
          />
          <video 
            v-else-if="media.type === 'video'" 
            :src="media.thumbnail || media.url"
          ></video>
        </div>
        
        <!-- 添加更多媒体按钮 -->
        <div class="add-more" @click="addMoreMedia">
          <div class="plus-icon">+</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch, computed } from 'vue';

// 媒体项类型
interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
  path: string;
}

export default defineComponent({
  name: 'MediaPreviewer',
  props: {
    mediaList: {
      type: Array as PropType<MediaItem[]>,
      required: true
    }
  },
  setup(props) {
    const selectedIndex = ref(0);
    const selectedMedia = ref<MediaItem | null>(null);
    const thumbnailContainer = ref<HTMLElement | null>(null);
    
    // 计算是否应该居中显示缩略图
    const shouldCenterThumbnails = computed(() => {
      // 当媒体列表数量+1(加上添加按钮)小于等于5时居中显示
      return props.mediaList.length + 1 <= 5;
    });
    
    // 选择媒体
    const selectMedia = (index: number) => {
      selectedIndex.value = index;
    };
    
    // 添加更多媒体
    const addMoreMedia = () => {
      console.log('添加更多媒体被点击');
    };
    
    // 监听媒体列表变化
    watch(() => props.mediaList, (newList) => {
      if (newList.length > 0 && selectedIndex.value >= newList.length) {
        selectedIndex.value = 0;
      }
      
      if (newList.length > 0) {
        selectedMedia.value = newList[selectedIndex.value];
      } else {
        selectedMedia.value = null;
      }
    }, { immediate: true });
    
    // 监听选中索引变化
    watch(selectedIndex, (newIndex) => {
      if (props.mediaList.length > 0) {
        selectedMedia.value = props.mediaList[newIndex];
      }
    });
    
    return {
      selectedIndex,
      selectedMedia,
      selectMedia,
      addMoreMedia,
      thumbnailContainer,
      shouldCenterThumbnails
    };
  }
});
</script>

<style scoped>
.media-previewer {
  width: 100%;
  height: 35vh;
  display: flex;
  flex-direction: column;
}

.large-thumbnail {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 5px;
}

.large-thumbnail img,
.large-thumbnail video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
}

.thumbnail-scrollbar {
  width: 100%;
  height: 30%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding: 0 5px;
}

.thumbnail-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.thumbnail-list {
  display: inline-flex;
  height: 100%;
  padding: 5px 0;
  /* 默认靠左显示 */
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

/* 当缩略图数量少时居中显示 */
.thumbnail-list.centered {
  margin-left: 50%;
  transform: translateX(-50%);
}

.thumbnail-item {
  width: 60px;
  height: 60px;
  margin-right: 8px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.thumbnail-item.active {
  border-color: #ff4757;
}

.thumbnail-item img,
.thumbnail-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.add-more {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.plus-icon {
  font-size: 24px;
  color: #666;
}
</style> 