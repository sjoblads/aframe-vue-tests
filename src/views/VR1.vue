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
  
  function onAssetsLoaded() {
    assetsLoaded.value = true;
    console.log('ASSETS LOADED');
  }
  function onRootLoaded() {
    console.log('ROOT ENTITY LOADED');
  }
  function onClicked(evt: Event) {
    console.log('clicked:', evt);
  }

</script>

<template>
    <a-scene style="width: 100vw; height: 100vh;" xr-mode-ui="enabled: true;">
      <a-assets @loaded="onAssetsLoaded">
        <a-asset-item id="sponza" :src="sponzaUrl" />
        <a-asset-item id="icon-font" src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" />
      </a-assets>
      <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" />

      <a-entity @loaded="onRootLoaded">
        <a-camera wasd-controls="acceleration: 5;">
          <a-entity cursor raycaster="far: 20; interval: 100; objects: .clickable" />
        </a-camera>
        <a-sky color="skyblue"></a-sky>
        <a-gltf-model src="#sponza" />
        <a-entity position="0 1.5 -1.6">
          <a-link scale="0.3 .3 .3" class="clickable" @click="onClicked" position="-1.5 0 0" href="/vr2" title="Other page" >
            <!-- <a-troika-text value="other page" /> -->
          </a-link>
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
      </a-entity>
    </a-scene>
</template>
