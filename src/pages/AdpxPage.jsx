import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import { ADPX, CHAIN } from '../data/content'
import { SCHOOLS, D_AXIS_SEATS } from '../data/schools'
import { revealDelay } from '../hooks/useReveal'

const AXES = ADPX.axes

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
  const [active, setActive] = useState(0)
  const tabsRef = useRef([])
  const axis = AXES[active]

  const onKeyDown = (e) => {
    const move = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    let next = null
    if (move) next = (active + move + AXES.length) % AXES.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = AXES.length - 1
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabsRef.current[next]?.focus()
  }

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

      {/* 네 사람 */}
      <section className="band bg-canvas">
        <div className="edge">
          <h2 data-reveal className="h2 whitespace-pre-line text-ink">
            {ADPX.title}
          </h2>

          <ul className="mt-10 flex flex-col gap-px overflow-hidden rounded-[--radius-lg] bg-gray-200 md:mt-12">
            {AXES.map((a, i) => (
              <li
                key={a.key}
                data-reveal
                style={revealDelay(i, 60)}
                className="flex items-baseline gap-4 bg-canvas px-5 py-5 md:gap-7 md:px-8 md:py-6"
              >
                <span className="w-6 shrink-0 text-[22px] font-bold leading-none text-brand md:w-8 md:text-[26px]">
                  {a.key}
                </span>
                <span className="text-[17px] font-medium leading-[1.5] text-ink md:text-[20px]">
                  {a.person}
                </span>
              </li>
            ))}
          </ul>

          <p data-reveal className="lead mt-8 max-w-[36rem]">
            {ADPX.body}
          </p>
        </div>
      </section>

      {/* 축별 상세 */}
      <section className="band-tight bg-canvas">
        <div className="edge">
          <h2 data-reveal className="h3 text-ink">
            축마다 어떤 학부가 맡나요
          </h2>

          <div
            role="tablist"
            aria-label="ADP+X 축"
            onKeyDown={onKeyDown}
            className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            {AXES.map((a, i) => {
              const on = i === active
              return (
                <button
                  key={a.key}
                  ref={(el) => (tabsRef.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`axis-tab-${a.key}`}
                  aria-selected={on}
                  aria-controls="axis-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`rounded-[--radius-lg] p-5 text-left transition-colors duration-[--dur-base] md:p-6 ${
                    on
                      ? 'bg-brand-strong text-white shadow-[0_6px_20px_rgb(27_100_218/0.3)]'
                      : 'bg-gray-100 text-ink hover:bg-gray-200'
                  }`}
                >
                  <span
                    className={`block text-[13px] font-semibold uppercase tracking-wide ${
                      on ? 'text-white/80' : 'text-ink-faint'
                    }`}
                  >
                    {a.key} · {a.name}
                  </span>
                  <span className="mt-2 block text-[16px] font-bold leading-[1.35]">{a.school}</span>
                  <span
                    className={`mt-3 block text-[15px] font-semibold ${
                      on ? 'text-white/85' : 'text-ink-subtle'
                    }`}
                  >
                    {a.seats}명
                  </span>
                </button>
              )
            })}
          </div>

          <div
            id="axis-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`axis-tab-${axis.key}`}
            className="card mt-3 p-6 md:p-8"
          >
            <div className="grid items-center gap-6 md:grid-cols-[1fr_200px] md:gap-10">
              <div>
                <h3 className="text-[22px] font-bold text-ink md:text-[26px]">{axis.school}</h3>
                <p className="mt-4 max-w-[38rem] text-[17px] leading-[1.65] text-ink-muted">
                  {axis.role}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {axis.majors.map((m) => (
                    <li
                      key={m}
                      className="rounded-[--radius-sm] bg-gray-100 px-3 py-1.5 text-[14px] font-medium text-ink-muted"
                    >
                      {m}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  {SCHOOLS.filter((s) => s.axis === axis.key).map((s) => (
                    <Link
                      key={s.slug}
                      to={`/ai-college/schools/${s.slug}`}
                      className="rounded-[--radius-md] bg-blue-50 px-4 py-2.5 text-[15px] font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      {s.name} 소개 →
                    </Link>
                  ))}
                </div>
              </div>

              <img
                key={axis.image}
                src={`/img/${axis.image}@2x.webp`}
                alt=""
                width={200}
                height={200}
                loading="lazy"
                decoding="async"
                className="mx-auto w-[160px] animate-[axis-in_.4s_var(--ease-enter)] md:w-full"
              />
            </div>

            <style>{`
              @keyframes axis-in { from { opacity: 0; transform: scale(.94) } to { opacity: 1; transform: none } }
              @media (prefers-reduced-motion: reduce) { .animate-\\[axis-in_\\.4s_var\\(--ease-enter\\)\\] { animation: none } }
            `}</style>
          </div>

          <p data-reveal className="mt-6 text-[15px] text-ink-subtle">
            {AXES.map((a) => a.seats).join(' + ')} ={' '}
            <strong className="font-bold text-ink">424명</strong> · D축 {D_AXIS_SEATS}명은
            데이터사이언스학부와 통계학과를 합친 모집단위예요.
          </p>
        </div>
      </section>

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
