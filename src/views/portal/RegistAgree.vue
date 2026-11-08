<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { portalApi } from '@/api/axios'

const router = useRouter()

// 신청 정보
const formData = ref({
  adhrncNm: '',
  custNm01: '',
  moblphon: '',
  custNm02: '',
  agree: false,
})

// 입력 오류
const errors = ref({
  adhrncNm: false,
  custNm01: false,
  moblphon: false,
  agree: false,
})

// 입력 요소 참조
const adhrncNmInput = ref<HTMLInputElement | null>(null)
const custNm01Input = ref<HTMLInputElement | null>(null)
const moblphonInput = ref<HTMLInputElement | null>(null)
const agreeInput = ref<HTMLInputElement | null>(null)

// API 처리 상태
const loading = ref(false)

// Toast 상태
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('error')
const toastVisible = ref(false)

let toastTimer: ReturnType<typeof setTimeout> | undefined

// Toast 표시
const showToast = (message: string, type: 'success' | 'error' = 'error') => {
  toastMessage.value = message
  toastType.value = type
  toastVisible.value = true

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

// 누락된 항목으로 포커스 및 스크롤 이동 후 Toast 표시
const focusAndToast = async (element: HTMLInputElement | null, message: string) => {
  if (!element) return

  element.focus({ preventScroll: true })

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })

  // 스크롤 애니메이션이 진행될 시간을 확보
  await new Promise((resolve) => window.setTimeout(resolve, 600))

  showToast(message)
}

// 이전 화면 이동
const goBack = () => {
  router.push('/')
}

// 전화번호 자동 하이픈
const onPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  let value = target.value.replace(/\D/g, '').slice(0, 11)

  if (value.length > 7) {
    value =
      value.length === 11
        ? value.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
        : value.replace(/^(\d{3})(\d{3,4})(\d{0,4})$/, '$1-$2-$3')
  } else if (value.length > 3) {
    value = value.slice(0, 3) + '-' + value.slice(3)
  }

  formData.value.moblphon = value
  errors.value.moblphon = false
}

// 입력 오류 초기화
const clearError = (field: keyof typeof errors.value) => {
  errors.value[field] = false
}

// 신청서 검증 및 API 호출
const onSubmit = async () => {
  if (loading.value) return

  // 기존 오류 초기화
  errors.value = {
    adhrncNm: false,
    custNm01: false,
    moblphon: false,
    agree: false,
  }

  const adhrncNm = formData.value.adhrncNm.trim()
  const custNm01 = formData.value.custNm01.trim()
  const moblphon = formData.value.moblphon.replace(/\D/g, '')

  // 1. 성명 검사
  if (!adhrncNm) {
    errors.value.adhrncNm = true
    await focusAndToast(adhrncNmInput.value, '성명을 입력해 주세요.')
    return
  }

  // 2. 소속 검사
  if (!custNm01) {
    errors.value.custNm01 = true
    await focusAndToast(custNm01Input.value, '소속을 입력해 주세요.')
    return
  }

  // 3. 연락처 검사
  if (!moblphon) {
    errors.value.moblphon = true
    await focusAndToast(moblphonInput.value, '연락처를 입력해 주세요.')
    return
  }

  if (!/^01[016789]\d{7,8}$/.test(moblphon)) {
    errors.value.moblphon = true
    await focusAndToast(moblphonInput.value, '올바른 휴대전화 번호를 입력해 주세요.')
    return
  }

  // 4. 개인정보 수집·이용 동의 검사
  if (!formData.value.agree) {
    errors.value.agree = true
    await focusAndToast(agreeInput.value, '개인정보 수집 및 이용에 동의해 주세요.')
    return
  }

  // 5. 모든 필수 항목 통과 후 API 호출
  try {
    loading.value = true

    const requestData = {
      adhrncNm,
      custNm01,
      moblphon,
      custNm02: formData.value.custNm02.trim(),
    }

    await portalApi.post('/adhrnc/regist', requestData)

    showToast('참가 신청이 완료되었습니다.', 'success')

    router.push('/complete')
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const responseMessage = error.response?.data?.message

      showToast(
        typeof responseMessage === 'string' ? responseMessage : '참가 신청 중 오류가 발생했습니다.',
      )
    } else {
      showToast('참가 신청 중 오류가 발생했습니다.')
    }
  } finally {
    loading.value = false
  }
}

