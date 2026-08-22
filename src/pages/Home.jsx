import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HERO, SUMMARY } from '../data/content'
import { useReducedMotion } from '../hooks/useMedia'
import { revealDelay } from '../hooks/useReveal'

/**
 * The three doors the sponsor asked for, in the order they asked for:
 * AI대학 first, then A.U.R.A, then Google for Education. The latter two live
 * on the existing arise-ai site and are linked, not rebuilt.
 */
const DOORS = [
  {
    n: '01',
    to: '/ai-college',
    kicker: '2027년 3월 출범',
    title: 'AI대학',
    body: 'ADP+X 구조와 편제 대상 학부·학과, 소속 교원을 정리했어요.',
    primary: true,
  },
  {
    n: '02',
    href: 'https://arise-ai.pusan.ac.kr/bymonolog',
    kicker: 'AI 거점대학육성사업단',
    title: 'A.U.R.A 마스터플랜 및 데이터룸',
    body: '부산대학교 AI 대전환 추진 전략과 성과 분석 데이터룸이에요.',
  },
  {
    n: '03',
    href: 'https://arise-ai.pusan.ac.kr/',
    kicker: '교육 협력',
    title: 'PNU × Google for Education',
    body: 'Google과 함께하는 AI 교육·연구 협력 파트너십이에요.',
  },
]

export default function Home() {
  const reduced = useReducedMotion()

  useEffect(() => {
    document.title = '부산대학교 AI대학 — 2027년 3월 출범'
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-canvas pt-16 md:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[1100px]
            -translate-x-1/2 rounded-full bg-blue-50 opacity-60 blur-[120px]"
        />

        <div className="edge text-center">
          <span
            data-reveal
            className="inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue-50 px-3.5 py-1.5
              text-[14px] font-semibold text-blue-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {HERO.badge}
          </span>

          <h1 className="mt-7 text-ink">
            {HERO.headline.map((line, i) => (
              <span
                key={line}
                data-reveal
                style={{ '--reveal-delay': `${80 + i * 80}ms` }}
                className="display block"
              >
                {line}
              </span>
            ))}
          </h1>

          <p data-reveal style={revealDelay(4)} className="lead mx-auto mt-7 max-w-[36rem]">
            {HERO.sub}
          </p>

          <div data-reveal style={revealDelay(5)} className="mt-10">
            <Link
              to="/ai-college"
              className="inline-block rounded-[--radius-md] bg-brand-strong px-8 py-4 text-[17px]
                font-semibold text-white transition-colors duration-[--dur-fast] hover:bg-blue-700"
            >
              AI대학 살펴보기
            </Link>
          </div>
        </div>

        <div data-reveal style={revealDelay(6)} className="edge-wide mt-16 md:mt-20">
          <figure className="overflow-hidden rounded-[20px] md:rounded-[28px]">
            {reduced ? (
              <img
                src="/img/hero_light@2x.webp"
                alt="밝은 대학 아트리움 전경. 천장에 푸른 유리 조형물이 매달려 있어요."
                className="aspect-[16/9] w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <video
                className="aspect-[16/9] w-full object-cover"
                poster="/img/hero_light@2x.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="밝은 대학 아트리움 전경. 천장의 푸른 유리 조형물이 천천히 움직여요."
              >
                <source src="/video/atrium-loop.webm" type="video/webm" />
                <source src="/video/atrium-loop.mp4" type="video/mp4" />
              </video>
            )}
            <figcaption className="mt-3 text-center text-[12px] text-ink-faint">
              생성형 AI로 제작한 이미지예요. 실제 시설을 촬영한 것이 아니에요.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* the three doors */}
      <section className="band-tight bg-canvas">
        <div className="edge">
          <ul className="grid gap-3 md:grid-cols-3">
            {DOORS.map((d, i) => {
              const inner = (
                <>
                  <span
                    className={`text-[13px] font-bold ${d.primary ? 'text-blue-100' : 'text-ink-faint'}`}
                  >
                    {d.n}
                  </span>
                  <span
                    className={`mt-4 block text-[13px] font-semibold ${
                      d.primary ? 'text-blue-100' : 'text-brand'
                    }`}
                  >
                    {d.kicker}
                  </span>
                  <span
                    className={`mt-1.5 block text-[21px] font-bold leading-[1.35] ${
                      d.primary ? 'text-white' : 'text-ink'
                    }`}
                  >
                    {d.title}
                  </span>
                  <span
                    className={`mt-3 block text-[15px] leading-[1.6] ${
                      d.primary ? 'text-blue-50' : 'text-ink-subtle'
                    }`}
                  >
                    {d.body}
                  </span>
                </>
              )

              const cls = `flex h-full flex-col rounded-[--radius-xl] p-6 transition-colors
                duration-[--dur-base] md:p-7 ${
                  d.primary
                    ? 'bg-brand-strong hover:bg-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`

              return (
                <li key={d.n} data-reveal style={revealDelay(i)}>
                  {d.to ? (
                    <Link to={d.to} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* fact sheet */}
      <section id="summary" className="band bg-canvas-subtle">
        <div className="edge">
          <p data-reveal className="text-[15px] font-semibold text-brand">
            {SUMMARY.eyebrow}
          </p>
          <h2 data-reveal style={revealDelay(1)} className="h2 mt-4 text-ink">
            {SUMMARY.title}
          </h2>

          <dl className="mt-10 md:mt-12">
            {SUMMARY.rows.map((r, i) => (
              <div
                key={r.k}
                data-reveal
                style={revealDelay(i, 45)}
                className="grid gap-1.5 border-t border-line py-5 last:border-b md:grid-cols-[220px_1fr] md:gap-8 md:py-6"
              >
                <dt className="text-[15px] font-bold text-ink-subtle">{r.k}</dt>
                <dd className="text-[17px] font-medium leading-[1.55] text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>

          <p data-reveal className="mt-8 text-[14px] leading-[1.7] text-ink-faint">
            {SUMMARY.note}
          </p>
        </div>
      </section>
    </>
  )
}
