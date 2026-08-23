/**
 * Every figure here comes from docs/_extract/SOURCE_FACTS.md, which is itself
 * extracted from the university's own proposal, infographic and press release.
 * Nothing is inferred. See README.md for the per-figure source table.
 *
 * Voice: 해요체 throughout, verbs over noun stacks — the Toss UX-writing rules
 * documented in docs/TOSS_ANALYSIS.md §6.
 */

export const NAV = [
  { id: 'summary', label: '한눈에 보기' },
  { id: 'why', label: '설립 배경' },
  { id: 'adpx', label: '학사 구조' },
  { id: 'numbers', label: '규모와 인프라' },
  { id: 'apex', label: '운영 체계' },
  { id: 'roadmap', label: '추진 일정' },
]

export const HERO = {
  // This page announces the college's establishment and organises what it is —
  // it is not an admissions funnel. The news is the tier change: AI departments
  // are common, an AI *college* is not. The eyebrow carries "부산대학교" so
  // "대학" is not misread as some other university.
  badge: '부산대학교 · 2027년 3월 출범',
  headline: ['AI를 가르치는 학과가 아니라,', 'AI대학을 만듭니다'],
  sub: '세 개 단과대학에 흩어져 있던 AI 학문단위를 하나로 모읍니다. 입학정원은 424명으로, 대학은 국내 최대 규모의 AI 단과대학이라고 밝혔어요.',
  primary: { label: '한눈에 보기', href: '#summary' },
  secondary: { label: '학사 구조 살펴보기', href: '#adpx' },
}

/** The fact sheet — the "내용 정리" half of this page's job. */
export const SUMMARY = {
  eyebrow: '한눈에 보기',
  title: '부산대학교 AI대학',
  rows: [
    { k: '출범', v: '2027년 3월' },
    { k: '입학정원', v: '424명 — 대학은 국내 최대 규모라고 밝혔어요' },
    { k: '모집단위', v: 'AI컴퓨터공학부 214명 · 데이터사이언스학부·통계학과 114명 · 산업공학부 69명 · AX융합학부 27명' },
    { k: '대학이 밝힌 구성', v: '3개 학부와 17개 연계전공' },
    { k: '설계 원칙', v: 'AI 가치사슬 기반 ADP+X 집적' },
    // 원문은 「총장직속 3대 기구, AI대학+AI융합교육원+장영실AI연구원과
    // AX정보화혁신본부(대학본부)가 유기적으로 연계」다. 넷을 하나로 뭉쳐
    // 「총장 직속 4대 기구」라고 적으면 소속을 틀리게 말한다.
    // 근거: docs/EVAL_CONTENT.md, docs/_extract/ai_daehak_proposal.txt
    {
      k: '운영 체계',
      v: 'PNU-APEX — 총장 직속 3개 기구와 대학본부 AX정보화혁신본부',
      to: '/ai-college#apex',
      toLabel: '조직 체계 보기',
    },
    { k: '핵심 인프라', v: 'GPU 256장, IT관(2025.12)·경암공학관(2023.10)' },
    { k: '2027학년도 수시 원서접수', v: '2026년 9월 8일 ~ 11일' },
  ],
  note: '아래 내용은 부산대학교가 공개한 자료를 정리한 것입니다. 최종 기준은 대학의 공식 발표와 모집요강입니다.',
}

export const WHY = {
  eyebrow: '왜 만드나요',
  title: 'AI는 한 학과가\n감당할 수 있는 크기를 넘었어요',
  body: '부산대의 AI 역량은 세 개 단과대학에 나뉘어 있었어요. 그래서 교육과정을 함께 설계하기도, 장비를 함께 쓰기도 어려웠죠. AI대학은 그 경계를 없애려고 만들어요.',
  rows: [
    {
      label: '교육조직',
      before: 'AI 교육역량이 3개 단과대학에 분산돼 학과별로 따로 운영됐어요',
      after: '한 단과대학 안에서 교육과정·교원·인프라를 함께 운영해요',
    },
    {
      label: '학생 성장',
      before: '프로그램은 있었지만 진학·연구·창업으로 이어지는 길이 끊겨 있었어요',
      after: '학부 연구부터 대학원 진학까지 하나의 성장 레일로 이어져요',
    },
    {
      label: 'AI 역량',
      before: '캡스톤 교과가 전공별로 흩어져 있고, 산업 데이터를 실제로 다뤄볼 기회가 적었어요',
      after: '실제 산업·공공 데이터로 AX 캡스톤을 공동 운영해요',
    },
    {
      label: '지역 확산',
      before: 'AI 인프라를 학내에서만 소규모로 썼어요',
      after: 'AIDC 인프라를 동남권 대학·출연연과 함께 써요',
    },
  ],
}

