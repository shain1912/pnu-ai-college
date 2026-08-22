import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useMedia'
import { asset } from '../lib/asset'
import { ADPX, HERO } from '../data/content'

/*
 * ── 소스 기록 ────────────────────────────────────────────────────────────────
 *
 * [영상] public/video/hero_reel.mp4 는 클라이언트가 직접 편집한 spliced.mp4 다.
 *   생성물이 아니라 사람이 붙인 컷이라 컷 순서와 워프 위치를 그대로 지켰다.
 *   1152px, 무음, GOP 6 으로 재인코딩만 했다. GOP 를 촘촘히 둔 이유는 스크롤로
 *   currentTime 을 옮길 때 키프레임 간격이 넓으면 탐색이 끊기기 때문이다.
 *
 * [토스에서 가져온 것] 하나의 sticky 무대 안에서 영상이 스크롤에 묶여 흐르고
 *   그 위 문구만 교체되는 구조.
 *   관찰 근거: docs/motion/toss.md §2-1, assets/motion/toss-hero-progress-sheet1.jpg
 *   프레임 000→001 에서 이전 헤드라인이 흐려지며 다음 문구가 자리를 넘겨받는다.
 *   근거 강도: 직접관찰(프레임)
 *
 * [토스와 다르게 한 것] 토스 히어로는 밝은 배경에 어두운 글자다. 이 영상은
 *   짙은 남색이라 반대로 뒤집었다. 배경을 밝게 맞추려고 영상을 밝히면
 *   클라이언트가 잡아놓은 톤이 무너진다.
 *
 * [컷과 문구 대응] 컷 경계는 ffmpeg scene detect + 2fps 컨택트시트로 확인했다.
 *   0.00–1.90  로봇 팔 + 홀로그램 인터페이스   → 헤드라인
 *   1.90–3.38  데이터 비                        → D 데이터
 *   3.38–4.40  입자 구름 + 궤도 링              → A 인공지능
 *   4.40–5.67  워프                             → 문구 없음
 *   5.67–6.67  자율주행차                       → X 확장
 *   6.67–7.96  산업 로봇 + 기어 조립            → P 공정
 *   7.96–8.40  워프                             → 문구 없음
 *   8.40–10.0  부산대 엠블럼                    → 마무리 + CTA
 *
 *   컷 순서가 D·A·X·P 라 학사 구조 절의 A·D·P·X 와 어긋난다. 그래도 편집을
 *   건드리지 않았다. ADPX 는 순서가 있는 단계가 아니라 네 역할이라고
 *   content.js 에 적어둔 대로이고, 화면에 보이는 것과 문구가 맞는 쪽이 먼저다.
 * ────────────────────────────────────────────────────────────────────────────
 */

const axis = (key) => ADPX.axes.find((item) => item.key === key)

/** 문구 창 [시작, 끝] 초. 컷 경계보다 안쪽이라 컷이 바뀌기 전에 문구가 먼저 빠진다. */
const WINDOWS = { D: [2.05, 3.15], A: [3.5, 4.2], X: [5.8, 6.5], P: [6.8, 7.75] }

const CHAPTERS = [
  {
    id: 'intro',
    at: [0.1, 1.55],
    eyebrow: HERO.badge,
    title: HERO.headline.join('\n'),
    body: HERO.sub,
  },
  ...['D', 'A', 'X', 'P'].map((key) => {
    const found = axis(key)
    return {
      id: key,
      at: WINDOWS[key],
      eyebrow: key + ' · ' + found.name,
      title: found.person,
      body: found.role,
      meta: found.school + ' · ' + found.seats + '명',
    }
  }),
  {
    id: 'outro',
    at: [8.7, 10],
    eyebrow: '부산대학교',
    title: '2027년 3월,\nAI대학이 문을 엽니다',
    body: '입학정원 424명. 대학은 국내 최대 규모의 AI 단과대학이라고 밝혔어요.',
    cta: true,
  },
]

const FADE = 0.25
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/** 챕터 창 안이면 1, 창 밖 FADE 구간에 걸쳐 0 으로 떨어진다. */
const weightAt = (time, bounds) => {
  const [start, end] = bounds
  if (time < start) return clamp((time - (start - FADE)) / FADE)
  if (time > end) return clamp(1 - (time - end) / FADE)
  return 1
}

