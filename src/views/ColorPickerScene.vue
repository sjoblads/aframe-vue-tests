<script setup lang="ts">
import { type Ref, ref } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Scene } from 'aframe';

import UIOverlay from '@/components/UIOverlay.vue';

import {Vue3ColorPicker} from '@cyhnkckali/vue3-color-picker';
import "@cyhnkckali/vue3-color-picker/dist/style.css"

const color = ref('#05d66a');

</script>

<template>

  <UIOverlay>
    <div class="bg-slate-100 p-10">
      <Vue3ColorPicker class="test" v-model="color" mode="solid" inputType="RGB" type="HEX" :showColorList="false" :showAlpha="false" :showEyeDrop="false" :showInputMenu="false" :showInputSet="false"/>
      <div class="bg-black text-white" :style="{'background': color}">
        {{ color }}
      </div>
    </div>
  </UIOverlay>
  
  <a-scene ref="sceneTag" style="width: 100vw; height: 100vh;"  xr-mode-ui="enabled: true;" look>
    <a-box position="0 1.6 -2" :color="color" animation="property: rotation; to: 360, 360, 360; loop: true; dur: 100000; easing: easeInOutQuad"></a-box>
  </a-scene>
  
</template>