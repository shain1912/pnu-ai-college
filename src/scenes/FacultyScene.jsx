import { NUMBERS } from '../data/content'
import { SCHOOLS, facultyOf } from '../data/schools'

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
 * 그래서 **이름을 그대로 벽처럼 편다.** 60명을 학부별로 묶어 촘촘한 격자에
 * 넣는다. 숫자 60 을 쓰는 것보다 이름 60 개가 놓인 화면이 더 강한 증거다.
 * 지면 전체가 글자인 화면은 이 페이지에 아직 없다.
 *
 * 세 숫자(60 / 43% / 10)를 위에 두되 424 화면처럼 크게 키우지 않았다. 이
 * 절의 주인공은 숫자가 아니라 이름이다.
 * ────────────────────────────────────────────────────────────────────────
 */

const FACULTY = NUMBERS.faculty

export default function FacultyScene() {
  const groups = SCHOOLS.map((school) => ({ school, people: facultyOf(school) })).filter(
    (group) => group.people.length > 0,
  )

  return (
    <section id="faculty" className="band scroll-mt-24 bg-canvas-subtle" aria-labelledby="faculty-title">
      <div className="edge">
        <p className="text-[15px] font-semibold text-brand">가르치는 사람들</p>
        <h2 id="faculty-title" className="h2 mt-4 max-w-[20ch] text-ink">
          학교 밖에서 문제를 풀어본 사람이
          <br />
          절반 가까이 돼요
        </h2>
        <p className="lead mt-6 max-w-[42rem]">{FACULTY.body}</p>

        <ul className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-y border-line py-8">
          {FACULTY.stats.map((stat) => (
            <li key={stat.label} className="flex items-baseline gap-2">
              <span className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-none tracking-[-0.02em] text-ink">
                {stat.value}
                <span className="ml-0.5 text-[15px] font-bold text-ink-faint">{stat.unit}</span>
              </span>
              <span className="text-[14px] font-medium text-ink-subtle">{stat.label}</span>
            </li>
          ))}
        </ul>

        {/*
         * 이름 벽. 학부마다 제목을 두고 그 아래로 이름을 흘린다. 이름과 전공을
         * 한 칸에 넣되 전공은 한 줄로 잘라 격자가 들쭉날쭉해지지 않게 한다.
         */}
        <div className="mt-14 grid gap-10 md:mt-16 md:gap-12">
          {groups.map(({ school, people }) => (
            <div key={school.slug} className="grid gap-4 md:grid-cols-[minmax(0,200px)_1fr] md:gap-10">
              <h3 className="text-[15px] font-bold leading-[1.4] text-ink">
                {school.name}
                <span className="ml-2 font-semibold text-ink-faint">{people.length}</span>
              </h3>

              <ul className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((person) => (
                  <li key={person.no} className="min-w-0">
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-[15px] font-bold text-ink">{person.name}</span>
                      <span className="text-[12px] font-medium text-ink-faint">{person.rank}</span>
                    </p>
                    <p className="truncate text-[13px] leading-[1.5] text-ink-subtle" title={person.major}>
                      {person.major}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 max-w-[46rem] text-[13px] leading-[1.7] text-ink-faint">{FACULTY.caveat}</p>
      </div>
    </section>
  )
}
