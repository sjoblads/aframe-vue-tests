<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import type { Entity, Scene } from 'aframe';

import skyImage from '@/assets/classroom.png';

// import emojiSheetUrl from '@/assets/sprite-128.png';
// import sponzaUrl from '@/assets/sponza.glb?url'
// import lampUrl from '@/assets/LightsPunctualLamp.glb?url'

const assetsLoaded = ref(false);

const sceneTag = ref<Scene>()

const currentColor = ref('#7700bb');

function onAssetsLoaded() {
  assetsLoaded.value = true;
  // console.log('ASSETS LOADED');
}
function onRootLoaded() {
  // console.log('ROOT ENTITY LOADED');
}

function onClick(evt: Event) {
  console.log('thing clicked:', evt);
  // evt.target.emit('setState', 'clicked');
}

function getScreen() {
  const screen = sceneTag.value?.components.screenshot.capture('equirectangular');
  console.log(screen);
}

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
  <a-scene ref="sceneTag" screenshot="width: 2000; height: 1000" light="defaultLightsEnabled: false;"
    style="width: 100vw; height: 100vh;" cursor="fuse:false; rayOrigin:mouse;" raycaster="objects: .clickable"
    xr-mode-ui="enabled: true;">
    <a-assets @loaded="onAssetsLoaded" timeout="25000">
      <img id="portal-preview" src="@/assets/portal-screenshot.png">

      <a-mixin id="text"
          text="align: center; width: 2;
               value: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam"
      ></a-mixin>

      
      <!-- <a-asset-item id="sponza" :src="sponzaUrl" /> -->
      <!-- <a-asset-item id="lamp" :src="lampUrl" /> -->
      <!-- <a-asset-item id="icon-font"
                    src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" /> -->
    </a-assets>
    <!-- <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43"
             :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`"
             geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" /> -->
     
     

    <a-entity @loaded="onRootLoaded">

      <a-camera wasd-controls="acceleration: 15;">
        <a-entity position="0.2 0 -1">
        </a-entity>
      </a-camera>
      <a-sky :src="skyImage"></a-sky>
      <!--<a-sky color="skyblue"></a-sky> -->
      <!-- <a-gltf-model shadow src="#sponza" /> -->
      <!-- <a-gltf-model position="9 0 0" src="#lamp" /> -->
      <a-entity laser-controls="hand: left" raycaster="objects: .clickable">
        <a-entity position="0 0 -0.3" rotation="-90 0 0" class="clickable" @mouseleave="$event.target.emit('setState', 'default')"
          @mouseenter="$event.target.emit('setState', 'hover')"
          @click="currentColor = `#${Math.trunc(Math.random() * 255).toString(16)}00ff`"
          mesh-ui-block="width: 0.2; height: 0.4; margin: 0.01; backgroundColor: #000"
          mesh-ui-block-state__hover="backgroundColor: #888;">
          <a-entity mesh-ui-text="fontColor: #0ff; content: Tjena! lääget!"></a-entity>
        </a-entity>
      </a-entity>
      <a-entity laser-controls="hand: right" raycaster="objects: .clickable">
        <!-- <a-box position="0 0 -1" /> -->
      </a-entity>
      <a-entity position="0 1.5 -3">
        
        <!-- <a-light type="ambient" color="#BBB"></a-light> -->
        <!-- Red directional light shining from the top left. -->
        <!-- <a-light color="#fff" intensity="0.6" position="-0.5 1 1"></a-light> -->

        <!-- Blue point light, 5 meters in the air. -->
        <!-- <a-entity light="type: point; castShadow: true; color: red; intensity: 7;" position="-4 0 0"/> -->
        <!-- <a-light shadow="cast: true;" type="point" color="blue" position="-3.5 0 -1" intensity="5" decay="1">
          <a-sphere color="blue" scale="0.1 0.1 .1" />
        </a-light> -->
        <!-- <a-sphere rotation="90 180 0" position="2 0 0" detail="3" scale=".5 .5 .5"
                  material="shader: pano-portal; src: #portal-preview;" /> -->
        <!-- <a-link scale="" class="clickable" image="#portal-preview" position="0 0 0" href="/vr2" title="Go to VR2">
        </a-link> -->
        <a-sphere :color="currentColor" scale="0.4 .4 .4" class="clickable" @click="$router.push('/vr2')"
        position="2 0 0"></a-sphere>
        <a-box color="#B22222" scale="0.4 0.4 .4" position="-2 .8 0"></a-box>

        <a-box color="#B22222" opacity="0.4" scale="0.4 0.4 .4" position="-1 .5 0">
         
        </a-box>

        <a-text mixin="text" color="red" position="3 -2 0" wrap-count="20"></a-text>
      <a-text mixin="text" color="red" position="-3 -2 0" wrap-count="20"></a-text>

        

        
      <a-box opacity="0.5" color="blue" width="2.7" height="2.7" depth="0"
             position="0 -3 -1.5">

        <!-- Reference marks, so we can see where the label is aligning.  -->
        <a-entity mixin="marker" position="-0.5 0 0"></a-entity>
        

        <!--
          Label the top of the box,
          positioning the entity at the center of the top,
          and using baseline "top" to align top of text with entity position.
          NOTE: attribute collision makes the text property text-text
        -->
        <a-text color="white" align="center" baseline="top" width="5.4" position="0 0.5 0"
                font="aileronsemibold"
                value="Top of box\n(even when multi-line)\naileronsemibold font" ></a-text>
      </a-box>


        
        <!-- <a-entity link="href: /vr2; title: liiink; image: #portal-preview; borderColor: #0ff; visualAspectEnabled: true;"
                  position="0 0 0" /> -->
        <a-entity
          mesh-ui-block="backgroundOpacity: 0.2; contentDirection: row; justifyContent: space-evenly; fontSize: 0.03;"
          class="">
          <a-entity mesh-ui-block="width: 0.2; height: 0.4; margin: 0.01; justifyContent: space-evenly;">
            <a-entity mesh-ui-block="width: 0.1; height: 0.1; backgroundColor: #0ff; bestFit: auto">
              <a-entity mesh-ui-text="content: Gunnar är bäst!;"></a-entity>
            </a-entity>
            <a-entity mesh-ui-block="width: 0.1; height: 0.1; backgroundColor: #0ff; bestFit: auto">
              <!-- <a-troika-text color="red" position="0 0 0" depth-offset="-100" value="phone" font-size="0.1"
                             font="#icon-font" class="clickable" @click="onClick" /> -->
              <a-entity mesh-ui-text="content: Gunnar är bäst!;"></a-entity>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-entity>
    </a-entity>
  </a-scene>
</template>

