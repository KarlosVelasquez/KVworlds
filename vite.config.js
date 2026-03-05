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
            if (id.includes('node_modules/@react-three') || id.includes('node_modules/@dimforge')) {
              return 'vendor-react-three'
            }

            if (id.includes('node_modules/@splinetool') || id.includes('node_modules/three')) {
              return 'vendor-spline-three'
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