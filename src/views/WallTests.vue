<script setup lang="ts">
import { ref } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Entity, type Scene } from 'aframe';

const sceneTag = ref<Scene>();

const cursorEntity = ref<Entity>();
function placeCursor(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  // console.log(evt.detail.intersection.point);
  if (!cursorEntity.value) return;
  cursorEntity.value.object3D.position.set(...evt.detail.intersection.point.toArray());
  const normal = evt.detail.intersection.normal;
  if (!normal) return;
  const up = new THREE.Vector3(0, 0, 1);
  const newRotation = new THREE.Quaternion();
  newRotation.setFromUnitVectors(up, normal);
  cursorEntity.value.object3D.rotation.setFromQuaternion(newRotation);
}

function onClick(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  releasePlacedObject();
  return;
  // console.log(evt);
  const scene = sceneTag.value!;
  const newTorus = document.createElement('a-torus');
  newTorus.setAttribute('color', 'blue');
  newTorus.setAttribute('scale', '.1 .1 .1');
  newTorus.object3D.position.set(...evt.detail.intersection.point.toArray());
  const normal = evt.detail.intersection.normal;
  if (!normal) return;
  const up = new THREE.Vector3(0, 0, 1);
  const newRotation = new THREE.Quaternion();
  newRotation.setFromUnitVectors(up, normal);
  newTorus.object3D.rotation.setFromQuaternion(newRotation);
  scene.appendChild(newTorus);
}


const placedObjectsEntity = ref<Entity>();
function releasePlacedObject() {
  cursorEntity.value?.flushToDOM(true);
  // const placedEntity = cursorEntity.value?.firstChild as Entity;
  // placedEntity.flushToDOM();
  placedObjectsEntity.value?.append(...cursorEntity.value?.children);
  cursorEntity.value?.replaceChildren()
}

type placeableAssetTypes = `a-${'image' | 'sphere'}`;
function createPlacedObject(type: placeableAssetTypes, url: string) {
  console.log(type, url);
  const newEntity = document.createElement(type)
  if (type === 'a-image') {
    newEntity.setAttribute('src', url);
  } else {
    newEntity.setAttribute('color', 'teal');
  }
  cursorEntity.value?.replaceChildren(newEntity);
}

</script>

<template>
  <div id="ui-overlay" class="absolute z-50 left-5 top-5">
    <button class="p-3 text-white rounded-md cursor-pointer bg-zinc-800"
      @click="createPlacedObject('a-image', '/photos/joey-chacon-edbYu4vxXww-unsplash.jpg')"> Hello</button>
  </div>
  <a-scene ref="sceneTag" cursor="rayOrigin: mouse;" raycaster="objects: .clickable;" raycaster-update
    @raycast-update="placeCursor">
    <a-assets>
      <a-asset-item id="sponza" :src="sponzaUrl"></a-asset-item>
    </a-assets>
    <a-entity ref="placedObjectsEntity">

    </a-entity>
    <a-entity ref="cursorEntity">
      <a-torus scale=".1 .1 .1" color="teal" />
    </a-entity>

    <a-gltf-model @click="onClick" class="clickable" src="#sponza" />
    <a-torus-knot position="0 1.6 -4" color="red"
      animation="property: rotation; from: 0 0 0; to: 400 300 500; dir: alternate; dur: 15000; easing: easeInOutQuad; loop: true;"></a-torus-knot>
  </a-scene>
</template>