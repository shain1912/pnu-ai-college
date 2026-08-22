/**
 * ChainScene — 가치사슬 사례 (부산항 컨테이너 하역)
 *
 * 위 씬(AxisScene)이 ADP+X를 "네 개의 역할"로 나란히 보여준다면, 여기는 그 넷이
 * 하나의 문제를 두고 순서대로 이어지는 장면이다. 그래서 카드 네 장을 늘어놓지 않고
 * 한 줄기 선으로 꿰었다. 순서는 D→A→P→X — 약칭 순서가 아니라 무엇이 무엇에
 * 의존하는지의 순서이고, 근거는 src/data/content.js 의 CHAIN 주석에 있다. 읽는
 * 사람이 "왜 D가 먼저지?"에서 걸리지 않도록 도표 위에 한 줄로 밝혀 둔다.
 *
 * 모션 (docs/SCENES.md §4)
 * - 스크롤 진입 애니메이션 없음. 이 씬은 /ai-college/adpx 의 마지막 섹션이라
 *   언제나 스크롤로 도달한다. 그래서 data-reveal 을 붙이지 않았다. 첫 페인트에
 *   도표는 이미 완성된 모습(선이 다 그어지고 배지가 다 칠해진 상태)이다.
 * - 유일한 모션은 사용자가 [흐름 따라가기]를 눌렀을 때다. 배지가 차례로 켜지고
 *   그 사이를 선이 그어진다. 끝난 뒤의 모습이 곧 기본 모습이라, 애니메이션이
 *   끝나도 아무것도 사라지지 않는다.
 * - 순서는 CSS animation-delay 로만 잡는다. 타이머로 상태를 네 번 바꾸는 대신
 *   불리언 하나(playing)만 두는 편이 프레임 드롭·언마운트에 강하다.
 * - prefers-reduced-motion: 버튼을 아예 렌더하지 않고 모든 animation 을 끈다.
 *   그 경우 도표는 처음부터 끝까지 완성 상태 그대로다.
 *
 * 에셋: 요청 없음. 이 사례는 CHAIN.caveat 가 밝히듯 진행 중인 사업이 아니라
 * 설명용 시나리오라서, 부산항 사진을 깔면 실재하는 프로젝트처럼 읽힌다.
 * 도표와 활자로만 만든다.
 */
import { useEffect, useRef, useState } from 'react'
import { ADPX, CHAIN } from '../data/content'
import { useReducedMotion } from '../hooks/useMedia'

/** 단계마다 그 일을 맡는 학부를 붙인다 — "손이 바뀐다"는 말이 누구의 손인지 보이게. */
const HANDS = CHAIN.steps.map((step) => {
  const axis = ADPX.axes.find((a) => a.key === step.key)
  return { ...step, name: axis.name, school: axis.school }
})

const LAST = HANDS.length - 1

// 배지가 켜지는 데 240ms, 다음 배지까지 선이 그어지는 데 520ms. 한 마디가 760ms라
// i번째 선이 다 그어지는 순간과 i+1번째 배지가 켜지는 순간이 정확히 맞물린다.
const NODE_MS = 240
const SEG_MS = 520
const BEAT = NODE_MS + SEG_MS
const TOTAL_MS = LAST * BEAT + NODE_MS

