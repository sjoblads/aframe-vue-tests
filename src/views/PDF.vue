<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
// import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

import { useScriptTag } from '@vueuse/core';

useScriptTag('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs', async el => {
  console.log('pdfjs loaded');
  // @ts-ignore
  const { pdfjsLib } = globalThis;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.mjs'
  // const pdfDoc = pdfjsLib.getDocument('/documents/sample.pdf') as PDFDocumentLoadingTask;
  const pdfDoc = pdfjsLib.getDocument('/documents/compressed.tracemonkey-pldi-09.pdf') as PDFDocumentLoadingTask;
  loadedDoc = await pdfDoc.promise
  numPages = loadedDoc.numPages;

}, { type: 'module' })


const pdfCanvasTag = ref<HTMLCanvasElement>();

const activePage = ref(0);
let numPages = 0;

let loadedDoc: undefined | PDFDocumentProxy;

onBeforeMount(async () => {

  // const pdfjs = (await import('pdfjs-dist')).default;
  // pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc
})

async function renderPage(pageIdx: number = 0) {
  if (!loadedDoc || !pdfCanvasTag.value) return;
  const canvas = pdfCanvasTag.value
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const page = await loadedDoc.getPage(pageIdx)
  const vp = page.getViewport({ scale: 2, })
  console.log(vp);
  canvas.width = vp.width;
  canvas.height = vp.height;
  let renderCtx = { canvasContext: ctx, viewport: vp };
  await page.render(renderCtx).promise;
}



</script>

<template>
  <button @click="activePage = (activePage + 1) % numPages; renderPage(activePage)">next</button> {{ activePage }}
  <a-scene embedded class="w-96 h-96 bg-zinc-400">
    <a-box color="red" position="0 1 -3" />
    <a-entity canvas-material="src: #pdf-target; autoUpdate: true;" geometry="primitive: plane;" position="1 1 -4" />

  </a-scene>
  <canvas class="bg-zinc-600" ref="pdfCanvasTag" id="pdf-target"></canvas>


</template>