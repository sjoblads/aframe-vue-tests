import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { viteExternalsPlugin } from 'vite-plugin-externals';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('a-'),
        }
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
  // build:{
  //   rollupOptions: {
  //     external: ['three'],
  //     output: {
  //       globals: {
  //         three: 'THREE',
  //         aframe: 'AFRAME'
  //       }
  //     }
  //   }
  // },
  // optimizeDeps: {
  //   exclude: ['three', 'three-mesh-ui', 'troika-three-text > three']
  // }
})
