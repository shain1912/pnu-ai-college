import { useReducedMotion } from '../hooks/useMedia'
import { asset } from '../lib/asset'

/**
 * A generated object rendered as its five-second loop, falling back to the
 * still it was generated from.
 *
 * Every object in the set ships as both a webm/mp4 loop and a poster webp. The
 * still is not a placeholder — it is the same frame, so a viewer who blocks
 * autoplay, is on a slow connection, or has reduced motion turned on sees the
 * identical composition rather than an empty box.
 */
export default function LoopMedia({
  slug,
  alt = '',
  className = '',
  width,
  height,
  eager = false,
}) {
  const reduced = useReducedMotion()
  const poster = asset(`img/${slug}@2x.webp`)

  if (reduced) {
    return (
      <img
        src={poster}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <video
      className={className}
      poster={poster}
      width={width}
      height={height}
      autoPlay
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'metadata'}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : 'true'}
    >
      <source src={asset(`video/${slug}.webm`)} type="video/webm" />
      <source src={asset(`video/${slug}.mp4`)} type="video/mp4" />
    </video>
  )
}
