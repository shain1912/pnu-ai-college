import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import { WHY, NUMBERS, APEX, PROGRAMS, PARTNERS } from '../data/content'
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

      {/* 설립 배경 */}
      <section className="band bg-canvas">
        <div className="edge">
          <p data-reveal className="text-[15px] font-semibold text-brand">
            {WHY.eyebrow}
          </p>
          <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 whitespace-pre-line text-ink">
            {WHY.title}
          </h2>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_340px] md:gap-14">
            <p data-reveal style={revealDelay(2)} className="lead max-w-[38rem]">
              {WHY.body}
            </p>
            <figure data-reveal style={revealDelay(3)} className="rounded-[--radius-xl] bg-gray-50 p-4 md:p-6">
              <img
                src="/img/why_converge@2x.webp"
                alt="흩어져 있던 세 갈래가 하나로 합쳐지는 형태의 도형"
                width={340}
                height={215}
                loading="lazy"
                decoding="async"
                className="w-full"
              />
            </figure>
          </div>

          <ul className="mt-12 flex flex-col gap-3 md:mt-16">
            {WHY.rows.map((row, i) => (
              <li
                key={row.label}
                data-reveal
                style={revealDelay(i)}
                className="card grid gap-5 p-6 md:grid-cols-[132px_1fr_1fr] md:items-start md:gap-8 md:p-7"
              >
                <span className="text-[15px] font-bold text-ink">{row.label}</span>
                <div className="flex gap-3">
                  <span className="mt-[3px] shrink-0 rounded-[--radius-sm] bg-gray-100 px-2 py-0.5 text-[12px] font-semibold text-ink-faint">
                    지금
                  </span>
                  <p className="text-[15px] leading-[1.6] text-ink-subtle">{row.before}</p>
                </div>
                <div className="flex gap-3">
                  <span className="mt-[3px] shrink-0 rounded-[--radius-sm] bg-blue-50 px-2 py-0.5 text-[12px] font-semibold text-blue-700">
                    앞으로
                  </span>
                  <p className="text-[15px] font-medium leading-[1.6] text-ink">{row.after}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

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

      {/* 규모와 인프라 */}
      <section id="numbers" className="band bg-canvas">
        <div className="edge">
          <p data-reveal className="text-[15px] font-semibold text-brand">
            {NUMBERS.eyebrow}
          </p>
          <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 text-ink">
            {NUMBERS.title}
          </h2>

          <figure data-reveal style={revealDelay(2)} className="mt-10 max-w-[520px] rounded-[--radius-xl] bg-gray-50 p-4 md:p-6">
            <img
              src="/img/infra_gpu@2x.webp"
              alt="촘촘히 쌓인 연산 모듈을 형상화한 도형. 일부가 밝게 빛나요."
              width={520}
              height={330}
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          </figure>

          <dl className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4">
            {NUMBERS.items.map((n, i) => (
              <div key={n.label} data-reveal style={revealDelay(i)} className="card p-6 md:p-7">
                <dd className="flex items-baseline gap-1">
                  <span className="text-[40px] font-bold leading-none tracking-[-0.03em] text-ink md:text-[48px]">
                    {n.value}
                  </span>
                  <span className="text-[20px] font-bold text-brand">{n.unit}</span>
                </dd>
                <dt className="mt-4 text-[16px] font-bold text-ink">{n.label}</dt>
                <p className="mt-1.5 text-[14px] leading-[1.5] text-ink-subtle">{n.note}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

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
