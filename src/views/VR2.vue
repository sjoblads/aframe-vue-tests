<script setup lang="ts">
  import { ref } from 'vue';
  import 'aframe'
  import 'aframe-troika-text';
  // import 'aframe-mesh-ui-components' ;

  const assetsLoaded = ref(false);
  
  import registerAframeComponents from '@/modules/aframe-components';
  registerAframeComponents();

  import emojiSheetUrl from '@/assets/sprite-128.png';
  import sponzaUrl from '@/assets/sponza.glb?url'

</script>

<template>
    <a-scene style="width: 100vw; height: 100vh;" cursor="fuse:false; rayOrigin:mouse;" raycaster="objects: .clickable"  xr-mode-ui="enabled: true;">
      <a-assets @loaded="assetsLoaded = true">
        <a-asset-item id="sponza" :src="sponzaUrl" />
        <a-asset-item id="icon-font" src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" />
      </a-assets>
      <!-- <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" /> -->

        <a-camera wasd-controls="acceleration: 5;"/>
        <a-sky color="skyblue"></a-sky>
        <a-gltf-model src="#sponza" />
        <a-entity laser-controls="hand: left"></a-entity>
        <a-entity laser-controls="hand: right"></a-entity>

        <a-entity position="0 1.5 -1.6">
          <a-entity troika-test />
          <a-troika-text position="0 0 0" depth-offset="-100" value="whatshot" font-size="0.1" font="#icon-font" />
          <a-link scale="0.3 .3 .3" class="clickable" position="-1.5 0 0" href="/vr1" title="Other page" />
          <!-- <a-entity position="1.5 0 0" mixin="emojimap" material="opacity: 1;" atlas-uvs="column: 4; row: 4;" /> -->
        </a-entity>
    </a-scene>
</template>
