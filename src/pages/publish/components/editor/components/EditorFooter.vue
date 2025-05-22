<template>
  <div class="editor-footer">
    <button class="draft-button" @click="saveDraft">存草稿</button>
    <button class="daily-button" @click="publishDaily">朋友日常</button>
    <button class="publish-button" @click="publishContent">发作品</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditorFooter',
  emits: ['save-draft', 'publish-daily', 'publish-content'],
  setup(_, { emit }) {
    // 保存草稿
    const saveDraft = () => {
      emit('save-draft');
    };
    
    // 发布朋友日常
    const publishDaily = () => {
      emit('publish-daily');
    };
    
    // 发布作品
    const publishContent = () => {
      emit('publish-content');
    };
    
    return {
      saveDraft,
      publishDaily,
      publishContent
    };
  }
});
</script>

<style scoped>
.editor-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.draft-button,
.daily-button,
.publish-button {
  border: none;
  border-radius: 22px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.draft-button {
  background-color: #f5f5f5;
  color: #666;
}

.daily-button {
  background-color: #e6f7ff;
  color: #1890ff;
}

.publish-button {
  background-color: #ff4757;
  color: white;
}
</style>