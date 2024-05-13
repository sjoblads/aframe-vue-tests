<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import PdfEntity from '@/components/PdfEntity.vue';

const activePage = ref(1);

const pdfEntities = ref<InstanceType<typeof PdfEntity>[]>()
const nrPages = computed(() => {
  return pdfEntities.value?.map(entity => entity.numPages);
})
const pdfs = ref<{ src: string, position: string, currentPage: number }[]>([
  { src: '/documents/compressed.tracemonkey-pldi-09.pdf', position: '0 1.7 0', currentPage: 0 },
  { src: '/documents/smallpdf_sample.pdf', position: '4 2 0', currentPage: 0 },
]);

function nextPages() {
  // if(!nrPages.value) return;
  pdfs.value.forEach((pdf, idx) => { pdf.currentPage = (pdf.currentPage + 1) % nrPages.value[idx] })
}

</script>

<template>
  <div class="absolute z-50 left-5 top-5">

    <button @click="nextPages">next</button> {{ activePage }}
  </div>
  <a-scene background="color: lightskyblue">
    <a-assets>
    </a-assets>
    <a-box color="red" position="-1 1 -3" />
    <a-entity position="0 0 -4">

      <PdfEntity v-for="pdf in pdfs" :key="pdf.src" ref="pdfEntities" :src="pdf.src" :current-page="pdf.currentPage + 1"
        scale="2 2 1" :position="pdf.position" />
      <!-- <PdfEntity src="/documents/sample.pdf" :current-page="activePage" position="4 2 0" scale="4 4 1" /> -->
    </a-entity>

  </a-scene>

</template>