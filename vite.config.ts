import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { viteExternalsPlugin } from 'vite-plugin-externals';



// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb'],
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('a-'),
        },
        transformAssetUrls: {
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href'],
          'a-asset-item': ['src'],
        },
      }
    }),
    VueDevTools(),
    viteExternalsPlugin({
      three: 'THREE'
    }, {useWindow: false}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // define: {
  //   THREE
  // }
  build: {
    target: 'es2022'
  // rollupOptions: {
  //   external: ['three'],
  //   output: {
  //     globals: {
  //       three: 'THREE',
  //       aframe: 'AFRAME'
  //     }
  //   }
    // }
  },
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
    // exclude: ['three', 'three-mesh-ui', 'troika-three-text > three']
  }
})
