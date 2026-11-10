<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { Toaster } from '@/components/ui/sonner'

const router = useRouter()
const authStore = useAuthStore()

const handlePageShow = () => {
  const requiresAuth = router.currentRoute.value.matched.some(
    (record) => record.meta.requiresAuth === true,
  )

  if (!requiresAuth) return

  if (!authStore.accessToken) {
    authStore.clearAuth()
    router.replace({ name: 'AdminAuth' })
  }
}

onMounted(() => {
  window.addEventListener('pageshow', handlePageShow)
})

onUnmounted(() => {
  window.removeEventListener('pageshow', handlePageShow)
})
</script>

<template>
  <Toaster position="top-center" rich-colors />
  <RouterView />
</template>
