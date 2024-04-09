<script setup lang="ts">
  import { ref } from 'vue';
  import type { Entity } from 'aframe';

  import emojiSheetUrl from '@/assets/sprite-128.png';
  import sponzaUrl from '@/assets/sponza.glb?url'

  const assetsLoaded = ref(false);

  const sceneTag = ref<Entity>()
  
  
  function onAssetsLoaded() {
    assetsLoaded.value = true;
    // console.log('ASSETS LOADED');
  }
  function onRootLoaded() {
    // console.log('ROOT ENTITY LOADED');
  }

  function onClick(evt: Event){

    console.log('thing clicked:', evt);
    // evt.target.emit('setState', 'clicked');
  }

  function getScreen(){
    const screen = sceneTag.value?.components.screenshot.capture('equirectangular');    
    console.log(screen);
  }

</script>

<template>
    <a-scene ref="sceneTag" screenshot="width: 2000; height: 1000" renderer="physicallyCorrectLights: true;" style="width: 100vw; height: 100vh;" cursor="fuse:false; rayOrigin:mouse;" raycaster="objects: .clickable"  xr-mode-ui="enabled: true;">
      <a-assets @loaded="onAssetsLoaded">
        <img id="portal-preview" src="@/assets/portal-screenshot.png" >
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
          <a-sphere rotation="90 180 0" position="2 0 0" detail="3" scale=".5 .5 .5" material="shader: pano-portal; src: #portal-preview;" />
          <a-link image="#portal-preview" scale="" class="clickable" position="-3 0 1" href="/vr2" title="Other page" >
          </a-link>
          <a-entity link="href: /vr2; title: liiink; image: #portal-preview; borderColor: #0ff; visualAspectEnabled: true;" position="0 0 0" />
          <a-entity mesh-ui-block="backgroundOpacity: 0.2; contentDirection: row; justifyContent: space-evenly; fontSize: 0.03;" class="">
            <a-entity mesh-ui-block="width: 0.2; height: 0.4; margin: 0.01; justifyContent: space-evenly;" >
              <a-entity mesh-ui-block="width: 0.1; height: 0.1; backgroundColor: #0ff; bestFit: auto">
                <a-entity mesh-ui-text="content: Gunnar är bäst!;"></a-entity>
              </a-entity>
              <a-entity mesh-ui-block="width: 0.1; height: 0.1; backgroundColor: #0ff; bestFit: auto">
                <a-troika-text color="red" position="0 0 0" depth-offset="-100" value="phone" font-size="0.1" font="#icon-font" class="clickable" @click="onClick" />
              </a-entity>
              <!-- <a-torus-knot position="1.3 1 0" scale=".2 .2 .2" class="clickable" @click="onClick" @hover="onClick" /> -->
              <!-- <a-troika-text color="red" position="0 0 0" depth-offset="-100" value="phone" font-size="0.1" font="#icon-font" class="clickable" @click="onClick" /> -->
            </a-entity>
            <a-entity 
              class="clickable"
              @mouseleave="$event.target.emit('setState', 'default')"
              @mouseenter="$event.target.emit('setState', 'hover')"
              @click="getScreen"
              mesh-ui-block="width: 0.2; height: 0.4; margin: 0.01; backgroundColor: #000"
              mesh-ui-block-state__hover="backgroundColor: #888;"
            >
              <a-troika-text color="#0ff" position="0 0 0" depth-offset="-100" value="whatshot" font-size="0.1" font="#icon-font" class="clickable" @click="onClick" />
              <a-entity mesh-ui-text="fontColor: #0ff; content: Tjena! lääget!"></a-entity>
            </a-entity>
          </a-entity>
          <!-- <a-entity position="1.5 0 0" mixin="emojimap" material="opacity: 1;" atlas-uvs="column: 4; row: 4;" /> -->
        </a-entity>
      </a-entity>
    </a-scene>
</template>
