import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(sessionStorage.getItem('accessToken'))

  const adminId = ref<string | null>(sessionStorage.getItem('admin_id'))

  const isAuthenticated = computed(() => !!accessToken.value)

  // 로그인 정보 저장
  const setAuth = (token: string, id: string) => {
    accessToken.value = token
    adminId.value = id

    sessionStorage.setItem('accessToken', token)
    sessionStorage.setItem('admin_id', id)
  }

  // 인증 정보 초기화
  const clearAuth = () => {
    accessToken.value = null
    adminId.value = null

    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('admin_id')
  }

  return {
    accessToken,
    adminId,
    isAuthenticated,
    setAuth,
    clearAuth,
  }
})
