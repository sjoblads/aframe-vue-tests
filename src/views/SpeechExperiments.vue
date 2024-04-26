<script setup lang="ts">
// import Meyda from 'meyda';
import { onMounted, reactive, ref } from 'vue';

const audioTag = ref<HTMLAudioElement>();

const nrOfBands = 25;
const mfccCoffs = reactive<number[]>(Array(nrOfBands).fill(0));

onMounted(() => {
  const audioCtx = new AudioContext();
  if (!audioTag.value) return;
  audioTag.value
  const source = audioCtx.createMediaElementSource(audioTag.value);

  const analyser = audioCtx.createAnalyser()
  source.connect(analyser);
  analyser.fftSize = 2048;
  analyser.connect(audioCtx.destination);

  const bufferLength = analyser.frequencyBinCount;
  const fftData = new Float32Array(analyser.frequencyBinCount)
  // setInterval(() => {
  //   analyser.getFloatFrequencyData(fftData);
  //   console.log(fftData);

  // }, 100)

  //Create 2D canvas
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  // canvas.style.position = "absolute";
  // canvas.style.top = "0";
  // canvas.style.left = "0";
  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight / 2;
  document.body.appendChild(canvas);
  const canvasCtx = canvas.getContext("2d")!;
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);

  //Get spectrum data
    analyser.getFloatFrequencyData(fftData);

    //Draw black background
    canvasCtx.fillStyle = "rgb(0 0 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw spectrum
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let posX = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (fftData[i] + 140) * 2;
      canvasCtx.fillStyle = `rgb(${Math.floor(barHeight + 100)} 50 50)`;
      canvasCtx.fillRect(
        posX,
        canvas.height - barHeight / 2,
        barWidth,
        barHeight / 2,
      );
      posX += barWidth + 1;
    }
  }

  draw();

  // const analyser = Meyda.createMeydaAnalyzer({
  //   audioContext: audioCtx,
  //   source,
  //   numberOfMFCCCoefficients: nrOfBands,
  //   bufferSize: 2048,
  //   featureExtractors: ['mfcc'],
  //   callback: (features) => {
  //     for (let i = 0; i < features.mfcc.length; i++) {
  //       mfccCoffs[i] = features.mfcc[i];
  //     };
  //     console.log(features);
  //   }
  // })

  // analyser.start();

  // source.connect(audioCtx.destination);
})

</script>
<template>

  <audio ref="audioTag" controls loop crossorigin="anonymous" id="audio" src="/audio/speech-test.mp3"></audio>
  <div style="word-break: keep-all; background-color: green;" v-for="coff in mfccCoffs">
    <!-- {{ coff }} -->
    <template v-if="coff > 0">
      <template v-for="n in Math.trunc(coff * 5)">-</template>
    </template>
  </div>
</template>