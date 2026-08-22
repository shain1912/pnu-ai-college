/*
 * ScaleScene — id="numbers" · /ai-college
 *
 * 이 페이지에서 가장 강한 증거는 숫자예요. 그래서 무게를 카운트업 같은 시간 연출이
 * 아니라 조판으로 줬어요.
 *
 *  - 424는 나머지 셋과 같은 크기의 카드에 두지 않고, 브랜드 면 위에 display 스케일로
 *    혼자 세웠어요. 한 화면에서 제일 큰 글자가 이 숫자가 되도록.
 *  - 17 / 256 / 300+ 은 카드 세 장이 아니라 헤어라인으로 나뉜 계기판 한 판이에요.
 *    떠 있는 카드보다 한 덩어리가 무거워요.
 *  - 숫자는 tabular-nums 로 자릿수를 맞췄어요.
 *
 * 카운트업은 넣지 않았어요. docs/SCENES.md §4 는 "최초 화면 진입 1회만" 애니메이션하고
 * "스크롤해서 도달하는 요소에는 붙이지 마라"고 못박아요. #numbers 는 /ai-college 에서
 * 언제나 첫 화면 아래에 있으니, 카운트업은 정의상 스크롤 진입 애니메이션이 돼요.
 * docs/motion/reference.md 의 네 레퍼런스(Linear·Stripe·EPFL·MIT)도 스크롤 진입
 * 애니메이션이 없었어요(픽셀 diff 0.00). 진입은 훅이 주는 data-reveal 에 맡기고,
 * 이 씬이 직접 만드는 모션은 §4 가 "반드시" 넣으라고 한 상호작용 쪽 — 산정 기준
 * 펼침(높이+투명도)과 그 버튼의 hover — 그리고 인프라 루프 영상뿐이에요.
 *
 * 에셋: /video/infra_gpu.webm + .mp4 (루프), poster /img/infra_gpu-poster.webp.
 *   prefers-reduced-motion 에서는 같은 poster 를 <img> 로 대신 깔아, 정지 화면이
 *   영상의 첫 프레임과 정확히 같은 구도가 되게 했어요.
 */
import { useId, useState } from 'react'
import { NUMBERS } from '../data/content'
import { revealDelay } from '../hooks/useReveal'
import { useReducedMotion } from '../hooks/useMedia'
import { asset } from '../lib/asset'

const [LEAD, ...REST] = NUMBERS.items

const INFRA_ALT = '촘촘히 쌓인 연산 모듈을 형상화한 도형. 일부가 밝게 빛나요.'

