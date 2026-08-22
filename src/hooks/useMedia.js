import { useEffect, useState } from 'react'

export function useMedia(query, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsMobile = () => useMedia('(max-width: 767px)')

/*
 * 손가락으로 미는 것이 가능한 기기인지. 폭으로 가르면 태블릿(768~1024)이
 * 데스크톱으로 취급돼 가로 레일을 밀 수 없다. 밀 수 있느냐는 화면 크기가
 * 아니라 포인터 종류의 문제다.
 */
export const useIsTouch = () => useMedia('(pointer: coarse)')
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
