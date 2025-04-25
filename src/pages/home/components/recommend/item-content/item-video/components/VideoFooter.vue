<template>
  <div class="video-footer" :style="{ opacity: opacityStyle }">
    <div class="author">
      <a href="#" class="author-name">@{{ author }}</a>
    </div>
    <div class="content">
      <div class="text-content" :class="{ 'expanded': isExpanded }">
        {{ title }}
        <span v-for="(label, index) in labels" :key="index" class="label">#{{ label }}</span>
      </div>
      <span class="expand-btn" @click="toggleExpand">{{ isExpanded ? '收起' : '展开' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  author: string
  title: string
  labels: string[]
  opacity?: number
}>()

defineOptions({
  name: 'VideoFooter'
})

const isExpanded = ref(false)

const opacityStyle = computed(() => {
  if (props.opacity === undefined) return 1
  return Math.max(0.5, props.opacity)
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.video-footer {
  position: absolute;
  bottom: 5%;
  max-width: calc(100% - 100px);
  z-index: 1;
  padding: 8px 12px;
  border-radius: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2), transparent);
}

.author {
  margin-bottom: 8px;
}

.author-name {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.text-content {
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  transition: all 0.3s ease;
  flex: 1;
}

.text-content.expanded {
  -webkit-line-clamp: unset;
  line-clamp: unset;
}

.label {
  margin: 0 4px;
  opacity: 0.85;
}

.expand-btn {
  display: inline-block;
  color: #fff;
  font-size: 14px;
  opacity: 0.8;
  cursor: pointer;
  padding: 1px 6px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  backdrop-filter: blur(4px);
  margin-top: 1.4em;
  flex-shrink: 0;
}
</style> 