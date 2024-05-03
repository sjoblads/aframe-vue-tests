<script setup lang="ts">
import { ref } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Entity, type Scene } from 'aframe';

const sceneTag = ref<Scene>();

const cursorEntity = ref<Entity>();
function placeCursor(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  const cursor = cursorEntity.value;
  // console.log(evt.detail.intersection.point);
  if (!cursor) return;
  const newPos = evt.detail.intersection.point.clone();
  // cursor.object3D.position.set(...evt.detail.intersection.point.toArray());
  const normal = evt.detail.intersection.normal;
  if (!normal) { console.error('no normal vector in intersection object'); return; }
  const up = new THREE.Vector3(0, 0, 1);
  const newRotation = new THREE.Quaternion();
  newRotation.setFromUnitVectors(up, normal);

  newPos.add(normal.setLength(0.05));
  cursor.object3D.position.set(...newPos.toArray());
  cursor.object3D.rotation.setFromQuaternion(newRotation);
}

function onClick(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  addCursorChildrenToScene();
  return;
}


const placedObjectsEntity = ref<Entity>();
// NOTE: aframe is acting a bit peculiar, in where it's not possible to simply reparent a DOM entity.
// We need to clone it in order to make aframe pickup that it should be included in the scene
function addCursorChildrenToScene() {
  const cursor = cursorEntity.value;
  if (!cursor) {
    console.warn('cursorEntity was undefined');
    return;
  }
  // Unclear if we need to flushToDom
  // I think it might become necessary if we want to keep custom properties set in components.
  // cursorEntity.value?.flushToDOM(true);
  const cursorPos = cursor.object3D.getWorldPosition(new THREE.Vector3());
  const cursorRot = cursor.object3D.getWorldQuaternion(new THREE.Quaternion());

  const clone = cursorEntity.value?.cloneNode(true);
  const children = clone?.childNodes;
  cursorEntity.value?.replaceChildren()

  if (!children) {
    console.warn('no children in cursor');
    return;
  }
  children?.forEach(node => {
    const e = node as Entity;
    e.object3D.position.add(cursorPos);
    e.object3D.setRotationFromQuaternion(cursorRot);
  })
  placedObjectsEntity.value?.append(...children);
}

type placeableAssetTypes = `a-${'image' | 'sphere'}`;
function createCursorChild(type: placeableAssetTypes, url: string) {
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
      @click="createCursorChild('a-image', '/photos/joey-chacon-edbYu4vxXww-unsplash.jpg')"> Hello</button>
  </div>
  <a-scene ref="sceneTag" cursor="rayOrigin: mouse;" raycaster="objects: .clickable;" raycaster-update
    @raycast-update="placeCursor">
    <a-assets>
      <a-asset-item id="sponza" :src="sponzaUrl"></a-asset-item>
    </a-assets>
    <a-entity ref="placedObjectsEntity">

    </a-entity>
    <a-ring color="teal" radius-outer="0.2" radius-inner="0.1" ref="cursorEntity">
      <a-torus scale=".1 .1 .1" color="teal" />
    </a-ring>

    <a-gltf-model @click="onClick" class="clickable" src="#sponza" />
    <a-torus-knot position="0 1.6 -4" color="red"
      animation="property: rotation; from: 0 0 0; to: 400 300 500; dir: alternate; dur: 15000; easing: easeInOutQuad; loop: true;"></a-torus-knot>
  </a-scene>
</template>