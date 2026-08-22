/**
 * Resolves a public-directory path against the deploy base.
 *
 * The site ships to a GitHub Pages project URL, so it is served from
 * /pnu-ai-college/ rather than the domain root. A literal "/video/x.webm"
 * resolves against the origin and 404s there while working fine in dev — which
 * is exactly how every image and video on the site ended up broken in
 * production while looking correct locally.
 *
 * Vite exposes the configured base as import.meta.env.BASE_URL, always with a
 * trailing slash.
 */
const BASE = import.meta.env.BASE_URL

export const asset = (path) => `${BASE}${String(path).replace(/^\/+/, '')}`

export const img = (slug, { retina = true } = {}) =>
  asset(`img/${slug}${retina ? '@2x' : ''}.webp`)

export const video = (slug, ext = 'webm') => asset(`video/${slug}.${ext}`)
