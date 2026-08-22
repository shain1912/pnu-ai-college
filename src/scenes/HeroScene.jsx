import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useMedia'
import { asset } from '../lib/asset'
import { ADPX, CHAIN, HERO } from '../data/content'

/*
 * ── toss 출처 기록 ──────────────────────────────────────────────────────────
 * [구조] toss 송금 히어로처럼 하나의 sticky 무대 안에서 장면과 문구를 함께 넘겨요.
 *   관찰 근거: docs/motion/toss.md §2-1, assets/motion/toss-hero-progress-sheet1.jpg
 *   프레임 000→001에서 이전 헤드라인이 밀려나며 흐려지고 다음 영상과 문구가 자리를
 *   넘겨받는 것을 직접 관찰했어요. 고정 무대와 장면·문구 동시 교체만 가져왔어요.
 * [배치] 영상 무대가 내비게이션 아래 화면 대부분을 채우고 문구는 영상 하단에 겹쳐요.
 *   관찰 근거: assets/motion/toss-hero-fine/008.png, docs/motion/toss.md §2-1
 *   우리 영상은 밝은 스튜디오 장면이라 가독성을 위해 어두운 글자와 국소 흰 패널을 써요.
 * [전환] 문구는 blur·opacity·수직 이동으로 순차 교체해요.
 *   관찰 근거: docs/motion/toss.md §2-3. 장면 자체는 toss를 추정해 복제하지 않고,
 *   제공된 t_da/t_ap 실제 모프를 스크롤 진행률로 재생해 네 소재를 하나의 흐름으로 묶어요.
 * ────────────────────────────────────────────────────────────────────────────
 */

const ORDER = ['D', 'A', 'P', 'X']
const SLUGS = { D: 'scene_d', A: 'scene_a', P: 'scene_p', X: 'scene_x' }
const MORPHS = ['t_da', 't_ap']
// Holds are brief; the transformations own most of the scroll distance so the
// connecting motion, rather than four separate loop clips, is what people see.
const PHASE_WIDTHS = [0.07, 0.2, 0.07, 0.2, 0.07, 0.32, 0.07]

