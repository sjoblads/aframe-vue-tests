<script setup lang="ts">
import { type Ref, ref } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Scene } from 'aframe';

import UIOverlay from '@/components/UIOverlay.vue';
import EmojiPicker from '@/components/EmojiPicker.vue';
import EmojiOther from '@/components/EmojiOther.vue';
import EmojiSelf from '@/components/EmojiSelf.vue';

import emojiSheetUrl from '@/assets/sprite-128.png';

type Tuple = [number, number]

const sceneTag = ref<Scene>();
const isVR = ref(false)

const emojiCoordsOther = ref<Tuple | undefined>(undefined)
const emojiActiveOther = ref(false)

function setEmojiSelf(coords: Tuple, active: boolean) {
  // Send things to server
  console.log("Sending emoji stuff to server", coords, active)

  // Simulating receiving emoji data from other user. It just happens to be the same emoji you just picked yourself.
  emojiCoordsOther.value = coords
  emojiActiveOther.value = active
}

</script>

<template>

  <UIOverlay>
    <EmojiPicker :sheet-url="emojiSheetUrl" :uvs="[43, 43]" :coords="[[35,8], [34,8], [36,26], [36,27]]" @change="setEmojiSelf"></EmojiPicker>
  </UIOverlay>
  
  <a-scene ref="sceneTag" style="width: 100vw; height: 100vh;"  xr-mode-ui="enabled: true;" @enter-vr="isVR = true" @exit-vr="isVR = false" look>
    <a-assets>
      <a-asset-item id="sponza" :src="sponzaUrl"></a-asset-item>
    </a-assets>

    <a-entity camera="active: true" look-controls wasd-controls position="9 1.6 0" rotation="90 190 90">
      <EmojiSelf :sheet-url="emojiSheetUrl" :coords="emojiCoordsOther" :active="emojiActiveOther"/>
    </a-entity>

    <a-entity v-if="isVR">
    </a-entity>

    <!-- Other user entity -->
    <a-entity position="10 0 -3">
      <!-- Other user's avatar -->
      <a-sphere position="0 0.9 0" scale="0.4 0.9 0.3"/>
      <!-- Emoji entity -->
      <EmojiOther :sheet-url="emojiSheetUrl" :coords="emojiCoordsOther" :active="emojiActiveOther"/>
    </a-entity>
    
    <!-- Another user entity -->
    <a-entity position="6 0 -4.5">
      <!-- Other user's avatar -->
      <a-sphere position="0 0.9 0" scale="0.4 0.9 0.3"/>
      <!-- Emoji entity -->
      <EmojiOther :sheet-url="emojiSheetUrl" :coords="emojiCoordsOther" :active="emojiActiveOther"/>
    </a-entity>

    <a-gltf-model class="clickable" src="#sponza" />
  </a-scene>
</template>