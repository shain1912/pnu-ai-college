import { CHAIN } from '../data/content'
import { asset } from '../lib/asset'
import { useReducedMotion } from '../hooks/useMedia'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [좌우 번갈아] 밝은 바탕에서 미디어와 카피가 행마다 자리를 바꾼다
 *   toss 씬        : 「자산을 관리하는 일은 한껏 단순하게」(카피 왼쪽·제품 오른쪽)
 *                    → 「최저가는 알아서 찾아주고」(제품 왼쪽·카피 오른쪽)
 *   캡처 파일       : assets/gap/home.jpg 행 1·2 (toss 열)
 *   원본에서 본 것  : 연달아 오는 두 화면에서 제품이 왼쪽·오른쪽으로 자리를
 *                    바꾼다. 같은 밝은 바탕인데도 두 화면이 구분된다.
 *   그대로 가져온 것: 밝은 바탕, 행마다 좌우 교대.
 *   바꾼 것과 이유  : toss 는 흰 배경에 뜬 제품 목업이고 우리는 어두운 영상
 *                    타일이다. 보여줄 제품 화면이 없다.
 *   근거 강도       : 직접관찰(프레임)
 *
 *
 * ── 왜 이 절이 필요했나 ──────────────────────────────────────────────────
 * 배포본을 7단계로 재니 우리 행 0~3 이 전부 어두운 전면 영상이었다. 네 화면
 * 연속으로 톤이 같다. toss 는 사진·흰 바탕·사진·흰 바탕으로 계속 엇갈린다.
 * 그리고 우리 홈은 네 구간에서 끝나는데 toss 는 스무 장을 간다.
 *
 * 부산항 예시는 원래 /ai-college/adpx 에만 있었다. 네 학부가 어떻게 이어지는지
 * 가장 잘 보여주는 내용인데 홈에서는 볼 수 없었다.
 * ────────────────────────────────────────────────────────────────────────
 */

/*
 * 네 단계에 붙일 화면. 단계가 말하는 장소를 그대로 찍은 것으로 골랐다.
 *   D 하역 기록      → 컨테이너 터미널
 *   A 예측 모델      → 서버랙
 *   P 크레인 운영    → 기어를 집어넣는 산업 로봇
 *   X 조선소로 확산  → 조선소 도크
 */
const MEDIA = {
  D: { slug: 'port_crane_v', alt: '야간 컨테이너 터미널. 갠트리 크레인이 컨테이너를 내리고 파란 경로선이 야드 위를 흐른다.' },
  A: { slug: 'gpu_rack_v', alt: '서버랙이 늘어선 냉복도. 파란 상태 표시등이 줄지어 깜빡인다.' },
  P: { slug: 'axis_p', alt: '산업용 로봇 팔이 기어를 제자리에 내려놓는다.' },
  X: { slug: 'shipyard_v', alt: '야간 조선소 도크. 건조 중인 선체를 파란 계측선이 따라 훑는다.' },
}

function Tile({ media, reduced }) {
  const poster = asset(`img/${media.slug}@2x.webp`)
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[--radius-xl] bg-[#0a0a14]">
      {reduced ? (
        <img src={poster} alt={media.alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <video
          className="h-full w-full object-cover"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
        >
          <source src={asset(`video/${media.slug}.webm`)} type="video/webm" />
          <source src={asset(`video/${media.slug}.mp4`)} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

export default function ImpactScene() {
  const reduced = useReducedMotion()

  return (
      <section id="impact" className="band scroll-mt-24 bg-canvas" aria-labelledby="impact-title">
        <div className="edge">
          <p className="text-[15px] font-semibold text-brand">{CHAIN.eyebrow}</p>
          <h2 id="impact-title" className="h2 mt-4 whitespace-pre-line text-ink">
            {CHAIN.title}
          </h2>
          <p className="lead mt-6 max-w-[40rem]">{CHAIN.intro}</p>

          <div className="mt-16 grid gap-16 md:mt-20 md:gap-24">
            {CHAIN.steps.map((step, index) => {
              const media = MEDIA[step.key]
              // 홀수 행은 미디어를 오른쪽으로 보낸다. 좁은 화면에서는 순서를
              // 건드리지 않는다 — 세로로 쌓이면 교대가 아니라 뒤죽박죽이 된다.
              const flip = index % 2 === 1
              return (
                <div key={step.key} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                  <div className={flip ? 'md:order-2' : ''}>
                    <Tile media={media} reduced={reduced} />
                  </div>

                  <div className={flip ? 'md:order-1' : ''}>
                    <p className="flex items-center gap-3">
                      <span className="text-[13px] font-bold tracking-[0.12em] text-brand">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true" className="h-px w-8 bg-line" />
                      <span className="text-[13px] font-bold tracking-[0.08em] text-ink-faint">{step.key}</span>
                    </p>
                    <p className="mt-5 text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold leading-[1.4] tracking-[-0.015em] text-ink">
                      {step.text}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-16 max-w-[42rem] text-[14px] leading-[1.7] text-ink-faint">{CHAIN.caveat}</p>
        </div>
      </section>
  )
}
