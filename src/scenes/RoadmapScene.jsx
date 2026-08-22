import { Link } from 'react-router-dom'
import { ROADMAP } from '../data/content'
import MediaBand from '../components/MediaBand'

/*
 * ── 왜 이 절이 필요했나 ──────────────────────────────────────────────────
 * 이 페이지는 「2027년 3월 출범」을 첫 화면부터 마지막 화면까지 내세우는데,
 * 거기까지 어떻게 가는지는 홈에서 한 번도 말하지 않았다. 추진 일정이
 * /ai-college/roadmap 안쪽에만 있었다.
 *
 * 13회차에 히어로를 41% → 33% 로 줄이면서 "히어로를 더 줄이는 대신 뒤쪽 절을
 * 늘리는 쪽이 남은 길" 이라고 적어뒀다. 그 첫 번째다.
 *
 * ── 구도 ──────────────────────────────────────────────────────────────────
 * 서브페이지는 이미 점과 선으로 잇는 세로 타임라인이다. 홈에서 같은 그림을
 * 또 그리면 두 화면이 겹친다. 여기서는 행마다 왼쪽 여백을 조금씩 밀어
 * 계단으로 세운다. 자산(roadmap_path)이 다섯 표식이 점점 커지며 올라가는
 * 그림이라 형태가 맞물린다.
 *
 * 5열 그리드로 가로로 늘어놓는 안도 재봤는데, 1280 폭에서 한 칸이 236px 라
 * 한국어 본문이 서너 글자마다 끊긴다. 계단은 각 행이 폭을 다 쓴다.
 *
 * 좁은 화면에서는 들여쓰기를 걷는다. 세로로 쌓인 상태에서 들여쓰기가 남으면
 * 계단이 아니라 어긋난 목록으로 보인다.
 * ────────────────────────────────────────────────────────────────────────
 */

/** 행마다 미는 폭. 다섯 단계가 화면 3분의 1 안에서 올라간다. */
const INDENT = ['md:ml-0', 'md:ml-[8%]', 'md:ml-[16%]', 'md:ml-[24%]', 'md:ml-[32%]']

export default function RoadmapScene() {
  return (
    <>
      <MediaBand
        slug="roadmap_path_v"
        ratio="aspect-[3/2] sm:aspect-[16/8] md:aspect-[21/8]"
        alt="어두운 공간에 파란 길이 안쪽으로 이어지고, 그 위에 다섯 개의 표식이 점점 커지며 놓여 있다."
      />

      <section id="roadmap" className="band scroll-mt-24 bg-canvas" aria-labelledby="roadmap-title">
        <div className="edge">
          <p className="text-[15px] font-semibold text-brand">{ROADMAP.eyebrow}</p>
          <h2 id="roadmap-title" className="h2 mt-4 text-ink">
            {ROADMAP.title}
          </h2>

          <ol className="mt-14 md:mt-20">
            {ROADMAP.steps.map((step, index) => (
              <li key={step.year} className={`${INDENT[index]} max-w-[52rem]`}>
                <div
                  className={`grid gap-4 border-t py-8 md:grid-cols-[minmax(0,132px)_1fr] md:gap-10 md:py-10 ${
                    step.highlight ? 'border-brand' : 'border-line'
                  }`}
                >
                  <p
                    className={`text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-none tracking-[-0.02em] ${
                      step.highlight ? 'text-brand' : 'text-ink-faint'
                    }`}
                  >
                    {step.year}
                  </p>

                  <div>
                    <h3
                      className={`text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold leading-[1.4] ${
                        step.highlight ? 'text-brand-strong' : 'text-ink'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.7] text-ink-muted md:text-[16px]">{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12 md:ml-[32%]">
            <Link
              to="/ai-college/roadmap"
              className="text-[15px] font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              추진 일정과 원서접수 자세히 보기 →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
