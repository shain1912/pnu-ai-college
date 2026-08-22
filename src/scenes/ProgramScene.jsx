import { useEffect, useRef, useState } from 'react'
import { PROGRAMS } from '../data/content'
import { useReducedMotion } from '../hooks/useMedia'
import SceneVideo from '../components/SceneVideo'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [한 번에 하나] 화면 하나에 대상 하나만 크게 놓고, 스크롤로 갈아 끼운다
 *   toss 씬        : 제품 소개 구간 — 폰 / 택배상자 / POS 단말 / 태블릿이
 *                    각각 자기 화면을 통째로 차지한다
 *   캡처 파일       : assets/gap/home.jpg 행 1·2·4·10·11 (toss 열, 14단계)
 *   원본에서 본 것  : 열넷 중 여덟 화면이 대상 하나만 크게 보여준다. 곁들이는
 *                    문구는 한 덩이뿐이고 목록이나 격자가 없다.
 *   그대로 가져온 것: 한 화면에 하나. 나머지는 물러난다.
 *   바꾼 것과 이유  : toss 는 절마다 화면을 새로 쌓지만 우리는 무대를 고정하고
 *                    안에서 갈아 끼운다. 셋이 나란한 프로그램이라 자리를 옮기면
 *                    비교가 끊긴다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * ── 왜 이 절이 필요했나 ──────────────────────────────────────────────────
 * 15회차까지 홈은 toss 와 같은 20화면이 됐다. 길이는 맞췄는데 화면당 밀도가
 * 다르다. 표는 여덟 줄, 레일은 카드 다섯, 이름 벽은 예순 명 — 우리는 한
 * 화면에 여러 개를 편다. toss 는 하나만 놓는다.
 *
 * 그리고 「들어와서 무엇을 할 수 있나요」가 /ai-college 안쪽에만 있었다.
 * 진학을 생각하는 사람에게는 정원이나 교원보다 이쪽이 먼저 궁금하다.
 * ────────────────────────────────────────────────────────────────────────
 */

const MEDIA = ['prog_pathway_v', 'prog_funnel_v', 'prog_startup_v']
const ALT = [
  '어두운 공간에서 파란 경로 여러 갈래가 갈라졌다 다시 모이고, 갈림마다 표식이 빛난다.',
  '위쪽에 넓게 흩어진 파란 입자들이 아래로 내려오며 하나의 밝은 기둥으로 좁혀진다.',
  '어두운 실험대 위로 파란 홀로그램 장치가 빛의 고리를 남기며 떠오른다.',
]

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export default function ProgramScene() {
  const reduced = useReducedMotion()
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)

  /*
   * 스크롤 진행률을 항목 수로 나눠 현재 항목을 고른다. 각 항목이 한 화면씩
   * 붙잡으므로 절 높이는 (항목 수 + 1) 화면이다. 마지막 항목도 온전히 한
   * 화면을 갖고 나서 절이 풀린다.
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
      const next = Math.min(PROGRAMS.items.length - 1, Math.floor(progress * PROGRAMS.items.length))
      setActive(next)
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

  return (
    <section
      ref={rootRef}
      id="programs"
      className="relative scroll-mt-24 bg-canvas"
      style={{ height: reduced ? 'auto' : `${(PROGRAMS.items.length + 1) * 100}svh` }}
      aria-labelledby="programs-title"
    >
      <div className={reduced ? 'band' : 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-16'}>
        <div className="edge w-full">
          <p className="text-[15px] font-semibold text-brand">{PROGRAMS.eyebrow}</p>
          <h2 id="programs-title" className="h2 mt-4 text-ink">
            {PROGRAMS.title}
          </h2>

          <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
            {/* 무대. 항목이 바뀌면 화면도 같이 넘어간다. */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[--radius-xl] bg-[#0a0a14] lg:order-2">
              {PROGRAMS.items.map((item, index) => (
                <div
                  key={item.name}
                  aria-hidden={index !== active}
                  className="absolute inset-0 transition-[opacity,filter] duration-[600ms] ease-[--ease-enter]"
                  style={{
                    opacity: reduced ? (index === 0 ? 1 : 0) : index === active ? 1 : 0,
                    filter: index === active ? 'blur(0px)' : 'blur(14px)',
                  }}
                >
                  <SceneVideo
                    slug={MEDIA[index]}
                    alt={ALT[index]}
                    className="h-full w-full object-cover"
                    play={index === active}
                  />
                </div>
              ))}
            </div>

            {/*
             * 좌우 두 칸은 lg(1024) 부터다. 768 에서 나누면 820x1180 태블릿에서
             * 무대가 화면 높이의 17% 로 쪼그라든다 — 한 화면에 하나를 보여주는
             * 자리인데 네 폭 중 가장 작다. 세로로 쌓으면 41% 를 받는다.
             *
             * 문구도 무대와 같은 자리에서 갈아 끼운다. 셋을 세로로 쌓아두고
             * 현재 것만 보이게 하면 자리가 흔들리지 않는다. 목록으로 늘어놓지
             * 않는 것이 이 절의 요점이다 — 한 번에 하나.
             */}
            <div className="relative grid lg:order-1">
              {PROGRAMS.items.map((item, index) => {
                const shown = reduced ? true : index === active
                return (
                  <div
                    key={item.name}
                    aria-hidden={!shown}
                    className={reduced ? 'border-t border-line py-6' : 'col-start-1 row-start-1'}
                    style={
                      reduced
                        ? undefined
                        : {
                            opacity: shown ? 1 : 0,
                            filter: shown ? 'blur(0px)' : 'blur(8px)',
                            transform: shown ? 'none' : 'translateY(14px)',
                            transition: 'opacity 600ms var(--ease-enter), filter 600ms var(--ease-enter), transform 600ms var(--ease-enter)',
                            pointerEvents: shown ? 'auto' : 'none',
                          }
                    }
                  >
                    <p className="text-[13px] font-bold tracking-[0.12em] text-brand">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-4 text-[clamp(1.5rem,3.2vw,2.375rem)] font-extrabold leading-[1.25] tracking-[-0.025em] text-ink">
                      {item.name}
                    </h3>
                    <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.7] text-ink-muted md:text-[17px]">
                      {item.body}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {!reduced && (
            <div aria-hidden="true" className="mt-10 flex gap-2 md:mt-14">
              {PROGRAMS.items.map((item, index) => (
                <span
                  key={item.name}
                  className="h-[3px] rounded-full bg-ink transition-all duration-[--dur-base]"
                  style={{ width: index === active ? 40 : 16, opacity: index === active ? 0.85 : 0.18 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
