<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { portalApi } from '@/api/axios'

const router = useRouter()

const formData = ref({
  adhrncNm: '',
  custNm01: '',
  custNm02: '',
  moblphon: '',
  email: '',
})

const agree = ref(false)
const termsAccepted = ref(false)
const privacyOpen = ref(false)
const loading = ref(false)

const toastMessage = ref('')
const toastVisible = ref(false)
const toastType = ref('')

const errors = reactive({
  adhrncNm: false,
  custNm01: false,
  custNm02: false,
  moblphon: false,
  email: false,
  agree: false,
})

let toastTimer: ReturnType<typeof setTimeout> | undefined

const isValidPhone = computed(() => {
  const phone = formData.value.moblphon.replace(/\D/g, '')
  return /^01[016789]\d{7,8}$/.test(phone)
})

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.value.email)
})

const showToast = (message: string, type = '') => {
  toastMessage.value = message
  toastType.value = type
  toastVisible.value = true

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2400)
}

/* 개인정보 안내 팝업 열기 */
const openTerms = () => {
  privacyOpen.value = true
}

/* 팝업 닫기 */
const closeTerms = () => {
  privacyOpen.value = false
}

/* 개인정보 동의 */
const acceptTerms = () => {
  agree.value = true
  termsAccepted.value = true
  errors.agree = false
  privacyOpen.value = false

  showToast('개인정보 수집 및 이용에 동의하셨습니다.')
}

/* 체크박스 클릭 */
const toggleAgree = () => {
  if (agree.value) {
    agree.value = false
    return
  }

  openTerms()
}

/* 휴대폰 자동 하이픈 */
const formatPhone = () => {
  let digits = formData.value.moblphon.replace(/\D/g, '').slice(0, 11)

  if (digits.length > 7) {
    digits =
      digits.length === 11
        ? digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')
        : digits.replace(/^(\d{3})(\d{3,4})(\d{0,4})$/, '$1-$2-$3')
  } else if (digits.length > 3) {
    digits = digits.slice(0, 3) + '-' + digits.slice(3)
  }

  formData.value.moblphon = digits
}

/* 휴대폰 입력 오류 해제 */
const onPhoneInput = () => {
  formatPhone()
  errors.moblphon = false
}

/* 입력 오류 해제 */
const clearError = (field: keyof typeof errors) => {
  errors[field] = false
}

