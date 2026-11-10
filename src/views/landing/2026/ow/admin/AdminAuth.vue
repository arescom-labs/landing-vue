<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'

import { adminApi } from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

interface LoginResponse {
  accessToken: string
}

const router = useRouter()
const authStore = useAuthStore()

const adminId = ref('')
const adminPw = ref('')
const rememberId = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')

// 저장된 아이디 불러오기
onMounted(() => {
  try {
    const savedId = localStorage.getItem('admin_id')

    if (savedId) {
      adminId.value = savedId
      rememberId.value = true
    }
  } catch {
    // 브라우저 저장소 사용이 불가능한 경우 무시
  }
})

// 오류 메시지 초기화
const clearError = () => {
  loginError.value = ''
}

// 로그인 처리
const handleLogin = async () => {
  loginError.value = ''

  const id = adminId.value.trim()
  const pw = adminPw.value

  if (!id || !pw) {
    loginError.value = '아이디와 비밀번호를 입력해 주세요.'
    return
  }

  loading.value = true

  try {
    const response = await adminApi.post<LoginResponse>('/auth/login', {
      adminId: id,
      adminPw: pw,
    })

    const token = response.data.accessToken

    if (!token) {
      throw new Error('인증 토큰이 없습니다.')
    }

    // 아이디 저장 여부 처리
    if (rememberId.value) {
      localStorage.setItem('admin_id', id)
    } else {
      localStorage.removeItem('admin_id')
    }

    // Pinia 및 sessionStorage 인증 정보 저장
    authStore.setAuth(token, id)

    // 관리자 메인 화면 이동
    await router.replace('/admin/main')
  } catch {
    loginError.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="admin-login">
    <div class="login-card">
      <!-- 로그인 헤더 -->
      <div class="login-head">
        <div class="logo" aria-label="Ocean Winds">
          <b>OW</b>
          <small>OCEAN WINDS</small>
        </div>

        <p>2026 한반도해상풍력 연말 초청 만찬</p>
        <h1>관리자 로그인</h1>
      </div>

      <!-- 로그인 폼 -->
      <form class="login-form" novalidate @submit.prevent="handleLogin">
        <!-- 아이디 -->
        <div class="field">
          <label for="adminId">아이디</label>

          <input
            id="adminId"
            v-model="adminId"
            class="login-input"
            type="text"
            autocomplete="username"
            placeholder="아이디 입력"
            @input="clearError"
          />
        </div>

        <!-- 비밀번호 -->
        <div class="field">
          <label for="adminPw">비밀번호</label>

          <div class="pw-wrap">
            <input
              id="adminPw"
              v-model="adminPw"
              class="login-input"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="비밀번호 입력"
              @input="clearError"
            />

            <button
              type="button"
              class="pw-toggle"
              :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" />
              <Eye v-else />
            </button>
          </div>
        </div>

        <!-- 아이디 저장 -->
        <label class="remember">
          <input v-model="rememberId" type="checkbox" />
          <span>아이디 저장</span>
        </label>

        <!-- 로그인 오류 -->
        <div v-if="loginError" class="login-error" role="alert">
          {{ loginError }}
        </div>

        <!-- 로그인 버튼 -->
        <button class="login-button" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>로그인</span>
        </button>
      </form>

      <!-- 하단 안내 -->
      <p class="login-foot">
        관계자 외 접근을 금합니다.
        <br />
        계정 문의는 행사 운영 담당자에게 연락해 주세요.
      </p>
    </div>
  </section>
</template>

<style scoped>
.admin-login {
  --navy: #1d2937;
  --card: #2b4663;
  --yellow: #ffe500;
  --ink: #11262f;
  --blue: #1f5f84;
  --red: #e5484d;

  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;

  background: radial-gradient(1200px 600px at 50% -10%, #2b4663 0%, var(--navy) 60%);

  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    sans-serif;

  color: #1b2a35;
  -webkit-font-smoothing: antialiased;
  word-break: keep-all;
}

/* 로그인 카드 */
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px 32px 32px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

/* 로그인 헤더 */
.login-head {
  text-align: center;
}

/* OW 로고 */
.logo {
  width: 72px;
  height: 50px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  background: var(--yellow);
  color: var(--ink);
}

.logo b {
  font-size: 27px;
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1;
}

.logo small {
  margin-top: 5px;
  font-size: 5px;
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1;
}

.login-head p {
  margin-top: 22px;
  font-size: 13px;
  font-weight: 500;
  color: var(--blue);
}

.login-head h1 {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 800;
  color: var(--ink);
}

/* 로그인 폼 */
.login-form {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field label {
  display: block;
  margin-bottom: 7px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
}

/* 입력 필드 */
.login-input {
  width: 100%;
  height: 48px;
  padding: 0 15px;

  border: 1px solid #dfe4e8;
  border-radius: 10px;

  background: #f2f3f5;
  font-size: 15px;
  outline: none;

  transition:
    border-color 0.15s,
    background 0.15s;
}

.login-input::placeholder {
  color: #9aa9b1;
}

.login-input:focus {
  border-color: var(--blue);
  background: #fff;
}

/* 비밀번호 표시 버튼 */
.pw-wrap {
  position: relative;
}

.pw-wrap .login-input {
  padding-right: 48px;
}

.pw-toggle {
  position: absolute;
  top: 6px;
  right: 6px;

  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8695a0;
  cursor: pointer;
}

.pw-toggle:hover {
  background: #e9edf0;
}

.pw-toggle :deep(svg) {
  width: 20px;
  height: 20px;
}

/* 아이디 저장 */
.remember {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 13.5px;
  color: #4a5d66;
  cursor: pointer;
  user-select: none;
}

.remember input {
  width: 17px;
  height: 17px;
  margin: 0;
  accent-color: var(--blue);
  cursor: pointer;
}

/* 로그인 오류 */
.login-error {
  padding: 10px 12px;

  border: 1px solid #f6c9cb;
  border-radius: 8px;

  background: #fff2f2;
  color: var(--red);
  font-size: 13px;
  line-height: 1.5;
}

/* 로그인 버튼 */
.login-button {
  width: 100%;
  height: 52px;
  margin-top: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 26px;

  background: var(--yellow);
  color: var(--ink);

  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  transition:
    filter 0.15s,
    transform 0.1s;
}

.login-button:hover {
  filter: brightness(0.96);
}

.login-button:active {
  transform: scale(0.98);
}

.login-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* 로딩 스피너 */
.spinner {
  width: 20px;
  height: 20px;

  border: 3px solid rgba(17, 38, 47, 0.25);
  border-top-color: var(--ink);
  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 하단 안내 */
.login-foot {
  margin-top: 22px;
  text-align: center;

  font-size: 12px;
  color: #8a98a2;
  line-height: 1.6;
}

/* 모바일 */
@media (max-width: 480px) {
  .admin-login {
    padding: 24px 16px;
  }

  .login-card {
    padding: 36px 24px 28px;
  }
}
</style>
