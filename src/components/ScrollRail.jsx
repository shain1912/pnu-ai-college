import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useMedia'

/**
 * A persistent reading-progress line pinned to the left edge.
 *
 * Frame capture of toss.im shows the same vertical indicator holding its x
 * position across all 64 scroll frames, through every chapter and background
 * change (docs/motion/toss.md §4). On a page this long it is the one piece of
 * chrome that tells the reader how much is left.
 *
 * The value is written straight to a custom property inside rAF — putting it in
 * React state would re-render the tree on every scroll frame for a number that
 * only CSS consumes.
 */
export default function ScrollRail() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const span = doc.scrollHeight - doc.clientHeight
      const progress = span > 0 ? Math.min(1, doc.scrollTop / span) : 0
      el.style.setProperty('--progress', progress.toFixed(4))
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div className="scroll-rail" aria-hidden="true">
      <span ref={ref} />
    </div>
  )
}
