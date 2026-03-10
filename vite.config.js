import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'
import { visualizer } from 'rollup-plugin-visualizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'

  return {
    plugins: [
      react(),
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'dist/bundle-report.html',
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
              open: false,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/@splinetool/react-spline')) {
              return 'vendor-spline-react'
            }

            if (id.includes('node_modules/@splinetool/runtime')) {
              return 'vendor-spline-runtime'
            }

            if (id.includes('node_modules/@react-three/fiber')) {
              return 'vendor-r3f'
            }

            if (id.includes('node_modules/@react-three/drei')) {
              return 'vendor-r3f-drei'
            }

            if (id.includes('node_modules/@react-three/rapier') || id.includes('node_modules/@dimforge')) {
              return 'vendor-r3f-rapier'
            }

            if (id.includes('node_modules/three')) {
              return 'vendor-three-core'
            }

            if (id.includes('node_modules/meshline')) {
              return 'vendor-three-meshline'
            }

            if (id.includes('node_modules/gsap')) {
              return 'vendor-gsap'
            }

            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
              return 'vendor-react-core'
            }

            return undefined
          },
        },
      },
    },
  }
})