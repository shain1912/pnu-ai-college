import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SCHOOLS, D_AXIS_SEATS, facultyOf } from '../data/schools'
import { useIsMobile, useReducedMotion } from '../hooks/useMedia'
import { asset } from '../lib/asset'

/*
 * ── toss 출처 기록 ──────────────────────────────────────────────────────────
 *
 * [구조] 세로 스크롤이 가로 카드 레일을 민다
 *   toss 씬        : 광고 상품 레일 "상품마다 판매 전략이 다르듯"
 *   캡처 파일       : assets/motion/toss-rail-move.jpg (스크롤 0.470~0.545 6단계)
 *   원본에서 본 것  : 0.485 에서는 「혜택이 잘 보이는 리스트 광고」가 맨 왼쪽인데
 *                    0.500 에서는 「자동 플레이되는 동영상 광고」가 왼쪽으로 잘려
 *                    나가 있다. 페이지가 1.5% 내려가는 동안 레일이 카드 두 장만큼
 *                    왼쪽으로 갔다. 제목은 제자리에 있고 레일만 움직인다.
 *   그대로 가져온 것: 세로 스크롤 → 가로 이동, 제목 고정, 카드가 좌우 양끝을
 *                    넘어 잘려 나가는 것. 잘린 카드가 "더 있다"는 신호다.
 *   바꾼 것과 이유  : toss 카드는 앱 화면 목업이고 우리는 학부 영상이다.
 *                    보여줄 제품 화면이 없다.
 *   근거 강도       : 직접관찰(프레임 비교)
 *
 * [영상] 카드 위 영상은 클라이언트 편집본에서 잘라 쓴 축별 화면이다.
 *   axis_a 입자 구름 / axis_d 데이터 비 / axis_stat 데이터 비(다른 크롭) /
 *   axis_p 산업 로봇 / axis_x 자율주행차. 출처는 docs/GAP_LOG.md 5회차 표.
 * ────────────────────────────────────────────────────────────────────────────
 */

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/*
 * D축 두 단위는 원문에 학부 단독 정원이 없고 합산 114명만 있다. 괄호에 다른
 * 단위 이름을 넣으면 통계학과 카드에 "통계학과 포함"이 찍혀 자기를 가리킨다.
 * 어느 카드에 놓여도 맞는 문구로 적는다.
 */
const seatLabel = (school) =>
  school.seats === null ? `D축 합산 ${D_AXIS_SEATS}명` : `${school.seats}명`

export default function SchoolRailScene() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const rootRef = useRef(null)
  const railRef = useRef(null)
  const [shift, setShift] = useState(0)

  /*
   * 좁은 화면에서는 스크롤 구동을 끄고 손가락으로 미는 평범한 가로 스크롤로
   * 돌린다. 390px 에서 확인해 보니 카드가 264px 라 어느 위치에서도 좌우가
   * 잘려 있고, overflow-hidden 이라 밀어도 움직이지 않는다. 손안에서는 가로로
   * 늘어선 것을 밀어 보는 것이 먼저 나오는 동작인데 아무 반응이 없다.
   *
   * 데스크톱은 그대로 둔다. 마우스에는 가로로 밀 방법이 마땅치 않아서 세로
   * 스크롤이 미는 편이 낫고, 잘린 카드가 "더 있다"는 신호도 거기서는 유효하다.
   */
  const driven = !reduced && !mobile

  /*
   * 레일이 실제로 넘치는 만큼만 민다. 카드 폭과 화면 폭은 뷰포트마다 달라서
   * 이동 거리를 상수로 박아두면 좁은 화면에서는 끝까지 못 가고 넓은 화면에서는
   * 빈 자리가 생긴다. 매번 재어서 넘치는 폭을 그대로 쓴다.
   */
  useEffect(() => {
    if (!driven) return
    let frame = 0
    const update = () => {
      frame = 0
      const root = rootRef.current
      const rail = railRef.current
      if (!root || !rail) return
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

  return (
    <section
      ref={rootRef}
      id="schools-rail"
      className="relative bg-canvas"
      style={{ height: driven ? '240svh' : 'auto' }}
      aria-labelledby="schools-rail-title"
    >
      <div className={driven ? 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-16' : 'py-16 md:py-20'}>
        <div className="edge">
          <p className="text-[15px] font-semibold text-brand">편제 대상</p>
          <h2 id="schools-rail-title" className="h2 mt-4 whitespace-pre-line text-ink">
            {'424명이\n이 다섯 곳으로 들어와요'}
          </h2>
          <p className="lead mt-5 max-w-[38rem]">
            세 개 단과대학에 흩어져 있던 학문단위예요. 2027년 3월에 AI대학 한 곳으로 모여요.
          </p>
        </div>

        {/*
         * edge 안에 넣지 않는다. 컨테이너 안에 가두면 카드가 양끝에서 딱 끊겨
         * 다섯 개가 전부라는 인상이 된다. 화면 밖으로 넘어가야 더 있다는 신호가 된다.
         */}
        <div
          ref={railRef}
          className={`mt-10 md:mt-12 ${
            driven ? 'overflow-hidden' : 'snap-x snap-mandatory scroll-pl-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          }`}
        >
          <ul
            className="flex w-max gap-4 px-6 md:gap-5 md:px-[max(1.5rem,calc((100vw-1120px)/2))]"
            style={driven ? { transform: `translate3d(${-shift}px, 0, 0)` } : undefined}
          >
            {SCHOOLS.map((school) => (
              <li key={school.slug} className="w-[264px] shrink-0 snap-start md:w-[320px]">
                <Link
                  to={`/ai-college/schools/${school.slug}`}
                  className="card group flex h-full flex-col overflow-hidden p-0"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-[#0a0a14]">
                    {reduced ? (
                      <img
                        src={asset(`img/${school.image}@2x.webp`)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <video
                        className="h-full w-full object-cover"
                        poster={asset(`img/${school.image}@2x.webp`)}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      >
                        <source src={asset(`video/${school.image}.webm`)} type="video/webm" />
                        <source src={asset(`video/${school.image}.mp4`)} type="video/mp4" />
                      </video>
                    )}
                    <span className="absolute left-3 top-3 rounded-[--radius-sm] bg-white/90 px-2 py-1 text-[12px] font-bold text-ink">
                      {school.axis} · {school.axisName}
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-5 md:p-6">
                    <span className="text-[19px] font-bold leading-[1.35] text-ink md:text-[21px]">
                      {school.name}
                    </span>
                    <span className="mt-2 text-[13px] font-semibold text-brand">{seatLabel(school)}</span>
                    <span className="mt-3 text-[14px] leading-[1.6] text-ink-muted">{school.role}</span>
                    <span className="mt-5 flex items-center gap-1.5 pt-1 text-[14px] font-semibold text-ink-subtle md:mt-auto">
                      소속 교원 {facultyOf(school).length}명 보기
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-[--dur-base] group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
