<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import lampUrl from '@/assets/LightsPunctualLamp.glb?url'

const avatarAssets = ref({
  hands: ['hands_basic_left', 'hands_basic_right'],
  heads: ['heads_basic'],
  torsos: ['torsos_basic_male'],
  eyes: ['eyes_huge', 'eyes_relaxed'],
  eyebrows: ['eyebrows_brookie', 'eyebrows_innocent'],
  hair: ['hair_ponytail', 'hair_thick_buzzcut'],
  mouths: ['mouth_polite_smile', 'mouth_prettypolite_smile'],
  clothes: ['clothes_poloshirt'],
  jewelry: ['jewelry_pearl'],
})

const modelPaths = computed(() => {


})
const mouthFlipAssets = ref(['flip_a_e_i', 'flip_b_m_p', 'flip_c_d_n_s_t_x_y_z', 'flip_e', 'flip_f_v', 'flip_i_ch_sh', 'flip_l', 'flip_o', 'flip_r', 'flip_th', 'flip_u'])

const pickedColors = reactive({
  color1: '#ff00ff',
  color2: '#00ffff',
  color3: '#f0f0ff',
  color4: '#ff0000',
  color5: '#000000',
})

const currentClothingIdx = ref(0);
function changeClothingIdx() {
  currentClothingIdx.value = (currentClothingIdx.value + 1) % 2;
}

</script>

<template>
  <div style="position: absolute; left: 5rem; top: 5rem; z-index: 5000;">
    <template v-for="(color, key) in pickedColors" :key="key">

      <input style="margin-right: 1rem;" v-model="pickedColors[key]" type="color">
    </template>
  </div>
  <a-scene ref="sceneTag" style="width: 100vw; height: 100vh;" cursor="fuse:false; rayOrigin:mouse;"
    raycaster="objects: .clickable" xr-mode-ui="enabled: true;">
    <a-assets v-once timeout="25000">
      <template v-once v-for="(fileNames, prop) in avatarAssets" :key="prop">
        <a-asset-item :id="`${prop}-${idx}`" v-for="(fileName, idx) in fileNames" :key="fileName"
          :src="`/avatar/${prop}/${fileName}.glb`" />
      </template>
      <a-asset-item id="shirt-colorable" src="/custom-props/PoloShirt_colorable.glb" />
      <a-asset-item id="hair-colorable" src="/custom-props/PT_Colorable_HairTie.glb" />
      <a-asset-item id="hair-colorable-mat" src="/custom-props/Ponytail_materialfix.glb" />
      <a-asset-item id="ponytail-color1" src="/custom-props/hairTestMerged.glb" />
      <a-asset-item id="ponytail-manycolors" src="/custom-props/hairTest5Colors.glb" />
      <!-- <a-asset-item id="head" src="/avatar/Body-Parts/Heads/Head_Medium_White.glb" /> -->
      <img id="portal-preview" src="@/assets/portal-screenshot.png">
      <!-- <a-asset-item id="sponza" :src="sponzaUrl" /> -->
      <a-asset-item id="lamp" :src="lampUrl" />
      <!-- <a-asset-item id="icon-font" src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" /> -->
    </a-assets>
    <!-- <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" /> -->

    <a-camera wasd-controls="acceleration: 15;" />
    <a-sky color="skyblue"></a-sky>
    <a-entity laser-controls="hand: left" raycaster="objects: .clickable"></a-entity>
    <a-entity laser-controls="hand: right" raycaster="objects: .clickable"></a-entity>


    <a-entity position="0 1.5 -0.6">
      <!-- a-gltf-model position="3 0 0" src="#lamp" /> -->
      <!-- <a-sphere src="#portal-preview" color="lightskyblue" /> -->
      <a-entity position="1 0 0" mesh-ui-block="width: 0.3; height: 0.3; backgroundColor: #000000; borderRadius: 0.1;"
        @click="changeClothingIdx" class="clickable" />

      <a-gltf-model src="#torsos-0" position="0 0 0" />
      <a-gltf-model src="#heads-0" position="0 0 0" />
      <a-gltf-model :model-color="`colors: ${pickedColors.color4}`" src="#jewelry-0" position="0 0 0" />
      <a-gltf-model :model-color="`colors: ${Object.values(pickedColors)};`" src="#hair-0" position="0 0 0" />
      <a-entity make-gltf-swappable :gltf-model="`#eyebrows-${currentClothingIdx}`" position="0 0 0" />
      <a-gltf-model :model-color="`colors: ${pickedColors.color4}, ${pickedColors.color3}`" src="#eyes-1"
        position="0 0 0" />
      <a-gltf-model make-gltf-swappable :src="`#mouths-${currentClothingIdx}`" position="0 0 0" />
      <a-gltf-model :model-color="`colors: ${pickedColors.color5}`" src="#clothes-0" position="0 0 0" />
      <a-gltf-model src="#hands-0" position="0 0 0" />
      <a-gltf-model src="#hands-1" position="0 0 0" />

      <!-- <a-gltf-model position="2 0 0" src="#shirt-colorable" model-color="color: blue;"/> -->
      <!-- <a-gltf-model rotation="0 110 0" position="0 0 0" src="#hair-colorable-mat" model-color="color: blue;"/> -->
    </a-entity>
  </a-scene>
</template>