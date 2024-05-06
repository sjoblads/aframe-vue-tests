<script setup lang="ts">
import { ref, shallowReactive, shallowRef } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Entity, type Scene } from 'aframe';

// console.log(AFRAME);
// console.log(AFRAME.utils);

function arrToCoordString(arr: Array<unknown>) {
  // console.log(arr);
  const constructedString = arr.join(' ');
  // console.log(constructedString);
  return constructedString;
}
const sceneTag = ref<Scene>();

const cursorEntity = ref<Entity>();
function placeCursor(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  const cursor = cursorEntity.value;
  // console.log(evt.detail.intersection.point);
  if (!cursor) return;
  const transform = intersectionToTransform(evt.detail.intersection);
  if (!transform) return;
  cursor.object3D.position.set(...transform.position);
  const quat = new THREE.Quaternion().fromArray(transform.rotation);
  const aframeRotation = quaternionToAframeRotation(quat);
  cursor.setAttribute('rotation', arrToCoordString(aframeRotation));
  // cursor.object3D.rotation.setFromQuaternion(quat);
}

type Transform = {
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector4Tuple,
}
function intersectionToTransform(intersection: THREE.Intersection, normalOffset: number = 0.05) {
  const position = intersection.point.clone();
  const rotation = new THREE.Quaternion();
  const normal = intersection.normal;
  if (!normal) { console.error('no normal vector in intersection object'); return; }
  //Rotation part
  const fromVector = new THREE.Vector3(0, 0, 1);
  rotation.setFromUnitVectors(fromVector, normal);
  const euler = new THREE.Euler().reorder('YXZ').setFromQuaternion(rotation);
  euler.z = 0;
  const quat = new THREE.Quaternion().setFromEuler(euler);

  // Position part
  position.add(normal.clone().setLength(normalOffset));
  position.set(...position.toArray());
  return {
    position: position.toArray(),
    rotation: quat.toArray() as THREE.Vector4Tuple,
    // rotation: rotation.toArray() as THREE.Vector4Tuple,
  }
}

function threeRotationToAframeRotation(threeRotation: THREE.Vector3Tuple): THREE.Vector3Tuple {
  return [
    THREE.MathUtils.radToDeg(threeRotation[0]),
    THREE.MathUtils.radToDeg(threeRotation[1]),
    THREE.MathUtils.radToDeg(threeRotation[2]),
  ]
}

function quaternionToAframeRotation(quaternion: THREE.Quaternion): THREE.Vector3Tuple {
  const euler = new THREE.Euler().reorder('YXZ').setFromQuaternion(quaternion);
  const arr = euler.toArray() as THREE.Vector3Tuple;
  return threeRotationToAframeRotation(arr);
}

function onClick(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  console.log('click!', evt);
  placeMovedObject(evt.detail.intersection);
  return;
}

// type vec3Array = [number, number, number];
type placeableAssetTypes = `a-${'image' | 'sphere'}`;
type PlaceableObject = { type: placeableAssetTypes, src: string };
type PlacedObjectList = Array<PlaceableObject & { position: THREE.Vector3Tuple, rotation: THREE.Vector3Tuple }>

const currentlyMovedObject = shallowRef<PlaceableObject | undefined>();
const currentlyMovedEntity = ref<Entity | null>(null);
const placedObjects = shallowReactive<PlacedObjectList>([
  // { type: 'a-image', src: '/photos/joey-chacon-edbYu4vxXww-unsplash.jpg', position: [0, 0, 0], rotation: [0, 0, 0] }
]);


