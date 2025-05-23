<template>
  <div class="editor-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <icon-left theme="outline" size="28" fill="#000000"/>
    </div>
    
    <!-- 内容滚动区域 -->
    <div class="scrollable-content">
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
    </div>
    
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
import { usePublishStore } from '@/store/publish';
import { useUserStore } from '@/store/user';
import { getFilesystem, Directory } from '@/utils/web-capacitor-adapter';
import MediaPreviewer from './components/MediaPreviewer.vue';
import InfoEditor from './components/InfoEditor.vue';
import EditorFooter from './components/EditorFooter.vue';
import { saveDraft, publishContent, type PublishMessage, type MediaItem as ApiMediaItem } from '@/api/modules/publish';
import { createContentItem } from '@/api/modules/userContent';
import { uploadFile } from '@/utils/upload';

// 导入类型
import type { MediaItem } from '@/store/publish';

interface Location {
  name: string;
  address?: string;
  longitude?: number;
  latitude?: number;
}

interface FormData {
  title: string;
  description: string;
  topics: string[];
  mentions: string[];
  location?: Location;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  isDaily: boolean;
  createdAt: number;
  updatedAt: number;
}

interface FilesystemInterface {
  readFile: (options: any) => Promise<{ data: string }>;
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
    const publishStore = usePublishStore();
    const userStore = useUserStore();
    
    // 媒体项列表
    const mediaItems = ref<MediaItem[]>([]);
    
