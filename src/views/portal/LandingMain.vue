<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 참가 신청 화면으로 이동
 */
const goRegist = () => {
  router.push('/regist')
}
</script>

<template>
  <main class="landing-wrap">
    <section class="landing-page">
      <!-- 상단 배경 이미지 -->
      <div class="hero"></div>

      <!-- 배경 그라데이션 -->
      <div class="hero-gradient"></div>

      <!-- 물결 장식 -->
      <svg class="wave" viewBox="0 0 640 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 22 C120 14 230 12 330 20 S520 30 640 16 V40 H0Z" fill="#28435b" />
        <path d="M0 30 C120 22 230 20 330 28 S520 38 640 26 V40 H0Z" fill="#1d2937" />
      </svg>

      <!-- 로고 -->
      <div class="logo">
        <b>OW</b>
        <small>OCEAN WINDS</small>
      </div>

      <!-- 상단 구분선 -->
      <div class="top-line"></div>

      <span class="invitation">INVITATION</span>

      <!-- 행사 제목 -->
      <span class="event-year">2026 한반도해상풍력</span>
      <h1 class="event-title">연말 초청 만찬</h1>

      <!-- 노란색 슬로건 -->
      <div class="tag tag-first"></div>
      <div class="tag tag-second"></div>

      <span class="tag-text tag-text-first"> 함께 알아가는 미래 </span>
      <span class="tag-text tag-text-second"> 어업인 소통의 장 </span>

      <!-- 초청 문구 -->
      <p class="greeting">한 해 동안 바다를 함께 지켜주신 분들께 감사의 마음을 전합니다</p>

      <!-- 행사 정보 카드 -->
      <div class="event-card">
        <div class="card-line card-line-first"></div>
        <div class="card-line card-line-second"></div>

        <div class="info-row info-date">
          <span class="info-label">일시</span>
          <strong>2026. 12. 15 (화) 16:00 ~</strong>
        </div>

        <div class="info-row info-place">
          <span class="info-label">장소</span>
          <div class="place-info">
            <strong>송도컨벤시아</strong>
            <small>인천광역시 연수구 센트럴로 123</small>
          </div>
        </div>

        <div class="info-row info-target">
          <span class="info-label">대상</span>
          <strong>한반도해상풍력 이해관계자</strong>
        </div>
      </div>

      <!-- 참가 신청 버튼 -->
      <button type="button" class="regist-btn" @click="goRegist">
        <span>참가 신청하기</span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>

      <!-- 하단 안내 -->
      <p class="notice">※ 참가 신청서를 통해 사전 등록이 가능합니다.</p>
    </section>
  </main>
</template>

<style scoped>
.landing-wrap {
  --u: calc(min(100vw, 640px) / 640);

  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #1d2937;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.landing-page {
  position: relative;
  width: calc(640 * var(--u));
  height: calc(1136 * var(--u));
  flex-shrink: 0;
  overflow: hidden;
  background: #1d2937;
}

/* 배경 이미지 */
.hero {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(680 * var(--u));
  background: url('@/assets/images/invitation-bg.jpg') center / cover no-repeat;
}

.hero-gradient {
  position: absolute;
  inset: 0 0 auto;
  height: calc(680 * var(--u));
  background: linear-gradient(
    180deg,
    rgba(29, 41, 55, 0.92) 0%,
    rgba(29, 41, 55, 0.82) 16%,
    rgba(29, 41, 55, 0.45) 38%,
    rgba(29, 41, 55, 0.12) 58%,
    rgba(29, 41, 55, 0.35) 72%,
    rgba(29, 41, 55, 0.85) 88%,
    #1d2937 100%
  );
}

/* 물결 */
.wave {
  position: absolute;
  left: 0;
  top: calc(622 * var(--u));
  width: 100%;
  height: calc(40 * var(--u));
}

/* 로고 */
.logo {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(32 * var(--u));
  width: calc(74 * var(--u));
  height: calc(52 * var(--u));
  background: #ffe500;
  color: #11262f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo b {
  font-size: calc(28 * var(--u));
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1;
}

.logo small {
  margin-top: calc(5 * var(--u));
  font-size: calc(5 * var(--u));
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1;
}

.top-line {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(103 * var(--u));
  width: calc(560 * var(--u));
  height: 1px;
  background: rgba(255, 255, 255, 0.28);
}

