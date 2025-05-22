<template>
  <div class="editor-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <icon-left theme="outline" size="28" fill="#000000"/>
    </div>
    
    <!-- 媒体预览区域 -->
    <MediaPreviewer 
      :mediaList="mediaItems"
    />
    
    <!-- 信息编辑区域 -->
    <InfoEditor
      :initialTitle="formData.title"
      :initialDescription="formData.description"
      :initialTopics="formData.topics"
      :initialMentions="formData.mentions"
      :initialLocation="formData.location"
      :initialTags="formData.tags"
      :initialVisibility="formData.visibility"
      @update:title="formData.title = $event"
      @update:description="formData.description = $event"
      @update:topics="formData.topics = $event"
      @update:mentions="formData.mentions = $event"
      @update:location="formData.location = $event"
      @update:tags="formData.tags = $event"
      @update:visibility="formData.visibility = $event"
    />
    
    <!-- 底部按钮区域 -->
    <EditorFooter
      @save-draft="handleSaveDraft"
      @publish-daily="handlePublishDaily"
      @publish-content="handlePublishContent"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MediaPreviewer from './components/MediaPreviewer.vue';
import InfoEditor from './components/InfoEditor.vue';
import EditorFooter from './components/EditorFooter.vue';
import { saveDraft, publishContent } from '@/api/modules/publish';
import { uploadMultipleFiles } from '@/utils/upload';

// 导入或定义类型
interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
  path: string;
}

interface Location {
  name: string;
  address?: string;
  longitude?: number;
  latitude?: number;
}

