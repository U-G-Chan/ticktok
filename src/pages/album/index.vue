<template>
    <Album />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Album from '@/components/Album/index.vue'

export default defineComponent({
    name: 'AlbumPage',
    components: {
        Album
    }
})
</script> 