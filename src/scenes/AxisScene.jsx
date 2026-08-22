import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ADPX } from '../data/content'
import { D_AXIS_SEATS, SCHOOLS } from '../data/schools'
import { useReducedMotion } from '../hooks/useMedia'

const AXES = ADPX.axes

/*
 * Keep the stage API ready for loops without changing the layout or content.
 * Add `video: `/video/axis_${axis.key.toLowerCase()}.webm`` when each loop ships.
 */
// Each axis object ships as a five-second loop; the still is its poster, so a
// slow connection or reduced-motion still gets the same frame.
const AXIS_MEDIA = Object.fromEntries(
  AXES.map((axis) => [
    axis.key,
    {
      poster: `/img/${axis.image}@2x.webp`,
      video: `/video/${axis.image}.webm`,
      videoMp4: `/video/${axis.image}.mp4`,
    },
  ]),
)

function AxisObject({ axis, active, reducedMotion }) {
  const media = AXIS_MEDIA[axis.key]

  if (media.video && !reducedMotion) {
    return (
      <video
        aria-hidden="true"
        autoPlay={active}
        loop
        muted
        playsInline
        poster={media.poster}
        className="h-full w-full object-contain"
      >
        <source src={media.video} type="video/webm" />
        <source src={media.videoMp4} type="video/mp4" />
      </video>
    )
  }

  return (
    <img
      src={media.poster}
      alt=""
      width={320}
      height={320}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-contain"
    />
  )
}

