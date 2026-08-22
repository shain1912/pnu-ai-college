import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import BackgroundScene from '../scenes/BackgroundScene'
import MediaBand from '../components/MediaBand'
import ScaleScene from '../scenes/ScaleScene'
import { APEX, PROGRAMS, PARTNERS } from '../data/content'
import { SCHOOLS } from '../data/schools'
import { revealDelay } from '../hooks/useReveal'

export default function AiCollege() {
  return (
    <>
      <PageHead
        eyebrow="2027년 3월 출범"
        title={'AI대학'}
        lead="세 개 단과대학에 흩어져 있던 AI 학문단위를 하나로 모읍니다. 입학정원 424명, 국내에서 가장 큰 AI 단과대학이에요."
        crumbs={[{ to: '/', label: '홈' }]}
      />

      {/* 글이 계속 이어지던 자리에 쉬는 화면 하나 */}
      <MediaBand slug="campus_night_v" alt="블루아워의 대학 공학관. 유리 파사드 안쪽에서 빛이 새어 나오고 앞마당은 비어 있다." />

      <BackgroundScene />

      {/* 학사 구조 요약 → 상세로 보내기 */}
      <section className="band bg-canvas-subtle">
        <div className="edge">
          <p data-reveal className="text-[15px] font-semibold text-brand">
            학사 구조
          </p>
          <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 text-ink">
            ADP+X, 네 개의 축
          </h2>
          <p data-reveal style={revealDelay(2)} className="lead mt-6 max-w-[38rem]">
            AI 가치사슬을 그대로 학사조직으로 옮겼어요. 각 축이 어떤 학부를 맡는지 아래에서
            확인할 수 있어요.
          </p>

          <ul className="mt-10 grid gap-3 md:mt-12 md:grid-cols-2">
            {SCHOOLS.map((s, i) => (
              <li key={s.slug} data-reveal style={revealDelay(i, 50)}>
                <Link
                  to={`/ai-college/schools/${s.slug}`}
                  className="card flex h-full items-start gap-5 p-6 transition-shadow hover:shadow-[0_2px_4px_rgb(25_31_40/0.06),0_8px_28px_rgb(25_31_40/0.09)] md:p-7"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[--radius-md] bg-blue-50 text-[18px] font-bold text-blue-700">
                    {s.axis}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="text-[19px] font-bold text-ink">{s.name}</span>
                      {s.isNew && (
                        <span className="rounded-[--radius-sm] bg-blue-50 px-2 py-0.5 text-[12px] font-bold text-blue-700">
                          신설
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block text-[15px] leading-[1.6] text-ink-subtle">
                      {s.role}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/ai-college/adpx"
              className="rounded-[--radius-md] bg-brand-strong px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              ADP+X 구조 자세히 보기
            </Link>
            <Link
              to="/ai-college/schools"
              className="rounded-[--radius-md] bg-gray-100 px-6 py-3.5 text-[16px] font-semibold text-ink-muted transition-colors hover:bg-gray-200"
            >
              학부·학과 전체 보기
            </Link>
          </div>
        </div>
      </section>

      <ScaleScene />

      {/* 운영 체계 */}
      <section id="apex" className="band bg-canvas-subtle">
        <div className="edge">
          <p data-reveal className="text-[15px] font-semibold text-brand">
            {APEX.eyebrow}
          </p>
          <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 text-ink">
            {APEX.title}
          </h2>
          <p data-reveal style={revealDelay(2)} className="lead mt-6 max-w-[36rem]">
            {APEX.body}
          </p>

          <ol className="mt-12 grid gap-3 md:mt-14 md:grid-cols-2">
            {APEX.pillars.map((p, i) => (
              <li
                key={p.name}
                data-reveal
                style={revealDelay(i)}
                className={`card flex items-start gap-5 p-6 md:p-7 ${
                  i === 0 ? 'md:col-span-2 md:items-center' : ''
                }`}
              >
                <span
                  className={`grid shrink-0 place-items-center rounded-[--radius-md] text-[13px] font-bold ${
                    i === 0 ? 'h-14 w-14 bg-brand-strong text-white' : 'h-12 w-12 bg-blue-50 text-blue-700'
                  }`}
                >
                  {p.role}
                </span>
                <div>
                  <h3 className={`font-bold text-ink ${i === 0 ? 'text-[22px]' : 'text-[18px]'}`}>
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-subtle">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <p data-reveal className="mt-7 text-center text-[14px] font-medium text-ink-faint">
            {APEX.full}
          </p>
        </div>
      </section>

      <MediaBand slug="studio_team_v" alt="어두운 스튜디오에서 학생 넷이 뒷모습으로 서서 대형 화면의 파란 네트워크 도표를 가리키고 있다." />

      {/* 특화 프로그램 + 기업 */}
      <section className="band bg-canvas">
        <div className="edge">
          <p data-reveal className="text-[15px] font-semibold text-brand">
            {PROGRAMS.eyebrow}
          </p>
          <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 text-ink">
            {PROGRAMS.title}
          </h2>

          <dl className="mt-12 md:mt-16">
            {PROGRAMS.items.map((p, i) => (
              <div
                key={p.name}
                data-reveal
                style={revealDelay(i)}
                className="grid gap-3 border-t border-line py-8 last:border-b md:grid-cols-[64px_320px_1fr] md:items-baseline md:gap-8 md:py-10"
              >
                <span className="text-[15px] font-bold text-brand">0{i + 1}</span>
                <dt className="text-[21px] font-bold leading-[1.35] text-ink md:text-[24px]">
                  {p.name}
                </dt>
                <dd className="max-w-[34rem] text-[16px] leading-[1.7] text-ink-subtle">{p.body}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="mt-16">
            <h3 className="text-[21px] font-bold text-ink md:text-[24px]">{PARTNERS.title}</h3>
            <p className="mt-2.5 text-[16px] text-ink-subtle">{PARTNERS.body}</p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {PARTNERS.names.map((n) => (
                <li
                  key={n}
                  className="rounded-[--radius-md] bg-gray-100 px-4 py-2.5 text-[15px] font-semibold text-ink-muted"
                >
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
