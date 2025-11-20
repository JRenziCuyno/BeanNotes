// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import wasm from "vite-plugin-wasm";
// import topLevelAwait from "vite-plugin-top-level-await";
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(), 
//     wasm(),
//     topLevelAwait(),
//     nodePolyfills(),
//   ],
//   define: {
//     global: 'window',
//   },
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      // Force polyfills for these specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  // This 'define' block is critical for MeshSDK
  define: {
    global: 'window',
  },
})