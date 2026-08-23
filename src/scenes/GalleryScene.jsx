import { useScrollRail } from '../hooks/useScrollRail'
import SceneVideo from '../components/SceneVideo'

/*
 * ── 참조 ──────────────────────────────────────────────────────────────────
 * pnu-ai-college-2027.netlify.app/scroll-story.html 의 두 번째 구성,
 * 「AI대학의 장면들」. 캡처: assets/motion/ref-gallery.jpg.
 *
 * 원본에서 본 것: 아주 밝은 바탕에 제목이 왼쪽, 한 줄 설명이 오른쪽. 그 아래로
 * 사진 카드가 가로로 늘어서는데 크기가 제각각이라 큰 카드 하나에 작은 카드
 * 여럿이 붙는 모양이 된다. 카드마다 아래쪽에 짙은 알약 모양 설명이 얹힌다.
 *
 * 그대로 가져온 것: 밝은 바탕, 제목 왼쪽·설명 오른쪽, 크기가 엇갈리는 가로 카드,
 * 카드 위에 얹히는 짙은 설명 띠.
 *
 * 바꾼 것: 원본은 격자로 짜서 스크롤과 무관하게 서 있다. 우리는 세로 스크롤이
 * 가로로 미는 레일로 만들었다 — 클라이언트가 요청한 것이 "가로 스크롤 형식"
 * 이고, 이 페이지는 이미 그 방식을 학부 레일에서 쓰고 있어 동작이 일관된다.
 *
 * 학부 레일과 구분되는 점: 저쪽은 같은 크기 카드에 글이 아래 붙고 링크로 간다.
 * 여기는 크기가 엇갈리고 글이 사진 위에 얹히며 어디로도 가지 않는다. 읽는
 * 카드가 아니라 보는 카드다.
 *
 * ── 왜 여기인가 ──────────────────────────────────────────────────────────
 * 추진 일정과 마무리 사이. 앞에서 흩어져 나왔던 장면들을 마지막 문장 앞에
 * 한 줄로 모아 보여준다. 원본도 같은 자리에 둔다.
 * ────────────────────────────────────────────────────────────────────────
 */

/*
 * 이미 만들어 둔 자산에서 골랐다. 새로 만들지 않은 이유는 이 절이 "지금까지 본
 * 장면들" 이라서다 — 여기서 처음 보는 그림이 나오면 모아 보여주는 뜻이 없어진다.
 * tall 이 엇갈려야 큰 카드에 작은 카드가 붙는 원본의 리듬이 난다.
 */
const SCENES = [
  { slug: 'lecture_v', tall: true, label: '강의실', note: '424명이 한 단과대학 안에서 배워요' },
  { slug: 'gpu_rack_v', tall: false, label: '인프라', note: 'GPU 256장을 함께 써요' },
  { slug: 'port_crane_v', tall: true, label: '부산항', note: '하역 순서를 다시 짜는 일부터' },
  { slug: 'studio_team_v', tall: false, label: '연구실', note: '학습 경로를 직접 설계해요' },
  { slug: 'shipyard_v', tall: true, label: '조선소', note: '같은 방법을 옆 산업으로 옮겨요' },
  { slug: 'campus_night_v', tall: false, label: '캠퍼스', note: '2027년 3월에 문을 열어요' },
]

export default function GalleryScene() {
  const { rootRef, railRef, shift, driven, revealOnFocus, nativeClass } = useScrollRail()

  return (
    <section
      ref={rootRef}
      className="relative bg-canvas-subtle"
      style={{ height: driven ? '260svh' : 'auto' }}
      aria-labelledby="gallery-title"
    >
      <div className={driven ? 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-16' : 'py-16 md:py-20'}>
        <div className="edge">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
            <h2 id="gallery-title" className="h2 text-ink">
              AI대학의 장면들
            </h2>
            <p className="max-w-[26rem] text-[15px] leading-[1.7] text-ink-subtle">
              교육과 연구, 산업 실증까지 이 페이지가 지나온 자리를 한 줄로 모았어요.
            </p>
          </div>
        </div>

        {/* edge 안에 가두면 양끝에서 딱 끊겨 여섯이 전부라는 인상이 된다. */}
        <div
          ref={railRef}
          onFocusCapture={revealOnFocus}
          className={`mt-10 md:mt-12 ${driven ? 'overflow-hidden' : nativeClass}`}
        >
          <ul
            className="flex w-max items-center gap-4 px-6 md:gap-5 md:px-[max(1.5rem,calc((100vw-1120px)/2))]"
            style={driven ? { transform: `translate3d(${-shift}px, 0, 0)` } : undefined}
          >
            {SCENES.map((scene) => (
              <li
                key={scene.slug}
                className={`relative shrink-0 snap-start overflow-hidden rounded-[var(--radius-2xl)] bg-[#0a0a14] ${
                  scene.tall ? 'h-[380px] w-[290px] md:h-[520px] md:w-[400px]' : 'h-[260px] w-[290px] md:h-[340px] md:w-[380px]'
                }`}
              >
                <SceneVideo slug={scene.slug} className="h-full w-full object-cover" />

                {/* 사진 위에 얹히는 설명 띠. 원본과 같은 알약 모양이다. */}
                <p className="absolute inset-x-3 bottom-3 flex flex-wrap items-baseline gap-x-2 rounded-[var(--radius-pill)] bg-[#05050c]/75 px-4 py-2.5 backdrop-blur-sm">
                  <span className="text-[13px] font-bold text-white">{scene.label}</span>
                  <span className="text-[13px] leading-[1.5] text-white/70">{scene.note}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
