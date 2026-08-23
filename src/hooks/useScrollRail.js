import { useEffect, useRef, useState } from 'react'
import { useIsMobile, useIsTouch, useReducedMotion } from './useMedia'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/*
 * 세로 스크롤이 가로 레일을 미는 동작. 두 절이 같은 것을 쓴다.
 *
 * 처음에는 SchoolRailScene 안에만 있었는데, 「AI대학의 장면들」에도 같은 것이
 * 필요해졌다. 복사하면 18·20·23회차에 여기서 고친 세 가지가 한쪽에만 남는다.
 *
 *   18회차  좁은 화면에서는 스크롤 구동을 끄고 손가락으로 미는 가로 스크롤로
 *           돌린다. overflow-hidden + transform 은 밀어도 반응이 없다.
 *   20회차  기준을 폭이 아니라 포인터로 본다. 태블릿은 768 을 넘어 데스크톱으로
 *           잡히지만 손가락으로 미는 기기다.
 *   23회차  탭으로 카드에 초점이 가면 그 카드가 보이는 자리로 페이지를 옮긴다.
 *           스크롤 컨테이너가 아니라 브라우저가 끌어올 방법이 없다.
 *
 * 쓰는 쪽은 rootRef 를 절에, railRef 를 넘치는 상자에 걸고 shift 를 transform
 * 으로 쓴다. driven 이 false 면 네이티브 가로 스크롤로 두면 된다.
 */
export function useScrollRail() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const touch = useIsTouch()
  const rootRef = useRef(null)
  const railRef = useRef(null)
  const [shift, setShift] = useState(0)

  const driven = !reduced && !mobile && !touch

  useEffect(() => {
    if (!driven) return
    let frame = 0
    const update = () => {
      frame = 0
      const root = rootRef.current
      const rail = railRef.current
      if (!root || !rail) return
      // 이동 거리를 상수로 박지 않고 실제로 넘치는 만큼만 민다. 카드 폭과 화면
      // 폭이 뷰포트마다 달라서, 상수로 두면 좁은 화면에서 끝까지 못 가고 넓은
      // 화면에서는 빈 자리가 생긴다.
      const overflow = Math.max(0, rail.scrollWidth - rail.clientWidth)
      const range = root.offsetHeight - window.innerHeight
      const progress = range > 0 ? clamp(-root.getBoundingClientRect().top / range) : 0
      setShift(progress * overflow)
    }
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [driven])

  /** 초점이 밀려난 카드로 갔을 때 그 카드가 보이는 자리로 페이지를 옮긴다. */
  const revealOnFocus = (event) => {
    if (!driven) return
    const card = event.target.closest('li')
    const rail = railRef.current
    const root = rootRef.current
    if (!card || !rail || !root) return
    const overflow = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const range = root.offsetHeight - window.innerHeight
    if (!overflow || range <= 0) return
    const need = clamp(card.offsetLeft - 24, 0, overflow) / overflow
    window.scrollTo({ top: root.offsetTop + need * range, behavior: 'instant' })
  }

  /** 네이티브 스크롤로 갈 때 붙이는 클래스. 스냅 기준선에 좌측 여백을 알려준다. */
  const nativeClass =
    'snap-x snap-mandatory scroll-pl-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

  return { rootRef, railRef, shift, driven, revealOnFocus, nativeClass }
}