// 컴포넌트 종료 시 타이머 정리
onBeforeUnmount(() => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>

<template>
  <main class="regist-wrap">
    <section class="regist-page">
      <!-- 상단 영역 -->
      <header class="form-header">
        <div class="header-wave">
          <svg viewBox="0 0 640 14" preserveAspectRatio="none">
            <path d="M0 14 V8 C140 2 300 0 420 4 S580 10 640 12 V14Z" fill="#2c4a68" opacity=".7" />
            <path d="M0 14 V11 C160 6 320 5 460 9 S600 13 640 14Z" fill="#fff" />
          </svg>
        </div>
      </header>

      <!-- 로고 -->
      <div class="logo">
        <b>OW</b>
        <small>OCEAN WINDS</small>
      </div>

      <!-- 행사명 -->
      <div class="event-heading">
        <span>2026 한반도해상풍력 연말 초청 만찬</span>
        <strong>함께 알아가는 미래: 어업인 소통의 장</strong>
      </div>

      <form class="application-form" @submit.prevent="onSubmit">
        <!-- 신청서 제목 -->
        <h2 class="section-title">
          참가신청서
          <i></i>
          <span>Application form</span>
        </h2>

        <div class="section-rule"></div>

        <!-- 성명 -->
        <div class="field-group field-name">
          <label for="adhrncNm" class="field-label">
            <span class="required">*</span>
            성명
            <small>Name</small>
          </label>

          <input
            id="adhrncNm"
            ref="adhrncNmInput"
            v-model="formData.adhrncNm"
            class="form-input"
            :class="{ 'is-error': errors.adhrncNm }"
            autocomplete="name"
            placeholder="성명 입력"
            maxlength="30"
            @input="clearError('adhrncNm')"
          />
        </div>

        <!-- 소속 -->
        <div class="field-group field-org">
          <label for="custNm01" class="field-label">
            <span class="required">*</span>
            소속
            <small>Organization</small>
          </label>

          <input
            id="custNm01"
            ref="custNm01Input"
            v-model="formData.custNm01"
            class="form-input"
            :class="{ 'is-error': errors.custNm01 }"
            autocomplete="organization"
            placeholder="소속 입력"
            maxlength="50"
            @input="clearError('custNm01')"
          />
        </div>

        <!-- 연락처 -->
        <div class="field-group field-phone">
          <label for="moblphon" class="field-label">
            <span class="required">*</span>
            전화번호
            <small>Mobile</small>
          </label>

          <input
            id="moblphon"
            ref="moblphonInput"
            :value="formData.moblphon"
            class="form-input"
            :class="{ 'is-error': errors.moblphon }"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="숫자만 입력"
            maxlength="13"
            @input="onPhoneInput"
          />
        </div>

        <!-- 선박명 -->
        <div class="field-group field-custNm02">
          <label for="custNm02" class="field-label">
            선박명
            <small>Vessel</small>
            <small class="optional">(선택)</small>
          </label>

          <input
            id="custNm02"
            v-model="formData.custNm02"
            class="form-input"
            placeholder="선박명 입력"
            maxlength="40"
          />
        </div>

        <!-- 개인정보 동의 제목 -->
        <h2 class="section-title privacy-title">
          개인정보 수집·이용 동의
          <i></i>
          <span>Privacy</span>
        </h2>

        <div class="section-rule privacy-rule"></div>

        <!-- 개인정보 안내 -->
        <div class="privacy-box">
          <b>[개인정보 수집·이용 동의]</b>

          주최 측은 「개인정보 보호법」에 따라 행사 운영을 위해 아래와 같이 개인정보를
          수집·이용합니다.

          <b class="privacy-heading">1. 수집·이용 목적</b>
          - 연말 초청 만찬 참석 확인 및 참석자 관리
          <br />
          - 행사 일정·장소 등 관련 안내 문자 발송

          <b class="privacy-heading">2. 수집 항목</b>
          - 필수 : 성명, 소속, 전화번호
          <br />
          - 선택 : 선박명

          <b class="privacy-heading">3. 보유·이용 기간</b>
          - 행사 종료 후 지체 없이 파기

          <b class="privacy-heading">4. 동의 거부 권리 및 불이익</b>
          - 귀하는 동의를 거부할 권리가 있으며, 거부 시
          <br />
          <span class="privacy-indent"> 행사 참가 신청이 제한될 수 있습니다. </span>
        </div>

        <!-- 개인정보 동의 -->
        <label class="agree-box" :class="{ 'is-error': errors.agree }">
          <input
            ref="agreeInput"
            v-model="formData.agree"
            type="checkbox"
            @change="clearError('agree')"
          />

          <span class="check-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              stroke-width="3.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>

          <span>
            개인정보 수집 및 이용에 동의합니다.
            <em>(필수)</em>
          </span>
        </label>

        <!-- 하단 버튼 영역 -->
        <div class="form-footer"></div>

        <button type="button" class="back-button" @click="goBack">이전</button>

        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? '신청 처리 중...' : '참가 신청 완료' }}
        </button>
      </form>
    </section>

    <!-- Toast 알림 -->
    <Transition name="toast-slide">
      <div
        v-if="toastVisible"
        class="toast-message"
        :class="`toast-${toastType}`"
        role="alert"
        aria-live="assertive"
      >
        <span class="toast-icon">
          {{ toastType === 'error' ? '!' : '✓' }}
        </span>

        <span class="toast-text">
          {{ toastMessage }}
        </span>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.regist-wrap {
  --u: calc(min(100vw, 640px) / 640);

  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: hidden;
  background: #1d2937;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.regist-page {
  position: relative;
  width: calc(640 * var(--u));
  height: calc(1136 * var(--u));
  flex-shrink: 0;
  overflow: hidden;
  background: #fff;
}

