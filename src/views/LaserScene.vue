<script setup lang="ts">
import { type Ref, ref } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Entity, type Scene } from 'aframe';

import LaserPointer from '@/components/LaserPointer.vue'

const sceneTag = ref<Scene>();
const isVR = ref(false)
const laserActive = ref(false)
const cursorIntersection : Ref<THREE.Vector3> = ref(new THREE.Vector3())

function setIntersection(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  cursorIntersection.value = evt.detail.intersection.point
}

function setLaserActiveByOculusHandControl(evt: DetailEvent<{value: boolean}>) {
  laserActive.value = evt.detail.value
}

window.addEventListener("keydown", (event) => {
  if (event.isComposing || event.key === 'l') {
    laserActive.value = !laserActive.value
  }
});

</script>

<template>
  
  <a-scene ref="sceneTag" style="width: 100vw; height: 100vh;" cursor="rayOrigin: mouse;" raycaster="objects: .clickable;" raycaster-update
    @raycast-update="setIntersection" xr-mode-ui="enabled: true;" @enter-vr="isVR = true" @exit-vr="isVR = false">
    <a-assets>
      <a-asset-item id="sponza" :src="sponzaUrl"></a-asset-item>
    </a-assets>
    
    <LaserPointer :active="laserActive" :intersection="cursorIntersection" />

    <a-entity v-if="isVR">
      <a-entity laser-controls="hand: right" raycaster="objects: .clickable" raycaster-update @raycast-update="setIntersection"></a-entity>
      <a-entity oculus-touch-controls="hand: right" laser-pointer @laser-active-toggle="setLaserActiveByOculusHandControl"></a-entity>
    </a-entity>

    <a-gltf-model class="clickable" src="#sponza" />
  </a-scene>
</template>