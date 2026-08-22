import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import AxisScene from '../scenes/AxisScene'
import { ADPX, CHAIN } from '../data/content'
import { revealDelay } from '../hooks/useReveal'

/**
 * ADP+X presented as four roles, not four ordered steps.
 *
 * The source defines the chain as "AI(A) is developed on top of data(D),
 * applied to process(P), spread as AX(X)" — so causally D precedes A while the
 * acronym reads A→D. An arrow diagram would show the picture contradicting the
 * sentence next to it, so the four are a list here and the chain appears
 * further down as one worked example.
 */
export default function AdpxPage() {
  return (
    <>
      <PageHead
        eyebrow="학사 구조"
        title={'ADP+X'}
        lead="AI가 세상에 닿기까지 필요한 네 가지 역할을, 그대로 학사조직으로 만들었어요."
        crumbs={[
          { to: '/', label: '홈' },
          { to: '/ai-college', label: 'AI대학' },
        ]}
      />

      <AxisScene />

      {/* 가치사슬 — 사례 추적 */}
      <section className="band bg-canvas-subtle">
        <div className="edge">
          <p data-reveal className="text-[15px] font-semibold text-brand">
            {CHAIN.eyebrow}
          </p>
          <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 whitespace-pre-line text-ink">
            {CHAIN.title}
          </h2>
          <p data-reveal style={revealDelay(2)} className="lead mt-6 max-w-[36rem]">
            {CHAIN.intro}
          </p>

          <ol className="mt-12 md:mt-14">
            {CHAIN.steps.map((s, i) => (
              <li
                key={s.key}
                data-reveal
                style={revealDelay(i)}
                className="relative flex items-start gap-5 pb-8 last:pb-0 md:gap-7"
              >
                {i < CHAIN.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[21px] top-12 w-[2px] rounded-full bg-gray-200 md:left-[25px]"
                  />
                )}
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-strong text-[17px] font-bold text-white md:h-[52px] md:w-[52px] md:text-[19px]">
                  {s.key}
                </span>
                <p className="pt-2 text-[17px] font-medium leading-[1.55] text-ink md:pt-3 md:text-[19px]">
                  {s.text}
                </p>
              </li>
            ))}
          </ol>

          <p
            data-reveal
            className="mt-10 max-w-[38rem] rounded-[--radius-md] bg-gray-100 px-5 py-4 text-[14px] leading-[1.7] text-ink-subtle"
          >
            {CHAIN.caveat}
          </p>

          <p data-reveal className="mt-12 text-[19px] font-bold leading-[1.5] text-ink md:text-[22px]">
            {ADPX.closing}
          </p>
        </div>
      </section>
    </>
  )
}