/* 등록 */
const handleSubmit = async () => {
  errors.adhrncNm = !formData.value.adhrncNm.trim()
  errors.custNm01 = !formData.value.custNm01.trim()
  errors.custNm02 = !formData.value.custNm02.trim()
  errors.moblphon = !isValidPhone.value
  errors.email = !isValidEmail.value

  if (errors.adhrncNm) {
    showToast('성함을 입력해 주세요.')
    return
  }

  if (errors.custNm01) {
    showToast('회사명을 입력해 주세요.')
    return
  }

  if (errors.custNm02) {
    showToast('소속/직책을 입력해 주세요.')
    return
  }

  if (errors.moblphon) {
    showToast('휴대폰 번호를 확인해 주세요.')
    return
  }

  if (errors.email) {
    showToast('이메일 주소를 확인해 주세요.')
    return
  }

  if (!agree.value) {
    errors.agree = true

    if (!termsAccepted.value) {
      openTerms()
    } else {
      showToast('개인정보 수집 및 이용에 동의해 주세요.')
    }

    return
  }

  try {
    loading.value = true

    const requestData = {
      adhrncNm: formData.value.adhrncNm.trim(),
      custNm01: formData.value.custNm01.trim(),
      moblphon: formData.value.moblphon.replace(/\D/g, ''),
      custNm02: formData.value.custNm02.trim(),
      email: formData.value.email.trim(),
    }

    await portalApi.post('/adhrnc/regist', requestData)

    showToast('참가 신청이 완료되었습니다.', 'success')

    await router.push('/complete')
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

/* ESC로 개인정보 팝업 닫기 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && privacyOpen.value) {
    closeTerms()
  }
}
</script>

<template>
  <div class="landing-page" @keydown="handleKeydown">
    <main class="stage">
      <section class="register-screen">
        <!-- 일시 -->
        <span class="pill date-pill">일시</span>
        <span class="info date-info"> 2026. 12. 15 (화) 오후 1시 30분 </span>

        <!-- 장소 -->
        <span class="pill place-pill">장소</span>
        <span class="info place-info"> 그랜드 인터컨티넨탈 서울 파르나스 5F </span>

        <!-- 안내 문구 -->
        <p class="notice notice-bold">
          한정된 좌석으로 12. 7 (월)까지 사전 등록 완료하신 분에 한해
          <br />
          참석 가능합니다.
        </p>

        <p class="notice notice-normal">
          행사 전일에 입장을 위한 <strong>QR코드</strong>를 문자로 보내드릴 예정이며,
          <br />
          등록데스크에서 확인 후 지정된 존으로 입장 안내 드리겠습니다.
        </p>

        <!-- 등록 입력 -->
        <form class="register-form" @submit.prevent="handleSubmit">
          <label class="field-label name-label" for="f-adhrncNm">성함</label>
          <input
            id="f-adhrncNm"
            v-model="formData.adhrncNm"
            class="field-input name-input"
            :class="{ err: errors.adhrncNm }"
            autocomplete="name"
            maxlength="30"
            @input="clearError('adhrncNm')"
          />

          <label class="field-label company-label" for="f-custNm01">회사</label>
          <input
            id="f-custNm01"
            v-model="formData.custNm01"
            class="field-input company-input"
            :class="{ err: errors.custNm01 }"
            autocomplete="organization"
            maxlength="50"
            @input="clearError('custNm01')"
          />

          <label class="field-label title-label" for="f-custNm02">소속/직책</label>
          <input
            id="f-custNm02"
            v-model="formData.custNm02"
            class="field-input title-input"
            :class="{ err: errors.custNm02 }"
            autocomplete="organization-title"
            maxlength="50"
            @input="clearError('custNm02')"
          />

          <label class="field-label phone-label" for="f-moblphon">휴대폰</label>
          <input
            id="f-moblphon"
            v-model="formData.moblphon"
            class="field-input phone-input"
            :class="{ err: errors.moblphon }"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            maxlength="13"
            placeholder="010-0000-0000"
            @input="onPhoneInput"
          />

          <label class="field-label email-label" for="f-email">이메일</label>
          <input
            id="f-email"
            v-model="formData.email"
            class="field-input email-input"
            :class="{ err: errors.email }"
            type="email"
            inputmode="email"
            autocomplete="email"
            maxlength="80"
            @input="clearError('email')"
          />

          <!-- 개인정보 동의 -->
          <div class="agree-row" :class="{ err: errors.agree }">
            <button
              type="button"
              class="check-box"
              :class="{ checked: agree }"
              role="checkbox"
              :aria-checked="agree"
              aria-label="개인정보 수집 및 이용 동의"
              @click="toggleAgree"
            >
              <span v-if="agree" class="check-mark">✓</span>
            </button>

            <button type="button" class="agree-text" @click="openTerms">
              개인정보 수집 및 이용에 동의합니다.
            </button>
          </div>

          <!-- 등록 버튼 -->
          <button type="submit" class="submit-button" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>사전 등록하기</span>
          </button>
        </form>
      </section>
    </main>

    <!-- 개인정보 안내 팝업 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="privacyOpen" class="privacy-backdrop" @click.self="closeTerms">
          <section
            class="privacy-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
          >
            <div class="privacy-content">
              <h2 id="terms-title" class="privacy-title">개인정보 수집 및 이용 안내</h2>

              <p>
                개인정보 수집 및 이용과 관련하여 다음의 몇 가지 사항을 안내 드리니, 관련 내용을
                숙지하신 후 해당 내용에 동의하여 주시기 바랍니다.
              </p>

              <p>
                귀하께서는 개인정보 동의를 거부할 권리가 있으며, 참석 일정 안내 및 경품 제공 등
                행사・운영을 위해 필요한 최소한의 개인정보를 수집하여, 행사 종료 1개월 이내
                일괄 삭제됨을 알려드립니다.
              </p>

              <h3>1. 수집하는 개인정보의 항목</h3>
              <p>참가 신청 양식 내 포함된 성함, 소속명 및 직책, 연락처, 이메일 등 개인 정보</p>

              <h3>2. 거부권 및 거부 시 불이익</h3>
              <p>
                귀하는 개인정보 수집 및 활용에 대한 동의서 제출을 거부할 권리가 있지만, 동의서를
                제출하지 않을 경우에는 컨퍼런스 신청 및 경품 수령이 제한될 수 있습니다.
              </p>
            </div>

            <!-- 팝업 하단 버튼 -->
            <div class="privacy-actions">
              <button type="button" class="privacy-cancel" @click="closeTerms">닫기</button>
              <button type="button" class="privacy-accept" @click="acceptTerms">동의하기</button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>

    <!-- 토스트 -->
    <Teleport to="body">
      <div
        class="toast"
        :class="{ show: toastVisible, success: toastType === 'success' }"
        role="status"
        aria-live="polite"
      >
        {{ toastMessage }}
      </div>
    </Teleport>
  </div>
</template>

<style>
/* 원본 HTML의 Pretendard 폰트 */
@font-face {
  font-family: 'Pretendard';
  font-weight: 400;
  font-display: swap;
  src: url('@/assets/images/landing/2026/cj2027/font-1.woff2') format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-weight: 500;
  font-display: swap;
  src: url('@/assets/images/landing/2026/cj2027/font-2.woff2') format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-weight: 700;
  font-display: swap;
  src: url('@/assets/images/landing/2026/cj2027/font-3.woff2') format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-weight: 800;
  font-display: swap;
  src: url('@/assets/images/landing/2026/cj2027/font-4.woff2') format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-weight: 900;
  font-display: swap;
  src: url('@/assets/images/landing/2026/cj2027/font-5.woff2') format('woff2');
}

.landing-page {
  --u: calc(min(100vw, 640px) / 640);
  --line: #a7a6a7;
  --field: #34343c;
  --violet: #8b6fd6;
  --pink: #d23f8f;

  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: linear-gradient(#161823 0%, #0d0e15 50%, #040205 100%);
  color: #fff;
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  word-break: keep-all;
}

.landing-page *,
.privacy-backdrop * {
  box-sizing: border-box;
}

.stage {
  width: calc(640 * var(--u));
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.register-screen {
  position: relative;
  width: calc(640 * var(--u));
  height: calc(1000 * var(--u));
  flex-shrink: 0;
  overflow: hidden;
  background: #040204 url('@/assets/images/landing/2026/cj2027/image-3.jpg') center top / 100% 100%
    no-repeat;
}

/* 일시 / 장소 */
.pill {
  position: absolute;
  left: calc(136 * var(--u));
  width: calc(72 * var(--u));
  height: calc(34 * var(--u));
  border-radius: calc(17 * var(--u));
  background: #fff;
  color: #12151c;
  font-size: calc(18 * var(--u));
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-pill {
  top: calc(172 * var(--u));
}

.place-pill {
  top: calc(215 * var(--u));
}

.info {
  position: absolute;
  left: calc(222 * var(--u));
  font-size: calc(18.5 * var(--u));
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.005em;
  white-space: nowrap;
}

.date-info {
  top: calc(179 * var(--u));
}

.place-info {
  top: calc(222 * var(--u));
}

/* 안내 문구 */
.notice {
  position: absolute;
  left: calc(122 * var(--u));
  font-size: calc(16 * var(--u));
  line-height: calc(23 * var(--u));
  letter-spacing: 0.035em;
  white-space: nowrap;
}

.notice-bold {
  top: calc(294 * var(--u));
  font-weight: 800;
}

.notice-normal {
  top: calc(367 * var(--u));
  font-weight: 400;
}

.notice strong {
  font-weight: 800;
}

/* 입력 폼 */
.register-form {
  position: absolute;
  inset: 0;
}

.field-label {
  position: absolute;
  left: calc(89 * var(--u));
  font-size: calc(22 * var(--u));
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.field-input {
  position: absolute;
  left: calc(200 * var(--u));
  width: calc(352 * var(--u));
  height: calc(40 * var(--u));
  border: 1px solid transparent;
  border-radius: calc(5 * var(--u));
  background: transparent;
  padding: 0 calc(14 * var(--u));
  font-family: inherit;
  font-size: 16px;
  color: #fff;
  outline: none;
  transition:
    border-color 0.15s,
    background 0.15s,
    box-shadow 0.15s;
}

.field-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.field-input:focus {
  border-color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 0 calc(3 * var(--u)) rgba(139, 111, 214, 0.25);
}

.field-input.err {
  border-color: #ff5a7a;
  background: rgba(255, 90, 122, 0.06);
}

.field-input:-webkit-autofill {
  -webkit-text-fill-color: #fff;
  -webkit-box-shadow: 0 0 0 100px #34343c inset;
  caret-color: #fff;
}

/* 원본 입력 위치 */
.name-label {
  top: calc(479 * var(--u));
}

.name-input {
  top: calc(470 * var(--u));
}

.company-label {
  top: calc(540 * var(--u));
}

.company-input {
  top: calc(531 * var(--u));
}

.title-label {
  top: calc(602 * var(--u));
}

.title-input {
  top: calc(592 * var(--u));
}

.phone-label {
  top: calc(663 * var(--u));
}

.phone-input {
  top: calc(653 * var(--u));
}

.email-label {
  top: calc(724 * var(--u));
}

.email-input {
  top: calc(714 * var(--u));
}

/* 개인정보 동의 */
.agree-row {
  position: absolute;
  left: calc(135 * var(--u));
  top: calc(777 * var(--u));
  height: calc(28 * var(--u));
  display: flex;
  align-items: center;
  gap: calc(17 * var(--u));
}

.check-box {
  appearance: none !important;
  -webkit-appearance: none !important;
  width: calc(28 * var(--u));
  height: calc(28 * var(--u));
  min-width: calc(28 * var(--u));
  min-height: calc(28 * var(--u));
  border: 1px solid #fff !important;
  border-radius: 0 !important;
  background: transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 1 !important;
  transition: background 0.15s;
}

.check-box.checked {
  background: #fff !important;
  border-color: #fff !important;
}

.check-mark {
  display: block !important;
  color: #12151c !important;
  font-family: Arial, sans-serif !important;
  font-size: calc(23 * var(--u)) !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.agree-row.locked .check-box {
  opacity: 1 !important;
}

.agree-row.err .check-box {
  border-color: #ff5a7a !important;
  box-shadow: 0 0 0 calc(3 * var(--u)) rgba(255, 90, 122, 0.25);
}

.agree-text {
  font-size: calc(22 * var(--u));
  letter-spacing: 0.03em;
  font-weight: 800;
  line-height: 1;
  background: none;
  border: 0;
  color: #fff;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.35);
  text-underline-offset: calc(5 * var(--u));
  text-decoration-thickness: 1px;
}

.agree-text:hover {
  text-decoration-color: #fff;
}

/* 등록 버튼 */
.submit-button {
  position: absolute;
  left: calc(197 * var(--u));
  top: calc(829 * var(--u));
  width: calc(246 * var(--u));
  height: calc(46 * var(--u));
  border: 0;
  border-radius: calc(23 * var(--u));
  background: transparent;
  color: #fff;
  font-family: inherit;
  font-size: calc(29 * var(--u));
  font-weight: 900;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    text-shadow 0.2s;
}

.submit-button:hover {
  background: rgba(255, 255, 255, 0.06);
  text-shadow: 0 0 calc(18 * var(--u)) rgba(210, 63, 143, 0.7);
}

.submit-button:active {
  transform: scale(0.98);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: default;
}

.spinner {
  width: calc(24 * var(--u));
  height: calc(24 * var(--u));
  border: calc(3 * var(--u)) solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 개인정보 팝업 */
.privacy-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(6px);
}

.privacy-dialog {
  position: relative;
  width: min(100%, 600px);
  max-height: min(850px, 90dvh);
  display: flex;
  flex-direction: column;
  padding: 36px 32px 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  background: #171720;
  color: #f2f2f4;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}

.privacy-content {
  overflow-y: auto;
  padding-right: 8px;
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: 0.02em;
  word-break: keep-all;
}

.privacy-title {
  margin-bottom: 24px;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
}

.privacy-content p + p,
.privacy-content h3 {
  margin-top: 24px;
}

.privacy-content h3 {
  color: #fff;
  font-size: 17.5px;
  font-weight: 800;
}

/* 팝업 하단 버튼 영역 */
.privacy-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  margin-top: 24px;
}

.privacy-cancel,
.privacy-accept {
  width: 118px;
  height: 42px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s,
    transform 0.15s;
}

.privacy-cancel {
  border: 1px solid var(--line);
  background: transparent;
  color: #fff;
}

.privacy-cancel:hover {
  background: rgba(255, 255, 255, 0.08);
}

.privacy-accept {
  border: 1px solid #fff;
  background: #fff;
  color: #171720;
}

.privacy-accept:hover {
  background: #e8e8ed;
  border-color: #e8e8ed;
}

.privacy-cancel:active,
.privacy-accept:active {
  transform: scale(0.97);
}

/* 팝업 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 토스트 */
.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 1100;
  transform: translateX(-50%) translateY(16px);
  background: rgba(255, 255, 255, 0.95);
  color: #12151c;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 18px;
  border-radius: 22px;
  opacity: 0;
  pointer-events: none;
  transition: 0.25s;
  white-space: nowrap;
  font-family: inherit;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%);
}

/* 작은 모바일 화면 */
@media (max-width: 420px) {
  .privacy-dialog {
    padding: 28px 20px 22px;
  }

  .privacy-content {
    font-size: 14px;
  }

  .privacy-title {
    font-size: 19px;
  }

  .privacy-actions {
    margin-top: 18px;
  }

  .privacy-cancel,
  .privacy-accept {
    width: 112px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