export const ADPX = {
  eyebrow: '무엇을 배우나요',
  title: 'AI는 혼자\n굴러가지 않아요',
  /*
   * Four roles, deliberately not four ordered steps. The source defines the
   * chain as "AI(A) is built on data(D)…", so causally D comes before A while
   * the acronym reads A→D. An arrow diagram would show those two contradicting
   * each other; a list of roles claims no order at all.
   */
  body: '넷이 한 바퀴를 다 돌아야 산업 하나가 바뀌어요. 그래서 넷을 따로 두지 않고, 한 단과대학으로 묶었어요.',
  closing: '전공을 고르는 일은, 이 넷 중에 어느 쪽이 되고 싶은지 고르는 일이에요.',
  axes: [
    {
      key: 'A',
      image: 'axis_a',
      name: 'AI',
      school: 'AI컴퓨터공학부',
      seats: 214,
      person: '모델을 만드는 사람',
      role: 'AI 모델과 알고리즘, 시스템을 만들고 실제 서비스로 구현해요.',
      majors: ['컴퓨터공학', '인공지능', '인터랙티브컴퓨팅', 'AI컴퓨팅자율전공'],
    },
    {
      key: 'D',
      image: 'axis_d',
      name: 'Data',
      school: '데이터사이언스학부 · 통계학과',
      seats: 114,
      person: '그 모델이 먹을 데이터를 믿을 수 있게 만드는 사람',
      role: '데이터를 모으고 다루고 분석해요. 통계적 추론으로 결과가 믿을 만한지 검증해요.',
      majors: ['데이터사이언스', '첨단바이오공학', '통계학'],
    },
    {
      key: 'P',
      image: 'axis_p',
      name: 'Process',
      school: '산업공학부',
      seats: 69,
      person: '그걸 진짜 공정에 집어넣는 사람',
      role: '산업과 사회의 문제를 구조로 바꾸고, 프로세스를 모델링하고 최적화해요.',
      majors: ['산업공학', '산업AI'],
    },
    {
      key: 'X',
      image: 'axis_x',
      name: 'AX',
      school: 'AX융합학부',
      seats: 27,
      person: '집어넣을 현장을 계속 늘려가는 사람',
      role: 'A·D·P에서 쌓은 역량을 각 분야에 옮겨 실제 전환을 만들어요.',
      majors: ['편제 대상 15개 전공', '기존 운영 2개 연계'],
      isNew: true,
    },
  ],
}

export const CHAIN = {
  eyebrow: '배우는 방식',
  title: '하나의 문제가\n네 번 손을 바꿔요',
  intro: '예를 들어 부산항 컨테이너 하역 순서를 다시 짠다고 하면, 이렇게 흘러가요.',
  // Ordered by what actually depends on what, not by the letters. The source
  // says AI is *developed on top of* data, so data comes first here even though
  // the acronym reads A→D.
  steps: [
    { key: 'D', text: '하역 기록을 모으고, 믿을 만한 데이터인지 먼저 가려내요' },
    { key: 'A', text: '그 위에서 처리 순서를 예측하는 모델을 만들어요' },
    { key: 'P', text: '크레인 운영 순서에 실제로 집어넣어요' },
    { key: 'X', text: '같은 방법을 조선소와 공장으로 옮겨요' },
  ],
  caveat:
    '위 사례는 네 학부가 어떻게 이어지는지 보여주려고 만든 설명용 시나리오예요. 진행 중인 프로젝트가 아니에요.',
}

export const NUMBERS = {
  eyebrow: '규모',
  title: '숫자로 보면 이래요',
  items: [
    { value: '424', unit: '명', label: '입학정원', note: '대학이 밝힌 국내 최대 규모' },
    { value: '17', unit: '개', label: '연계전공', note: '학부와 함께 운영해요' },
    { value: '256', unit: '장', label: 'GPU', note: 'H100 · A100 · A6000 및 PC급' },
    { value: '300', unit: '명+', label: 'A·D·P 대학원생', note: '3개 분야 모두 BK21 수행 중' },
  ],
  faculty: {
    title: '가르치는 사람들',
    body: 'AI대학 편제 대상 교원 60명 가운데 26명은 기업이나 출연연구기관에서 일한 적이 있어요. 학교 밖에서 문제를 풀어본 사람이 절반 가까이 되는 셈이에요.',
    stats: [
      { value: '60', unit: '명', label: '편제 대상 교원' },
      { value: '43', unit: '%', label: '산업체·출연연 경력 보유' },
      { value: '10', unit: '개', label: '연구영역 분포' },
    ],
    caveat:
      '교원 정보 자료(2026-08 기준) 60건을 집계했어요. 산업체·출연연 경력은 경력 필드에 기업·연구기관 근무 이력이 명시된 경우만 셌어요. 산정 기준은 docs/FACULTY_STATS.md에 있어요.',
  },
}

