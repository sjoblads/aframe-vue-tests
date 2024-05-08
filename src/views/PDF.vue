<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
// import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

import { useScriptTag } from '@vueuse/core';
import type { Entity } from 'aframe';

useScriptTag('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs', async el => {
  console.log('pdfjs loaded');
  // @ts-ignore
  const { pdfjsLib } = globalThis;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.mjs'
  // const pdfDoc = pdfjsLib.getDocument('/documents/sample.pdf') as PDFDocumentLoadingTask;
  const pdfDoc = pdfjsLib.getDocument('/documents/compressed.tracemonkey-pldi-09.pdf') as PDFDocumentLoadingTask;
  loadedDoc = await pdfDoc.promise
  numPages = loadedDoc.numPages;
  console.log(numPages);
  await renderPage();
  pdfInVrTag.value?.emit('canvasReady') 

}, { type: 'module' })


const pdfCanvasTag = ref<HTMLCanvasElement>();
const pdfInVrTag = ref<Entity>();

const activePage = ref(1);
let numPages = 0;

let loadedDoc: undefined | PDFDocumentProxy;

function nextPage() {
  activePage.value = (activePage.value + 1) % numPages;
  renderPage(activePage.value + 1);
}

onBeforeMount(async () => {

  // const pdfjs = (await import('pdfjs-dist')).default;
  // pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc
})

async function renderPage(pageIdx: number = 1) {
  console.log(pageIdx);
  if (!loadedDoc || !pdfCanvasTag.value) return;
  const canvas = pdfCanvasTag.value
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const page = await loadedDoc.getPage(pageIdx)
  const vp = page.getViewport({ scale: 2, })
  // console.log(vp);
  canvas.width = vp.width;
  canvas.height = vp.height;
  let renderCtx = { canvasContext: ctx, viewport: vp };
  await page.render(renderCtx).promise;
  console.log('rendered');
  if (pdfInVrTag.value) {
    // console.log('updating material');
    pdfInVrTag.value.emit('update');
  }
}

onMounted(async () => { });



</script>

<template>
  <button @click="nextPage">next</button> {{ activePage }}
  <a-scene embedded class="w-96 h-96 bg-zinc-400">
    <a-assets>

      <canvas ref="pdfCanvasTag" class="bg-zinc-600" id="pdf-target"></canvas>
    </a-assets>
    <a-box color="red" position="-1 1 -3" />
    <a-entity ref="pdfInVrTag" canvas-material="autoUpdate: false; src: #pdf-target" position="1 1.6 -2" />

  </a-scene>


</template>