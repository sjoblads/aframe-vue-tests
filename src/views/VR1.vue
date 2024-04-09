<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import 'aframe'
  import 'aframe-troika-text';
  const assetsLoaded = ref(false);
  
  import registerAframeComponents from '@/modules/aframe-components';
  onBeforeMount(async () => {
    await registerAframeComponents();
  })


  import emojiSheetUrl from '@/assets/sprite-128.png';
  import sponzaUrl from '@/assets/sponza.glb?url'
  
  function onAssetsLoaded() {
    assetsLoaded.value = true;
    console.log('ASSETS LOADED');
  }
  function onRootLoaded() {
    console.log('ROOT ENTITY LOADED');
  }

  function onClick(evt: Event){

    console.log('thing clicked:', evt);
    evt.target.emit('setState', 'clicked');
  }

</script>

<template>
    <a-scene renderer="physicallyCorrectLights: true;" style="width: 100vw; height: 100vh;" cursor="fuse:false; rayOrigin:mouse;" raycaster="objects: .clickable"  xr-mode-ui="enabled: true;">
      <a-assets @loaded="onAssetsLoaded">
        <a-asset-item id="sponza" :src="sponzaUrl" />
        <a-asset-item id="icon-font" src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" />
      </a-assets>
      <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" />

      <a-entity @loaded="onRootLoaded">
        <a-camera wasd-controls="acceleration: 15;">
          <a-entity position="0.2 0 -1">
          </a-entity>
        </a-camera>
        <!-- <a-background color="skyblue"></a-background> -->
        <a-gltf-model src="#sponza" />
        <a-entity laser-controls="hand: left" raycaster="objects: .clickable"></a-entity>
        <a-entity laser-controls="hand: right" raycaster="objects: .clickable"></a-entity>

        <a-entity position="0 1.5 -1.6">
          <a-light type="ambient" color="#BBB"></a-light>
          <!-- Red directional light shining from the top left. -->
          <a-light color="#fff" intensity="0.6" position="-0.5 1 1"></a-light>

          <!-- Blue point light, 5 meters in the air. -->
          <a-light type="point" color="blue" position="-3.5 0 -1" intensity="2" decay="1">
            <a-sphere color="blue" scale="0.1 0.1 .1" />
          </a-light>
          <a-link scale="0.3 .3 .3" class="clickable" position="-1.5 0 0" href="/vr2" title="Other page" >
            <!-- <a-troika-text value="other page" /> -->
          </a-link>
          <a-entity mesh-ui-block="contentDirection: row; justifyContent: space-evenly" class="">
            <a-entity mesh-ui-block="width: 0.2; height: 0.3; offset: 0.05;" >
              <a-entity mesh-ui-text="content: Gunnar är bäst!;"></a-entity>
              <a-torus-knot position="1.3 1 0" scale=".2 .2 .2" class="clickable" @click="onClick" />
              <!-- <a-troika-text position="0 0 0" depth-offset="-100" value="whatshot" font-size="0.1" font="#icon-font" class="clickable" @click="onClick" /> -->
            </a-entity>
            <a-entity class="clickable" @click="$event.target.emit('setState', 'clicked')" mesh-ui-block-state__clicked="backgroundOpacity: 0.8;" mesh-ui-block="offset: 0.10; backgroundOpacity: 0.3;" >
              <a-entity mesh-ui-text="fontColor: #0ff; content: Tjena hur ääär läääget!"></a-entity>
            </a-entity>
          </a-entity>
          <!-- <a-entity position="1.5 0 0" mixin="emojimap" material="opacity: 1;" atlas-uvs="column: 4; row: 4;" /> -->
        </a-entity>
      </a-entity>
    </a-scene>
</template>