interface Message {
  id?: string;
  title: string;
  description: string;
  mediaItems: MediaItem[];
  topics: string[];
  mentions: string[];
  location?: Location;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  isDaily: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export default defineComponent({
  name: 'Editor',
  components: {
    MediaPreviewer,
    InfoEditor,
    EditorFooter
  },
  setup() {
    const router = useRouter();
    
    // 媒体项列表
    const mediaItems = ref<MediaItem[]>([]);
    
    // 表单数据
    const formData = reactive<Message>({
      title: '',
      description: '',
      mediaItems: [],
      topics: [],
      mentions: [],
      tags: [],
      visibility: 'public',
      isDaily: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    // 从路由参数获取选中的文件
    const getSelectedFiles = async (): Promise<{ files: File[], mediaItems: MediaItem[] }> => {
      try {
        // 从 sessionStorage 中获取文件信息
        const fileDataStr = sessionStorage.getItem('selectedFiles');
        if (!fileDataStr) {
          console.warn('sessionStorage 中没有文件数据');
          return { files: [], mediaItems: [] };
        }
        
        // 解析文件信息
        const fileDataArray = JSON.parse(fileDataStr);
        const files: File[] = [];
        const mediaItems: MediaItem[] = [];
        
        // 处理每个文件
        for (let i = 0; i < fileDataArray.length; i++) {
          const fileData = fileDataArray[i];
          try {
            // 创建媒体项
            const mediaItem: MediaItem = {
              id: `media-${i}`,
              type: fileData.type.startsWith('image') ? 'photo' : 'video',
              url: fileData.url,
              thumbnail: fileData.url,
              path: fileData.id || `file-${i}`
            };
            
            // 添加到媒体项列表
            mediaItems.push(mediaItem);
            
            // 处理数据URL或者常规URL
            const response = await fetch(fileData.url);
            const blob = await response.blob();
            const file = new File([blob], fileData.name, { type: fileData.type });
            files.push(file);
          } catch (error) {
            console.error('处理文件失败:', error);
          }
        }
        
        // 清理 sessionStorage
        sessionStorage.removeItem('selectedFiles');
        
        return { files, mediaItems };
      } catch (error) {
        console.error('获取文件数据失败:', error);
        return { files: [], mediaItems: [] };
      }
    };
    
    // 处理上传的文件
    const processFiles = async () => {
      try {
        // 获取选中的文件
        const { files: selectedFiles, mediaItems: initialMediaItems } = await getSelectedFiles();
        
        // 检查是否有文件需要处理
        if (selectedFiles.length === 0) {
          console.warn('没有文件可处理');
          return;
        }
        
        // 更新媒体项列表用于预览
        mediaItems.value = initialMediaItems;
        
        // 上传文件并获取URL
        const mediaType = initialMediaItems[0].type; // 使用第一个文件的类型作为批量上传的类型
        
        try {
          // 上传文件
          const uploadedUrls = await uploadMultipleFiles(selectedFiles, mediaType);
          
          // 更新媒体项的实际路径
          const finalMediaItems: MediaItem[] = initialMediaItems.map((item, index) => ({
            ...item,
            path: uploadedUrls[index] || item.path,
            // 保持原始URL用于预览，实际开发中这里应该是服务器返回的URL
            // url: uploadedUrls[index] || item.url
          }));
          
          // 更新媒体项列表
          mediaItems.value = finalMediaItems;
          formData.mediaItems = finalMediaItems;
        } catch (uploadError) {
          console.error('上传文件失败:', uploadError);
          // 即使上传失败，也使用初始媒体项展示
          mediaItems.value = initialMediaItems;
          formData.mediaItems = initialMediaItems;
        }
        
      } catch (error) {
        console.error('处理文件失败:', error);
      }
    };
    
    // 保存草稿
    const handleSaveDraft = async () => {
      try {
        // 更新时间戳
        formData.updatedAt = Date.now();
        
        // 调用API保存草稿
        const result = await saveDraft(formData);
        
        if (result.success) {
          console.log('草稿保存成功:', result.draftId);
          
          // 使用confirm确认框
          if (window.confirm('草稿保存成功，是否返回首页？')) {
            router.push('/home');
          }
        } else {
          console.error('保存草稿失败');
          alert('保存草稿失败，请重试');
        }
      } catch (error) {
        console.error('保存草稿失败:', error);
        alert('保存草稿失败，请重试');
      }
    };
    
    // 发布朋友日常
    const handlePublishDaily = async () => {
      try {
        // 设置为朋友日常
        formData.isDaily = true;
        
        // 调用发布API
        await handlePublishContent(true);
      } catch (error) {
        console.error('发布朋友日常失败:', error);
        alert('发布朋友日常失败，请重试');
      }
    };
    
    // 发布作品
    const handlePublishContent = async (isDaily = false) => {
      try {
        // 更新时间戳
        formData.updatedAt = Date.now();
        formData.isDaily = isDaily;
        
        // 调用API发布作品
        const result = await publishContent(formData);
        
        if (result.success) {
          console.log('作品发布成功:', result.publishId);
          
          // 使用confirm确认框
          const message = isDaily ? '朋友日常发布成功，是否返回首页？' : '作品发布成功，是否返回首页？';
          if (window.confirm(message)) {
            router.push('/home');
          }
        } else {
          console.error('发布作品失败');
          alert('发布作品失败，请重试');
        }
      } catch (error) {
        console.error('发布作品失败:', error);
        alert('发布作品失败，请重试');
      }
    };
    
    // 返回上一页
    const goBack = () => {
      router.push('/publish/album');
    };
    
    // 组件挂载时处理文件
    onMounted(async () => {
      await processFiles();
    });
    
    return {
      mediaItems,
      formData,
      handleSaveDraft,
      handlePublishDaily,
      handlePublishContent,
      goBack
    };
  }
});
</script>

<style scoped>
.editor-container {
  width: 100%;
  min-height: 100vh; /* 使用视口高度确保填满整个屏幕 */
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  overflow: hidden; /* 防止内容溢出 */
  padding-bottom: 70px; /* 为底部固定的EditorFooter留出空间 */
}

/* InfoEditor 将自动扩展占用剩余空间 */
.editor-container :deep(.info-editor) {
  flex: 1;
  overflow-y: auto; /* 允许内容过多时滚动 */
}

/* 返回按钮样式 */
.back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: pointer;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.back-icon {
  color: white;
  font-size: 20px;
  font-style: normal;
}
</style> 