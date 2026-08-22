import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroScene from '../scenes/HeroScene'
import GatewayScene from '../scenes/GatewayScene'
import { SUMMARY } from '../data/content'
import { revealDelay } from '../hooks/useReveal'
import { asset } from '../lib/asset'

export default function Home() {

  useEffect(() => {
    document.title = '부산대학교 AI대학 — 2027년 3월 출범'
  }, [])

  return (
    <>
      <HeroScene />

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
