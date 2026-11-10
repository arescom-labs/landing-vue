import type { RouteRecordRaw } from 'vue-router'

// Portal
import LandingMain from './portal/LandingMain.vue'
import RegistAgree from './portal/RegistAgree.vue'
import CmpltView from './portal/CmpltView.vue'

// Admin
import AdminAuth from './admin/AdminAuth.vue'
import AdminMain from './admin/AdminMain.vue'

const routes: RouteRecordRaw[] = [
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
]

export default routes
