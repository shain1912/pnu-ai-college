import PageHead from '../components/PageHead'
import { ROADMAP, ADMISSION } from '../data/content'
import { revealDelay } from '../hooks/useReveal'
import LoopMedia from '../components/LoopMedia'

export default function RoadmapPage() {
  return (
    <>
      <PageHead
        eyebrow={ROADMAP.eyebrow}
        title={'추진 일정'}
        lead="설계에서 출범, 그리고 성과 기반 재편까지 4년의 계획이에요."
        crumbs={[
          { to: '/', label: '홈' },
          { to: '/ai-college', label: 'AI대학' },
        ]}
      />

      <section className="band bg-canvas">
        <div className="edge">
          <figure data-reveal className="mb-14 max-w-[560px] rounded-[--radius-xl] bg-gray-50 p-4 md:p-6">
            <LoopMedia slug="roadmap_path" alt="점점 커지는 다섯 개의 표식이 하나의 오르막 띠를 따라 놓인 도형" className="w-full" />
          </figure>

          <ol>
            {ROADMAP.steps.map((s, i) => (
              <li
                key={s.year}
                data-reveal
                style={revealDelay(i)}
                className="relative grid gap-4 pb-10 pl-8 last:pb-0 md:grid-cols-[120px_1fr] md:gap-10 md:pl-10"
              >
                {i < ROADMAP.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[5px] top-4 w-[2px] rounded-full bg-line"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[7px] h-3 w-3 rounded-full ring-4 ring-canvas ${
                    s.highlight ? 'bg-brand' : 'bg-gray-300'
                  }`}
                />

                <span
                  className={`text-[20px] font-bold leading-none ${
                    s.highlight ? 'text-brand' : 'text-ink-faint'
                  }`}
                >
                  {s.year}
                </span>

                <div>
                  <h2 className="text-[19px] font-bold text-ink">{s.title}</h2>
                  <p className="mt-2.5 max-w-[40rem] text-[15px] leading-[1.7] text-ink-subtle">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band-tight bg-canvas-subtle">
        <div className="edge">
          <div data-reveal className="card p-6 md:p-9">
            <p className="text-[15px] font-semibold text-brand">{ADMISSION.eyebrow}</p>
            <h2 className="h3 mt-3 whitespace-pre-line text-ink">{ADMISSION.title}</h2>

            <div className="mt-7 inline-flex flex-col gap-1 rounded-[--radius-lg] bg-blue-50 px-6 py-4 md:flex-row md:items-baseline md:gap-4">
              <span className="text-[14px] font-semibold text-blue-700">
                {ADMISSION.period.label}
              </span>
              <span className="text-[19px] font-bold tracking-[-0.02em] text-blue-700">
                {ADMISSION.period.value}
              </span>
            </div>

            <p className="mt-7 max-w-[38rem] text-[16px] leading-[1.7] text-ink-subtle">
              {ADMISSION.body}
            </p>

            <a
              href={ADMISSION.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-[--radius-md] bg-brand-strong px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {ADMISSION.primary.label} ↗
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
