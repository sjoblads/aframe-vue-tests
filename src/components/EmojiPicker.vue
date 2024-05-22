<script setup lang="ts">

import SpriteRender from '@/components/SpriteRenderer.vue'

type Tuple = [number, number]

const props = defineProps<{
  sheetUrl: string,
  uvs: Tuple,
  coords?: Array<Tuple>
}>()

const emit = defineEmits<{
  change: [Tuple]
}>()

function emitChange(coords: Tuple) {
  emit('change', coords)
}

</script>

<template>
  <div>
    <SpriteRender v-for="(coords,i) in props.coords" :key="i" class="sprite" :sheet-url="sheetUrl" :uvs="uvs" :coords="coords" @click="emitChange(coords)"/>
  </div>
</template>

<style scoped>

.sprite {
  width: 100px;
  height: 100px;
}

</style>