import { Link, Navigate, useParams } from 'react-router-dom'
import PageHead from '../components/PageHead'
import FacultyList from '../components/FacultyList'
import { SCHOOLS, bySlug, facultyOf, D_AXIS_SEATS } from '../data/schools'
import { DEPT_INFO } from '../data/departments'
import { revealDelay } from '../hooks/useReveal'

export default function SchoolDetail() {
  const { slug } = useParams()
  const school = bySlug(slug)
  if (!school) return <Navigate to="/ai-college/schools" replace />

  const people = facultyOf(school)
  const info = DEPT_INFO[school.slug]
  const idx = SCHOOLS.findIndex((s) => s.slug === school.slug)
  const prev = SCHOOLS[idx - 1]
  const next = SCHOOLS[idx + 1]

  return (
    <>
      <PageHead
        eyebrow={`${school.axis} · ${school.axisName}`}
        title={school.name}
        lead={school.role}
        crumbs={[
          { to: '/', label: '홈' },
          { to: '/ai-college', label: 'AI대학' },
          { to: '/ai-college/schools', label: '학부·학과' },
        ]}
      />

      {/* 기본 정보 */}
      <section className="band-tight bg-canvas">
        <div className="edge">
          <div className="grid gap-10 md:grid-cols-[1fr_200px] md:items-start md:gap-14">
            <div>
              <h2 data-reveal className="h3 text-ink">
                기본 정보
              </h2>

              <dl data-reveal style={revealDelay(1)} className="mt-6">
                <Row k="AI 가치사슬 축" v={`${school.axis} — ${school.axisName}`} />
                <Row k="현재 소속" v={school.from} />
                <Row
                  k="모집단위"
                  v={
                    school.seats
                      ? `${school.seats}명`
                      : `D축 ${D_AXIS_SEATS}명에 포함 (데이터사이언스학부·통계학과 합산)`
                  }
                />
                <Row k="전공 구성" v={school.majors.join(' · ')} />
                <Row k="2027년 개편" v={school.change} />
                {info?.established && <Row k="연혁" v={info.established} />}
              </dl>
            </div>

            <figure className="mx-auto w-[170px] rounded-[--radius-xl] bg-gray-50 p-4 md:p-6 md:w-full">
              <img
                src={`/img/${school.image}@2x.webp`}
                alt=""
                width={200}
                height={200}
                loading="lazy"
                decoding="async"
                className="w-full"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* 학과 소개 — 공식 홈페이지에서 확인한 내용만 */}
      {info?.intro && (
        <section className="band-tight bg-canvas-subtle">
          <div className="edge">
            <h2 data-reveal className="h3 text-ink">
              무엇을 배우고 연구하나요
            </h2>
            <p data-reveal style={revealDelay(1)} className="lead mt-5 max-w-[40rem]">
              {info.intro}
            </p>

            {info.fields?.length > 0 && (
              <div data-reveal style={revealDelay(2)} className="mt-9">
                <h3 className="text-[15px] font-bold text-ink-subtle">주요 분야</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {info.fields.map((f) => (
                    <li
                      key={f}
                      className="rounded-[--radius-sm] bg-canvas px-3.5 py-2 text-[15px] font-medium text-ink-muted"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {info.careers?.length > 0 && (
              <div data-reveal style={revealDelay(3)} className="mt-9">
                <h3 className="text-[15px] font-bold text-ink-subtle">졸업 후 진로</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {info.careers.map((c) => (
                    <li
                      key={c}
                      className="rounded-[--radius-sm] bg-canvas px-3.5 py-2 text-[15px] font-medium text-ink-muted"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {info.note && (
              <p
                data-reveal
                className="mt-9 max-w-[40rem] rounded-[--radius-md] bg-canvas px-5 py-4 text-[14px] leading-[1.7] text-ink-subtle"
              >
                {info.note}
              </p>
            )}

            {info.sources?.length > 0 && (
              <p data-reveal className="mt-9 text-[13px] leading-[1.7] text-ink-faint">
                출처:{' '}
                {info.sources.map((u, i) => (
                  <span key={u}>
                    {i > 0 && ' · '}
                    <a
                      href={u}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-brand"
                    >
                      {new URL(u).hostname}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 교원 */}
      <section className="band bg-canvas">
        <div className="edge">
          <h2 data-reveal className="h3 text-ink">
            소속 교원
          </h2>
          <div data-reveal style={revealDelay(1)} className="mt-6">
            <FacultyList people={people} unitName={school.name} />
          </div>
        </div>
      </section>

      {/* 앞뒤 학과 */}
      <section className="border-t border-line bg-canvas-subtle py-10">
        <div className="edge flex flex-wrap items-center justify-between gap-4">
          {prev ? (
            <Link
              to={`/ai-college/schools/${prev.slug}`}
              className="text-[15px] font-semibold text-ink-muted transition-colors hover:text-brand"
            >
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/ai-college/schools/${next.slug}`}
              className="text-[15px] font-semibold text-ink-muted transition-colors hover:text-brand"
            >
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </>
  )
}

function Row({ k, v }) {
  return (
    <div className="grid gap-1 border-t border-line py-4 md:grid-cols-[160px_1fr] md:gap-6 md:py-5">
      <dt className="text-[14px] font-bold text-ink-subtle">{k}</dt>
      <dd className="text-[16px] leading-[1.6] text-ink">{v}</dd>
    </div>
  )
}
