<script setup lang="ts">
  import { ref } from 'vue';
  import 'aframe'
  import 'aframe-troika-text';
  const assetsLoaded = ref(false);
  
  // import 'aframe-mesh-ui-components' ;
  import registerAframeComponents from '@/modules/aframe-components';
  registerAframeComponents();

  import emojiSheetUrl from '@/assets/sprite-128.png';
  import sponzaUrl from '@/assets/sponza.glb?url'

</script>

<template>
    <a-scene xr-mode-ui="enabled: false;">
      <a-assets @loaded="assetsLoaded = true">
        <a-asset-item id="sponza" :src="sponzaUrl" />
        <a-asset-item id="icon-font" src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" />
      </a-assets>
      <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" />

        <a-camera wasd-controls="acceleration: 5;"/>
        <a-sky color="skyblue"></a-sky>
        <a-gltf-model src="#sponza" />
        <a-entity position="0 1.5 -1.6">
          <a-entity position="1.5 0 0" mixin="emojimap" material="opacity: 1;" atlas-uvs="column: 4; row: 4;" />
          <a-entity mesh-ui-block="contentDirection: row; justifyContent: space-evenly" >
            <a-entity mesh-ui-block="width: 0.4; height: 0.3; offset: 0.05;" >
              <a-entity mesh-ui-text="content: Gunnar är bäst!;"></a-entity>
            </a-entity>
            <a-entity mesh-ui-block="width: 0.4; height: 0.5; offset: 0.10; backgroundOpacity: 0;" >
              <a-entity mesh-ui-text="fontColor: #0ff; content: Tjena hur ääär läääget!"></a-entity>
              <a-troika-text position="0 0 0" depth-offset="0" value="whatshot" font-size="0.1" font="#icon-font" />
            </a-entity>
          </a-entity>
        </a-entity>
    </a-scene>
</template>
