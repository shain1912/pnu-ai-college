import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import ScrollRail from '../components/ScrollRail'

const NAV = [
  { to: '/ai-college', label: 'AI대학' },
  { to: '/ai-college/adpx', label: 'ADP+X 구조' },
  { to: '/ai-college/schools', label: '학부·학과' },
  { to: '/ai-college/roadmap', label: '추진 일정' },
]

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // An in-page anchor owns its own scrolling; a route change starts at the top.
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-sm">
      <div className="edge-wide flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link to="/" className="flex shrink-0 items-baseline gap-2.5">
          <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">
            부산대학교 AI대학
          </span>
          <span className="hidden text-[13px] font-medium text-ink-faint sm:inline">
            2027년 3월 출범
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/ai-college'}
              className={({ isActive }) =>
                `rounded-[--radius-sm] px-3.5 py-2 text-[15px] font-medium transition-colors
                 duration-[--dur-fast] ${
                   isActive ? 'bg-blue-50 text-blue-700' : 'text-ink-muted hover:bg-gray-100 hover:text-ink'
                 }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* the desktop nav collapses to a horizontally scrollable rail rather than
          a hamburger — five short items fit, and a menu would hide the structure */}
      <nav aria-label="주요 메뉴" className="-mb-px flex gap-1 overflow-x-auto px-5 pb-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/ai-college'}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-[--radius-sm] px-3 py-2 text-[14px] font-medium ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-ink-muted'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line bg-canvas-subtle">
      <div className="edge py-14 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="text-[17px] font-bold text-ink">부산대학교 AI대학</p>
            <p className="mt-3 text-[14px] leading-[1.7] text-ink-subtle">
              부산광역시 금정구 부산대학로63번길 2
              <br />
              2027년 3월 출범 예정
            </p>
          </div>

          <nav aria-label="맨 아래 메뉴" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-[15px] text-ink-muted transition-colors hover:text-brand"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/*
         * CORE.md 가 요구한 세 관문 중 둘. 홈 상단의 3열 카드로 있었는데
         * 클라이언트가 그 블록을 걷어내라고 해서 링크만 여기로 옮겼다.
         * 둘 다 이미 arise-ai.pusan.ac.kr 에 있는 페이지라 다시 만들지 않고
         * 어디로 가는지 밝히고 넘긴다.
         */}
        <div className="mt-12 border-t border-line pt-8">
          <p className="text-[13px] font-semibold text-ink-subtle">함께 보기</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: 'https://arise-ai.pusan.ac.kr/bymonolog', label: 'A.U.R.A 마스터플랜 및 데이터룸' },
              { href: 'https://arise-ai.pusan.ac.kr/', label: 'PNU × Google for Education' },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-medium text-ink-muted underline underline-offset-4 transition-colors hover:text-brand"
                >
                  {item.label} ↗<span className="sr-only">새 창에서 열려요</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <div className="space-y-3 text-[13px] leading-[1.7] text-ink-faint">
            <p>
              <strong className="font-semibold text-ink-subtle">승인 전 계획안입니다.</strong>{' '}
              학사조직 개편의 상당 부분은 관련 위원회 심의와 학칙 제·개정을 거쳐 확정돼요. 학부·학과
              편제, 정원, 교육과정은 확정 과정에서 달라질 수 있어요. 최종 기준은 대학의 공식 발표와
              모집요강이에요.
            </p>
            <p>
              이 페이지의 배경 영상과 이미지 일부에는 생성형 AI 기술이 활용됐어요. 실제 시설이나
              특정 인물을 촬영한 기록이 아니에요.
            </p>
            <p>
              공식 정보는{' '}
              <a
                href="https://www.pusan.ac.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-subtle underline underline-offset-4 hover:text-brand"
              >
                pusan.ac.kr
              </a>
              {' · '}
              <a
                href="https://go.pusan.ac.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-subtle underline underline-offset-4 hover:text-brand"
              >
                입학정보
              </a>
              에서 확인하세요. 기준일 2026년 8월.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function SiteLayout() {
  const { pathname } = useLocation()
  // Re-arm the reveal observer on every route so a new page's elements animate.
  useReveal(pathname)

  return (
    <>
      <ScrollToTop />
      <ScrollRail />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
          focus:rounded-[--radius-md] focus:bg-brand-strong focus:px-4 focus:py-2.5 focus:font-semibold focus:text-white"
      >
        본문으로 건너뛰기
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
