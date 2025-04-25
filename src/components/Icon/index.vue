<template>
  <i :class="['iconfont', `icon-${name}`]" :style="style"></i>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import './iconfont.css'

export default defineComponent({
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      required: false
    },
    color: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const style = computed(() => {
      const styles: Record<string, string> = {}
      if (props.size) {
        styles.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size
      }
      if (props.color) {
        styles.color = props.color
      }
      return styles
    })

    return {
      style
    }
  }
})
</script> 