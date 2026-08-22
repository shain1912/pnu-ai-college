import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'
import { useReducedMotion } from '../hooks/useMedia'

/*
 * 화면에 들어올 때까지 받지 않는 루프 영상.
 *
 * 22회차에 첫 화면 전송량을 재보니 4초 동안 9.5MB 였고 그중 8.26MB 가 영상이었다.
 * 스크롤을 한 칸도 하지 않은 상태인데 학부 레일·부산항 타일·협력 기업 띠·마무리
 * 강의실까지 열 개가 내려오고 있었다. autoPlay 와 preload="metadata" 를 달아두면
 * 브라우저가 문서에 있는 것을 곧바로 물어온다. 화면 밖에 있는지는 보지 않는다.
 *
 * 그래서 preload="none" 으로 두고 source 도 뷰포트에 들어오기 전에는 붙이지
 * 않는다. src 가 없으면 브라우저가 받을 것이 없다. 들어오면 그때 붙이고 재생한다.
 *
 * poster 는 처음부터 둔다. 이건 받아야 자리를 채운다 — 영상이 오기 전에도 같은
 * 장면이 보이고, 자동재생이 막힌 사람이나 저속 회선에서는 이게 끝까지 남는다.
 *
 * eager 는 첫 화면에 이미 있는 것에만 쓴다. 관찰자를 붙여봐야 곧바로 들어오므로
 * 한 프레임 늦어지기만 한다.
 */
export default function SceneVideo({
  slug,
  alt = '',
  className = '',
  poster = `img/${slug}@2x.webp`,
  eager = false,
  play = true,
  formats = ['webm', 'mp4'],
}) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const [near, setNear] = useState(eager)
  const posterUrl = asset(poster)

  useEffect(() => {
    if (near || reduced) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    // 화면에 닿기 한 화면 앞에서 미리 받는다. 도착했을 때 검은 상자가 아니라
    // 이미 돌아가는 화면이 보이게 하려면 이 정도 여유가 필요하다.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near, reduced])

  if (reduced) {
    return <img ref={ref} src={posterUrl} alt={alt} className={className} loading="lazy" decoding="async" />
  }

  return (
    <video
      ref={ref}
      className={className}
      poster={posterUrl}
      autoPlay={near && play}
      muted
      loop
      playsInline
      preload={near ? 'auto' : 'none'}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : 'true'}
    >
      {near &&
        formats.map((ext) => (
          <source key={ext} src={asset(`video/${slug}.${ext}`)} type={`video/${ext === 'mp4' ? 'mp4' : 'webm'}`} />
        ))}
    </video>
  )
}
