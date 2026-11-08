import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios'

import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { getAppBasePath } from '@/core/utils/appBasePath'

const basePath = getAppBasePath()

// 일반 사용자 API
export const portalApi = axios.create({
  baseURL: `${basePath}/api/portal`,
  timeout: 10000,
})

// 관리자 API
export const adminApi = axios.create({
  baseURL: `${basePath}/api/admin`,
  timeout: 10000,
})

// 관리자 API 요청에 accessToken 자동 추가
const addAccessToken = (config: InternalAxiosRequestConfig) => {
  const accessToken = sessionStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

// 관리자 요청 인터셉터
adminApi.interceptors.request.use(addAccessToken, (error: unknown) => Promise.reject(error))

// 관리자 응답 인터셉터
adminApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()

      authStore.clearAuth()

      if (router.currentRoute.value.path !== '/admin') {
        await router.replace('/admin')
      }
    }

    return Promise.reject(error)
  },
)
