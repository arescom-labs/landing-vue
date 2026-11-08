import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // WAR 파일명에 관계없이 상대 경로 사용
  base: './',

  plugins: [vue(), vueDevTools(), tailwindcss()],

  // Spring Boot API 연동
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Spring Boot 정적 리소스 경로로 빌드
  build: {
    outDir: 'D:/dev/0.src/0.arescom/Landing/src/main/resources/static',
    emptyOutDir: true,
  },
})
