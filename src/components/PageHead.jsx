import { useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * The banner every inner page opens with: breadcrumb, eyebrow, title, lead.
 * Also owns the document title, so each route is distinguishable in history
 * and when a tab is shared.
 */
/*
 * 공유 카드는 index.html 에 한 벌만 있어서 어느 경로를 붙여도 홈 카드가 떴다.
 * 27회차에 라우트마다 HTML 을 미리 찍기 시작했으니, 여기서 태그를 갈아 끼우면
 * 그 상태가 그대로 파일에 굳는다.
 *
 * 실행 중에도 같이 바뀐다 — 라우트를 옮겨 다니다 주소를 복사하는 경우다.
 * 떠날 때 원래 값으로 되돌린다.
 */
const SITE = 'https://shain1912.github.io/pnu-ai-college'

const setAttr = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (!el) return null
  const previous = el.getAttribute(attr)
  el.setAttribute(attr, value)
  return () => el.setAttribute(attr, previous)
}
const setMeta = (selector, value) => setAttr(selector, 'content', value)

export default function PageHead({ eyebrow, title, lead, crumbs = [], docTitle, path }) {
  useEffect(() => {
    const full = `${docTitle ?? title} — 부산대학교 AI대학`
    const previous = document.title
    document.title = full

    const undo = [
      setMeta('meta[property="og:title"]', full),
      setMeta('meta[name="twitter:title"]', full),
      lead && setMeta('meta[property="og:description"]', lead),
      lead && setMeta('meta[name="twitter:description"]', lead),
      lead && setMeta('meta[name="description"]', lead),
      path && setMeta('meta[property="og:url"]', `${SITE}${path}`),
      // 같은 내용이 여러 주소로 잡히지 않게 정규 주소도 같이 옮긴다
      path && setAttr('link[rel="canonical"]', 'href', `${SITE}${path}`),
    ].filter(Boolean)

    return () => {
      document.title = previous
      undo.forEach((fn) => fn())
    }
  }, [docTitle, title, lead, path])

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
