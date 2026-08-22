import { WHY } from '../data/content'

const COLUMNS = [
  {
    key: 'before',
    label: '지금',
    image: '/img/asis@2x.webp',
    alt: '여러 방향으로 흩어진 투명한 유리 파편',
  },
  {
    key: 'after',
    label: '앞으로',
    image: '/img/tobe@2x.webp',
    alt: '유리 조각이 하나로 맞물려 완성된 다면체',
  },
]

export default function BackgroundScene() {
  return (
    <section id="why" className="band bg-canvas">
      <div className="edge">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(520px,1.18fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-[15px] font-semibold text-brand">{WHY.eyebrow}</p>
            <h2 className="h2 mt-4 whitespace-pre-line text-ink">{WHY.title}</h2>
          </div>
          <p className="lead max-w-[42rem] lg:pb-1">{WHY.body}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[--radius-xl] border border-line bg-canvas-subtle md:mt-16">
          <div className="relative grid md:grid-cols-2">
            {COLUMNS.map((column) => (
              <figure
                key={column.key}
                className={`why-figure relative grid min-h-[260px] place-items-center px-7 pb-7 pt-16 md:min-h-[360px] md:px-12 md:pb-10 md:pt-20 ${
                  column.key === 'after' ? 'why-figure-after' : ''
                }`}
              >
                <figcaption
                  className={`absolute left-6 top-6 rounded-[--radius-pill] px-3 py-1.5 text-[13px] font-bold md:left-8 md:top-8 ${
                    column.key === 'after'
                      ? 'bg-brand-strong text-white'
                      : 'bg-gray-200 text-ink-muted'
                  }`}
                >
                  {column.label}
                </figcaption>
                <img
                  src={column.image}
                  alt={column.alt}
                  width={480}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="h-[190px] w-full object-contain md:h-[260px]"
                />
              </figure>
            ))}

            <span
              aria-hidden="true"
              className="why-bridge absolute left-1/2 top-1/2 z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-canvas text-[20px] font-semibold text-brand shadow-[0_4px_16px_rgb(25_31_40/0.08)]"
            >
              →
            </span>
          </div>

          <div className="border-t border-line bg-canvas">
            <div className="hidden grid-cols-[150px_1fr_1fr] border-b border-line px-7 py-4 md:grid md:gap-8 lg:px-9">
              <span aria-hidden="true" />
              {COLUMNS.map((column) => (
                <span
                  key={column.key}
                  className={`text-[13px] font-bold ${
                    column.key === 'after' ? 'text-brand' : 'text-ink-faint'
                  }`}
                >
                  {column.label}
                </span>
              ))}
            </div>

            <dl>
              {WHY.rows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-5 border-b border-line px-6 py-6 last:border-b-0 md:grid-cols-[150px_1fr_1fr] md:gap-8 md:px-7 md:py-7 lg:px-9"
                >
                  <dt className="text-[15px] font-bold text-ink">{row.label}</dt>
                  <dd className="grid grid-cols-[64px_1fr] gap-3 md:block">
                    <span className="text-[12px] font-bold text-ink-faint md:hidden">지금</span>
                    <p className="text-[15px] leading-[1.65] text-ink-subtle">{row.before}</p>
                  </dd>
                  <dd className="grid grid-cols-[64px_1fr] gap-3 md:block">
                    <span className="text-[12px] font-bold text-brand md:hidden">앞으로</span>
                    <p className="text-[15px] font-medium leading-[1.65] text-ink">{row.after}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <style>{`
        .why-figure-after {
          background: color-mix(in srgb, var(--color-brand) 5%, var(--color-canvas));
        }
        @media (min-width: 768px) {
          .why-figure + .why-figure { border-left: 1px solid var(--color-line); }
        }
        @media (max-width: 767px) {
          .why-figure + .why-figure { border-top: 1px solid var(--color-line); }
          .why-bridge { transform: translate(-50%, -50%) rotate(90deg); }
        }
      `}</style>
    </section>
  )
}
