import { createRouter, createWebHistory } from 'vue-router'

import LandingMain from '@/views/portal/LandingMain.vue'
import RegistAgree from '@/views/portal/RegistAgree.vue'
import CmpltView from '@/views/portal/CmpltView.vue'

import AdminAuth from '@/views/admin/AdminAuth.vue'
import AdminMain from '@/views/admin/AdminMain.vue'

import { useAuthStore } from '@/stores/auth'
import { getAppBasePath } from '@/core/utils/appBasePath'

const basePath = getAppBasePath()

const router = createRouter({
  history: createWebHistory(basePath ? `${basePath}/` : '/'),

  routes: [
    {
      path: '/',
      name: 'LandingMain',
      component: LandingMain,
    },
    {
      path: '/regist',
      name: 'RegistAgree',
      component: RegistAgree,
    },
    {
      path: '/complete',
      name: 'CmpltView',
      component: CmpltView,
    },
    {
      path: '/admin',
      name: 'AdminAuth',
      component: AdminAuth,
    },
    {
      path: '/admin/main',
      name: 'AdminMain',
      component: AdminMain,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true)

  if (!requiresAuth) {
    return true
  }

  if (!authStore.accessToken) {
    return {
      name: 'AdminAuth',
      replace: true,
    }
  }

  return true
})

export default router
