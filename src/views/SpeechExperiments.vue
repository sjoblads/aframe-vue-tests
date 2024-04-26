<script setup lang="ts">
import Meyda from 'meyda';
import { onMounted, reactive, ref } from 'vue';

const audioTag = ref<HTMLAudioElement>();

const nrOfBands = 25;
const mfccCoffs = reactive<number[]>(Array(nrOfBands).fill(0));

onMounted(() => {
  const audioCtx = new AudioContext();
  if (!audioTag.value) return;
  audioTag.value
  const source = audioCtx.createMediaElementSource(audioTag.value);

  const analyser = Meyda.createMeydaAnalyzer({
    audioContext: audioCtx,
    source,
    numberOfMFCCCoefficients: nrOfBands,
    bufferSize: 2048,
    featureExtractors: ['mfcc'],
    callback: (features) => {
      for (let i = 0; i < features.mfcc.length; i++) {
        mfccCoffs[i] = features.mfcc[i];
      };
      console.log(features);
    }
  })

  analyser.start();

  source.connect(audioCtx.destination);
})

</script>
<template>

  <audio ref="audioTag" controls loop crossorigin="anonymous" id="audio" src="/audio/speech-test.mp3"></audio>
  <div v-for="coff in mfccCoffs">
    <p>
      <!-- {{ coff }} -->
      <template v-if="coff > 0">
        <template v-for="n in Math.trunc(coff * 5)">-</template>
      </template>
    </p>
  </div>
</template>