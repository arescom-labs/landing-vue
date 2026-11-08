/**
 * 현재 배포된 WAR 컨텍스트 경로 반환
 *
 * /ow/assets/index-xxxx.js      -> /ow
 * /app/assets/index-xxxx.js     -> /app
 * /assets/index-xxxx.js         -> ''
 *
 * 개발 환경에서는 루트 경로 반환
 */
export const getAppBasePath = (): string => {
  const script = document.querySelector<HTMLScriptElement>('script[type="module"][src]')

  if (!script) {
    return ''
  }

  const scriptUrl = new URL(script.src, window.location.href)
  const assetPath = '/assets/'

  const assetIndex = scriptUrl.pathname.lastIndexOf(assetPath)

  if (assetIndex === -1) {
    return ''
  }

  return scriptUrl.pathname.substring(0, assetIndex)
}
