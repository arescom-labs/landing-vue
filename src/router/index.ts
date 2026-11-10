import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { PROJECT_CONFIG } from '@/core/config/project'
import { useAuthStore } from '@/stores/auth'
import { getAppBasePath } from '@/core/utils/appBasePath'

// 프로젝트별 라우트 동적 로딩
const routeModules = import.meta.glob('/src/views/{landing,onsite}/**/routes.ts')

const projectRoutePath = `/src/views/${PROJECT_CONFIG.category}/${PROJECT_CONFIG.year}/${PROJECT_CONFIG.projectName}/routes.ts`

const loadProjectRoutes = async (): Promise<RouteRecordRaw[]> => {
  const loadRoutes = routeModules[projectRoutePath]

  if (!loadRoutes) {
    throw new Error(`프로젝트 라우트 파일을 찾을 수 없습니다: ${projectRoutePath}`)
  }

  const module = (await loadRoutes()) as {
    default: RouteRecordRaw[]
  }

  return module.default
}

const basePath = getAppBasePath()

const router = createRouter({
  history: createWebHistory(basePath ? `${basePath}/` : '/'),
  routes: [],
})

// 인증 및 권한 검사
router.beforeEach((to) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true)

  if (!requiresAuth) return true

  if (!authStore.accessToken) {
    return {
      name: 'AdminAuth',
      replace: true,
    }
  }

  return true
})

// 프로젝트 라우트 초기화 함수
export const initializeRouter = async () => {
  const projectRoutes = await loadProjectRoutes()

  projectRoutes.forEach((route) => {
    router.addRoute(route)
  })
}

export default router
