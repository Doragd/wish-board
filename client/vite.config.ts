import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/wish-board/', // 必须与仓库名一致
  build: {
    outDir: '../dist'  // 构建输出到上级目录的dist
  }
})