const SCENES = ORDER.map((key) => {
  const axis = ADPX.axes.find((item) => item.key === key)
  const chain = CHAIN.steps.find((item) => item.key === key)
  return { ...axis, slug: SLUGS[key], line: chain?.text ?? axis.role }
})

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export default function HeroScene() {
  const reduced = useReducedMotion()
  const rootRef = useRef(null)
  const morphRefs = useRef([])
  const [position, setPosition] = useState(0)
  const [entered, setEntered] = useState(reduced)

  useEffect(() => {
    if (reduced) return
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const root = rootRef.current
      if (!root) return
      const range = root.offsetHeight - window.innerHeight
      const progress = range > 0 ? clamp(-root.getBoundingClientRect().top / range) : 0
      setPosition(progress)
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
  }, [reduced])

  let phaseStart = 0
  let segment = PHASE_WIDTHS.length - 1
  for (let index = 0; index < PHASE_WIDTHS.length; index += 1) {
    if (position <= phaseStart + PHASE_WIDTHS[index]) {
      segment = index
      break
    }
    phaseStart += PHASE_WIDTHS[index]
  }
  const within = clamp((position - phaseStart) / PHASE_WIDTHS[segment])
  const isTransition = segment % 2 === 1
  const from = Math.floor(segment / 2)
  const active = isTransition ? (within < 0.5 ? from : from + 1) : Math.ceil(segment / 2)

  useEffect(() => {
    if (reduced || !isTransition || from > 1) return
    const video = morphRefs.current[from]
    if (!video || !Number.isFinite(video.duration)) return
    const nextTime = within * Math.max(0, video.duration - 0.04)
    if (Math.abs(video.currentTime - nextTime) > 0.025) video.currentTime = nextTime
  }, [from, isTransition, reduced, within])

  const sceneOpacity = (index) => {
    if (!isTransition) return index === active ? 1 : 0
    if (from < 2) return 0
    if (index === from) return 1 - within
    if (index === from + 1) return within
    return 0
  }

  const copyOpacity = (index) => {
    if (!isTransition) return index === active ? 1 : 0
    if (index === from) return clamp(1 - within * 2)
    if (index === from + 1) return clamp((within - 0.5) * 2)
    return 0
  }

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative bg-canvas"
      style={{ height: reduced ? 'auto' : '700svh' }}
    >
      <div className="sticky top-16 px-[10px] pb-[10px] md:top-[72px] md:px-5 md:pb-5">
        <div className="relative h-[calc(100svh-84px)] overflow-hidden rounded-[18px] bg-[#f4f6f8] md:h-[calc(100svh-96px)] md:rounded-[28px]">
          {SCENES.map((scene, index) => (
            <div
              key={scene.key}
              aria-hidden={index !== active}
              className="absolute inset-0"
              style={{ opacity: reduced ? (index === 0 ? 1 : 0) : sceneOpacity(index) }}
            >
              {reduced ? (
                <img src={asset(`img/${scene.slug}@2x.webp`)} alt="" className="h-full w-full object-cover" />
              ) : (
                <video
                  className="h-full w-full object-cover"
                  poster={asset(`img/${scene.slug}@2x.webp`)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={index < 2 ? 'auto' : 'metadata'}
                >
                  <source src={asset(`video/${scene.slug}.webm`)} type="video/webm" />
                  <source src={asset(`video/${scene.slug}.mp4`)} type="video/mp4" />
                </video>
              )}
            </div>
          ))}

          {!reduced && MORPHS.map((slug, index) => (
            <video
              key={slug}
              ref={(node) => { morphRefs.current[index] = node }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{ opacity: isTransition && from === index ? 1 : 0 }}
              poster={asset(`img/${slug}@2x.webp`)}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => {
                if (isTransition && from === index) {
                  event.currentTarget.currentTime = within * Math.max(0, event.currentTarget.duration - 0.04)
                }
              }}
            >
              <source src={asset(`video/${slug}.webm`)} type="video/webm" />
              <source src={asset(`video/${slug}.mp4`)} type="video/mp4" />
            </video>
          ))}

          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-white/95 via-white/50 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-14 md:pb-12">
            <div className="relative grid max-w-[720px]">
              {SCENES.map((scene, index) => {
                const opacity = reduced ? (index === 0 ? 1 : 0) : copyOpacity(index)
                return (
                  <div
                    key={scene.key}
                    aria-hidden={opacity === 0}
                    className="col-start-1 row-start-1"
                    style={{
                      opacity,
                      filter: reduced ? 'none' : `blur(${(1 - opacity) * 10}px)`,
                      transform: reduced ? 'none' : `translateY(${(1 - opacity) * 18}px)`,
                      pointerEvents: opacity > 0.9 ? 'auto' : 'none',
                    }}
                  >
                    <p className="text-[13px] font-bold tracking-[0.08em] text-brand">{scene.key} · {scene.name}</p>
                    <h1 className="mt-3 text-[clamp(2rem,5vw,4.4rem)] font-extrabold leading-[1.06] tracking-[-0.035em] text-gray-950">
                      {scene.person}
                    </h1>
                    <p className="mt-4 max-w-[36rem] text-[15px] font-medium leading-[1.65] text-gray-700 md:text-[18px]">{scene.line}</p>
                  </div>
                )
              })}
            </div>

            <div className={`mt-6 flex flex-wrap items-center gap-4 transition-[opacity,transform] duration-[700ms] ${entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
              <Link to="/ai-college" className="rounded-[--radius-pill] bg-brand-strong px-6 py-3 text-[15px] font-bold text-white transition-transform duration-[--dur-base] hover:-translate-y-0.5">
                {HERO.primary.label}
              </Link>
              <span className="text-[13px] font-semibold text-ink-subtle md:text-[14px]">{HERO.badge}</span>
            </div>
          </div>

          <div aria-hidden="true" className="absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
            {SCENES.map((scene, index) => (
              <span key={scene.key} className="h-[2px] rounded-full bg-gray-900 transition-all duration-[--dur-base]" style={{ width: index === active ? 24 : 12, opacity: index === active ? 0.8 : 0.22 }} />
            ))}
          </div>
        </div>
        <p className="mx-auto mt-2.5 max-w-[1120px] px-1 text-[12px] text-ink-faint">배경 영상은 생성형 AI로 제작했어요. 실제 시설을 촬영한 것이 아니에요.</p>
      </div>
    </section>
  )
}
