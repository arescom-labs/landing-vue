# 프로젝트 빌드 가이드

## 1. 프로젝트 개요

본 프로젝트는 공통 Vue 기반으로 여러 랜딩페이지 및 현장 운영 프로젝트를 개발하고,
프로젝트별로 독립적인 빌드 및 배포를 수행한다.

- 공통 소스 재사용
- 프로젝트별 화면 및 설정 분리
- 프로젝트별 WAR 빌드 및 배포
- 프로젝트 추가 시 기존 공통 소스 활용

---

## 2. 프로젝트 디렉터리 구조

```text
src/
├─ api/                         # 공통 API 통신
├─ stores/                      # 공통 상태 관리
├─ router/                      # 공통 라우터
├─ components/                  # 공통 컴포넌트
├─ layouts/                     # 공통 레이아웃
├─ composables/                 # 공통 Composition API
├─ utils/                       # 공통 유틸리티
│
├─ config/
│  └─ project.ts                # 현재 빌드 프로젝트 설정
│
├─ landing/
│  └─ 2026/
│     └─ project-a/
│        ├─ portal/             # 사용자 화면
│        ├─ admin/              # 관리자 화면
│        ├─ routes.ts           # 프로젝트 라우트
│        └─ config.ts           # 프로젝트별 설정
│
└─ onsite/
   └─ 2026/
      └─ project-b/
         ├─ portal/
         ├─ admin/
         ├─ routes.ts
         └─ config.ts
```

### 디렉터리 설명

| 디렉터리    | 설명                     |
| ----------- | ------------------------ |
| api         | 공통 API 통신 모듈       |
| stores      | Pinia 상태 관리          |
| router      | 공통 라우터 및 인증 처리 |
| components  | 공통 UI 컴포넌트         |
| layouts     | 공통 화면 레이아웃       |
| composables | 공통 Composition API     |
| utils       | 공통 유틸리티            |
| landing     | 랜딩페이지 프로젝트      |
| onsite      | 현장 운영 프로젝트       |
| 연도        | 프로젝트 생성 연도       |
| 프로젝트명  | 실제 프로젝트 식별명     |
| portal      | 사용자 화면              |
| admin       | 관리자 화면              |

---

## 3. 프로젝트 설정

현재 빌드할 프로젝트는 다음 파일에서 관리한다.

**설정 파일: `src/config/project.ts`**

```typescript
export const PROJECT_CONFIG = {
  category: 'landing',
  year: '2026',
  projectName: 'project-a',
}
```

### 설정 항목

| 항목        | 설명               | 예시            |
| ----------- | ------------------ | --------------- |
| category    | 프로젝트 대분류    | landing, onsite |
| year        | 프로젝트 생성 연도 | 2026            |
| projectName | 실제 프로젝트명    | project-a       |

새로운 프로젝트를 빌드할 경우 해당 파일의 설정값을 변경한다.

예시:

```typescript
export const PROJECT_CONFIG = {
  category: 'onsite',
  year: '2026',
  projectName: 'project-b',
}
```

---

## 4. 개발 환경 실행

프로젝트 최상위 디렉터리에서 실행한다.

```bash
npm run dev
```

---

## 5. 프로젝트 빌드

프로젝트 설정 파일(`src/config/project.ts`)에 지정된 프로젝트를 기준으로 빌드한다.

```bash
npm run build:project
```

### 빌드 처리 순서

1. TypeScript 타입 검사
2. 프로젝트 설정 확인
3. 프로젝트별 화면 및 라우트 선택
4. Vue 프로젝트 빌드
5. Spring Boot 정적 리소스 디렉터리에 빌드 결과 저장
6. Spring Boot WAR 패키징

---

## 6. 프로젝트 추가 방법

신규 프로젝트 생성 시 다음 순서로 진행한다.

1. `landing` 또는 `onsite` 대분류 선택
2. 해당 연도 디렉터리 생성
3. 실제 프로젝트명으로 디렉터리 생성
4. `portal` 디렉터리 생성
5. `admin` 디렉터리 생성
6. 프로젝트별 `routes.ts` 생성
7. 프로젝트별 `config.ts` 생성
8. `src/config/project.ts`에서 빌드 대상 프로젝트 변경
9. 프로젝트 빌드 및 WAR 생성

---

## 7. 빌드 및 배포

각 프로젝트는 독립적으로 빌드하여 개별 WAR 파일로 배포한다.

예시:

| 프로젝트                   | 빌드 결과 | 배포   |
| -------------------------- | --------- | ------ |
| landing / 2026 / project-a | A.war     | Tomcat |
| onsite / 2026 / project-b  | B.war     | Tomcat |

각 WAR 파일은 해당 프로젝트의 화면과 설정을 포함한다.

---

## 8. 개발 및 관리 원칙

- 공통 기능은 최상위 공통 디렉터리에서 관리한다.
- 프로젝트별 화면은 해당 프로젝트 디렉터리에서 관리한다.
- API, Store, Router는 공통 영역에서 관리한다.
- 프로젝트별 URL과 화면 연결은 각 프로젝트의 `routes.ts`에서 관리한다.
- 프로젝트별 설정은 각 프로젝트의 `config.ts`에서 관리한다.
- 현재 빌드 대상은 `src/config/project.ts`에서 지정한다.
- 프로젝트명은 고정하지 않으며 신규 프로젝트 추가가 가능해야 한다.
- 공통 소스는 프로젝트마다 중복 작성하지 않는다.
