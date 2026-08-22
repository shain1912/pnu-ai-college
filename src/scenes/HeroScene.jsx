import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useMedia'
import { asset } from '../lib/asset'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [구조] 영상이 화면을 채우고 헤드라인이 그 위 하단에 얹힌다
 *   toss 씬        : §2-1 송금 히어로 / 실사 영상
 *   캡처 파일       : assets/motion/toss-hero-fine/008.png (1440×900)
 *   원본에서 본 것  : nav 아래부터 화면 하단까지 영상이 차고, 좌우로 약 20px 여백만
 *                    남는다. 헤드라인은 흰색으로 영상 위 하단에 놓이고 어두운
 *                    오버레이 없이 영상 자체의 어두운 부분에 얹혀 읽힌다.
 *   그대로 가져온 것: 풀블리드 영상 + 영상 위 하단 헤드라인이라는 배치 자체
 *   바꾼 것과 이유  : 우리 영상은 밝은 아트리움이라 흰 글자가 그대로는 읽히지
 *                    않는다. 하단에만 그라데이션 스크림을 깔았다. toss 는
 *                    피사체가 어두워 스크림이 필요 없었다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [어절 간격] 헤드라인 어절 사이를 크게 벌린다
 *   toss 씬        : §2-1
 *   캡처 파일       : assets/motion/toss-hero-fine/008.png
 *   원본에서 본 것  : "금융부터 일상까지 / 마침내 / 토스 하나로" 세 어절 사이가
 *                    일반 공백의 3~4배로 벌어져 있다. 한 줄이지만 세 덩어리로 읽힌다.
 *   그대로 가져온 것: 어절을 덩어리로 끊고 사이를 크게 벌리는 조판
 *   바꾼 것과 이유  : 없음
 *   근거 강도       : 직접관찰(프레임)
 *
 * [등장] 어절이 순차로 나타난다
 *   toss 씬        : §2-1
 *   캡처 파일       : assets/motion/toss-load-20-sheet1.jpg 프레임 001→002
 *   원본에서 본 것  : 프레임 001 에서 첫 어절은 거의 불투명, 둘째는 약 0.45,
 *                    셋째는 아직 없다. 002 에서 셋 다 불투명해진다.
 *   그대로 가져온 것: 어절 단위 순차 등장과 그 순서
 *   바꾼 것과 이유  : 어절 간 지연은 20ms 샘플에도 중간 프레임이 없어 특정하지
 *                    못했다. 관찰 가능한 상한이 20ms 구간이라 그보다 읽히는
 *                    값(90ms)을 골랐다. 원본 수치가 아니라 우리 선택이다.
 *   근거 강도       : 직접관찰(순서) / 추정(지연값)
 *
 * [좌측 인디케이터] 세로 눈금
 *   toss 씬        : §2-4 전역 sticky
 *   캡처 파일       : assets/motion/toss-hero-fine/008.png 좌측 y≈380~510
 *   원본에서 본 것  : 짧은 가로선이 세로로 쌓여 있고 현재 위치만 굵고 길다.
 *   그대로 가져온 것: 눈금 형태와 위치
 *   바꾼 것과 이유  : toss 는 전 페이지 고정이지만 우리는 히어로에만 둔다.
 *                    우리 페이지는 챕터 구조가 아니라 눈금이 가리킬 대상이 없다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * ── 영상 ──────────────────────────────────────────────────────────────
 * /video/atrium-loop.webm|mp4 — Higgsfield seedance_2_5 생성 (assets/loop-jobs.txt).
 * toss 의 영상 연출을 참고한 것은 없다. toss 히어로는 인물 실사이고 우리는 건축
 * 공간이다. 카메라를 고정한 루프라는 점만 같고 그건 toss 를 보기 전에 정한 것이다.
 *
 * ── 씬 대응 ───────────────────────────────────────────────────────────
 * toss §2-1(송금 히어로)에 대응시켰다. 사이트의 첫 화면이고 풀블리드 실사 영상
 * 위에 한 문장을 얹는다는 역할이 같다.
 */

const CHUNKS = ['2027년 3월', 'AI대학이', '문을 엽니다']
const TICKS = 9

export default function HeroScene() {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced)
  const sectionRef = useRef(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [reduced])

  // The ticks track how far through the hero the reader has scrolled, which is
  // the only thing on this page they could honestly point at.
  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = sectionRef.current
      if (!el) return
      const span = el.offsetHeight - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span)) : 0
      setTick(Math.round(p * (TICKS - 1)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative bg-canvas px-[10px] pb-[10px] md:px-5 md:pb-5"
    >
      <div className="relative h-[calc(100svh-64px)] overflow-hidden rounded-[8px] md:h-[calc(100svh-72px)] md:rounded-[12px]">
        {reduced ? (
          <img
            src={asset('img/hero_light@2x.webp')}
            alt="밝은 대학 아트리움 전경. 천장에 푸른 유리 조형물이 매달려 있어요."
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            poster={asset('img/hero_light@2x.webp')}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={asset('video/atrium-loop.webm')} type="video/webm" />
            <source src={asset('video/atrium-loop.mp4')} type="video/mp4" />
          </video>
        )}

        {/* the atrium is bright, so white type needs ground the toss footage
            already had from its own dark subject */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 via-black/25 to-transparent"
        />

        {/* left tick rail */}
        <div
          aria-hidden="true"
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-[7px] md:flex"
        >
          {Array.from({ length: TICKS }, (_, i) => (
            <span
              key={i}
              className={`block h-[2px] rounded-full bg-white transition-all duration-[--dur-base] ${
                i === tick ? 'w-5 opacity-95' : 'w-2.5 opacity-45'
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-12 md:pb-14">
          <h1 className="flex flex-wrap items-baseline gap-x-8 gap-y-1 md:gap-x-14">
            {CHUNKS.map((chunk, i) => (
              <span
                key={chunk}
                className="block overflow-hidden"
                style={{ transitionDelay: `${120 + i * 90}ms` }}
              >
                <span
                  className={`block text-[clamp(2rem,6.2vw,4.25rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white transition-[transform,opacity] duration-[700ms] ease-[--ease-enter] ${
                    shown ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'
                  }`}
                  style={{ transitionDelay: `${120 + i * 90}ms` }}
                >
                  {chunk}
                </span>
              </span>
            ))}
          </h1>

          <div
            className={`mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 transition-[transform,opacity] duration-[700ms] ease-[--ease-enter] ${
              shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '420ms' }}
          >
            <Link
              to="/ai-college"
              className="rounded-[--radius-pill] bg-white px-7 py-3.5 text-[16px] font-bold text-gray-900 transition-transform duration-[--dur-base] hover:-translate-y-0.5"
            >
              AI대학 살펴보기
            </Link>
            <p className="text-[15px] font-medium text-white/85">
              입학정원 424명 · 국내에서 가장 큰 AI 단과대학
            </p>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-3 max-w-[1120px] px-1 text-[12px] text-ink-faint">
        배경 영상은 생성형 AI로 제작했어요. 실제 시설을 촬영한 것이 아니에요.
      </p>
    </section>
  )
}
