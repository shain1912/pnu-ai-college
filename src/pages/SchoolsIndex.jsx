import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import { SCHOOLS, facultyOf } from '../data/schools'
import { revealDelay } from '../hooks/useReveal'

export default function SchoolsIndex() {
  return (
    <>
      <PageHead
        eyebrow="편제 대상"
        title={'학부 · 학과'}
        path="/ai-college/schools/"
        lead="2027년 3월 AI대학으로 모이는 학문단위예요. 각 학과의 기본 정보와 소속 교원을 정리했어요."
        crumbs={[
          { to: '/', label: '홈' },
          { to: '/ai-college', label: 'AI대학' },
        ]}
      />

      <section className="band bg-canvas">
        <div className="edge">
          <ul className="grid gap-3 md:grid-cols-2">
            {SCHOOLS.map((s, i) => {
              const n = facultyOf(s).length
              return (
                <li key={s.slug} data-reveal style={revealDelay(i, 60)}>
                  <Link
                    to={`/ai-college/schools/${s.slug}`}
                    className="card flex h-full flex-col p-6 transition-shadow hover:shadow-[0_2px_4px_rgb(25_31_40/0.06),0_8px_28px_rgb(25_31_40/0.09)] md:p-8"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-[--radius-sm] bg-blue-50 text-[15px] font-bold text-blue-700">
                        {s.axis}
                      </span>
                      <span className="text-[13px] font-semibold uppercase tracking-wide text-ink-faint">
                        {s.axisName}
                      </span>
                      {s.isNew && (
                        <span className="rounded-[--radius-sm] bg-blue-50 px-2 py-0.5 text-[12px] font-bold text-blue-700">
                          신설
                        </span>
                      )}
                    </div>

                    <h2 className="mt-5 text-[24px] font-bold leading-[1.3] text-ink">{s.name}</h2>
                    <p className="mt-3 text-[15px] leading-[1.65] text-ink-subtle">{s.role}</p>

                    <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-2 border-t border-line pt-5 text-[14px]">
                      <div className="flex gap-2">
                        <dt className="text-ink-faint">현재 소속</dt>
                        <dd className="font-medium text-ink-muted">{s.from.split(' ')[0]}</dd>
                      </div>
                      {s.seats && (
                        <div className="flex gap-2">
                          <dt className="text-ink-faint">모집단위</dt>
                          <dd className="font-medium text-ink-muted">{s.seats}명</dd>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <dt className="text-ink-faint">교원</dt>
                        <dd className="font-medium text-ink-muted">{n}명</dd>
                      </div>
                    </dl>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