/* 상단 헤더 */
.form-header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(104 * var(--u));
  background: #1d2937;
}

.header-wave {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: calc(14 * var(--u));
}

.header-wave svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* 로고 */
.logo {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(24 * var(--u));
  width: calc(62 * var(--u));
  height: calc(44 * var(--u));
  background: #ffe500;
  color: #11262f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo b {
  font-size: calc(23 * var(--u));
  font-weight: 300;
  line-height: 1;
}

.logo small {
  margin-top: calc(4 * var(--u));
  font-size: calc(4.2 * var(--u));
  letter-spacing: 0.08em;
  line-height: 1;
}

/* 행사 제목 */
.event-heading {
  position: absolute;
  left: calc(120 * var(--u));
  top: calc(36 * var(--u));
  display: flex;
  flex-direction: column;
  gap: calc(5 * var(--u));
}

.event-heading span {
  font-size: calc(13 * var(--u));
  font-weight: 500;
  color: #ffe500;
}

.event-heading strong {
  font-size: calc(19 * var(--u));
  font-weight: 700;
  color: #fff;
}

/* 신청서 */
.application-form {
  position: absolute;
  inset: 0;
}

/* 섹션 제목 */
.section-title {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(129 * var(--u));
  margin: 0;
  font-size: calc(21 * var(--u));
  font-weight: 800;
  color: #1f5f84;
}

.section-title i {
  display: inline-block;
  width: calc(2 * var(--u));
  height: calc(18 * var(--u));
  margin: 0 calc(12 * var(--u));
  background: #b9c4cc;
  vertical-align: calc(-1 * var(--u));
}

.section-title span {
  font-size: calc(18 * var(--u));
  font-weight: 700;
}

/* 구분선 */
.section-rule {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(157 * var(--u));
  width: calc(560 * var(--u));
  height: calc(2 * var(--u));
  background: #1f5f84;
}

/* 입력 항목 */
.field-group {
  position: absolute;
  width: calc(272 * var(--u));
}

.field-name,
.field-org {
  top: calc(178 * var(--u));
}

.field-phone,
.field-custNm02 {
  top: calc(262 * var(--u));
}

.field-name,
.field-phone {
  left: calc(40 * var(--u));
}

.field-org,
.field-custNm02 {
  left: calc(328 * var(--u));
}

.field-label {
  display: block;
  margin-bottom: calc(8 * var(--u));
  font-size: calc(16 * var(--u));
  font-weight: 700;
  color: #11262f;
}

.field-label small {
  margin-left: calc(6 * var(--u));
  font-size: calc(13 * var(--u));
  font-weight: 400;
  color: #6f7f88;
}

.field-label .required {
  margin-right: calc(5 * var(--u));
  color: #d94848;
}

.field-label .optional {
  margin-left: calc(4 * var(--u));
  font-size: calc(12 * var(--u));
}

