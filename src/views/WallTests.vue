<script setup lang="ts">
import { ref, shallowReactive, shallowRef } from 'vue';
import sponzaUrl from '@/assets/sponza.glb?url'
import { type DetailEvent, THREE, type Entity, type Scene } from 'aframe';
import TheWelcome from '@/components/TheWelcome.vue';

function arrToCoordString(arr: Array<unknown>) {
  const constructedString = arr.join(' ');
  return constructedString;
}
const sceneTag = ref<Scene>();

const cursorEntity = ref<Entity>();
function placeCursor(evt: DetailEvent<{ intersection: THREE.Intersection }>) {
  const cursor = cursorEntity.value;
  if (!cursor) return;
  const transform = intersectionToTransform(evt.detail.intersection);
  if (!transform) return;
  cursor.object3D.position.set(...transform.position);
  const quat = new THREE.Quaternion().fromArray(transform.rotation);
  cursor.object3D.rotation.setFromQuaternion(quat);
}

function intersectionToTransform(intersection: THREE.Intersection, normalOffset: number = 0.05) {
  const position = intersection.point.clone();
  const rotation = new THREE.Quaternion();
  const normal = intersection.normal;
  if (!normal) { console.error('no normal vector in intersection object'); return; }
  //Rotation part
  const fromVector = new THREE.Vector3(0, 0, 1);
  // fromVector.setY(0);
  // fromVector.normalize().negate();
  rotation.setFromUnitVectors(fromVector, normal);
  const euler = new THREE.Euler().reorder('YXZ').setFromQuaternion(rotation);
  // console.log(euler.toArray());
  euler.z = 0;
  // if flat placement, align with camera direction
  if (euler.x < (-Math.PI / 2 + 0.01)) {// && euler.x > (-Math.PI / 4 - 0.01)) {
    // console.log('floor placement');
    const quat = new THREE.Quaternion();
    // const cameraRot = AFRAME.AScene.camera.getWorldQuaternion(quat)
    const cameraRot = sceneTag.value!.camera.getWorldQuaternion(quat);
    const eul = new THREE.Euler().reorder('YXZ').setFromQuaternion(cameraRot);
    // console.log(cameraYaw);
    // console.log(eul);
    euler.y = eul.y;
  }
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

type placeableAssetTypes = `a-${'image' | 'sphere'}`;
type PlaceableObject = { type: placeableAssetTypes, src: string };
type PlacedObjectList = Array<PlaceableObject & { position: THREE.Vector3Tuple, rotation: THREE.Vector3Tuple }>

const currentlyMovedObject = shallowRef<PlaceableObject | undefined>();
const currentlyMovedEntity = ref<Entity | null>(null);
const placedObjects = shallowReactive<PlacedObjectList>([
]);


const placedObjectsEntity = ref<Entity>();
function placeMovedObject(intersection: THREE.Intersection) {
  if (!currentlyMovedObject.value) return;
  const transform = intersectionToTransform(intersection);
  if (!transform) return;
  const quat = new THREE.Quaternion(...transform.rotation)
  const rotation = quaternionToAframeRotation(quat);
  const position = transform.position;
  const { type, src } = currentlyMovedObject.value;
  placedObjects.push({ type, src, rotation, position });
  currentlyMovedObject.value = undefined;
}

function createPlaceableObject(type: placeableAssetTypes, src: string) {
  const newPlaceableObject: PlaceableObject = {
    src,
    type
  }
  currentlyMovedObject.value = newPlaceableObject
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
      <a-entity :visible="!currentlyMovedObject" rotation="0 0 0">
        <a-ring id="cursor-ring" color="teal" radius-outer="0.2" radius-inner="0.1" />
        <a-box id="cursor-box" color="blue" scale="0.04 0.1 0.01" />
        <a-cone id="cursor-box" position="0 0.1 0" color="blue" scale="0.1 0.1 0.1" radius-bottom="0.2" />
      </a-entity>
      <a-entity id="moved-object">
        <component ref="currentlyMovedEntity" v-if="currentlyMovedObject" :is="currentlyMovedObject.type"
          :src="currentlyMovedObject.src" />
      </a-entity>
    </a-entity>

    <a-gltf-model @click="onClick" class="raycastable" src="#sponza" />
    <a-torus-knot position="0 1.6 -4" color="red" class="raycastable"
      animation="property: rotation; from: 0 0 0; to: 400 300 500; dir: alternate; dur: 15000; easing: easeInOutQuad; loop: true;"></a-torus-knot>
  </a-scene>
</template>