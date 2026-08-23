import faculty from './faculty.json'

/**
 * The five academic units that move into AI대학 in March 2027.
 *
 * `deptKeys` maps each unit to how its members are labelled in the faculty
 * spreadsheet — the sheet still uses the *current* department names for some
 * rows and the *future* AI대학 names for others, so the mapping is explicit
 * rather than inferred from a single field.
 */
export const SCHOOLS = [
  {
    slug: 'ai-computer',
    axis: 'A',
    axisName: 'AI',
    name: 'AI컴퓨터공학부',
    from: '정보의생명공학대학 정보컴퓨터공학부',
    seats: 214,
    role: 'AI 모델과 알고리즘, 시스템을 만들고 실제 서비스로 구현해요.',
    majors: ['컴퓨터공학', '인공지능', '인터랙티브컴퓨팅', 'AI컴퓨팅자율전공'],
    change: '정보컴퓨터공학부가 AI대학으로 소속을 옮기면서 AI컴퓨터공학부로 개편돼요.',
    deptKeys: ['정보컴퓨터공학부', 'AI컴퓨터공학부 (인터랙티브컴퓨팅전공)'],
    image: 'axis_a',
  },
  {
    slug: 'data-science',
    axis: 'D',
    axisName: 'Data',
    name: '데이터사이언스학부',
    from: '의생명융합공학부 데이터사이언스전공 · 첨단바이오공학전공',
    seats: null, // 통계학과와 합쳐 D축 114명 — 학부 단독 정원은 원문에 없음
    role: '데이터를 모으고 다루고 분석해요. 결과가 믿을 만한지 검증하는 일까지 포함해요.',
    majors: ['데이터사이언스', '첨단바이오공학'],
    change: '두 전공이 독립 학부로 승격해 AI대학에 편제돼요.',
    deptKeys: ['데이터사이언스학부'],
    image: 'axis_d',
  },
  {
    slug: 'statistics',
    axis: 'D',
    axisName: 'Data',
    name: '통계학과',
    from: '자연과학대학 통계학과',
    seats: null,
    role: '통계적 추론으로 데이터가 말하는 것과 말하지 않는 것을 가려내요.',
    majors: ['통계학'],
    change: '자연과학대학에서 AI대학으로 소속이 이전돼요.',
    deptKeys: ['통계학과'],
    image: 'data_wall_v',
  },
  {
    slug: 'industrial',
    axis: 'P',
    axisName: 'Process',
    name: '산업공학부',
    from: '공과대학 산업공학과',
    seats: 69,
    role: '산업과 사회의 문제를 구조로 바꾸고, 프로세스를 모델링하고 최적화해요.',
    majors: ['산업공학', '산업AI'],
    change: '공과대학에서 소속을 옮기면서 산업공학전공과 산업AI전공으로 나뉘어요.',
    deptKeys: ['산업공학부'],
    image: 'axis_p',
  },
  {
    slug: 'ax',
    axis: 'X',
    axisName: 'AX',
    name: 'AX융합학부',
    from: '신설 — 지금은 융합전공이 단과대학별로 흩어져 있어요',
    seats: 27,
    role: 'A·D·P에서 쌓은 역량을 각 분야로 옮겨 실제 전환을 만들어요.',
    majors: ['편제 대상 15개 전공', '기존 운영 2개 연계'],
    change: '완전히 새로 만드는 학부예요. 편제 대상 15개 전공과 기존 운영 2개를 연계해요.',
    deptKeys: ['AX융합학부'],
    isNew: true,
    image: 'axis_x',
  },
]

/** D축 정원은 데이터사이언스학부와 통계학과를 합친 값으로만 공개돼 있다. */
export const D_AXIS_SEATS = 114

export const facultyOf = (school) =>
  faculty.filter((p) => school.deptKeys.includes(p.dept))

export const bySlug = (slug) => SCHOOLS.find((s) => s.slug === slug)

/*
 * ── 교원 정보를 집계로만 내보내는 이유 ────────────────────────────────────
 *
 * faculty.json 의 원본은 대학 내부 교원정보 파일이다. 그 파일을 정리한
 * docs/_extract/SOURCE_FACTS.md 가 직접 이렇게 적어뒀다.
 *
 *   "개인 신상이므로 사이트에는 집계 통계로만 사용할 것. 개별 교수 이름·경력을
 *    공개 페이지에 싣는 것은 별도 동의가 필요하다."
 *
 * docs/EVAL_CONTENT.md 는 한 걸음 더 나가 실명 + 소속 + 직급 + 세부전공의
 * 4중 조합이 동명이인까지 갈라내는 재식별 키가 된다고 짚었고,
 * docs/EVAL_GROK.md 는 이 항목을 제출 전 최소 수정 1번으로 올렸다.
 * 저장소 어디에도 공개 동의 기록은 없다.
 *
 * 그래서 이름·개별 경력은 화면에 내보내지 않고 집계만 낸다. 대학 담당 부서의
 * 명시적 공개 동의를 확보하면 아래 상수 하나만 true 로 돌리면 된다 —
 * faculty.json 도 facultyOf 도 그대로 남겨뒀다.
 */
export const FACULTY_NAMES_PUBLIC = false

const RANKS = ['교수', '부교수', '조교수']

/** 사람 수가 적은 묶음은 연구영역만으로도 누구인지 좁혀진다. 다섯 미만은 감춘다. */
const AREA_MIN = 5

export const facultyStats = (school) => {
  const people = facultyOf(school)
  const byRank = RANKS.map((rank) => ({ rank, n: people.filter((p) => p.rank === rank).length })).filter(
    (r) => r.n > 0,
  )

  const tally = new Map()
  for (const person of people) {
    for (const raw of String(person.major ?? '').split(/[,·/]/)) {
      const area = raw.trim().replace(/\(.*\)/, '').trim()
      if (area.length < 2) continue
      tally.set(area, (tally.get(area) ?? 0) + 1)
    }
  }
  const areas =
    people.length >= AREA_MIN
      ? [...tally].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko')).slice(0, 8).map(([a]) => a)
      : []

  return { total: people.length, byRank, areas }
}
