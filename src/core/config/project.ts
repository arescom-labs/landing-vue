/**
 * 프로젝트 기본 설정
 *
 * category    : 프로젝트 구분 (landing / onsite)
 * year        : 프로젝트 연도
 * projectName : 실제 프로젝트 폴더명
 */
export const PROJECT_CONFIG = {
  category: 'landing',
  year: '2026',
  projectName: 'cj2027',
  title: '2026 한반도해상풍력 연말 초청 만찬',
} as const

/**
 * 프로젝트 설정 타입
 */
export type ProjectCategory = 'landing' | 'onsite'

export type ProjectConfig = {
  category: ProjectCategory
  year: string
  projectName: string
  title: string
}

/**
 * 프로젝트 경로 생성
 */
export const PROJECT_PATH = `/${PROJECT_CONFIG.category}/${PROJECT_CONFIG.year}/${PROJECT_CONFIG.projectName}`
