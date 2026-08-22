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
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
