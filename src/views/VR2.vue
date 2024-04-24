<script setup lang="ts">
  import type { Scene } from 'aframe';
  import { ref, onBeforeUnmount, onMounted } from 'vue';

  const assetsLoaded = ref(false);
  const sceneTag = ref<Scene>();

  // import emojiSheetUrl from '@/assets/sprite-128.png';
  // import sponzaUrl from '@/assets/sponza.glb?url'

  // onBeforeUnmount(() => {
  //   const isInVR = sceneTag.value.is('vr-mode');
  //   document.shouldRestoreVR = isInVR;
  //   sceneTag.value?.exitVR();
  // })

  // onMounted(() => {
  //   if(document.shouldRestoreVR){
  //     console.log('gonna try to restore VR');
  //     if(!sceneTag.value) {
  //       console.log('NO GOOD');
  //       return;
  //     }
  //     sceneTag.value.addEventListener('renderstart', (evt) => {
  //       if(!sceneTag.value) {
  //         console.error('no good');
  //         return;
  //       }
  //       console.log('renderstart. enter vr');
  //       sceneTag.value.enterVR();
  //     })
  //   } 
  // })
</script>

<template>
    <a-scene ref="sceneTag" style="width: 100vw; height: 100vh;" 
      light="defaultLightsEnabled: false;"
      cursor="fuse:false; rayOrigin:mouse;"
      raycaster="objects: .clickable" 
      xr-mode-ui="enabled: true;"
    >
      <a-assets @loaded="assetsLoaded = true" timeout="25000">
        <!-- <a-asset-item id="sponza" :src="sponzaUrl" /> -->
        <!-- <img id="portal-preview" src="@/assets/portal-screenshot.png"> -->
        <!-- <a-asset-item id="icon-font" src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" /> -->
      </a-assets>
      <!-- <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" /> -->

        <a-camera wasd-controls="acceleration: 5;"/>
        <a-sky color="skyblue"></a-sky>
        <!-- <a-gltf-model src="#sponza" /> -->
        <a-entity laser-controls="hand: left" raycaster="objects: .clickable"></a-entity>
        <a-entity laser-controls="hand: right" raycaster="objects: .clickable"></a-entity>

        <a-entity position="0 1.5 -2.5">
          <!-- <a-entity troika-test /> -->
          <!-- <a-troika-text position="0 0 0" depth-offset="-100" value="help" font-size="0.1" font="#icon-font" /> -->
          <!-- <a-link class="clickable" position="0 0 0" href="/vr1" title="Go to VR1" /> -->
          <a-sphere color="green" scale="0.4 .4 .4" class="clickable" @click="$router.push('vr1')" position="2 0 0"></a-sphere>
          <!-- <a-entity position="1.5 0 0" mixin="emojimap" material="opacity: 1;" atlas-uvs="column: 4; row: 4;" /> -->
        </a-entity>
    </a-scene>
</template>
