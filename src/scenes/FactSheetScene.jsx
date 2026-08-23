import { Link } from 'react-router-dom'
import { SUMMARY } from '../data/content'
import SceneVideo from '../components/SceneVideo'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [숨 쉬는 화면] 밀도 높은 구간 앞에 문장 하나만 놓인 화면을 둔다
 *   toss 씬        : §2-8 「온오프라인 경계 없이」
 *   캡처 파일       : assets/motion/toss-rail-sheet2.jpg 프레임 014
 *   원본에서 본 것  : 흰 화면에 검은 오브젝트 하나와 문장 하나뿐이다. 다른
 *                    요소가 없다. 앞뒤가 빽빽해서 이 화면이 쉬는 자리가 된다.
 *   바꾼 것과 이유  : toss 는 오브젝트를 놓지만 우리는 숫자를 놓는다. 424 는
 *                    이 페이지에서 가장 강한 증거인데 표의 한 행에 묻혀 있었다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [큰 숫자 밑 작은 숫자 줄] 헤드라인 숫자 아래 내역을 한 줄로 깐다
 *   toss 씬        : Toss Ads 「토스의 3,000만 고객이 내 고객이 될 때까지」
 *   캡처 파일       : assets/motion/toss-rail-move.jpg (0.530 프레임)
 *   원본에서 본 것  : 큰 문장 아래 날짜·지표·데이터 종류가 작은 글씨로 가로
 *                    한 줄에 늘어서 있다. 큰 숫자의 근거를 같은 화면에서 받는다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [전면 이미지 띠] 정보 구간 사이에 글자 없는 이미지를 통으로 넣는다
 *   toss 씬        : 제품 사진 구간
 *   캡처 파일       : assets/motion/toss-rail-sheet2.jpg 프레임 015~018
 *   원본에서 본 것  : 화면을 꽉 채운 사진 위에 문구가 왼쪽 아래에만 있고,
 *                    사진이 한 장면을 통째로 차지한다.
 *   바꾼 것과 이유  : 우리는 문구까지 뺐다. 앞이 숫자, 뒤가 표라 글자가 연달아
 *                    세 번 나오면 읽히지 않는다.
 *
 * ── 이전 버전에서 걷어낸 것 ──────────────────────────────────────────────
 * 1. 평평한 파란 사각형 + 엠블럼 워터마크. 히어로는 여백을 둔 둥근 카드인데
 *    이건 각진 전면 사각형이라 기하가 충돌했다. 파란 면 자체도 빈 판이었다.
 * 2. 읽고 있지 않은 행을 0.4 로 죽이던 처리. 여덟 줄 중 일곱 줄이 회색이라
 *    강조가 아니라 로드 실패로 보였다. toss 는 본문을 죽이지 않는다.
 * 3. 왼쪽에 고정하던 정사각 영상. 오른쪽 표가 훨씬 길어 영상 아래로 빈 공간이
 *    화면 절반 넘게 남았다.
 * 4. 제목 「부산대학교 AI대학」. 사이트 이름이지 절 제목이 아니고, 고정 내비에
 *    걸려 잘렸다. 묶음 제목 셋으로 대신한다.
 * ────────────────────────────────────────────────────────────────────────
 */

/** 424 를 이루는 네 모집단위. 큰 숫자 바로 밑에서 근거를 받는다. */
const BREAKDOWN = [
  { n: 214, label: 'AI컴퓨터공학부' },
  { n: 114, label: '데이터사이언스학부 · 통계학과' },
  { n: 69, label: '산업공학부' },
  { n: 27, label: 'AX융합학부' },
]

/*
 * 여덟 줄을 세 묶음으로 나눈다. 한 줄씩 나열하면 무엇이 규모고 무엇이 구조인지
 * 구분이 없어 전부 같은 무게로 읽힌다. content.js 의 키를 참조해 문구가 바뀌어도
 * 여기서 다시 적지 않는다.
 */
const GROUPS = [
  { title: '규모', keys: ['출범', '입학정원', '모집단위'] },
  { title: '구조', keys: ['대학이 밝힌 구성', '설계 원칙', '운영 체계'] },
  { title: '준비 상황', keys: ['핵심 인프라', '2027학년도 수시 원서접수'] },
]

const rowsOf = (group) => SUMMARY.rows.filter((row) => group.keys.some((key) => row.k.startsWith(key)))