export default function AxisScene() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef([])
  const reducedMotion = useReducedMotion()

  const selectAxis = (index, focus = false) => {
    setActive(index)
    if (focus) tabsRef.current[index]?.focus()
  }

  const onKeyDown = (event) => {
    const move = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    }[event.key]
    let next = null

    if (move) next = (active + move + AXES.length) % AXES.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = AXES.length - 1
    if (next === null) return

    event.preventDefault()
    selectAxis(next, true)
  }

  return (
    <section id="axes" className="band bg-canvas">
      <div className="edge">
        <p className="text-[15px] font-semibold text-brand">{ADPX.eyebrow}</p>
        <h2 className="h2 mt-4 whitespace-pre-line text-ink">{ADPX.title}</h2>
        <p className="lead mt-6 max-w-[40rem]">{ADPX.body}</p>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-[--radius-lg] bg-gray-200 md:grid-cols-2">
          {AXES.map((axis) => (
            <li key={axis.key} className="flex gap-4 bg-canvas px-5 py-5 md:px-7 md:py-6">
              <span className="w-7 shrink-0 text-[24px] font-bold leading-none text-brand">
                {axis.key}
              </span>
              <span className="text-[17px] font-medium leading-[1.5] text-ink">
                {axis.person}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-16 md:mt-20">
          <h3 className="h3 text-ink">축마다 어떤 학부가 맡나요</h3>

          <div
            role="tablist"
            aria-label="ADP+X 축"
            onKeyDown={onKeyDown}
            className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"
          >
            {AXES.map((axis, index) => {
              const selected = index === active
              return (
                <button
                  key={axis.key}
                  ref={(element) => (tabsRef.current[index] = element)}
                  type="button"
                  role="tab"
                  id={`axis-tab-${axis.key}`}
                  aria-selected={selected}
                  aria-controls={`axis-panel-${axis.key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectAxis(index)}
                  className={`axis-tab rounded-[--radius-lg] border p-4 text-left md:p-5 ${
                    selected
                      ? 'border-transparent bg-brand-strong text-white shadow-[0_8px_24px_rgb(27_100_218/0.22)]'
                      : 'border-line bg-canvas text-ink hover:bg-gray-100'
                  }`}
                >
                  <span className={`block text-[13px] font-semibold tracking-wide ${selected ? 'text-white/80' : 'text-ink-faint'}`}>
                    {axis.key} · {axis.name}
                  </span>
                  <span className="mt-2 block text-[16px] font-bold leading-[1.35]">{axis.school}</span>
                  <span className={`mt-3 block text-[14px] font-semibold ${selected ? 'text-white/85' : 'text-ink-subtle'}`}>
                    {axis.seats}명
                  </span>
                </button>
              )
            })}
          </div>

          <div className="axis-stage card mt-3 overflow-hidden p-0">
            {AXES.map((axis, index) => {
              const selected = index === active
              const schools = SCHOOLS.filter((school) => school.axis === axis.key)

              return (
                <div
                  key={axis.key}
                  id={`axis-panel-${axis.key}`}
                  role="tabpanel"
                  aria-labelledby={`axis-tab-${axis.key}`}
                  aria-hidden={!selected}
                  tabIndex={selected ? 0 : -1}
                  className={`axis-panel grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_280px] md:items-center md:p-10 ${selected ? 'is-active' : ''}`}
                >
                  <div className="axis-copy">
                    <p className="text-[14px] font-bold tracking-[0.12em] text-brand">
                      {axis.key} · {axis.name}
                    </p>
                    <h4 className="mt-3 text-[24px] font-bold text-ink md:text-[30px]">{axis.school}</h4>
                    <p className="mt-4 max-w-[38rem] text-[17px] leading-[1.7] text-ink-muted">
                      {axis.role}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {axis.majors.map((major) => (
                        <li key={major} className="rounded-[--radius-sm] bg-gray-100 px-3 py-1.5 text-[14px] font-medium text-ink-muted">
                          {major}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap gap-2.5">
                      {schools.map((school) => (
                        <Link
                          key={school.slug}
                          to={`/ai-college/schools/${school.slug}`}
                          tabIndex={selected ? 0 : -1}
                          className="rounded-[--radius-md] bg-blue-50 px-4 py-2.5 text-[15px] font-semibold text-blue-700 transition-colors duration-[--dur-base] hover:bg-blue-100"
                        >
                          {school.name} 소개 →
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="axis-object mx-auto aspect-square w-full max-w-[220px] md:max-w-[280px]">
                    <AxisObject axis={axis} active={selected} reducedMotion={reducedMotion} />
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-6 text-[15px] leading-[1.65] text-ink-subtle">
            {AXES.map((axis) => axis.seats).join(' + ')} ={' '}
            <strong className="font-bold text-ink">424명</strong> · D축 {D_AXIS_SEATS}명은
            데이터사이언스학부와 통계학과를 합친 모집단위예요.
          </p>
        </div>
      </div>

      <style>{`
        .axis-tab {
          transition:
            color var(--dur-base) var(--ease-standard),
            background-color var(--dur-base) var(--ease-standard),
            border-color var(--dur-base) var(--ease-standard),
            box-shadow var(--dur-base) var(--ease-standard),
            transform var(--dur-base) var(--ease-standard);
        }
        .axis-tab:hover { transform: translateY(-2px); }
        .axis-stage { display: grid; }
        .axis-panel {
          grid-area: 1 / 1;
          align-self: stretch;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity var(--dur-enter) var(--ease-enter),
            visibility 0s linear var(--dur-enter);
        }
        .axis-panel.is-active {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition-delay: 0s;
        }
        .axis-copy,
        .axis-object {
          opacity: 0;
          filter: blur(8px);
          transform: translateY(10px);
          transition:
            opacity var(--dur-enter) var(--ease-enter),
            filter var(--dur-enter) var(--ease-enter),
            transform var(--dur-enter) var(--ease-enter);
        }
        .axis-object { transform: translateY(10px) scale(.96); }
        .axis-panel.is-active .axis-copy,
        .axis-panel.is-active .axis-object {
          opacity: 1;
          filter: blur(0);
          transform: none;
        }
        .axis-panel.is-active .axis-object { transition-delay: 50ms; }
        @media (prefers-reduced-motion: reduce) {
          .axis-tab,
          .axis-panel,
          .axis-copy,
          .axis-object { transition: none !important; }
          .axis-tab:hover { transform: none; }
        }
      `}</style>
    </section>
  )
}
