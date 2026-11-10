import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router, { initializeRouter } from './router'
import { PROJECT_CONFIG } from '@/core/config/project'

import './assets/main.css'

const startApp = async () => {
  document.title = PROJECT_CONFIG.title

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  await initializeRouter()

  //   console.log(
  //     '등록된 라우트:',
  //     router.getRoutes().map((route) => route.path),
  //   )

  app.use(router)

  await router.isReady()

  app.mount('#app')
}

startApp().catch((error) => {
  console.error('애플리케이션 초기화 실패:', error)
})
