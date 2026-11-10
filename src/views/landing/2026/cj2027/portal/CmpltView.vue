<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/* 처음으로 이동 */
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="landing-page">
    <main class="stage">
      <section class="complete-screen">
        <!-- 신청 완료 메시지 -->
        <div class="complete-content">
          <h1 class="complete-title">사전 등록 완료되었습니다.</h1>

          <p class="complete-message">귀한 시간 내주심에 감사합니다.</p>

          <!-- 처음으로 버튼 -->
          <button type="button" class="home-button" @click="goHome">
            처음으로
            <span class="button-arrow">→</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
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
.landing-page *::before,
.landing-page *::after {
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

.complete-screen {
  position: relative;
  width: calc(640 * var(--u));
  height: calc(1000 * var(--u));
  flex-shrink: 0;
  overflow: hidden;

  background: #040204 url('@/assets/images/landing/2026/cj2027/image-5.jpg') center top / 100% 100%
    no-repeat;
}

/* 완료 메시지 영역 */
.complete-content {
  position: absolute;
  top: calc(550 * var(--u));
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* 완료 아이콘 */
.complete-icon {
  width: calc(64 * var(--u));
  height: calc(64 * var(--u));
  margin-bottom: calc(32 * var(--u));
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 calc(12 * var(--u)) rgba(255, 255, 255, 0.25));
}

.complete-icon svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* 완료 제목 */
.complete-title {
  margin: 0;
  color: #fff;
  font-size: calc(45 * var(--u));
  font-weight: 900;
  line-height: 1.4;
  letter-spacing: -0.025em;
  text-shadow: 0 0 calc(20 * var(--u)) rgba(255, 255, 255, 0.18);
}

/* 감사 문구 */
.complete-message {
  margin: calc(18 * var(--u)) 0 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: calc(25 * var(--u));
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.015em;
}

/* 처음으로 버튼 */
.home-button {
  width: calc(220 * var(--u));
  height: calc(54 * var(--u));
  margin-top: calc(65 * var(--u));
  padding: 0 calc(28 * var(--u));

  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(12 * var(--u));

  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: calc(28 * var(--u));
  background: #fff;
  color: #171720;

  font-family: inherit;
  font-size: calc(20 * var(--u));
  font-weight: 800;
  letter-spacing: 0.015em;

  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.home-button:hover {
  background: #eee9fa;
  box-shadow: 0 0 calc(24 * var(--u)) rgba(255, 255, 255, 0.3);
  transform: translateY(calc(-3 * var(--u)));
}

.home-button:active {
  transform: scale(0.97);
}

.button-arrow {
  font-family: Arial, sans-serif;
  font-size: calc(23 * var(--u));
  font-weight: 400;
  transition: transform 0.2s ease;
}

.home-button:hover .button-arrow {
  transform: translateX(calc(4 * var(--u)));
}

.home-button:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.6);
  outline-offset: 5px;
}

/* 작은 모바일 화면 */
@media (max-width: 420px) {
  .complete-content {
    top: calc(350 * var(--u));
  }

  .complete-title {
    font-size: calc(28 * var(--u));
  }

  .complete-message {
    font-size: calc(19 * var(--u));
  }
}
</style>
