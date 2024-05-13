<script setup lang="ts">
import { onBeforeMount, onMounted, ref, shallowRef, watch, type Ref } from 'vue';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';

import { useScriptTag } from '@vueuse/core';
import type { Entity } from 'aframe';

const pdfjsLoaded = ref(false);
useScriptTag('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs', async el => {
  console.log('pdfjs loaded');
  // @ts-ignore
  const { pdfjsLib } = globalThis;

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.mjs'
  pdfjsLoaded.value = true;
  loadDocument(props.src);
}, { type: 'module' })

const props = defineProps<{
  // pdfEntityRef: Entity | undefined,
  src: string,
  currentPage: number,
}>()

const uuid = crypto.randomUUID().substring(0, 8);;
const canvasSelector = `pdf-${uuid}`;

const pdfCanvasTag = ref<HTMLCanvasElement>();
const pdfEntityTag = ref<Entity>();

// const activePage = ref(1);
let numPages = 0;

let loadedDoc = shallowRef<PDFDocumentProxy>();

// function nextPage() {
//   activePage.value = (activePage.value + 1) % numPages;
//   renderPage(activePage.value + 1);
// }
watch(() => props.currentPage, newPage => renderPage(newPage));
watch(() => props.src, newSrc => loadDocument(newSrc));

async function loadDocument(src: string) {
  if (!pdfjsLoaded.value) return;
  // @ts-ignore
  const { pdfjsLib } = globalThis;
  const pdfDoc = pdfjsLib.getDocument('/documents/compressed.tracemonkey-pldi-09.pdf') as PDFDocumentLoadingTask;
  loadedDoc.value = await pdfDoc.promise
  numPages = loadedDoc.value.numPages;
  console.log(numPages);
  await renderPage(props.currentPage);
  pdfEntityTag.value?.emit('canvasReady');
}

async function renderPage(pageIdx: number = 1) {
  console.log(pageIdx);
  if (!loadedDoc.value || !pdfCanvasTag.value) return;
  const canvas = pdfCanvasTag.value
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const page = await loadedDoc.value.getPage(pageIdx)
  const vp = page.getViewport({ scale: 4, })
  // console.log(vp);
  canvas.width = vp.width;
  canvas.height = vp.height;
  let renderCtx = { canvasContext: ctx, viewport: vp };
  await page.render(renderCtx).promise;
  console.log('rendered');
  pdfEntityTag.value?.emit('update');
}

</script>

<template>
  <a-entity ref="pdfEntityTag" :canvas-material="`autoUpdate: false; src: #${canvasSelector};`" />
  <Teleport to="body">
    <canvas :id="canvasSelector" style="display: block;" ref="pdfCanvasTag"></canvas>
  </Teleport>
</template>