const placedObjectsEntity = ref<Entity>();
// NOTE: aframe is acting a bit peculiar, in where it's not possible to simply reparent a DOM entity.
// We need to clone it in order to make aframe pickup that it should be included in the scene
function placeMovedObject(intersection: THREE.Intersection) {
  if (!currentlyMovedObject.value) return;
  // const movedEntity = currentlyMovedEntity.value;
  // if (!movedEntity) return;
  const transform = intersectionToTransform(intersection);
  if (!transform) return;
  const quat = new THREE.Quaternion(...transform.rotation)
  const rotation = quaternionToAframeRotation(quat);
  const position = transform.position;
  const { type, src } = currentlyMovedObject.value;
  placedObjects.push({ type, src, rotation, position });

  // const cursorPos = movedEntity.object3D.getWorldPosition(new THREE.Vector3());
  // const cursorRot = new THREE.Quaternion();
  // movedEntity.object3D.getWorldQuaternion(cursorRot);
  // // console.log(cursorRot);
  // const cursorEuler = new THREE.Euler().reorder('XYZ').setFromQuaternion(cursorRot);
  // // console.log(cursorEuler);
  // const cursorRotVec3 = new THREE.Vector3().setFromEuler(cursorEuler);
  // console.log(cursorRotVec3);
  // // const cursorRotEulerDeg = cursorRotVec3.toArray().map(THREE.MathUtils.radToDeg) as THREE.Vector3Tuple;
  // const cursorRotEulerDeg = threeRotationToAframeRotation(cursorRotVec3.toArray());
  // console.log(cursorRotEulerDeg);
  // // console.log(cursorRotVec3);
  // placedObjects.push({ ...currentlyMovedObject.value, position: cursorPos.toArray(), rotation: cursorRotEulerDeg })
  // currentlyMovedObject.value = undefined;

  // const ring = cursorEntity.value?.firstChild as Entity;
  // ring.object3D.visible = true;

  // const movedObjectsRoot = cursorEntity.value?.lastChild as Entity | undefined | null;
  // if (!movedObjectsRoot) {
  //   console.warn('movedObjects was undefined');
  //   return;
  // }
  // cursorEntity.value?.flushToDOM(true); // we need to flush to dom in order to keep component states (scale etc.)
  // const cursorPos = movedObjectsRoot.object3D.getWorldPosition(new THREE.Vector3());
  // const cursorRot = movedObjectsRoot.object3D.getWorldQuaternion(new THREE.Quaternion());

  // const clone = movedObjectsRoot.cloneNode(true);
  // const children = clone?.childNodes;
  // movedObjectsRoot.replaceChildren()

  // if (!children) {
  //   console.warn('no children in cursor');
  //   return;
  // }
  // children?.forEach(node => {
  //   const e = node as Entity;
  //   e.setAttribute('class', 'selectable');
  //   e.object3D.position.add(cursorPos);
  //   e.object3D.setRotationFromQuaternion(cursorRot);
  // })
  // placedObjectsEntity.value?.append(...children);

  // const ring = cursorEntity.value?.firstChild as Entity;
  // ring.object3D.visible = true;
}

function createPlaceableObject(type: placeableAssetTypes, src: string) {
  const newPlaceableObject: PlaceableObject = {
    src,
    type
  }
  currentlyMovedObject.value = newPlaceableObject

  // const ring = cursorEntity.value?.firstChild as Entity;
  // ring.object3D.visible = false;

  // const objectContainer = cursorEntity.value?.lastChild as Entity;
  // if (!objectContainer) {
  //   console.warn('object root was undefined');
  //   return;
  // }
  // // console.log(type, url);
  // const newEntity = document.createElement(type)
  // if (type === 'a-image') {
  //   newEntity.setAttribute('src', src);
  //   newEntity.setAttribute('scale', '1 -1 1');
  //   newEntity.setAttribute('class', 'selectable')
  //   // newEntity.setAttribute('onclick', 'selectEntity');
  // } else {
  //   newEntity.setAttribute('color', 'teal');
  // }
  // objectContainer.replaceChildren(newEntity);
}

function selectEntity(evt: CustomEvent) {
  console.log(evt);
}

</script>

<template>
  <div id="ui-overlay" class="absolute z-50 left-5 top-5">
    <button class="p-3 text-white rounded-md cursor-pointer bg-zinc-800"
      @click="createPlaceableObject('a-image', '/photos/joey-chacon-edbYu4vxXww-unsplash.jpg')"> Hello</button>
  </div>
  <a-scene ref="sceneTag" cursor="rayOrigin: mouse;" raycaster="objects: .raycastable" raycaster-update
    @raycast-update="placeCursor">
    <a-assets>
      <a-asset-item id="sponza" :src="sponzaUrl"></a-asset-item>
    </a-assets>
    <a-entity position="0 0.3 0 " rotation="-45 0 0">
      <a-ring id="cursor-ring" color="teal" radius-outer="0.2" radius-inner="0.1" />
      <a-box id="cursor-box" color="blue" scale="0.04 0.1 0.01" />
      <a-cone id="cursor-box" color="blue" position="0 0.2 0" scale="0.1 0.1 0.1" />
    </a-entity>
    <a-entity ref="placedObjectsEntity">
      <component v-for="placedObject in placedObjects" :key="placedObject.type" :is="placedObject.type"
        :src="placedObject.src" :position="arrToCoordString(placedObject.position)"
        :rotation="arrToCoordString(placedObject.rotation)" />
    </a-entity>
    <a-entity ref="cursorEntity">
      <a-entity rotation="0 0 0">
        <a-ring id="cursor-ring" color="teal" radius-outer="0.2" radius-inner="0.1" />
        <a-box id="cursor-box" color="blue" scale="0.04 0.1 0.01" />
        <a-cone id="cursor-box" position="0 0.1 0" color="blue" scale="0.1 0.1 0.1" radius-bottom="0.2" />
      </a-entity>
      <a-entity id="moved-objects">
        <component ref="currentlyMovedEntity" v-if="currentlyMovedObject" :is="currentlyMovedObject.type"
          :src="currentlyMovedObject.src" />
      </a-entity>
    </a-entity>

    <a-gltf-model @click="onClick" class="raycastable" src="#sponza" />
    <a-torus-knot position="0 1.6 -4" color="red" class="raycastable"
      animation="property: rotation; from: 0 0 0; to: 400 300 500; dir: alternate; dur: 15000; easing: easeInOutQuad; loop: true;"></a-torus-knot>
  </a-scene>
</template>