export default function ScaleScene() {
  const reduced = useReducedMotion()
  const [openCaveat, setOpenCaveat] = useState(false)
  const caveatId = useId()

  return (
    <section id="numbers" className="band bg-canvas">
      <div className="edge">
        <p data-reveal className="text-[15px] font-semibold text-brand">
          {NUMBERS.eyebrow}
        </p>
        <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 text-ink">
          {NUMBERS.title}
        </h2>
        <p data-reveal style={revealDelay(2)} className="lead mt-6 max-w-[36rem]">
          대학이 밝힌 자료에서 규모를 가늠할 수 있는 숫자만 넷 골랐어요.
          정원, 전공 수, 장비, 그리고 사람이에요.
        </p>

        {/* 머리 숫자 — 424명. 이 화면에서 제일 큰 글자. */}
        <div
          data-reveal
          style={revealDelay(3)}
          className="mt-12 rounded-[var(--radius-xl)] bg-brand-strong px-6 py-10 md:mt-16 md:px-12 md:py-14"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <p className="flex items-baseline gap-2 text-white md:gap-3">
              <span className="text-[clamp(4.5rem,13vw,9rem)] font-bold leading-[0.82] tracking-[-0.045em] tabular-nums">
                {LEAD.value}
              </span>
              <span className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-none text-blue-100">
                {LEAD.unit}
              </span>
            </p>
            <div className="md:max-w-[19rem] md:border-l md:border-white/25 md:pl-12 md:text-right">
              <p className="text-[22px] font-bold leading-[1.3] text-white md:text-[26px]">
                {LEAD.label}
              </p>
              <p className="mt-2 text-[15px] leading-[1.55] text-blue-50 md:text-[16px]">
                {LEAD.note}
              </p>
            </div>
          </div>
        </div>

        {/* 나머지 셋 — 카드 세 장이 아니라 헤어라인으로 나뉜 한 판. */}
        <ul
          data-reveal
          style={revealDelay(4)}
          className="card mt-3 grid divide-y divide-line rounded-[var(--radius-xl)] md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {REST.map((n) => (
            <li key={n.label} className="px-6 py-8 md:px-8 md:py-10">
              <p className="flex items-baseline gap-1.5 text-ink">
                <span className="text-[clamp(2.75rem,5.6vw,3.75rem)] font-bold leading-[0.9] tracking-[-0.035em] tabular-nums">
                  {n.value}
                </span>
                <span className="text-[20px] font-bold leading-none text-brand md:text-[22px]">
                  {n.unit}
                </span>
              </p>
              <p className="mt-5 text-[17px] font-bold text-ink">{n.label}</p>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-subtle">{n.note}</p>
            </li>
          ))}
        </ul>

        {/* 인프라 오브젝트. 숫자보다 크지 않게 폭을 묶어 뒀어요. */}
        <div
          data-reveal
          style={revealDelay(5)}
          className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]"
        >
          <figure className="flex items-center justify-center rounded-[var(--radius-xl)] bg-gray-50 p-4 md:p-6">
            {reduced ? (
              <img
                src={asset('img/infra_gpu-poster.webp')}
                alt={INFRA_ALT}
                width={1200}
                height={670}
                loading="lazy"
                decoding="async"
                className="h-auto w-full max-w-[540px] rounded-[var(--radius-lg)]"
              />
            ) : (
              <video
                className="h-auto w-full max-w-[540px] rounded-[var(--radius-lg)]"
                width={1200}
                height={670}
                poster={asset('img/infra_gpu-poster.webp')}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={INFRA_ALT}
              >
                <source src={asset('video/infra_gpu.webm')} type="video/webm" />
                <source src={asset('video/infra_gpu.mp4')} type="video/mp4" />
              </video>
            )}
          </figure>

          <div className="card flex flex-col justify-center rounded-[var(--radius-xl)] px-6 py-8 md:px-8 md:py-10">
            <p className="text-[13px] font-semibold tracking-[0.02em] text-brand">인프라</p>
            <p className="mt-3 text-[19px] font-bold leading-[1.45] text-ink md:text-[21px]">
              {REST[1].label} {REST[1].value}
              {REST[1].unit}은 한 급의 장비가 아니에요.
            </p>
            <p className="mt-3 text-[15px] leading-[1.65] text-ink-muted md:text-[16px]">
              한 종류를 {REST[1].value}
              {REST[1].unit} 세운 게 아니라, 성격이 다른 장비를 합한 수예요.
            </p>
          </div>
        </div>

        {/* 가르치는 사람들 — 규모의 마지막 항목. 머리 숫자보다 조용하게. */}
        <div className="mt-16 border-t border-line pt-12 md:mt-24 md:pt-16">
          <h3 data-reveal className="h3 text-ink">
            {NUMBERS.faculty.title}
          </h3>
          <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,33rem)_minmax(0,1fr)] md:items-start md:gap-16">
            <p data-reveal style={revealDelay(1)} className="text-[17px] leading-[1.7] text-ink-muted md:text-[18px]">
              {NUMBERS.faculty.body}
            </p>
            <ul className="flex flex-wrap gap-x-12 gap-y-7 md:justify-end">
              {NUMBERS.faculty.stats.map((s, i) => (
                <li key={s.label} data-reveal style={revealDelay(i + 2)}>
                  <p className="flex items-baseline gap-1 text-ink">
                    <span className="text-[34px] font-bold leading-none tracking-[-0.03em] tabular-nums md:text-[40px]">
                      {s.value}
                    </span>
                    <span className="text-[17px] font-bold leading-none text-brand md:text-[18px]">
                      {s.unit}
                    </span>
                  </p>
                  <p className="mt-2.5 text-[14px] leading-[1.5] text-ink-subtle">{s.label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/*
           * 산정 기준은 접어 뒀어요. 여기가 이 씬의 유일한 상호작용이라, SCENES.md §4 가
           * 요구하는 전환을 붙일 자리이기도 해요. 높이는 grid-template-rows 0fr→1fr 로
           * 보간해요 — max-height 를 추정하지 않아도 되고, 접힘 방향에도 전환이 남아요.
           */}
          <div className="mt-10">
            <button
              type="button"
              aria-expanded={openCaveat}
              aria-controls={caveatId}
              onClick={() => setOpenCaveat((v) => !v)}
              className="-mx-2 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-[14px] font-semibold text-ink-subtle transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)] hover:text-ink hover:underline hover:underline-offset-[5px] motion-reduce:transition-none"
            >
              {openCaveat ? '산정 기준 접기' : '산정 기준 보기'}
              <span
                aria-hidden="true"
                className={`inline-block leading-none transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)] motion-reduce:transition-none ${
                  openCaveat ? '-rotate-90' : 'rotate-90'
                }`}
              >
                ›
              </span>
            </button>

            <div
              id={caveatId}
              className={`grid transition-[grid-template-rows,opacity] duration-[var(--dur-base)] ease-[var(--ease-enter)] motion-reduce:transition-none ${
                openCaveat ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden" aria-hidden={!openCaveat}>
                <p className="mt-3 max-w-[46rem] rounded-[var(--radius-lg)] bg-canvas-subtle p-5 text-[14px] leading-[1.7] text-ink-subtle md:p-6">
                  {NUMBERS.faculty.caveat}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