.form-input {
  width: 100%;
  height: calc(48 * var(--u));
  padding: 0 calc(16 * var(--u));
  border: 1px solid #e1e5e9;
  border-radius: calc(9 * var(--u));
  background: #f2f3f5;
  color: #11262f;
  font-family: inherit;
  font-size: 16px;
  outline: none;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.form-input::placeholder {
  color: #9aa9b1;
}

.form-input:focus {
  border-color: #1f5f84;
  background: #fff;
}

.form-input.is-error {
  border-color: #d94848;
  background: #fff5f5;
}

/* 개인정보 제목 */
.privacy-title {
  top: calc(363 * var(--u));
}

.privacy-rule {
  top: calc(391 * var(--u));
}

/* 개인정보 안내 */
.privacy-box {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(408 * var(--u));
  width: calc(560 * var(--u));
  height: calc(452 * var(--u));
  padding: calc(23 * var(--u)) calc(22 * var(--u));
  overflow-y: auto;
  border: 1px solid #cdd6da;
  border-radius: calc(10 * var(--u));
  background: #f1f2f4;
  color: #4a5d66;
  font-size: calc(14 * var(--u));
  line-height: calc(22 * var(--u));
}

.privacy-box b {
  display: block;
  color: #11262f;
  font-size: calc(15 * var(--u));
}

.privacy-box .privacy-heading {
  margin-top: calc(8 * var(--u));
}

.privacy-indent {
  padding-left: calc(7 * var(--u));
}

/* 동의 체크 */
.agree-box {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(877 * var(--u));
  width: calc(560 * var(--u));
  height: calc(52 * var(--u));
  display: flex;
  align-items: center;
  gap: calc(14 * var(--u));
  padding-left: calc(16 * var(--u));
  border: calc(2 * var(--u)) solid #edd827;
  border-radius: calc(10 * var(--u));
  background: #fff9c7;
  color: #11262f;
  cursor: pointer;
  font-size: calc(16 * var(--u));
  font-weight: 700;
}

.agree-box input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.check-icon {
  width: calc(26 * var(--u));
  height: calc(26 * var(--u));
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: calc(2 * var(--u)) solid #8d9ba6;
  border-radius: calc(5 * var(--u));
  background: #fff;
}

.check-icon svg {
  width: calc(17 * var(--u));
  height: calc(17 * var(--u));
  opacity: 0;
}

.agree-box input:checked + .check-icon {
  border-color: #2f4f6f;
  background: #2f4f6f;
}

.agree-box input:checked + .check-icon svg {
  opacity: 1;
}

.agree-box em {
  color: #d94848;
  font-style: normal;
}

.agree-box.is-error {
  border-color: #d94848;
  background: #fff2f2;
}

/* 하단 */
.form-footer {
  position: absolute;
  left: 0;
  top: calc(944 * var(--u));
  width: 100%;
  height: calc(192 * var(--u));
  background: #1d2937;
}

.back-button,
.submit-button {
  position: absolute;
  top: calc(962 * var(--u));
  height: calc(66 * var(--u));
  border: 0;
  border-radius: calc(33 * var(--u));
  font-family: inherit;
  font-size: calc(21 * var(--u));
  font-weight: 800;
  cursor: pointer;
  transition:
    filter 0.2s,
    transform 0.1s;
}

.back-button {
  left: calc(40 * var(--u));
  width: calc(150 * var(--u));
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: #fff;
}

.submit-button {
  left: calc(208 * var(--u));
  width: calc(392 * var(--u));
  background: #ffe500;
  color: #11262f;
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.back-button:hover,
.submit-button:not(:disabled):hover {
  filter: brightness(0.96);
}

.back-button:active,
.submit-button:not(:disabled):active {
  transform: scale(0.985);
}

/* 하단 Toast */
.toast-message {
  position: fixed;
  z-index: 9999;
  left: 50%;
  bottom: max(32px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  width: max-content;
  max-width: calc(100vw - 32px);
  padding: 15px 22px;
  border-radius: 12px;
  background: #1d2937;
  color: #fff;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
  font-size: 15px;
  font-weight: 600;
  word-break: keep-all;
}

.toast-error .toast-icon {
  background: #e05252;
}

.toast-success .toast-icon {
  background: #269b70;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}

.toast-text {
  line-height: 1.5;
}

/* 아래에서 위로 등장 */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 30px);
}
</style>