export default function ChainScene() {
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const guard = useRef(0)

  // animationend 가 오지 않는 경우(탭이 백그라운드로 내려가는 등)에도 라벨이
  // "따라가는 중"에 붙박이지 않도록 하는 보험.
  useEffect(() => () => clearTimeout(guard.current), [])

  const play = () => {
    if (playing) return
    setPlaying(true)
    clearTimeout(guard.current)
    guard.current = setTimeout(() => setPlaying(false), TOTAL_MS + 500)
  }

  const stop = () => {
    clearTimeout(guard.current)
    setPlaying(false)
  }

  return (
    <section id="chain" className="band bg-canvas-subtle">
      <div className="edge">
        <p className="text-[15px] font-semibold text-brand-strong">{CHAIN.eyebrow}</p>

        <h2 className="h2 mt-4 whitespace-pre-line text-ink">{CHAIN.title}</h2>

        <p className="lead mt-6 max-w-[36rem]">{CHAIN.intro}</p>

        <div data-play={playing ? '' : undefined} className="card mt-10 p-6 md:mt-12 md:p-8 lg:p-10">
          {/*
            단서 전문은 도표 아래에 있다 (CHAIN.caveat 가 "위 사례는"으로 시작하니
            도표보다 뒤여야 가리키는 대상이 맞는다). 다만 읽기 전에도 성격은 알아야
            해서, 도표 머리에 라벨만 먼저 붙인다.
          */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] leading-[1.6] text-ink-subtle">
              <span className="inline-block rounded-[--radius-pill] bg-gray-200 px-2.5 py-1 text-[12px] font-bold text-ink-muted">
                설명용 예시
              </span>
              글자 순서(A·D·P·X)가 아니라, 일이 실제로 이어지는 순서예요.
            </p>

            {!reduced && (
              <button
                type="button"
                data-chain-play
                onClick={play}
                aria-live="polite"
                className="inline-flex shrink-0 items-center gap-2 rounded-[--radius-pill] border border-line bg-canvas px-4 py-2 text-[14px] font-semibold text-ink-muted transition-[color,background-color,border-color] duration-[--dur-fast] ease-[--ease-standard] hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">
                  <path d="M3 1.4 10.2 6 3 10.6z" />
                </svg>
                {playing ? '따라가는 중…' : '흐름 따라가기'}
              </button>
            )}
          </div>

          <ol className="mt-8 grid gap-y-9 md:mt-10 md:grid-cols-4 md:gap-y-0">
            {HANDS.map((hand, i) => (
              <li
                key={hand.key}
                className="relative flex gap-4 md:block md:px-2 md:text-center lg:px-3"
              >
                {i < LAST && (
                  <>
                    <span
                      aria-hidden="true"
                      className="chain-line"
                      style={{ '--d': `${i * BEAT + NODE_MS}ms` }}
                    />
                    <span
                      aria-hidden="true"
                      className="chain-tip"
                      style={{ '--d': `${(i + 1) * BEAT}ms` }}
                    />
                  </>
                )}

                <div className="relative z-10 shrink-0">
                  <span
                    data-node
                    style={{ '--d': `${i * BEAT}ms` }}
                    onAnimationEnd={i === LAST ? stop : undefined}
                    className="grid h-12 w-12 place-items-center rounded-full bg-brand-strong text-[19px] font-bold leading-none text-white md:mx-auto"
                  >
                    {hand.key}
                  </span>
                </div>

                <div className="min-w-0 pt-0.5 md:pt-0">
                  <p className="text-[13px] font-bold uppercase tracking-wide text-brand-strong md:mt-4">
                    {hand.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.45] text-ink-subtle">{hand.school}</p>
                  <p className="mt-2.5 text-[15px] font-medium leading-[1.6] text-ink md:mt-3 md:text-[16px]">
                    {hand.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* 단서는 도표와 같은 판 안에 둔다. 밖으로 빼면 "위 사례"가 무엇인지 흐려진다. */}
          <p className="mt-9 max-w-[44rem] border-t border-line pt-5 text-[13.5px] leading-[1.75] text-ink-subtle md:mt-11">
            {CHAIN.caveat}
          </p>
        </div>

        {/*
          ADPX.closing 은 ADP+X 페이지 전체의 맺음말이고 이 씬이 그 페이지의 마지막
          섹션이라 여기 둔다. AxisScene 이 같은 문장을 들고 오면 통합 단계에서
          이쪽을 지우면 된다 (2026-08-22 확인 시점에는 들고 있지 않다).
        */}
        <p className="mt-12 text-[19px] font-bold leading-[1.5] text-ink md:text-[22px]">
          {ADPX.closing}
        </p>
      </div>

      <style>{`
        #chain {
          --chain-node-ms: ${NODE_MS}ms;
          --chain-seg-ms: ${SEG_MS}ms;
        }

        /* 쉴 때의 모습이 곧 애니메이션이 끝난 뒤의 모습이다. 선은 처음부터 다 그어져 있다. */
        #chain .chain-line {
          position: absolute;
          left: 23px;
          top: 3.5rem;
          bottom: -2.25rem;
          width: 2px;
          border-radius: 2px;
          background: var(--color-brand-strong);
          transform-origin: top;
        }

        #chain .chain-tip {
          position: absolute;
          left: 24px;
          bottom: -2.25rem;
          translate: -50% 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 7px solid var(--color-brand-strong);
        }

        @media (min-width: 768px) {
          /*
            열 사이 간격이 0이라, 열 안에서 left:50% + width:100% 는 정확히 이 배지
            중심에서 다음 배지 중심까지다. 배지는 z-10 이라 선 위에 얹힌다.
          */
          #chain .chain-line {
            left: 50%;
            top: 23px;
            bottom: auto;
            width: 100%;
            height: 2px;
            transform-origin: left;
          }

          #chain .chain-tip {
            left: auto;
            right: calc(-50% + 27px);
            top: 24px;
            bottom: auto;
            translate: 0 -50%;
            border-left: 7px solid var(--color-brand-strong);
            border-right: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
          }
        }

        @keyframes chain-draw-y { from { transform: scaleY(0) } to { transform: scaleY(1) } }
        @keyframes chain-draw-x { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes chain-tip-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes chain-arrive {
          from { background: var(--color-gray-200); color: var(--color-gray-500) }
          to   { background: var(--color-brand-strong); color: #fff }
        }

        #chain [data-play] [data-node] {
          animation: chain-arrive var(--chain-node-ms) var(--ease-standard) var(--d) both;
        }
        #chain [data-play] .chain-line {
          animation: chain-draw-y var(--chain-seg-ms) var(--ease-standard) var(--d) both;
        }
        #chain [data-play] .chain-tip {
          animation: chain-tip-in var(--chain-node-ms) linear var(--d) both;
        }

        @media (min-width: 768px) {
          #chain [data-play] .chain-line { animation-name: chain-draw-x }
        }

        @media (prefers-reduced-motion: reduce) {
          #chain [data-node],
          #chain .chain-line,
          #chain .chain-tip {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
