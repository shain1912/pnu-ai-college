import { useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * The banner every inner page opens with: breadcrumb, eyebrow, title, lead.
 * Also owns the document title, so each route is distinguishable in history
 * and when a tab is shared.
 */
export default function PageHead({ eyebrow, title, lead, crumbs = [], docTitle }) {
  useEffect(() => {
    const previous = document.title
    document.title = `${docTitle ?? title} — 부산대학교 AI대학`
    return () => {
      document.title = previous
    }
  }, [docTitle, title])

  return (
    <div className="border-b border-line bg-canvas-subtle">
      <div className="edge py-14 md:py-20">
        {crumbs.length > 0 && (
          <nav aria-label="위치" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[14px] text-ink-faint">
              {crumbs.map((c) => (
                <li key={c.to} className="flex items-center gap-2">
                  <Link to={c.to} className="transition-colors hover:text-brand">
                    {c.label}
                  </Link>
                  <span aria-hidden="true">›</span>
                </li>
              ))}
              <li className="text-ink-subtle">{title}</li>
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p data-reveal className="text-[15px] font-semibold text-brand">
            {eyebrow}
          </p>
        )}
        <h1 data-reveal style={{ '--reveal-delay': '70ms' }} className="h1 mt-3 whitespace-pre-line text-ink">
          {title}
        </h1>
        {lead && (
          <p data-reveal style={{ '--reveal-delay': '140ms' }} className="lead mt-6 max-w-[40rem]">
            {lead}
          </p>
        )}
      </div>
    </div>
  )
}
