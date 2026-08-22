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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const main = document.querySelector('main')
    let routeFrame = 0

    if (main && !reduced) {
      main.setAttribute('data-route-entering', '')
      routeFrame = requestAnimationFrame(() => {
        routeFrame = requestAnimationFrame(() => main.removeAttribute('data-route-entering'))
      })
    }

    const onTabClick = (event) => {
      const tab = event.target.closest('button[role="tab"]')
      if (!tab || reduced) return
      const panel = document.getElementById(tab.getAttribute('aria-controls'))
      if (!panel) return
      panel.setAttribute('data-panel-switching', '')
      requestAnimationFrame(() => requestAnimationFrame(() => panel.removeAttribute('data-panel-switching')))
    }
    document.addEventListener('click', onTabClick, true)

    const cleanupMotion = () => {
      if (routeFrame) cancelAnimationFrame(routeFrame)
      document.removeEventListener('click', onTabClick, true)
    }
    /*
     * Only the first screen animates.
     *
     * Frame capture of Linear, Stripe, MIT and EPFL found no scroll-entrance
     * animation on any of them: the same scroll offset shot twice at different
     * settle times came back pixel-identical (delta 0.00) on most samples, and
     * the rest differed only by image decode timing. Linear does use a
     * blur+fade stagger, but once, on first paint. Repeating a reveal at every
     * section is a habit with no precedent in the references, and it delays
     * information the reader has already scrolled to.
     */
    const all = [...document.querySelectorAll('[data-reveal]:not([data-shown])')]
    const fold = window.innerHeight

    const els = []
    all.forEach((el) => {
      if (el.getBoundingClientRect().top < fold) els.push(el)
      else el.setAttribute('data-shown', '') // below the fold: just be there
    })
    if (!els.length) return cleanupMotion

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.setAttribute('data-shown', ''))
      return cleanupMotion
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

    // An IntersectionObserver callback is scheduled, not synchronous. Anything
    // already on screen at mount would otherwise sit in its hidden state for a
    // frame or two, which reads as a flash.
    const kick = requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.setAttribute('data-shown', '')
          io.unobserve(el)
        }
      })
    })

    return () => {
      cancelAnimationFrame(kick)
      io.disconnect()
      cleanupMotion()
    }
  }, [key])
}

/** Staggers a list without hand-writing a delay on every item. */
export const revealDelay = (i, step = 70) => ({ '--reveal-delay': `${i * step}ms` })
