<script setup lang="ts">
</script>

<template>
  <div id="UI">
    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
#UI {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}

#UI > * {
  display: inline-block;
  pointer-events: all;
}
</style>
