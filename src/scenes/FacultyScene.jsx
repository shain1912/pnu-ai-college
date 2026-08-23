import { NUMBERS } from '../data/content'
import { SCHOOLS, facultyStats } from '../data/schools'

/*
 * ── 왜 이 절이 필요했나 ──────────────────────────────────────────────────
 * 홈은 몇 명이 들어오는지(424), 어느 학부가 오는지(다섯), 무엇을 배우는지
 * (부산항 예시), 언제 문을 여는지(추진 일정)까지 말한다. 그런데 **누가
 * 가르치는지는 한 번도 말하지 않았다.** 대학을 소개하는 페이지에서 상위 세
 * 질문 안에 드는 것이고, 답이 될 자료(교원 60명)는 이미 갖고 있었다.
 *
 * 그리고 이 페이지에는 사람 이름이 하나도 없었다. 마지막 강의실 장면에
 * 사람이 나오지만 실루엣이다.
 *
 * ── 구도 ──────────────────────────────────────────────────────────────────
 * 페이지가 이미 쓰고 있는 구도: 전면 영상 / 큰 숫자 + 여백 / 전면 이미지 띠 /
 * 라벨-값 표 / 문장 하나 / 가로 카드 레일 / 좌우 교대 / 계단 목록 /
 * 전면 영상 + 문구. 여기에 또 카드를 놓으면 겹친다.
 *
 * 처음에는 **이름을 그대로 벽처럼 폈다.** 60명을 학부별로 묶어 촘촘한 격자에
 * 넣었다 — 숫자 60 을 쓰는 것보다 이름 60 개가 놓인 화면이 더 강한 증거라서다.
 *
 * 32회차에 내렸다. faculty.json 의 원본은 대학 내부 교원정보 파일이고,
 * 그것을 정리한 docs/_extract/SOURCE_FACTS.md 가 "개인 신상이므로 사이트에는
 * 집계 통계로만 사용할 것" 이라고 직접 적어뒀다. 실명 + 소속 + 직급 +
 * 세부전공은 동명이인까지 갈라내는 조합이다 (docs/EVAL_CONTENT.md).
 * 공개 동의 기록은 저장소에 없다.
 *
 * 대신 학부별 인원과 직급 구성, 그리고 묶음 단위의 연구영역을 낸다. 사람을
 * 특정하지 않으면서 "누가 가르치나" 에는 답한다. 동의를 확보하면
 * schools.js 의 FACULTY_NAMES_PUBLIC 하나만 돌리면 된다.
 *
 * 세 숫자(60 / 43% / 10)를 위에 두되 424 화면처럼 크게 키우지 않았다. 이
 * 절의 주인공은 숫자가 아니라 이름이다.
 * ────────────────────────────────────────────────────────────────────────
 */

const FACULTY = NUMBERS.faculty

export default function FacultyScene() {
  const groups = SCHOOLS.map((school) => ({ school, stats: facultyStats(school) })).filter(
    (group) => group.stats.total > 0,
  )

  return (
    <section id="faculty" className="band scroll-mt-24 bg-canvas-subtle" aria-labelledby="faculty-title">
      <div className="edge">
        <p className="text-[15px] font-semibold text-brand">가르치는 사람들</p>
        <h2 id="faculty-title" className="h2 mt-4 max-w-[26ch] text-ink">
          학교 밖에서 문제를 풀어본 사람이
          <br />
          절반 가까이 돼요
        </h2>
        <p className="lead mt-6 max-w-[42rem]">{FACULTY.body}</p>

        <ul className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-y border-line py-8">
          {FACULTY.stats.map((stat) => (
            <li key={stat.label} className="flex items-baseline gap-2">
              <span className="t-3 font-extrabold leading-none text-ink">
                {stat.value}
                <span className="ml-0.5 text-[15px] font-bold text-ink-faint">{stat.unit}</span>
              </span>
              <span className="text-[14px] font-medium text-ink-subtle">{stat.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-2xl)] bg-line md:mt-16">
          {groups.map(({ school, stats }) => (
            <div
              key={school.slug}
              className="grid gap-4 bg-canvas-subtle px-6 py-7 md:grid-cols-[minmax(0,240px)_1fr] md:items-baseline md:gap-10 md:px-8"
            >
              <div>
                <h3 className="text-[17px] font-bold leading-[1.35] text-ink">{school.name}</h3>
                <p className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold leading-none text-brand">
                    {stats.total}
                  </span>
                  <span className="text-[13px] font-semibold text-ink-faint">명</span>
                  <span className="text-[13px] text-ink-subtle">
                    {stats.byRank.map((r) => `${r.rank} ${r.n}`).join(' · ')}
                  </span>
                </p>
              </div>

              {stats.areas.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {stats.areas.map((area) => (
                    <li
                      key={area}
                      className="rounded-[var(--radius-sm)] bg-canvas px-2.5 py-1 text-[13px] font-medium text-ink-muted"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              ) : (
                /* 인원이 적은 묶음은 연구영역만으로도 누구인지 좁혀진다. */
                <p className="text-[14px] text-ink-faint">
                  인원이 적어 연구영역은 따로 밝히지 않아요.
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-14 max-w-[46rem] text-[13px] leading-[1.7] text-ink-faint">{FACULTY.caveat}</p>
      </div>
    </section>
  )
}
