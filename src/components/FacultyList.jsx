import { useMemo, useState } from 'react'

const RANK_ORDER = { 교수: 0, 부교수: 1, 조교수: 2 }

/**
 * Faculty roster for one academic unit.
 *
 * Everything shown here — affiliation, rank, name, specialisation, AI-related
 * career — comes from the university's own 교원정보 file, which is professional
 * information of the kind a department page normally publishes. Career lines
 * are collapsed behind a toggle because several members have a dozen of them
 * and an always-open list buries the roster.
 */
export default function FacultyList({ people, unitName }) {
  const [open, setOpen] = useState(() => new Set())

  const sorted = useMemo(
    () =>
      [...people].sort(
        (a, b) =>
          (RANK_ORDER[a.rank] ?? 9) - (RANK_ORDER[b.rank] ?? 9) ||
          a.name.localeCompare(b.name, 'ko'),
      ),
    [people],
  )

  const counts = useMemo(() => {
    const c = {}
    people.forEach((p) => (c[p.rank] = (c[p.rank] ?? 0) + 1))
    return c
  }, [people])

  const toggle = (no) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(no) ? next.delete(no) : next.add(no)
      return next
    })

  if (!people.length) {
    return (
      <p className="rounded-[--radius-md] bg-gray-100 px-5 py-4 text-[15px] leading-[1.7] text-ink-subtle">
        {unitName}은 신설 예정이라 배정된 교원 정보가 아직 공개되지 않았어요.
      </p>
    )
  }

  return (
    <div>
      <p className="text-[15px] text-ink-subtle">
        전체 <strong className="font-bold text-ink">{people.length}명</strong>
        {Object.keys(counts).length > 0 && (
          <>
            {' · '}
            {Object.entries(counts)
              .sort((a, b) => (RANK_ORDER[a[0]] ?? 9) - (RANK_ORDER[b[0]] ?? 9))
              .map(([rank, n]) => `${rank} ${n}명`)
              .join(' · ')}
          </>
        )}
      </p>

      <ul className="mt-6 overflow-hidden rounded-[--radius-lg] border border-line">
        {sorted.map((p, i) => {
          const isOpen = open.has(p.no)
          const hasCareer = p.career.length > 0
          return (
            <li
              key={p.no}
              className={`bg-canvas ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <div className="grid gap-2 px-5 py-5 md:grid-cols-[150px_1fr_auto] md:items-baseline md:gap-6 md:px-7 md:py-6">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[17px] font-bold text-ink">{p.name}</span>
                  <span className="text-[13px] font-medium text-ink-faint">{p.rank}</span>
                </div>

                <p className="text-[15px] leading-[1.6] text-ink-muted">{p.major || '—'}</p>

                {hasCareer && (
                  <button
                    type="button"
                    onClick={() => toggle(p.no)}
                    aria-expanded={isOpen}
                    aria-controls={`career-${p.no}`}
                    className="justify-self-start rounded-[--radius-sm] px-2.5 py-1.5 text-[14px] font-semibold text-brand transition-colors hover:bg-blue-50 md:justify-self-end"
                  >
                    {isOpen ? '경력 접기' : `경력 ${p.career.length}건`}
                  </button>
                )}
              </div>

              {hasCareer && isOpen && (
                <ul
                  id={`career-${p.no}`}
                  className="border-t border-line bg-canvas-subtle px-5 py-5 md:px-7"
                >
                  {p.career.map((c, ci) => (
                    <li
                      key={ci}
                      className="flex gap-2.5 py-1 text-[14px] leading-[1.65] text-ink-subtle"
                    >
                      <span aria-hidden="true" className="text-ink-faint">
                        ·
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-5 text-[13px] leading-[1.7] text-ink-faint">
        부산대학교가 제공한 AI대학 교원정보 자료(2026년 8월 기준)를 정리했어요. 소속과 직급은
        개편 전 현재 기준이며, 2027년 3월 편제에 따라 달라질 수 있어요.
      </p>
    </div>
  )
}
