import { Link } from 'react-router-dom'

/**
 * The three doors the sponsor asked for, in the order they asked for
 * (docs/CORE.md): AI대학 first, then A.U.R.A, then Google for Education.
 * The latter two already live on arise-ai.pusan.ac.kr and are linked, not
 * rebuilt — so each card says where it lands before you click it.
 */
const DOORS = [
  {
    n: '01',
    to: '/ai-college',
    kicker: '2027년 3월 출범',
    title: 'AI대학',
    body: 'ADP+X 구조와 편제 대상 학부·학과, 소속 교원을 정리했어요.',
    go: 'AI대학 살펴보기',
    primary: true,
  },
  {
    n: '02',
    href: 'https://arise-ai.pusan.ac.kr/bymonolog',
    kicker: 'AI 거점대학육성사업단',
    title: 'A.U.R.A 마스터플랜 및 데이터룸',
    body: '부산대학교 AI 대전환 추진 전략과 성과 분석 데이터룸이에요.',
    go: 'arise-ai.pusan.ac.kr',
  },
  {
    n: '03',
    href: 'https://arise-ai.pusan.ac.kr/',
    kicker: '교육 협력',
    title: 'PNU × Google for Education',
    body: 'Google과 함께하는 AI 교육·연구 협력 파트너십이에요.',
    go: 'arise-ai.pusan.ac.kr',
  },
]

function DoorBody({ door }) {
  const external = !door.to

  return (
    <>
      <span className="flex items-center gap-3">
        <span className="g-num text-[13px] font-bold leading-none">{door.n}</span>
        <span aria-hidden="true" className="g-rule h-px flex-1" />
      </span>

      <span className="g-kicker mt-6 block text-[13px] font-semibold">{door.kicker}</span>
      <span className="g-title mt-1.5 block text-[21px] font-bold leading-[1.35] lg:text-[23px]">
        {door.title}
      </span>
      <span className="g-body mt-3 block text-[15px] leading-[1.6]">{door.body}</span>

      <span className="g-go mt-8 flex items-center gap-1.5 pt-1 text-[14px] font-semibold md:mt-auto">
        {door.go}
        <span aria-hidden="true" className="g-arrow text-[15px] leading-none">
          {external ? '↗' : '→'}
        </span>
        {external && <span className="sr-only">새 창에서 열려요</span>}
      </span>
    </>
  )
}

export default function GatewayScene() {
  return (
    <section id="gateway" className="band-tight bg-canvas" aria-labelledby="gateway-title">
      <div className="edge">
        <h2 id="gateway-title" className="text-[15px] font-semibold text-brand">
          바로 가기
        </h2>

        {/*
         * The first door carries more width on wide screens — the sponsor's
         * order already puts AI대학 first, and the fill plus the extra column
         * share says the same thing without reordering anything.
         */}
        <ul className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
          {DOORS.map((door) => {
            /*
             * rounded-[var(--radius-xl)], not rounded-[--radius-xl]: Tailwind
             * v4 emits the bare form as `border-radius: --radius-xl`, which is
             * invalid, so the card renders with square corners. The same
             * shorthand is still in index.css and several components.
             */
            const cls = `gateway-card flex h-full flex-col rounded-[var(--radius-xl)] p-6 md:min-h-[252px] md:p-7 lg:p-8 ${
              door.primary ? 'is-primary' : 'is-external'
            }`

            return (
              <li key={door.n}>
                {door.to ? (
                  <Link to={door.to} className={cls}>
                    <DoorBody door={door} />
                  </Link>
                ) : (
                  <a href={door.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    <DoorBody door={door} />
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <style>{`
        /*
         * Frame capture of MIT's home (docs/motion/reference.md §4-3) timed a
         * colour-surface card's hover at about 150ms of background colour and
         * nothing else — measured pixel-identical position, no lift, no
         * shadow, no scale. These doors are colour surfaces, so they answer
         * the same way; the .card lift in index.css belongs to a different
         * component. The second motion is the arrow, which is MIT's own CTA
         * idiom (§4-4): one small glyph moves, everything else holds.
         *
         * Each variant only redefines the tokens; the rules below are shared.
         */
        .gateway-card {
          --g-surface: var(--color-gray-100);
          --g-surface-hover: var(--color-blue-50);
          --g-rule: var(--color-gray-300);
          --g-rule-hover: var(--color-blue-300);
          --g-go: var(--color-ink-subtle);
          --g-go-hover: var(--color-brand-strong);

          background: var(--g-surface);
          transition: background-color var(--dur-base) var(--ease-standard);
        }

        .gateway-card .g-num { color: var(--color-ink-faint); }
        .gateway-card .g-kicker { color: var(--color-brand); }
        .gateway-card .g-title { color: var(--color-ink); }
        .gateway-card .g-body { color: var(--color-ink-subtle); }

        .gateway-card.is-primary {
          --g-surface: var(--color-brand-strong);
          /*
           * The old hover paired bg-brand-strong with hover:bg-blue-700 —
           * the same #1b64da, so the emphasised card answered with nothing.
           * Darkening keeps the small white text above the 5.41:1 it has now.
           */
          --g-surface-hover: color-mix(in srgb, var(--color-brand-strong) 86%, #000);
          --g-rule: color-mix(in srgb, #fff 32%, transparent);
          --g-rule-hover: color-mix(in srgb, #fff 72%, transparent);
          --g-go: var(--color-blue-100);
          --g-go-hover: #fff;
        }

        .gateway-card.is-primary .g-num,
        .gateway-card.is-primary .g-kicker { color: var(--color-blue-100); }
        .gateway-card.is-primary .g-title { color: #fff; }
        .gateway-card.is-primary .g-body { color: var(--color-blue-50); }

        .gateway-card:hover,
        .gateway-card:focus-visible { background: var(--g-surface-hover); }

        /* every .g-* rule stays under .gateway-card — these are short names in
           a global stylesheet shared with every other scene */
        .gateway-card .g-rule {
          background: var(--g-rule);
          transition: background-color var(--dur-base) var(--ease-standard);
        }
        .gateway-card:hover .g-rule,
        .gateway-card:focus-visible .g-rule { background: var(--g-rule-hover); }

        .gateway-card .g-go {
          color: var(--g-go);
          transition: color var(--dur-base) var(--ease-standard);
        }
        .gateway-card:hover .g-go,
        .gateway-card:focus-visible .g-go { color: var(--g-go-hover); }

        .gateway-card .g-arrow { transition: transform var(--dur-base) var(--ease-standard); }
        .gateway-card:hover .g-arrow,
        .gateway-card:focus-visible .g-arrow { transform: translateX(3px); }
        /* An external arrow points off-site; it leaves along its own diagonal. */
        .gateway-card.is-external:hover .g-arrow,
        .gateway-card.is-external:focus-visible .g-arrow { transform: translate(2px, -2px); }

        @media (prefers-reduced-motion: reduce) {
          .gateway-card,
          .gateway-card .g-rule,
          .gateway-card .g-go,
          .gateway-card .g-arrow { transition: none !important; }
          .gateway-card:hover .g-arrow,
          .gateway-card:focus-visible .g-arrow,
          .gateway-card.is-external:hover .g-arrow,
          .gateway-card.is-external:focus-visible .g-arrow { transform: none; }
        }
      `}</style>
    </section>
  )
}
