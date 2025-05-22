<template>
  <div class="editor-footer">
    <div class="draft-label" @click="saveDraft">
      <icon-memory-card-one theme="outline" size="24" fill="#666666"/>
      <span>存草稿</span>
    </div>
    <div class="action-buttons">
      <button class="daily-button" @click="publishDaily">
        <span class="button-icon">
          <icon-user theme="outline" size="20" fill="#333333"/>
        </span>
        <span>朋友日常</span>
      </button>
      <button class="publish-button" @click="publishContent">
        <span class="button-icon">
          <icon-arrow-circle-up theme="outline" size="20" fill="#ffffff"/>
        </span>
        <span>发作品</span>
      </button>
    </div>
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  background-color: #fff;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex: 3; /* 占据右侧3/4空间 */
}

.draft-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: transparent;
  border: none;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  flex: 1; /* 占据左侧1/4空间 */
  min-width: 60px; /* 最小宽度 */
  padding: 5px;
  margin-right: 20px;
}

.draft-label span {
  margin-top: 2px;
}

.daily-button,
.publish-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 12px;
  padding: 8px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  flex: 1; /* 两个按钮平分右侧空间 */
  min-width: 135px; /* 最小宽度，确保是存草稿按钮的1.5倍 */
  height: 44px;
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.daily-button {
  background-color: #f0f0f0;
  color: #333;
}

.publish-button {
  background-color: #ff4757;
  color: white;
}
</style>