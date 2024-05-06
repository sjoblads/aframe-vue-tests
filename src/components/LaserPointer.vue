<script setup lang="ts">
import { ref } from 'vue';
import { THREE, type Entity } from 'aframe';

defineProps<{
  intersection?: THREE.Vector3
  active: boolean
}>()

</script>

<template>
  <a-entity :position="$props.intersection">
    <!-- TODO: Should a-frame entities perhaps not be updated like below, using dynamic values? -->
    <a-sphere id="laserPoint" scale=".05 .05 .05" :color="$props.active ? 'red' : 'white'" />
  </a-entity>
</template>