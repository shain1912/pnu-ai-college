import { SUMMARY } from '../data/content'
import { asset } from '../lib/asset'
import { useReducedMotion } from '../hooks/useMedia'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [구조] 표 앞에 화면을 채우는 선언 한 장을 둔다
 *   toss 씬        : §2-8 온·오프라인 결제 인터스티셜
 *   캡처 파일       : assets/gap/home.jpg 행 3 (toss 열)
 *   원본에서 본 것  : 스크롤 중간에 다른 요소가 거의 없는 화면이 통째로 나오고
 *                    "온오프라인 경계 없이" 한 문장만 크게 놓인다. 정보 밀도가
 *                    높은 구간 사이에 숨 쉬는 화면을 끼워 리듬을 만든다.
 *   그대로 가져온 것: 정보 구간 앞에 선언 한 장을 두는 리듬
 *   바꾼 것과 이유  : toss 는 검정 배경을 쓰지만 우리는 브랜드 블루 면을 쓴다.
 *                    국립대 페이지에 검정 인터스티셜은 톤이 맞지 않는다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [배치] 숫자가 화면의 주인공이 된다
 *   toss 씬        : 대응 없음 — 우리 고유
 *   이유           : toss 는 스펙 표가 없는 제품 사이트라 대응할 챕터가 없다.
 *                    424 는 이 페이지에서 가장 강한 증거이므로 표 안의 한 행이
 *                    아니라 화면 하나를 받을 자격이 있다고 판단했다.
 *
 * ── 영상 ──────────────────────────────────────────────────────────────
 * /video/schools — Higgsfield kling3_0_turbo. toss 참조 없음.
 */

export default function FactSheetScene() {
  const reduced = useReducedMotion()

  return (
    <>
      {/* the breathing screen before the dense part */}
      <section id="summary" className="relative bg-brand-strong">
        <div className="edge flex min-h-[78svh] flex-col justify-center py-24">
          <p className="text-[15px] font-semibold text-blue-100">한눈에 보기</p>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="text-[clamp(4.5rem,15vw,11rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-white">
              424
            </span>
            <span className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-blue-100">명</span>
          </p>

          <p className="mt-8 max-w-[34rem] text-[clamp(1.25rem,2.6vw,1.75rem)] font-bold leading-[1.45] text-white">
            대학이 밝힌 국내 최대 규모의 AI 단과대학이에요.
          </p>
          <p className="mt-4 max-w-[32rem] text-[16px] leading-[1.7] text-blue-50">
            AI컴퓨터공학부 214명, 데이터사이언스학부·통계학과 114명, 산업공학부 69명,
            AX융합학부 27명을 더한 숫자예요.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[46%] w-[46%] max-w-[520px] opacity-45 mix-blend-screen"
        >
          {reduced ? (
            <img src={asset('img/schools@2x.webp')} alt="" className="h-full w-full object-contain object-bottom" />
          ) : (
            <video
              className="h-full w-full object-contain object-bottom"
              poster={asset('img/schools@2x.webp')}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={asset('video/schools.webm')} type="video/webm" />
              <source src={asset('video/schools.mp4')} type="video/mp4" />
            </video>
          )}
        </div>
      </section>

      {/* the dense part, given more presence than a bare list */}
      <section className="band bg-canvas">
        <div className="edge">
          <h2 className="h2 text-ink">{SUMMARY.title}</h2>

          <dl className="mt-12 grid gap-px overflow-hidden rounded-[--radius-xl] bg-gray-200 md:mt-14 md:grid-cols-2">
            {SUMMARY.rows.map((row) => (
              <div key={row.k} className="bg-canvas p-6 md:p-8">
                <dt className="text-[14px] font-bold text-brand">{row.k}</dt>
                <dd className="mt-3 text-[19px] font-bold leading-[1.45] text-ink md:text-[21px]">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[14px] leading-[1.7] text-ink-faint">{SUMMARY.note}</p>
        </div>
      </section>
    </>
  )
}
