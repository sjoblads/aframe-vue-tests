<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
// import { useStorage } from '@vueuse/core';
import lampUrl from '@/assets/LightsPunctualLamp.glb?url'
import type { Entity } from 'aframe';

const avatarAssets = {
  hands: ['hands_basic_left'],
  heads: ['heads_basic'],
  torsos: ['torsos_basic_male'],
  eyes: ['eyes_huge', 'eyes_relaxed'],
  eyebrows: ['eyebrows_brookie', 'eyebrows_innocent'],
  hair: ['hair_ponytail', 'hair_thick_buzzcut'],
  mouths: ['mouth_polite_smile', 'mouth_prettypolite_smile'],
  clothes: ['clothes_poloshirt', undefined],
  accessories: ['accessories_cateye', 'accessories_round', 'accessories_square', undefined],
  jewelry: ['jewelry_pearl', 'jewelry_diamond', 'jewelry_diamond2', 'jewelry_diamond3', 'jewelry_sparkling_hoopdrop_gold', 'jewelry_sparkling_hoopdrop_silver', undefined],
};

// const avatarSettingsInStorage = useStorage('avatarSettings', {});

const skinParts = ['hands', 'heads', 'torsos'];

const currentAvatarSettings = reactive({ skinColor: 'saddlebrown', parts: Object.fromEntries(Object.entries(avatarAssets).map(([k, p]) => [k, { model: p[0], colors: [''] }])) })

// watch(currentAvatarSettings, (newSettings) => {
//   window.localStorage.setItem('avatarSettings', JSON.stringify(newSettings));
// })

function saveAvatarSettingsToStorage() {
  window.localStorage.setItem('avatarSettings', JSON.stringify(currentAvatarSettings));
}

function loadAvatarFromStorage() {
  const loadedString = localStorage.getItem('avatarSettings');
  if (!loadedString) {
    console.error('failed to load from localstorage');
    return;
  }
  const parsedAvatarSettings = JSON.parse(loadedString);
  currentAvatarSettings.parts = parsedAvatarSettings.parts;
  currentAvatarSettings.skinColor = parsedAvatarSettings.skinColor;
}

const mouthFlipAssets = ref(['flip_a_e_i', 'flip_b_m_p', 'flip_c_d_n_s_t_x_y_z', 'flip_e', 'flip_f_v', 'flip_i_ch_sh', 'flip_l', 'flip_o', 'flip_r', 'flip_th', 'flip_u'])

const pickedColors = reactive({
  color1: '#ff00ff',
  color2: '#00ffff',
  color3: '#f0f0ff',
  color4: '#ff0000',
  color5: '#000000',
})

const modelEntityTags = ref<Entity[]>([]);

const modelEntitiesWithCOlors = computed(() => {
  return modelEntityTags.value.map((el) => ({ el, nrOfColors: el.components['model-color'].nrOfCustomColors }))
})

const partsNrOfColors = reactive(Object.fromEntries(Object.keys(avatarAssets).map(k => [k, 0])))
function setNrOfCustomColors(part: string, evt: CustomEvent) {
  console.log(evt, part);
  const entity = evt.target as Entity;
  const nrOfColors = entity.components['model-color'].nrOfCustomColors;
  console.log(nrOfColors);
  partsNrOfColors[part] = nrOfColors;
}

const currentClothingIdx = ref(0);
function changeClothingIdx() {
  currentClothingIdx.value = (currentClothingIdx.value + 1) % 2;
  for (const [k, part] of Object.entries(currentAvatarSettings.parts)) {
    const partType = k as keyof typeof avatarAssets;
    const partList = avatarAssets[partType];
    const l = avatarAssets[partType].length
    const modelName = part.model
    const idx = partList.indexOf(modelName);
    const newIdx = (idx + 1) % l;
    const newModelName = partList[newIdx];
    currentAvatarSettings.parts[partType].model = newModelName;
  }
}

</script>

