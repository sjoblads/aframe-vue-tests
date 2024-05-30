<script setup lang="ts">
import { watch } from 'vue';
import { THREE, } from 'aframe';

const props = defineProps<{
  intersection?: THREE.Vector3
  active: boolean
}>()

const emit = defineEmits<{
  update: [active: boolean, position?: THREE.Vector3]
}>()

watch(() => props.intersection, (value) => {
  if(!value) { return }
  if(!props.active) { return }
  emitUpdate()
});

watch(() => props.active, () => {
  emitUpdate()
});

function emitUpdate() {
  emit('update', props.active, props.intersection)
}

</script>

<template>
  <a-entity :position="$props.intersection">
    <!-- TODO: Should a-frame entities perhaps not be updated like below, using dynamic values? -->
    <a-box id="laserPoint" scale=".075 .075 .075" :color="$props.active ? 'green' : 'white'"/>
  </a-entity>
</template>