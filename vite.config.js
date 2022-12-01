import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),


    // Element plus
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),

    {
      ...Components({
        resolvers: [ElementPlusResolver()]
      }),
      enforce: 'pre'
    }
  ],

})
