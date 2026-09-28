import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({ plugins: [vue()], base: './', build: { outDir: 'dist', rollupOptions: { output: { manualChunks(id) { if (id.includes('node_modules')) { if (id.includes('@ant-design/icons')) return 'icons'; if (id.includes('ant-design-vue')) return 'antd'; return 'vendor'; } } } } } })