<template>
  <div id="colorpickers-container" style="position: absolute; left: 5rem; top: 5rem; z-index: 5000;">
    <template v-for="(modelSetting, key) in currentAvatarSettings.parts" :key="key">

      <div v-if="modelSetting.model && partsNrOfColors[key] !== 0">
        {{ key }}:
        <template v-for="cIdx in partsNrOfColors[key]" :key="cIdx">
          <input type="color" v-model="modelSetting.colors[cIdx - 1]">
        </template>
      </div>
    </template>
    <button @click="saveAvatarSettingsToStorage">save</button>
    <button @click="loadAvatarFromStorage">load</button>
    <!-- <template v-for="(color, key) in pickedColors" :key="key">

      <input style="margin-right: 1rem;" v-model="pickedColors[key]" type="color">
    </template> -->
  </div>
  <a-scene ref="sceneTag" style="width: 100vw; height: 100vh;" cursor="fuse:false; rayOrigin:mouse;"
    raycaster="objects: .clickable" xr-mode-ui="enabled: false;">
    <!-- <a-light id="dirlight" intensity="1" light="castShadow:true;type:directional" position="1 1 1"></a-light> -->
    <a-assets v-once timeout="25000">
      <template v-for="(fileNames, prop) in avatarAssets" :key="prop">
        <a-asset-item :id="`${prop}-${idx}`" v-for="(fileName, idx) in fileNames" :key="fileName"
          :src="`/avatar/${prop}/${fileName}.glb`" />
        <!-- <template v-else>
          <a-asset-item :id="`${prop}-${idx}-left`" v-for="(fileName, idx) in fileNames" :key="fileName"
            :src="`/avatar/${prop}/${fileName}_left.glb`" />
          <a-asset-item :id="`${prop}-${idx}-right`" v-for="(fileName, idx) in fileNames" :key="fileName"
            :src="`/avatar/${prop}/${fileName}_right.glb`" /> -->
        <!-- </template> -->
      </template>
      <!-- <a-asset-item id="shirt-colorable" src="/custom-props/PoloShirt_colorable.glb" />
      <a-asset-item id="hair-colorable" src="/custom-props/PT_Colorable_HairTie.glb" />
      <a-asset-item id="hair-colorable-mat" src="/custom-props/Ponytail_materialfix.glb" />
      <a-asset-item id="ponytail-color1" src="/custom-props/hairTestMerged.glb" />
      <a-asset-item id="ponytail-manycolors" src="/custom-props/hairTest5Colors.glb" /> -->
      <!-- <a-asset-item id="head" src="/avatar/Body-Parts/Heads/Head_Medium_White.glb" /> -->
      <img id="portal-preview" src="@/assets/portal-screenshot.png">
      <!-- <a-asset-item id="sponza" :src="sponzaUrl" /> -->
      <a-asset-item id="lamp" :src="lampUrl" />
      <!-- <a-asset-item id="icon-font" src="https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff" /> -->
    </a-assets>
    <!-- <a-mixin id="emojimap" atlas-uvs="totalRows: 43; totalColumns: 43" :material="`src: ${emojiSheetUrl}; transparent: true; shader: flat;`" geometry="primitive: plane; width: 0.4; height: 0.4; buffer: true; skipCache: true" /> -->

    <!-- <a-camera wasd-controls="acceleration: 15;" /> -->
    <a-entity camera look-controls="enabled: false"
      orbit-controls="minDistance: 1; maxDistance: 4; initialPosition: 0 0.4 1; rotateSpeed: 0.5; autoRotate: true"></a-entity>
    <a-sky color="skyblue"></a-sky>
    <a-entity laser-controls="hand: left" raycaster="objects: .clickable"></a-entity>
    <a-entity laser-controls="hand: right" raycaster="objects: .clickable"></a-entity>


    <a-entity position="0 0.2 0">
      <!-- a-gltf-model position="3 0 0" src="#lamp" /> -->
      <!-- <a-sphere src="#portal-preview" color="lightskyblue" /> -->
      <!-- <a-entity position="0.5 0 0" mesh-ui-block="width: 0.3; height: 0.3; backgroundColor: #000000; borderRadius: 0.1;"
        @click="changeClothingIdx" class="clickable" /> -->

      <template v-for="(modelSetting, key) in currentAvatarSettings.parts" :key="key">
        <template v-if="modelSetting.model">
          <!-- <Teleport v-if="partsNrOfColors[key] !== 0" to="#colorpickers-container">
            <div>
              {{ key }}:
              <template v-for="cIdx in partsNrOfColors[key]" :key="cIdx">
                <input type="color" v-model="modelSetting.colors[cIdx - 1]">
              </template>
            </div>
          </Teleport> -->
          <template v-if="skinParts.includes(key)">
            <a-gltf-model make-gltf-swappable
              :src="`#${key}-${avatarAssets[key as keyof typeof avatarAssets].indexOf(modelSetting.model)}`"
              :model-color="`colors: ${currentAvatarSettings.skinColor ?? ''}; materialName: skin`" />
            <a-gltf-model v-if="key === 'hands' && modelSetting.model" make-gltf-swappable
              :src="`#${key}-${avatarAssets[key as keyof typeof avatarAssets].indexOf(modelSetting.model)}`"
              :model-color="`colors: ${currentAvatarSettings.skinColor ?? ''}; materialName: skin`" scale="-1 1 1" />
          </template>
          <a-gltf-model v-else make-gltf-swappable ref="modelEntityTags"
            @nrOfCustomColors="setNrOfCustomColors(key, $event)"
            :src="`#${key}-${avatarAssets[key as keyof typeof avatarAssets].indexOf(modelSetting.model)}`"
            :model-color="`colors: ${modelSetting.colors ?? ''};`" />

        </template>
      </template>
    </a-entity>
  </a-scene>
</template>