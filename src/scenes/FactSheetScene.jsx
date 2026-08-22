import { useEffect, useRef, useState } from 'react'
import { SUMMARY } from '../data/content'
import { asset } from '../lib/asset'
import { useReducedMotion } from '../hooks/useMedia'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [구조 1] 정보 구간 앞에 화면을 채우는 선언 한 장을 둔다
 *   toss 씬        : §2-8 온·오프라인 결제 인터스티셜
 *   캡처 파일       : assets/gap/home.jpg 행 3 (toss 열)
 *   원본에서 본 것  : 다른 요소가 거의 없는 화면에 "온오프라인 경계 없이" 한
 *                    문장만 크게 놓인다. 밀도 높은 구간 사이의 숨 쉬는 화면이다.
 *   바꾼 것과 이유  : toss 는 검정 배경, 우리는 브랜드 블루. 국립대 페이지에
 *                    검정 인터스티셜은 톤이 맞지 않는다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [구조 2] 무대는 고정하고 항목만 교체한다
 *   toss 씬        : §2-2 자산관리 / 3D 폰 렌더
 *   캡처 파일       : assets/motion/toss-scroll-64-120-sheet1.jpg 프레임 009~012
 *   원본에서 본 것  : 폰 렌더가 화면 오른쪽 같은 자리에 고정된 채, 왼쪽 카피만
 *                    단계적으로 바뀐다. 스크롤해도 무대는 움직이지 않는다.
 *   그대로 가져온 것: 한쪽을 sticky 로 고정하고 반대쪽 목록이 지나가는 배치,
 *                    그리고 현재 항목만 선명하고 나머지는 물러나는 처리
 *   바꾼 것과 이유  : toss 는 제품 목업을 고정하지만 우리는 유리 오브젝트를
 *                    고정한다. 우리에게는 보여줄 제품 화면이 없다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [숫자 취급] 424 가 화면 하나를 받는다
 *   toss 씬        : 대응 없음 — 우리 고유
 *   이유           : toss 는 스펙 표가 없는 제품 사이트라 대응할 챕터가 없다.
 *                    424 는 이 페이지에서 가장 강한 증거인데 표의 한 행으로
 *                    묻혀 있었다.
 *
 * ── 영상 ──────────────────────────────────────────────────────────────
 * /video/schools, /video/apex — Higgsfield 생성. toss 영상 연출 참조는 없다.
 */

const STAGE = [
  { slug: 'schools', keys: ['출범', '입학정원', '모집단위'] },
  { slug: 'apex', keys: ['대학이 밝힌 구성', '설계 원칙', '운영 체계'] },
  { slug: 'infra_gpu', keys: ['핵심 인프라', '2027학년도 수시 원서접수'] },
]

const stageFor = (key) => {
  const i = STAGE.findIndex((s) => s.keys.some((k) => key.startsWith(k)))
  return i === -1 ? 0 : i
}

export default function FactSheetScene() {
  const reduced = useReducedMotion()
  const rowRefs = useRef([])
  const [current, setCurrent] = useState(0)

  /*
   * The stage follows whichever row is nearest the middle of the viewport.
   * Reading position, not scroll percentage — the rows are uneven heights and a
   * percentage would swap the object while the reader is still on the row that
   * belongs to the previous one.
   */
  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      rowRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setCurrent(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
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

  const activeStage = stageFor(SUMMARY.rows[current]?.k ?? '')

  return (
    <>
      {/* the breathing screen before the dense part */}
      <section id="summary" className="relative overflow-hidden bg-brand-strong">
        <div className="edge flex min-h-[78svh] flex-col justify-center py-24">
          <p className="text-[15px] font-semibold text-blue-100">한눈에 보기</p>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="text-[clamp(4.5rem,15vw,11rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-white">
              424
            </span>
            <span className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-blue-100">명</span>
          </p>

          <p className="mt-8 max-w-[34rem] text-[clamp(1.25rem,2.6vw,1.75rem)] font-bold leading-[1.45] text-white">
            대학이 밝힌 국내 최대 규모의 AI 단과대학이에요.
          </p>
          <p className="mt-4 max-w-[32rem] text-[16px] leading-[1.7] text-blue-50">
            AI컴퓨터공학부 214명, 데이터사이언스학부·통계학과 114명, 산업공학부 69명,
            AX융합학부 27명을 더한 숫자예요.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -right-8 h-[58%] w-[58%] max-w-[560px] opacity-70 mix-blend-screen"
        >
          <img
            src={asset('img/emblem@2x.webp')}
            alt=""
            className="h-full w-full object-contain object-bottom"
          />
        </div>
      </section>

      {/* stage holds on the left, the facts move past it on the right */}
      <section className="bg-canvas py-20 md:py-28">
        <div className="edge">
          <h2 className="h2 text-ink">{SUMMARY.title}</h2>

          <div className="mt-12 md:mt-16 md:grid md:grid-cols-[minmax(0,420px)_1fr] md:items-start md:gap-16">
            <div className="hidden md:block md:sticky md:top-32">
              <div className="relative aspect-square overflow-hidden rounded-[--radius-xl] bg-[#0a0a14]">
                {STAGE.map((s, i) => (
                  <div
                    key={s.slug}
                    aria-hidden="true"
                    className="absolute inset-0 transition-[opacity,filter] duration-[600ms] ease-[--ease-enter]"
                    style={{
                      opacity: i === activeStage ? 1 : 0,
                      filter: i === activeStage ? 'blur(0px)' : 'blur(12px)',
                    }}
                  >
                    {reduced ? (
                      <img
                        src={asset(`img/${s.slug}@2x.webp`)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        className="h-full w-full object-cover"
                        poster={asset(`img/${s.slug}@2x.webp`)}
                        autoPlay={i === activeStage}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      >
                        <source src={asset(`video/${s.slug}.webm`)} type="video/webm" />
                        <source src={asset(`video/${s.slug}.mp4`)} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <dl className="border-t border-line">
              {SUMMARY.rows.map((row, i) => (
                <div
                  key={row.k}
                  ref={(el) => (rowRefs.current[i] = el)}
                  className="border-b border-line py-8 transition-opacity duration-[--dur-base] md:py-10"
                  style={{ opacity: reduced || i === current ? 1 : 0.4 }}
                >
                  <dt className="text-[14px] font-bold text-brand">{row.k}</dt>
                  <dd className="mt-3 text-[20px] font-bold leading-[1.45] text-ink md:text-[24px]">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-10 text-[14px] leading-[1.7] text-ink-faint">{SUMMARY.note}</p>
        </div>
      </section>
    </>
  )
}
