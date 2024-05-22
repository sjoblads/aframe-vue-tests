<script setup lang="ts">
import { type Ref, ref } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Scene } from 'aframe';

import EmojiPicker from '@/components/EmojiPicker.vue';

import emojiSheetUrl from '@/assets/sprite-128.png';

type Tuple = [number, number]

const sceneTag = ref<Scene>();
const isVR = ref(false)

const emojiCoordsOther = ref<Tuple | undefined>(undefined)

function setEmojiSelf(coords: Tuple) {
  // Send things to server
  console.log("Sending emoji stuff to server", coords)

  // Simulating receiving emoji data from other user. It just happens to be the same emoji you just picked yourself.
  emojiCoordsOther.value = coords
}

</script>

<template>

  <div class="UI">
    <EmojiPicker :sheet-url="emojiSheetUrl" :uvs="[43, 43]" :coords="[[10,8], [10,9]]" @change="setEmojiSelf"></EmojiPicker>
  </div>
  
  <a-scene ref="sceneTag" style="width: 100vw; height: 100vh;"  xr-mode-ui="enabled: true;" @enter-vr="isVR = true" @exit-vr="isVR = false" look>
    <a-assets>
      <a-asset-item id="sponza" :src="sponzaUrl"></a-asset-item>
      <a-mixin id="emojimap" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" />
    </a-assets>

    <a-entity camera="active: true" look-controls wasd-controls position="9 1.6 0" rotation="90 190 90"></a-entity>

    <a-entity v-if="isVR">
    </a-entity>

    <!-- Other user entity -->
    <a-entity position="9 0 -3">
      <!-- Other user's avatar -->
      <a-sphere position="0 0.9 0" scale="0.4 0.9 0.3"/>
      <!-- Emoji entity -->
      <a-entity v-if="emojiCoordsOther" position="0 1.5 0" rotation="0 0 -10" animation="property: rotation; to: 0 0 10; loop: true; dir: alternate; dur: 1000; easing: easeInOutQuad">
        <a-entity position="0 0.5 0" :atlas-uvs="'totalRows: 43; totalColumns: 43; column: ' + emojiCoordsOther[0] + '; row: '+ emojiCoordsOther[1] +';'" mixin="emojimap" />
      </a-entity>
    </a-entity>

    <a-gltf-model class="clickable" src="#sponza" />
  </a-scene>
</template>

<style scoped>

.UI {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}

.UI * {
  display: inline;
  pointer-events: all;
}

</style>