<script setup lang="ts">
  import { onBeforeMount } from 'vue';
  import registerAframeComponents from '@/modules/aframe-components';
  
  // navigator.xr?.addEventListener('sessiongranted', function(evt) {
  //   console.log('SESSIONGRANTED');
  //   console.log(evt);
  // })
  // if(navigator.xr){
  //   console.log('remocing aframes sessiongranted listenet');
  //   navigator.xr.onsessiongranted = null;
  // }

  onBeforeMount(async () => {
    await registerAframeComponents();
  })
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
