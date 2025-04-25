<template>
  <div class="video-footer" :style="{ opacity: opacityStyle }">
    <div class="author">
      <a href="#" class="author-name">@{{ author }}</a>
    </div>
    <div class="content">
      <p class="title" :class="{ 'truncated': isTruncated }">{{ title }}</p>
      <div class="labels">
        <span v-for="(label, index) in labels" :key="index" class="label">#{{ label }}</span>
      </div>
      <span v-if="isTruncated" class="expand-btn">展开</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  name: 'VideoFooter',
  props: {
    author: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    labels: {
      type: Array as () => string[],
      required: true
    },
    opacity: {
      type: Number,
      required: false
    }
  },
  setup(props) {
    const isTruncated = ref(true)

    const opacityStyle = computed(() => {
      if (props.opacity === undefined) return 1
      return Math.max(0.5, props.opacity)
    })

    return {
      isTruncated,
      opacityStyle
    }
  }
})
</script>

<style scoped>
.video-footer {
  position: absolute;
  left: 12px;
  bottom: 50px;
  max-width: calc(100% - 100px);
  z-index: 1;
  padding: 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 8px;
}

.author {
  margin-bottom: 10px;
}

.author-name {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.content {
  position: relative;
}

.title {
  color: #fff;
  font-size: 15px;
  line-height: 1.4;
  margin-bottom: 6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  word-break: break-all;
}

.title.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.labels {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 4px;
}

.label {
  color: #fff;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
}

.expand-btn {
  color: #fff;
  font-size: 14px;
  margin-left: 6px;
  opacity: 0.8;
  cursor: pointer;
  padding: 2px 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  backdrop-filter: blur(4px);
}
</style> 