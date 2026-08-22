import { useEffect } from 'react'

/**
 * Releases every [data-reveal] element once it enters the viewport.
 *
 * One observer for the whole page rather than a tween per element. Toss's own
 * home does use motion beyond this — its deployed bundle carries a Framer
 * Motion runtime and a hero video — so this is not a claim that Toss has no
 * scroll-linked animation, only that a single short entrance is the right
 * amount for a page whose job is to be read.
 *
 * `key` re-arms the observer after a route change, when a fresh set of
 * elements has mounted.
 */
export function useReveal(key) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not([data-shown])')
    if (!els.length) return

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.setAttribute('data-shown', ''))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-shown', '')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}

/** Staggers a list without hand-writing a delay on every item. */
export const revealDelay = (i, step = 70) => ({ '--reveal-delay': `${i * step}ms` })