export default function FactSheetScene() {

  return (
    <>
      {/* 쉬는 화면 — 숫자 하나와 그 내역만 */}
      <section id="summary" className="scroll-mt-24 bg-canvas" aria-labelledby="summary-title">
        <div className="edge grid min-h-[82svh] items-center gap-10 py-24 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-14">
          <div>
          <p className="text-[15px] font-semibold text-brand">{SUMMARY.eyebrow}</p>

          <p className="mt-8 flex items-baseline gap-3">
            <span className="text-[clamp(5rem,17vw,13rem)] font-extrabold leading-[0.86] tracking-[-0.045em] text-ink">
              424
            </span>
            <span className="text-[clamp(1.75rem,4vw,3rem)] font-bold text-ink-subtle">명</span>
          </p>

          {/*
            이 문장이 이 구간의 제목이다. 전에는 p 였고 424 화면에 제목이 하나도
            없었다. 그래서 아래 표의 묶음 제목(h3)이 히어로의 h1 바로 다음에
            와서 낭독기 뼈대가 h1 → h3 로 한 단계 건너뛰었다.
          */}
          <h2
            id="summary-title"
            className="mt-10 max-w-[30rem] text-[clamp(1.375rem,2.8vw,2rem)] font-bold leading-[1.4] text-ink"
          >
            대학이 밝힌 국내 최대 규모의 AI 단과대학이에요.
          </h2>

          <ul className="mt-14 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {BREAKDOWN.map((item) => (
              <li key={item.label}>
                <p className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-none tracking-[-0.02em] text-ink">
                  {item.n}
                  <span className="ml-1 text-[15px] font-bold text-ink-faint">명</span>
                </p>
                <p className="mt-2.5 text-[14px] font-medium leading-[1.5] text-ink-subtle">{item.label}</p>
              </li>
            ))}
          </ul>
          </div>

          {/* 다섯 덩이가 맞물려 하나가 된다 — 「424명이 이 다섯 곳으로」의 형태 */}
          <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[--radius-xl] md:max-w-none">
            <SceneVideo
              slug="obj_gather_v"
              alt="크기가 다른 짙은 남색 덩어리 다섯이 맞물려 하나의 윤곽을 이룬다."
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* 글자 없는 이미지 한 장. 앞은 숫자, 뒤는 표라 사이에 눈이 쉴 자리를 둔다. */}
      <div className="px-[10px] md:px-5">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[18px] bg-[#0a0a14] sm:aspect-[16/7] md:aspect-[21/7] md:rounded-[28px]">
          <SceneVideo slug="band_lab" className="h-full w-full object-cover" />
        </div>
      </div>

      {/* 표 — 세 묶음, 전부 또렷하게 */}
      <section className="bg-canvas pb-8 pt-20 md:pt-28 lg:pt-40">
        <div className="edge">
          {GROUPS.map((group) => (
            <div
              key={group.title}
              className="grid gap-6 border-t border-line py-10 md:grid-cols-[minmax(0,200px)_1fr] md:gap-12 md:py-14"
            >
              <h3 className="text-[clamp(1.25rem,2vw,1.5rem)] font-bold tracking-[-0.015em] text-ink">
                {group.title}
              </h3>

              <dl className="grid gap-8 md:gap-10">
                {rowsOf(group).map((row) => (
                  <div key={row.k} className="grid gap-2 sm:grid-cols-[minmax(0,148px)_1fr] sm:gap-6">
                    <dt className="text-[14px] font-semibold leading-[1.5] text-ink-faint">{row.k}</dt>
                    <dd className="text-[clamp(1.0625rem,1.5vw,1.25rem)] font-bold leading-[1.5] text-ink">
                      {row.v}
                      {/*
                        소속 관계처럼 한 줄로는 다 못 담는 항목은 그림이 있는
                        자리로 보낸다. 홈에 조직도를 한 번 더 그리면 같은 그림이
                        두 페이지에 생긴다.
                      */}
                      {row.to && (
                        <Link
                          to={row.to}
                          className="ml-2 whitespace-nowrap align-middle text-[14px] font-semibold text-brand-strong underline-offset-4 hover:underline"
                        >
                          {row.toLabel} →
                        </Link>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <p className="mt-10 border-t border-line pt-8 text-[14px] leading-[1.7] text-ink-faint">
            {SUMMARY.note}
          </p>
        </div>
      </section>
    </>
  )
}