export default function HeroScene() {
  const reduced = useReducedMotion()
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const [time, setTime] = useState(0)
  const [ready, setReady] = useState(false)

  /*
   * 스크롤 진행률을 영상 시간으로 그대로 옮긴다. 컷마다 스크롤 거리가 그 컷의
   * 길이에 비례하므로, 클라이언트가 편집에서 잡아둔 완급이 스크롤에서도 남는다.
   */
  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const root = rootRef.current
      if (!root) return
      const range = root.offsetHeight - window.innerHeight
      const progress = range > 0 ? clamp(-root.getBoundingClientRect().top / range) : 0
      const video = videoRef.current
      const duration = video && Number.isFinite(video.duration) ? video.duration : 10
      const next = progress * Math.max(0, duration - 0.05)
      setTime(next)
      // 25ms 미만 차이로는 탐색을 걸지 않는다. 매 프레임 seek 를 걸면 디코더가
      // 앞선 탐색을 끝내기 전에 다음 요청이 들어와 영상이 멈춘 것처럼 보인다.
      if (video && Math.abs(video.currentTime - next) > 0.025) video.currentTime = next
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

  /*
   * 모바일 사파리는 한 번도 재생된 적 없는 영상의 탐색을 거부한다. 메타데이터가
   * 오면 곧바로 재생했다 멈춰서 탐색 가능한 상태로 만들어 둔다.
   */
  const prime = (event) => {
    const video = event.currentTarget
    setReady(true)
    const played = video.play()
    if (played && played.then) played.then(() => video.pause()).catch(() => {})
    else video.pause()
  }

  const weights = CHAPTERS.map((chapter, index) =>
    reduced ? (index === 0 ? 1 : 0) : weightAt(time, chapter.at),
  )
  const lead = weights.indexOf(Math.max(...weights))

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative bg-canvas"
      style={{ height: reduced ? 'auto' : '700svh' }}
    >
      <div className="sticky top-16 px-[10px] pb-[10px] md:top-[72px] md:px-5 md:pb-5">
        <div className="relative h-[calc(100svh-84px)] overflow-hidden rounded-[18px] bg-[#0a0a14] md:h-[calc(100svh-96px)] md:rounded-[28px]">
          {reduced ? (
            <img src={asset('img/hero_reel@2x.webp')} alt="" className="h-full w-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              aria-hidden="true"
              className="h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: ready ? 1 : 0 }}
              poster={asset('img/hero_reel@2x.webp')}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={prime}
            >
              <source src={asset('video/hero_reel.mp4')} type="video/mp4" />
            </video>
          )}

          {/* 글자가 앉는 아래쪽만 눌러 어둡게 한다. 영상 위쪽 톤은 건드리지 않는다. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#05050c] via-[#05050c]/70 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-14 md:pb-12">
            <div className="relative grid max-w-[760px]">
              {CHAPTERS.map((chapter, index) => {
                const weight = weights[index]
                return (
                  <div
                    key={chapter.id}
                    aria-hidden={weight === 0}
                    className="col-start-1 row-start-1"
                    style={{
                      opacity: weight,
                      filter: reduced ? 'none' : `blur(${(1 - weight) * 10}px)`,
                      transform: reduced ? 'none' : `translateY(${(1 - weight) * 18}px)`,
                      pointerEvents: weight > 0.9 ? 'auto' : 'none',
                    }}
                  >
                    <p className="text-[13px] font-bold tracking-[0.08em] text-sky-300">{chapter.eyebrow}</p>
                    <h1 className="mt-3 whitespace-pre-line text-[clamp(1.9rem,4.6vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-white">
                      {chapter.title}
                    </h1>
                    <p className="mt-4 max-w-[38rem] text-[15px] font-medium leading-[1.65] text-white/75 md:text-[17px]">
                      {chapter.body}
                    </p>
                    {chapter.meta && <p className="mt-3 text-[13px] font-semibold text-white/55">{chapter.meta}</p>}
                    {chapter.cta && (
                      <div className="mt-7 flex flex-wrap items-center gap-4">
                        <Link
                          to="/ai-college"
                          className="rounded-[--radius-pill] bg-white px-6 py-3 text-[15px] font-bold text-gray-950 transition-transform duration-[--dur-base] hover:-translate-y-0.5"
                        >
                          {HERO.primary.label}
                        </Link>
                        <a href="#adpx" className="text-[15px] font-semibold text-white/80 underline-offset-4 hover:underline">
                          {HERO.secondary.label}
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div aria-hidden="true" className="absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
            {CHAPTERS.map((chapter, index) => (
              <span
                key={chapter.id}
                className="h-[2px] rounded-full bg-white transition-all duration-[--dur-base]"
                style={{ width: index === lead ? 24 : 12, opacity: index === lead ? 0.85 : 0.28 }}
              />
            ))}
          </div>
        </div>
        <p className="mx-auto mt-2.5 max-w-[1120px] px-1 text-[12px] text-ink-faint">
          배경 영상은 생성형 AI로 제작한 연출 화면이에요. 실제 시설이나 장비를 촬영한 것이 아니에요.
        </p>
      </div>
    </section>
  )
}
