import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Purch',
      fileName: 'purch',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      'purch': mode === 'production' 
        ? 'purch' 
        : path.resolve(__dirname, './src/index.ts')
    }
  },
  optimizeDeps: {
    exclude: ['vue']
  }
}))