    // 表单数据
    const formData = reactive<FormData>({
      title: '',
      description: '',
      topics: [],
      mentions: [],
      tags: [],
      visibility: 'public',
      isDaily: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    // 通过pinia获取选中的媒体项（原getSelectedFiles函数）
    const getSelectedItems = () => {
      return publishStore.getSelectedItems;
    };
    
    // 获取第一张图片的缩略图URL（后端上传后的URL）
    const getThumbnailUrl = (uploadedMediaItems: ApiMediaItem[]): string => {
      // 优先选择第一张图片，如果没有图片则使用第一个媒体项
      const firstImage = uploadedMediaItems.find(item => item.type === 'photo');
      const firstItem = firstImage || uploadedMediaItems[0];
      const baseUrl = 'http://localhost:8080';//@TODO 需要修改为后端地址
      return baseUrl + firstItem?.url || '';
    };
    
    // 创建用户内容项
    const createUserContentItem = async (publishId: string, workType: 'draft' | 'published', uploadedMediaItems: ApiMediaItem[]) => {
      try {
        const thumbnailUrl = getThumbnailUrl(uploadedMediaItems);
        
        // 计算duration：如果有视频则设置默认时长，图片为0
        const hasVideo = uploadedMediaItems.some(item => item.type === 'video');
        const duration = hasVideo ? 60 : 0; // 视频默认60秒，图片为0
        
        await createContentItem({
          userId: userStore.userId.toString(),
          listType: 'works',
          thumbnail: thumbnailUrl,
          likes: 0,
          itemId: publishId,
          title: formData.title || '无标题',
          description: formData.description || '',
          workType: workType,
          duration: duration,
          tags: formData.tags,
          isPublic: formData.visibility === 'public',
          other: {
            topics: formData.topics,
            mentions: formData.mentions,
            location: formData.location,
            visibility: formData.visibility,
            isDaily: formData.isDaily,
            mediaCount: uploadedMediaItems.length,
            mediaTypes: uploadedMediaItems.map(item => item.type),
            hasVideo: hasVideo,
            publishTime: new Date().toISOString(),
            createdAt: formData.createdAt,
            updatedAt: formData.updatedAt,
            backendMediaItems: uploadedMediaItems // 保存后端媒体项信息
          }
        });
        
        console.log(`用户内容项创建成功 - 类型: ${workType}, ID: ${publishId}, 缩略图: ${thumbnailUrl}`);
      } catch (error) {
        console.error('创建用户内容项失败:', error);
        // 不影响主流程，只记录错误
      }
    };
    
    // 处理选中的媒体项
    const processSelectedItems = () => {
      const selectedItems = getSelectedItems();
      if (selectedItems.length > 0) {
        mediaItems.value = selectedItems;
        console.log('已获取选中的媒体项:', selectedItems.length, '个');
      } else {
        console.warn('没有选中的媒体项');
        // 可以考虑跳转回Album页面
        alert('没有选中的媒体项，请返回相册选择');
        router.push('/publish/album');
      }
    };
    
    // 保存草稿
    const handleSaveDraft = async () => {
      try {
        // 更新时间戳
        formData.updatedAt = Date.now();
        
        // 获取选中的媒体项
        const selectedItems = getSelectedItems();
        if (selectedItems.length === 0) {
          alert('没有媒体文件可保存');
          return;
        }
        
        // 准备上传的媒体项
        const uploadedMediaItems: ApiMediaItem[] = [];
        
        // 通过selectedItems的url读取媒体的真实数据并上传
        for (const item of selectedItems) {
          try {
            // 通过IndexedDB获取媒体资源
            const Filesystem = await getFilesystem() as FilesystemInterface;
            const fileData = await Filesystem.readFile({
              path: item.path,
              directory: Directory.Data
            });
            
            // 将base64数据转换为File对象
            const response = await fetch(`data:${item.type === 'photo' ? 'image/jpeg' : 'video/mp4'};base64,${fileData.data}`);
            const blob = await response.blob();
            const file = new File([blob], `${item.id}`, { 
              type: item.type === 'photo' ? 'image/jpeg' : 'video/mp4' 
            });
            
            // 上传文件到后端
            const uploadResult = await uploadFile(file, item.type);
            
            // 封装成表单中的mediaItems
            uploadedMediaItems.push({
              id: uploadResult.id || '',
              type: uploadResult.type,
              url: uploadResult.url
            });
            
          } catch (error) {
            console.error('处理媒体文件失败:', error);
            // 继续处理其他文件，不中断整个流程
          }
        }
        
        if (uploadedMediaItems.length === 0) {
          alert('媒体文件上传失败，无法保存草稿');
          return;
        }
        
        // 构建表单数据
        const draftData: PublishMessage = {
          title: formData.title,
          description: formData.description,
          mediaItems: uploadedMediaItems,
          topics: formData.topics,
          mentions: formData.mentions,
          tags: formData.tags,
          visibility: formData.visibility,
          isDaily: formData.isDaily,
          createdAt: formData.createdAt,
          updatedAt: formData.updatedAt
        };
        
        // 调用API保存草稿
        const result = await saveDraft(draftData);
        
        if (result.success && result.draftId) {
          console.log('草稿保存成功:', result.draftId);
          
          // 同时在用户内容中创建草稿项
          await createUserContentItem(result.draftId, 'draft', uploadedMediaItems);
          
          alert('草稿保存成功！');
          
          // 清空pinia中的选中项
          publishStore.clearSelectedItems();
          
          // 返回首页
          router.push('/home');
        } else {
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
        formData.isDaily = true;
        await handlePublishContent();
      } catch (error) {
        console.error('发布朋友日常失败:', error);
        alert('发布朋友日常失败，请重试');
      }
    };
    
    // 发布作品
    const handlePublishContent = async () => {
      try {
        // 更新时间戳
        formData.updatedAt = Date.now();
        
        // 获取选中的媒体项
        const selectedItems = getSelectedItems();
        if (selectedItems.length === 0) {
          alert('没有媒体文件可发布');
          return;
        }
        
        // 准备上传的媒体项
        const uploadedMediaItems: ApiMediaItem[] = [];
        
        // 通过selectedItems的url读取媒体的真实数据并上传
        for (const item of selectedItems) {
          try {
            // 通过IndexedDB获取媒体资源
            const Filesystem = await getFilesystem() as FilesystemInterface;
            const fileData = await Filesystem.readFile({
              path: item.path,
              directory: Directory.Data
            });
            
            // 将base64数据转换为File对象
            const response = await fetch(`data:${item.type === 'photo' ? 'image/jpeg' : 'video/mp4'};base64,${fileData.data}`);
            const blob = await response.blob();
            const file = new File([blob], `${item.id}`, { 
              type: item.type === 'photo' ? 'image/jpeg' : 'video/mp4' 
            });
            
            // 上传文件到后端
            const uploadResult = await uploadFile(file, item.type);
            
            // 封装成表单中的mediaItems
            uploadedMediaItems.push({
              id: uploadResult.id || '',
              type: uploadResult.type,
              url: uploadResult.url
            });
            
          } catch (error) {
            console.error('处理媒体文件失败:', error);
          }
        }
        
        if (uploadedMediaItems.length === 0) {
          alert('媒体文件上传失败，无法发布');
          return;
        }
        
        // 构建发布数据
        const publishData: PublishMessage = {
          title: formData.title,
          description: formData.description,
          mediaItems: uploadedMediaItems,
          topics: formData.topics,
          mentions: formData.mentions,
          tags: formData.tags,
          visibility: formData.visibility,
          isDaily: formData.isDaily,
          createdAt: formData.createdAt,
          updatedAt: formData.updatedAt
        };
        
        // 调用API发布作品
        const result = await publishContent(publishData);
        
        if (result.success && result.publishId) {
          console.log('作品发布成功:', result.publishId);
          
          // 同时在用户内容中创建发布项
          await createUserContentItem(result.publishId, 'published', uploadedMediaItems);
          
          const message = formData.isDaily ? '朋友日常发布成功！' : '作品发布成功！';
          alert(message);
          
          // 清空pinia中的选中项
          publishStore.clearSelectedItems();
          
          // 返回首页
          router.push('/home');
        } else {
          alert('发布失败，请重试');
        }
      } catch (error) {
        console.error('发布作品失败:', error);
        alert('发布失败，请重试');
      }
    };
    
    // 返回上一页
    const goBack = () => {
      // 清空选中项
      publishStore.clearSelectedItems();
      router.push('/publish/album');
    };
    
    // 组件挂载时处理选中的媒体项
    onMounted(() => {
      processSelectedItems();
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 15px;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.editor-container :deep(.editor-footer) {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

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
}
</style> 