export const APEX = {
  eyebrow: '운영 체계',
  title: 'AI대학 혼자 움직이지 않아요',
  body: 'PNU-APEX는 총장 직속 3개 기구와 대학본부의 AX정보화혁신본부가 함께 움직이는 실행 플랫폼이에요. 학사, 교육, 연구, 인프라가 각자 돌지 않고 같은 방향을 봐요.',
  pillars: [
    { role: '학사', name: 'AI대학', detail: '3개 학부와 17개 연계전공을 운영해요' },
    { role: '교육', name: 'AI융합교육원', detail: '전교생 대상 AI 보편교육을 맡아요' },
    { role: '연구', name: '장영실AI연구원', detail: '동남권 전략산업의 AX를 지원해요' },
    { role: '운영', name: 'AX정보화혁신본부', detail: '컴퓨팅·데이터 인프라를 운영해요 (대학본부 소속)' },
  ],
  full: 'PNU-APEX · AI·AX Platform for Education & eXecution',
}

export const PROGRAMS = {
  eyebrow: '특화 프로그램',
  title: '들어와서 무엇을 할 수 있나요',
  items: [
    {
      name: 'PNU AI특화 Pathway',
      body: '진로에 맞춰 학습 경로를 직접 설계해요. 집중수업제와 특화트랙, 학점으로 인정되는 역량패스로 운영해요.',
    },
    {
      name: 'AX1000 / 100 / 10',
      body: '창업과 연구로 이어지는 단계별 지원 프로그램이에요. 넓게 시작해서 좁고 깊게 들어가요.',
    },
    {
      name: 'AI Lab to Start-Up',
      body: 'AI 창업을 전 주기로 지원해요. 개인 창업과 연구실 단위 기술창업을 모두 다뤄요.',
    },
  ],
}

export const PARTNERS = {
  eyebrow: '함께하는 기업',
  title: '수업에 기업이 들어와요',
  body: 'IT Big-Tech 기업이 참여하는 교육과정을 운영해요.',
  names: ['NAVER Cloud', 'Google', 'AWS', 'LG U+', 'upstage'],
}

export const ROADMAP = {
  eyebrow: '앞으로',
  title: '2026년부터 2030년까지',
  steps: [
    {
      year: '2026',
      title: '설계하고 이어붙여요',
      body: '학칙과 교육과정, 정원과 경과조치안을 만들어요. 교과 매핑과 교차수강, 공동지도와 공동 PBL을 먼저 시범 운영해요.',
    },
    {
      year: '2027',
      title: '학부가 출범해요',
      body: '3월에 AI대학이 문을 열어요. AX융합학부를 승인 범위에서 운영하고, 대학원 공동교과와 교차수강을 시작해요.',
      highlight: true,
    },
    {
      year: '2028',
      title: '대학원까지 넓혀요',
      body: 'A·D 공통교과와 AX 심화교과의 학점, 공동지도를 정착시켜요. 성과가 확인된 AX 연구트랙을 전공으로 넓혀요.',
    },
    {
      year: '2029',
      title: '성과로 다시 짜요',
      body: '학생과 산업, 연구 수요에 따라 AX융합전공과 연구트랙을 새로 만들거나 합치거나 닫아요.',
    },
    {
      year: '2030',
      title: '제도로 굳혀요',
      body: '5개년 성과를 바탕으로 AI·DS·AX 세 축의 조직과 학위, 정원과 운영규정을 정착시켜요. 계약학과와 후속 공동연구도 승인 범위에서 넓혀요.',
    },
  ],
}

export const ADMISSION = {
  eyebrow: '모집 일정',
  title: '2027학년도 수시모집이\n9월에 열려요',
  period: { label: '원서접수', value: '2026년 9월 8일 ~ 11일' },
  body: '모집 요강과 전형 방법은 부산대학교 입학정보 홈페이지에서 확인할 수 있어요. 이 페이지의 숫자는 대학이 공개한 자료를 그대로 옮긴 것이고, 최종 기준은 공식 요강이에요.',
  primary: { label: '입학정보 홈페이지 열기', href: 'https://go.pusan.ac.kr' },
  secondary: { label: '부산대학교', href: 'https://www.pusan.ac.kr/' },
}
