import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import GatewayScene from '../scenes/GatewayScene'
import { HERO, SUMMARY } from '../data/content'
import { useReducedMotion } from '../hooks/useMedia'
import { revealDelay } from '../hooks/useReveal'
import { asset } from '../lib/asset'

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

        <div className="edge-wide mt-16 md:mt-20">
          <figure
            data-reveal="media"
            style={revealDelay(3)}
            className="overflow-hidden rounded-[20px] will-change-transform md:rounded-[28px]"
          >
            {reduced ? (
              <img
                src={asset('img/hero_light@2x.webp')}
                alt="밝은 대학 아트리움 전경. 천장에 푸른 유리 조형물이 매달려 있어요."
                className="aspect-[16/9] w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <video
                className="aspect-[16/9] w-full object-cover"
                poster={asset('img/hero_light@2x.webp')}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="밝은 대학 아트리움 전경. 천장의 푸른 유리 조형물이 천천히 움직여요."
              >
                <source src={asset('video/atrium-loop.webm')} type="video/webm" />
                <source src={asset('video/atrium-loop.mp4')} type="video/mp4" />
              </video>
            )}
            <figcaption className="mt-3 text-center text-[12px] text-ink-faint">
              생성형 AI로 제작한 이미지예요. 실제 시설을 촬영한 것이 아니에요.
            </figcaption>
          </figure>
        </div>
      </section>

      <GatewayScene />

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
