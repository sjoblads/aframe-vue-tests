<script setup lang="ts">
  import { onBeforeMount } from 'vue';
  import registerAframeComponents from '@/modules/aframe-components';

  onBeforeMount(async () => {
    await registerAframeComponents();
  })
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