.invitation {
  position: absolute;
  right: calc(43 * var(--u));
  top: calc(54 * var(--u));
  font-size: calc(14 * var(--u));
  font-weight: 500;
  letter-spacing: 0.24em;
  margin-right: -0.24em;
}

/* 행사 제목 */
.event-year {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(143 * var(--u));
  font-size: calc(22 * var(--u));
  font-weight: 700;
  color: #ffe500;
}

.event-title {
  position: absolute;
  left: calc(38 * var(--u));
  top: calc(186 * var(--u));
  font-size: calc(58 * var(--u));
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1;
  white-space: nowrap;
}

/* 노란색 슬로건 */
.tag {
  position: absolute;
  left: calc(40 * var(--u));
  height: calc(44 * var(--u));
  background: #ffe500;
}

.tag-first {
  top: calc(264 * var(--u));
  width: calc(242 * var(--u));
}

.tag-second {
  top: calc(316 * var(--u));
  width: calc(208 * var(--u));
}

.tag-text {
  position: absolute;
  left: calc(54 * var(--u));
  font-size: calc(24 * var(--u));
  font-weight: 700;
  color: #11262f;
  line-height: 1;
  white-space: nowrap;
}

.tag-text-first {
  top: calc(275 * var(--u));
}

.tag-text-second {
  top: calc(327 * var(--u));
}

/* 초청 문구 */
.greeting {
  position: absolute;
  left: 0;
  top: calc(598 * var(--u));
  width: 100%;
  text-align: center;
  font-size: calc(17 * var(--u));
  font-weight: 500;
  white-space: nowrap;
}

/* 행사 정보 카드 */
.event-card {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(684 * var(--u));
  width: calc(560 * var(--u));

  /* 기존 216에서 250으로 높이 확장 */
  height: calc(250 * var(--u));

  background: #2b4663;
  border-radius: 0 calc(16 * var(--u)) calc(16 * var(--u)) 0;
}

.event-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: calc(6 * var(--u));
  background: #ffe500;
}

/* 구분선 */
.card-line {
  position: absolute;
  left: calc(36 * var(--u));
  width: calc(496 * var(--u));
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
}

.card-line-first {
  top: calc(79 * var(--u));
}

.card-line-second {
  top: calc(165 * var(--u));
}

/* 정보 항목 공통 */
.info-row {
  position: absolute;
  left: calc(36 * var(--u));
  display: flex;
  align-items: flex-start;
}

.info-label {
  width: calc(80 * var(--u));
  flex-shrink: 0;
  color: #ffe500;
  font-size: calc(17 * var(--u));
  font-weight: 700;
}

.info-row strong {
  font-size: calc(20 * var(--u));
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

/* 일시 */
.info-date {
  top: calc(39 * var(--u));
}

/* 장소 */
.info-place {
  top: calc(101 * var(--u));
}

.place-info {
  display: flex;
  flex-direction: column;
  gap: calc(8 * var(--u));
}

.place-info small {
  color: #a9c2cf;
  font-size: calc(15 * var(--u));
  font-weight: 400;
  white-space: nowrap;
}

/* 대상 */
.info-target {
  top: calc(185 * var(--u));
}

.info-target strong {
  font-size: calc(19 * var(--u));
  font-weight: 500;
}

/* 참가 신청 버튼 */
.regist-btn {
  position: absolute;
  left: calc(40 * var(--u));

  /* 카드 확장에 맞춰 버튼도 아래로 이동 */
  top: calc(962 * var(--u));

  width: calc(560 * var(--u));
  height: calc(74 * var(--u));
  border: 0;
  border-radius: calc(37 * var(--u));
  background: #ffe500;
  color: #11262f;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(52 * var(--u));
  font-family: inherit;
  font-size: calc(24 * var(--u));
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.1s,
    filter 0.2s;
}

.regist-btn:hover {
  filter: brightness(0.96);
}

.regist-btn:active {
  transform: scale(0.985);
}

.regist-btn svg {
  width: calc(30 * var(--u));
  height: calc(30 * var(--u));
}

/* 하단 안내 */
.notice {
  position: absolute;
  left: 0;

  /* 버튼 아래 간격 확보 */
  top: calc(1058 * var(--u));

  width: 100%;
  text-align: center;
  font-size: calc(13 * var(--u));
  color: #8faab8;
  white-space: nowrap;
}
</style>
