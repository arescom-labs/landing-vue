<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 화면 진입 시 스크롤 최상단 이동
onMounted(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  })
})

// 처음 화면으로 이동
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <main class="complete-wrap">
    <section class="complete-page">
      <!-- 배경 오버레이 -->
      <div class="background-overlay"></div>

      <!-- OW 로고 -->
      <div class="logo">
        <b>OW</b>
        <small>OCEAN WINDS</small>
      </div>

      <!-- 행사명 -->
      <p class="event-title">2026 한반도해상풍력 연말 초청 만찬</p>

      <p class="event-subtitle">함께 알아가는 미래: 어업인 소통의 장</p>

      <!-- 완료 아이콘 -->
      <div class="complete-ring">
        <div class="complete-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#11262f"
            stroke-width="1.45"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
            <path d="M14 2.5V8h5.5" />
            <path d="M8.5 14.5l2.5 2.5 4.5-5" />
          </svg>
        </div>
      </div>

      <!-- 완료 메시지 -->
      <p class="complete-message">참가 신청이 완료되었습니다.</p>

      <p class="complete-thanks">참여해 주셔서 감사합니다.</p>

      <p class="complete-english">Registration Completed. Thank you.</p>

      <!-- 행사 정보 -->
      <div class="event-info-card">
        <div class="info-row">
          <span class="info-label">일시</span>
          <span class="info-value">2026. 12. 15 (화) 16:00 ~</span>
        </div>

        <div class="info-row">
          <span class="info-label">장소</span>
          <span class="info-value">송도컨벤시아</span>
        </div>
      </div>

      <!-- 마지막 안내 -->
      <p class="closing-message">행사 당일 뵙기를 기대하겠습니다.</p>

      <!-- 처음으로 버튼 -->
      <button type="button" class="btn-home" @click="goHome">처음으로</button>
    </section>
  </main>
</template>

<style scoped>
.complete-wrap {
  --u: calc(min(100vw, 640px) / 640);

  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: hidden;
  background: #1e2733;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
  -webkit-font-smoothing: antialiased;
  word-break: keep-all;
}

.complete-page {
  position: relative;
  flex-shrink: 0;
  width: calc(640 * var(--u));
  height: calc(1136 * var(--u));
  overflow: hidden;
  background: #202a36 url('@/assets/images/landing/2026/ow/invitation-bg.jpg') center / cover
    no-repeat;
}

/* 배경 오버레이 */
.background-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(32, 42, 54, 0.38),
    rgba(32, 42, 54, 0.5) 50%,
    rgba(30, 39, 51, 0.72) 78%,
    #1e2733 100%
  );
}

/* 로고 */
.logo {
  position: absolute;
  z-index: 1;
  left: calc(279 * var(--u));
  top: calc(80 * var(--u));
  width: calc(82 * var(--u));
  height: calc(58 * var(--u));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffe500;
  color: #11262f;
}

.logo b {
  font-size: calc(31 * var(--u));
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1;
}

.logo small {
  margin-top: calc(6 * var(--u));
  font-size: calc(5.6 * var(--u));
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1;
}

/* 행사명 */
.event-title,
.event-subtitle,
.complete-message,
.complete-thanks,
.complete-english,
.closing-message {
  position: absolute;
  z-index: 1;
  left: 0;
  width: 100%;
  text-align: center;
  line-height: 1;
}

.event-title {
  top: calc(225 * var(--u));
  color: #ffe500;
  font-size: calc(19 * var(--u));
  font-weight: 700;
}

.event-subtitle {
  top: calc(261 * var(--u));
  font-size: calc(17 * var(--u));
  font-weight: 500;
}

/* 완료 아이콘 */
.complete-ring {
  position: absolute;
  z-index: 1;
  left: calc(197 * var(--u));
  top: calc(327 * var(--u));
  width: calc(246 * var(--u));
  height: calc(246 * var(--u));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 229, 0, 0.32);
}

.complete-icon {
  width: calc(204 * var(--u));
  height: calc(204 * var(--u));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffe500;
}

.complete-icon svg {
  width: calc(128 * var(--u));
  height: calc(128 * var(--u));
}

/* 완료 메시지 */
.complete-message {
  top: calc(615 * var(--u));
  font-size: calc(32 * var(--u));
  font-weight: 800;
  letter-spacing: -0.01em;
}

.complete-thanks {
  top: calc(661 * var(--u));
  font-size: calc(32 * var(--u));
  font-weight: 800;
  letter-spacing: -0.01em;
}

.complete-english {
  top: calc(721 * var(--u));
  color: #c9d9e2;
  font-size: calc(17 * var(--u));
  font-weight: 500;
}

/* 행사 정보 카드 */
.event-info-card {
  position: absolute;
  z-index: 1;
  left: calc(90 * var(--u));
  top: calc(780 * var(--u));
  width: calc(460 * var(--u));
  height: calc(150 * var(--u));
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: calc(20 * var(--u));
  padding-left: calc(40 * var(--u));
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: calc(16 * var(--u));
  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.info-row {
  display: flex;
  align-items: center;
  gap: calc(16 * var(--u));
  font-size: calc(16 * var(--u));
}

.info-label {
  width: calc(40 * var(--u));
  flex-shrink: 0;
  color: #ffe500;
  font-weight: 700;
}

.info-value {
  color: #fff;
  font-weight: 500;
}

/* 마지막 안내 */
.closing-message {
  top: calc(950 * var(--u));
  color: #c9d9e2;
  font-size: calc(14 * var(--u));
  font-weight: 400;
}

/* 처음으로 버튼 */
.btn-home {
  position: absolute;
  z-index: 2;
  left: calc(120 * var(--u));
  top: calc(1000 * var(--u));
  width: calc(400 * var(--u));
  height: calc(66 * var(--u));
  border: 0;
  border-radius: calc(33 * var(--u));
  background: #ffe500;
  color: #11262f;
  font-family: inherit;
  font-size: calc(21 * var(--u));
  font-weight: 800;
  cursor: pointer;
  transition:
    filter 0.2s,
    transform 0.1s;
}

.btn-home:hover {
  filter: brightness(0.95);
}

.btn-home:active {
  transform: scale(0.98);
}
</style>
