/**
 * Per-unit detail gathered from each department's own official page and
 * adversarially verified (see docs/DEPT_RESEARCH.js.txt for the raw synthesis
 * and every rejected claim).
 *
 * Two rules were applied when the sources disagreed:
 *
 * 1. Numbers and unit names come from the university's own 2026-08 press
 *    release and proposal (docs/_extract/SOURCE_FACTS.md). Earlier campus-paper
 *    reporting from 2026-03 described a different draft — "AI컴퓨팅학부",
 *    347명, AX with no intake — which the August release supersedes.
 * 2. Anything a department claims about itself that its own site contradicts is
 *    dropped. 정보컴퓨터공학부's "졸업생 90% 이상 진로 확정" is excluded for
 *    exactly this reason: the same site's chart shows 2023 취업 57.6%.
 *
 * `careers` is empty where no department-published list exists. That is a
 * finding, not an omission — inventing a plausible one was the failure mode the
 * verification pass was there to catch.
 */
export const DEPT_INFO = {
  'ai-computer': {
    intro:
      '컴퓨터 시스템과 소프트웨어를 설계하고 구현하는 데 필요한 전공 지식과 실무 능력을 다뤄요. 자연과학대학 전자계산학과와 공과대학 컴퓨터공학과를 통합해 1999년에 정보컴퓨터공학부로 출범했고, 2020년부터 정보의생명공학대학 소속으로 운영되고 있어요.',
    fields: [
      '컴퓨터공학 기초 — 자료구조·알고리즘·운영체제',
      '인공지능·기계학습 — 머신러닝·딥러닝·강화학습',
      '자연어처리',
      '컴퓨터비전·영상처리',
      '컴퓨터그래픽스·확장현실(XR)',
      '데이터베이스·데이터과학',
      '컴퓨터네트워크·분산 컴퓨팅',
      '정보보안',
      '소프트웨어공학·임베디드시스템',
    ],
    careers: [],
    established:
      '1979년 전자계산학과(자연과학대학)와 1985년 컴퓨터공학과(공과대학)로 출발해, 1999년 두 학과를 통합한 정보컴퓨터공학부가 됐어요. 2006년 전자전기정보컴퓨터공학부에서 분리되고 2015년 전기컴퓨터공학부로 합쳐졌다가, 2020년 다시 분리되어 정보의생명공학대학 정보컴퓨터공학부가 됐어요.',
    sources: [
      'https://cse.pusan.ac.kr/cse/14207/subview.do',
      'https://cse.pusan.ac.kr/cse/14208/subview.do',
    ],
    note: '졸업 후 진로는 학부가 공표한 목록이 없어 싣지 않았어요. 진로현황 페이지는 연도별 취업률·진학률 그래프만 제공해요.',
  },

  'data-science': {
    intro:
      '의생명 분야를 전문으로 다루는 데이터사이언스 인력을 기르는 것을 목표로 해요. 1학년 때 수학·물리·프로그래밍·생물·화학 같은 기초를 배우고, 이후 진학할 전공을 선택하는 구조예요. 지금은 의생명융합공학부 데이터사이언스전공으로 운영되고 있고, 학부 공지에 따르면 2027학년도에 첨단바이오공학전공과 함께 AI대학 데이터사이언스학부로 옮겨 가요.',
    fields: [
      '기계학습·인공지능',
      'AI 프로그래밍·강화학습',
      '통계학·회귀분석·생존자료 분석',
      '생명정보학·의생명정보학',
      '생체신호처리·시계열 데이터 분석',
      '의료영상 처리 및 의료영상기기',
      '데이터베이스·자료구조·알고리즘',
      '데이터사이언스 수학·최적화',
    ],
    careers: [],
    established:
      '2020년 3월 의생명융합공학부가 신설됐어요. 같은 해 정보의생명공학대학이 공과대학에서 분리되어 출범했고, 9월에는 대학원 정보융합공학과 석·박사과정이 생겼어요. 2022년 차세대바이오헬스산업 혁신인재양성사업에 선정됐고, 2023년 9월 경암공학관 준공과 함께 학부가 이전했어요.',
    sources: [
      'https://bce.pusan.ac.kr/bce/4997/subview.do',
      'https://bce.pusan.ac.kr/bce/5023/subview.do',
    ],
    note: '이름이 비슷한 데이터사이언스전문대학원(ds.pusan.ac.kr)은 조직이 다른 별개 기관이에요.',
  },

  statistics: {
    intro:
      '자료를 조사·수집하는 방법과 수집된 자료를 분석하는 기법을 다뤄요. 수리통계학·확률론 같은 이론 과목과 회귀분석·시계열분석·데이터마이닝 같은 자료분석 과목, 그리고 통계 프로그래밍 실습을 함께 배워요. 통계 이론과 자료분석 능력을 같이 갖춘 전문가를 기르는 것이 교육목표예요.',
    fields: [
      '수리통계학·확률론',
      '회귀분석·다변량통계학',
      '시계열분석',
      '표본조사론·실험계획법',
      '베이지안통계학·비모수통계학',
      '데이터마이닝·빅데이터 통계분석',
      '생물통계학·생존분석',
      '통계 프로그래밍·통계패키지 실습',
    ],
    careers: [
      '은행·보험 등 금융기관',
      '통계청 등 공공기관·공기업',
      'IT 기업의 데이터 직군',
      '컨설팅·AI 개발 기업',
      '제조 대기업',
      '교육기관',
      '국내외 대학원 진학',
    ],
    established:
      '1979년 계산통계학과로 신설되어 1984년 전산통계학과로 바뀌었고, 1988년 통계학과와 전자계산학과로 분리 신설됐어요. 1996년 자연과학부 통계학전공, 1999년 수학통계학부 통계학전공으로 모집단위가 바뀌었다가 2009년 다시 통계학과가 됐어요. 대학원 석·박사과정을 함께 운영해요.',
    sources: [
      'https://stat.pusan.ac.kr/stat/4221/subview.do',
      'https://stat.pusan.ac.kr/stat/4796/subview.do',
    ],
    note: '진로 목록은 학과가 공개한 2018~2022년 진로현황 표에 실제로 적힌 취업처를 분야 단위로 정리한 거예요.',
  },

  industrial: {
    intro:
      '사람·설비·자재·정보·자금이 얽힌 산업 시스템을 어떻게 설계하고 운영하고 개선할지를 다뤄요. 수리적 모델링과 최적화, 통계 분석, 시뮬레이션, 데이터 기반 의사결정을 도구로 삼아 제조 현장뿐 아니라 물류·서비스·정보시스템 분야의 문제를 함께 다뤄요.',
    fields: [
      '생산·제조시스템 설계 및 운영',
      '물류·공급사슬 관리',
      '최적화 및 수리계획법',
      '응용통계 및 데이터 분석',
      '산업인공지능·머신러닝 응용',
      '시뮬레이션 및 리스크 분석',
      '인간공학과 제품·작업장 설계',
      '스마트팩토리 및 제조데이터 분석',
    ],
    careers: [
      '제조기업의 생산·공정·품질 관리',
      '물류·유통기업의 공급사슬 관리',
      'IT 기업의 정보시스템·데이터 분석',
      '기업의 기획·연구개발·원가관리',
      '금융기관 및 컨설팅',
      '대학원 진학 및 연구소·학계',
    ],
    established:
      '1985년 3월 공과대학 산업공학과로 신설됐어요. 1988년 산업대학원 산업공학 전공, 1989년 대학원 석사과정, 1991년 박사과정이 개설됐고, 1994년 특성화공학관으로 이전했어요. 2020년에는 대학원 산업데이터공학융합전공이 신설됐어요.',
    sources: [
      'https://ie.pusan.ac.kr/ie/5833/subview.do',
      'https://ie.pusan.ac.kr/ie/5834/subview.do',
    ],
  },

  ax: {
    intro:
      'A·D·P에서 쌓은 역량을 각 분야로 옮기는 역할을 맡는 신설 학부예요. 편제 대상 15개 전공과 기존에 운영하던 2개 전공을 연계해 구성해요. 완전히 새로 만드는 조직이라 아직 전용 홈페이지나 학과 안내가 없어요.',
    fields: ['편제 대상 융합전공 15개', '기존 운영 융합전공 2개 연계'],
    careers: [],
    established:
      '2027년 3월 AI대학 출범과 함께 신설돼요. 학부·학과 편제와 정원은 관련 위원회 심의와 학칙 제·개정을 거쳐 확정돼요.',
    sources: [],
    note: '이 학부에 대한 공개 정보는 대학이 배포한 자료가 사실상 전부예요. 구성과 운영 방식은 확정 과정에서 달라질 수 있어요.',
  },
}
