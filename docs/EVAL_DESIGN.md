# 평가 1 — 토스 충실도 및 디자인 시스템 검증

평가 기준일: 2026-08-22. 코드 수정 없이 `docs/TOSS_ANALYSIS.md`, 관련 기획 문서, `src/` 정적 검사와 프로덕션 빌드로 교차 검증했다. 실제 토스 값은 [toss.im](https://toss.im/)의 현재 HTML이 참조하는 배포 CSS 10개(총 260,057 bytes)에서 다시 검색했다.

## 판정 요약

- **MAJOR — 토큰 명세가 “semantic token만 사용”이라고 선언했지만 구현은 raw ramp를 광범위하게 직접 사용한다.** `src/index.css:30-40`은 컴포넌트가 raw ramp를 참조하지 않는다고 명시하지만, `src/components/Hero.jsx:16-19,51-59`, `src/components/Adpx.jsx:77-83,91`, `src/components/Apex.jsx:32-34`, `src/components/Admission.jsx:9,19,30,45` 등이 `blue-*`, `gray-*`를 직접 사용한다. 팔레트 값 자체는 `TOSS_ANALYSIS.md` §1.2(`docs/TOSS_ANALYSIS.md:47-86`)와 일치하지만 운용 규칙은 지키지 않는다.
- **MAJOR — 3열 동일 카드 금지를 문서와 구현이 동시에 어긴다.** `TOSS_ANALYSIS.md` §3.2는 동일 크기 3열을 금지한다(`docs/TOSS_ANALYSIS.md:159-164`). `CONTENT_PLAN.md`도 이 패턴을 “3열 기능 카드 금지의 사촌”으로 경고한다(`docs/CONTENT_PLAN.md:225`). 그러나 프로그램은 번호+제목+본문이 동일한 카드 3개로 정확히 반복된다(`src/components/Programs.jsx:15-23`). 이는 `claude-premium-webdesign-system.md` 1단계의 명시적 금지(`claude-premium-webdesign-system.md:9-12`)와도 충돌한다.
- **MAJOR — ADP+X 탭은 WAI-ARIA Tabs 키보드 패턴을 충족하지 않는다.** 네 탭 모두 기본 `tabIndex=0`이고(`src/components/Adpx.jsx:68-96`), 방향키/Home/End 처리와 roving tabindex가 없다. 따라서 Tab 키를 네 번 눌러야 패널에 도달하며, [WAI-ARIA APG Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)의 단일 Tab stop 및 좌우 방향키 이동 요구를 위반한다. `aria-selected`, `aria-controls`, `aria-labelledby` 연결 자체는 정확하다(`src/components/Adpx.jsx:61-74,101-105`).
- **MAJOR — 핵심 파란 CTA의 일반 크기 텍스트 대비가 AA에 미달한다.** `#3182F6`/white는 3.71:1이다. 15px·17px 텍스트를 쓰는 헤더, 히어로 CTA와 활성 탭(`src/components/Header.jsx:53-56`, `src/components/Hero.jsx:51-54`, `src/components/Adpx.jsx:75-95`)은 큰 텍스트 기준도 아니므로 4.5:1이 필요하다. 색은 명세와 일치하지만 접근성까지 포함한 컴포넌트 명세로는 실패다(`docs/TOSS_ANALYSIS.md:172-184`).

## 1. 토큰·레이아웃·모션 대조

### 컬러

- **양호:** blue/gray/danger/success hex는 문서 §1.1~1.2와 구현이 정확히 맞는다(`docs/TOSS_ANALYSIS.md:28-77`, `src/index.css:9-40`). 흰색/Gray 50 중심의 큰 면과 제한적 파랑이라는 방향도 대부분 유지한다(`src/components/Hero.jsx:5-13`, `src/components/Why.jsx:6`, `src/components/Numbers.jsx:8`).
- **MAJOR:** 문서 §1.2의 “그림자보다 배경 전환과 여백” 원칙(`docs/TOSS_ANALYSIS.md:83-86`)과 달리 공통 `.card`가 모든 카드에 2중 그림자를 강제한다(`src/index.css:147-150`). Numbers의 5개 카드, Why의 4개 행, Apex의 4개 카드에 동일 그림자가 반복된다(`src/components/Numbers.jsx:17-32`, `src/components/Why.jsx:18-24`, `src/components/Apex.jsx:18-26`). 문서 §4는 그림자를 “꼭 필요한 떠 있는 레이어”에만 쓰라고 했다(`docs/TOSS_ANALYSIS.md:187-191`).
- **MINOR:** `TOSS_ANALYSIS.md`의 카드 radius 24px 규격(`docs/TOSS_ANALYSIS.md:189`)과 달리 공통 카드 radius는 20px다(`src/index.css:49-50,147-149`). 반대로 Admission은 토큰에 없는 28px를 하드코딩한다(`src/components/Admission.jsx:8`).
- **MINOR:** 장식 배지는 금지했지만 히어로의 pill 배지는 사실상 제목 내용을 반복하는 eyebrow다(`src/components/Hero.jsx:14-21`, `src/data/content.js:21-23`). 출범 시점을 압축한다는 정보 가치는 조금 있으나 점과 pill은 상태를 표현하지 않아 `TOSS_ANALYSIS.md` §4의 “장식용 남발 금지” 취지(`docs/TOSS_ANALYSIS.md:187-192`)에 약하게 위배된다. Adpx의 “신설” 배지는 실제 상태를 구분하므로 적절하다(`src/components/Adpx.jsx:109-113`).

### 타이포그래피

- **양호:** Display/H1/H2/H3/Lead의 모바일·데스크톱 끝값은 문서 §2.2와 일치한다(`docs/TOSS_ANALYSIS.md:113-128`, `src/index.css:116-145`). Pretendard 대체 선택도 재배포 위험을 피하려는 문서 권고와 맞는다(`docs/TOSS_ANALYSIS.md:104-111`, `src/index.css:42-45`).
- **MINOR:** 문서는 Lead weight 500을 명세하지만(`docs/TOSS_ANALYSIS.md:123`) `.lead`에는 font-weight가 없어 기본 400이다(`src/index.css:140-145`). Body L의 `-0.005em` 토큰도 구현되지 않고 컴포넌트마다 임의 크기/행간을 쓴다(예: `src/components/Numbers.jsx:34-35`, `src/components/Adpx.jsx:116-118`). 즉 스케일의 큰 제목만 시스템화됐다.
- **MINOR:** 문서가 한글 레이블에 uppercase/넓은 영문 자간을 쓰지 말라고 했지만(`docs/TOSS_ANALYSIS.md:130-136`), 탭 레이블은 `uppercase tracking-wide`다(`src/components/Adpx.jsx:81-86`). 실제 텍스트 앞부분은 영문 A·AI이므로 영향은 제한적이나 명세 문구와는 불일치한다.

### 레이아웃·컴포넌트

- **양호:** 1120/1280px 컨테이너, 20/32/48px gutter, 80/112/160px band는 문서 §3.2의 핵심 리듬을 거의 그대로 구현한다(`docs/TOSS_ANALYSIS.md:146-163`, `src/index.css:99-114`).
- **MINOR:** 문서는 데스크톱 기본 섹션 120px을 요구하지만 `.band`는 Tailwind `md` 구간에서 112px, `lg`에서 160px만 사용한다(`docs/TOSS_ANALYSIS.md:153-162`, `src/index.css:108-110`). 1024px 이상 모든 일반 섹션이 “핵심 전환”급 160px이 되어 페이지가 불필요하게 길어진다.
- **MAJOR:** Programs 외에도 Numbers가 4개의 동일 “숫자+라벨+설명” 카드 그리드를 반복한다(`src/components/Numbers.jsx:17-30`). 정량 비교에는 그리드가 합리적이지만, Programs까지 같은 `.card` 문법을 이어 받아 전체가 Bootstrap/SaaS 템플릿처럼 보인다. Why도 네 개 동일 카드 행(`src/components/Why.jsx:18-45`)이고 Apex도 아이콘 박스+제목+본문 카드 반복(`src/components/Apex.jsx:18-46`)이라 섹션 주제는 달라도 시각 문법은 거의 하나다.
- **MINOR:** 버튼 규격은 문서의 Primary L 56px/16px radius 대신 패딩 기반 약 56px 높이/12px radius를 쓴다(`docs/TOSS_ANALYSIS.md:170-177`, `src/components/Hero.jsx:49-59`). Header CTA는 약 40px로 Text 최소 44px에도 못 미친다(`src/components/Header.jsx:49-57`).

### 모션

- **양호:** reveal은 20px 이동, 400ms, 1회 실행이며 문서 §5의 16~24px/400ms 이내와 일치한다(`docs/TOSS_ANALYSIS.md:206-222`, `src/index.css:158-170`, `src/hooks/useReveal.js:20-32`). `prefers-reduced-motion`에서 reveal과 smooth scroll도 제거한다(`src/index.css:172-180`).
- **MINOR:** 축소 모션 대응이 reveal에만 국한된다. 모바일 메뉴 선 변형/높이 전환(`src/components/Header.jsx:68-82`)과 Admission CTA의 hover translate(`src/components/Admission.jsx:44-45`)는 reduced-motion에서도 남는다. 문서의 “영상·scrub·parallax를 끈다”는 최소 요구는 만족하지만 장식 변형 전체를 제거한 것은 아니다(`docs/TOSS_ANALYSIS.md:218-222`).

## 2. `TOSS_ANALYSIS.md` 자체 검증

- **양호:** 현재 배포 CSS에서 `#3182F6`, 제시한 blue ramp와 Gray 50~900가 모두 실제로 발견됐다. 640/768/1024/1280 min-width 및 1024/1440/1600 max-width도 확인돼 컬러·브레이크포인트 관찰은 재현 가능하다(`docs/TOSS_ANALYSIS.md:26-45,140-142`).
- **MAJOR:** 폰트 스택을 “다음 계열이 확인된다”며 불완전하게 옮겼다(`docs/TOSS_ANALYSIS.md:94-102`). 현재 CSS의 실제 스택에는 인용된 Arial 앞에 `Roboto, Helvetica Neue`가 있고 뒤에 `Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji`가 더 있다. 문서가 축약임을 밝히지 않아 “실제 폴백” 명세로는 틀리다. 또한 `Tossface`가 본문 스택 중간에 있어도 실제 일반 글리프 제공 범위·fallback 동작을 검증하지 않고 “일반 본문용이 아니다”만 서술한다(`docs/TOSS_ANALYSIS.md:104`).
- **MAJOR:** 문서 §2.2의 44/48/56/64px, §4의 6/8/10/12/16/20px 분포, 버튼 높이·padding·radius, §5의 easing 값은 각각 구체 숫자지만 해당 CSS asset URL/selector/캡처나 추출 절차가 없다(`docs/TOSS_ANALYSIS.md:113-128,168-200,202-216`). §0은 “배포 CSS에서 직접 확인”했다고만 하고(`docs/TOSS_ANALYSIS.md:7-13`) 재현 가능한 근거를 남기지 않았다. 값 일부가 현재도 관찰된다는 사실과, 그 값이 토스의 일반 디자인 원칙이라는 주장은 별개다.
- **MINOR:** “현재 toss.im CSS에는 640/768/1024/1280px min-width”는 맞지만 이를 프로젝트의 Desktop/Tablet/Mobile grid로 이어가는 12/8/4열 규격은 실사이트 증거가 아니라 적용 권고다(`docs/TOSS_ANALYSIS.md:140-164`). 문서가 §3.2 제목으로 구분은 했으나 표 바로 뒤 문장이어서 독자가 실측 grid로 오인할 여지가 있다.
- **MINOR:** `TOSS_ANALYSIS.md` 조사일이 2026-08-22로 미래 배포 상태를 단정하고(`docs/TOSS_ANALYSIS.md:3,12`), 고정 asset URL 또는 스냅샷이 없다. 페이지 배포가 바뀌면 hex 존재 여부를 재검증할 수 있어도 “그날의 CSS”를 감사할 수 없다.

## 3. 접근성

- **BLOCKER — 색 대비:** `#3182F6`/white 3.71:1 문제는 주요 CTA와 선택 탭 전반에 걸쳐 있다(`src/components/Header.jsx:53-56`, `src/components/Hero.jsx:51-54`, `src/components/Adpx.jsx:75-95`). 더구나 활성 탭의 보조 텍스트 `#C9E2FF`/`#3182F6`는 2.80:1이다(`src/components/Adpx.jsx:81-94`). Admission의 `#E8F3FF`/brand도 3.31:1이다(`src/components/Admission.jsx:27-32`). 핵심 정보와 조작 상태가 WCAG AA를 반복적으로 실패하므로 공개 전 차단 항목이다.
- **MAJOR — 약한 보조 텍스트:** `#8B95A1`/white는 3.04:1, Gray 50에서는 2.91:1이다. 12~15px로 쓰이는 Why “지금”, 비활성 탭 상단, Apex 영문 풀네임, Footer 면책 문구가 AA 미달이다(`src/components/Why.jsx:29-33`, `src/components/Adpx.jsx:81-84`, `src/components/Apex.jsx:48-50`, `src/components/Footer.jsx:30-44`). 장식이 아닌 정보이므로 제외할 수 없다.
- **MAJOR — 탭 키보드:** 위 판정 요약과 같이 방향키/Home/End 및 roving tabindex가 없고, 자동/수동 활성화 정책도 없다(`src/components/Adpx.jsx:60-99`). 패널이 자동 선택된 탭의 내용을 즉시 보이므로 자동 활성화 패턴을 택할 수 있지만 키보드 구현은 필수다.
- **MINOR — 포커스:** 전역 `:focus-visible` 링은 제공되어 기본적인 가시성은 있다(`src/index.css:82-86`). 다만 `outline-offset`은 문서 2px이 아니라 3px이고(`docs/TOSS_ANALYSIS.md:181-184`), 메뉴가 열릴 때 포커스를 메뉴 내부로 이동시키거나 Escape로 닫고 닫힌 뒤 버튼으로 복원하는 처리가 없다(`src/components/Header.jsx:60-106`). 메뉴는 modal role이 아니므로 포커스 trap까지 필수는 아니지만 키보드 완결성은 낮다.
- **MINOR — 스킵 링크 목적지:** “본문으로 건너뛰기”가 `<main>` 자체가 아니라 첫 번째 Why 섹션으로 가서 Hero의 핵심 입학 정보까지 건너뛴다(`src/App.jsx:19-30`). 이름과 실제 목적지가 어긋난다.

## 4. 성능과 로딩 안정성

- **양호:** `npm run build` 결과 JS 171.28 kB(54.65 kB gzip), CSS 35.48 kB(7.01 kB gzip), HTML 1.41 kB(0.80 kB gzip)다. Three.js/GSAP/이미지가 없고 의존성도 React뿐이라 초기 번들은 이 규모의 단일 랜딩으로 무겁지 않다(`package.json:13-18`).
- **MAJOR — 폰트 공급망/FOUT·CLS:** Pretendard CSS를 jsDelivr에서 render-blocking으로 불러오며(`index.html:14-19`), 자체 호스팅·preload·무결성·fallback metric 보정(`size-adjust`, ascent/descent override)이 없다. CDN 지연/차단 시 시스템 폰트로 먼저 그려진 뒤 Variable font로 바뀌어 FOUT와 한글 줄바꿈/헤드라인 높이 변화가 생길 수 있다. `word-break: keep-all`(`src/index.css:68-75`) 때문에 폰트 폭 변화가 개행 변화로 증폭될 수 있다.
- **MINOR — reveal 초기 비가시성:** 모든 `[data-reveal]`은 CSS에서 즉시 opacity 0이 되고 JS effect가 실행된 뒤에야 observer가 붙는다(`src/index.css:153-169`, `src/hooks/useReveal.js:10-33`). 주석은 no-JS fallback을 주장하지만(`src/index.css:153-156`) 실제 no-JS 시 `[data-shown]`을 붙일 주체가 없어 콘텐츠가 영구히 숨는다. 성능 저하나 JS 오류 시 빈 섹션으로 보이는 점진적 향상 실패다.
- **MINOR — 잠재 CLS는 낮지만 0은 아니다:** 이미지·비디오가 없어 미디어 치수 누락 CLS는 없다. 다만 위 원격 폰트 교체와 모바일 메뉴 `max-height` 확장은 레이아웃/시각 이동을 만든다(`src/components/Header.jsx:80-106`). 헤더가 fixed라 본문 CLS는 제한적이다.

## 5. 다른 에이전트 산출물 교차평가

- **MAJOR — `TOSS_ANALYSIS.md`의 자체 오류:** 실제 폰트 스택 누락과 구체 수치의 selector/asset 근거 부재는 위 §2와 같다(`docs/TOSS_ANALYSIS.md:94-128,168-216`). 특히 “실사이트 관찰값”과 “프로젝트 권고”의 경계는 컬러에서는 명확하지만 버튼·모션에서는 섞여 있다.
- **MAJOR — `CONTENT_PLAN.md`와 구현 사이의 핵심 인계 실패:** 문서는 정보구조 10개 섹션과 FAQ/졸업 이후를 설계하고(`docs/CONTENT_PLAN.md:122-140,464-522`), 최종 CTA는 하나만 두라고 명시한다(`docs/CONTENT_PLAN.md:522-536`). 구현은 FAQ·졸업 이후가 없고 Admission에 외부 CTA 두 개가 있다(`src/App.jsx:28-38`, `src/components/Admission.jsx:35-58`). 디자인 평가 관점에서도 “한 화면 한 액션” 원칙을 깨며, 기획 산출물이 실제 구현 기준으로 잠기지 않았다.
- **MINOR — `FACULTY_STATS.md` 표현을 구현이 과장한다:** 통계 문서는 26명이 명시적 근무 이력을 가진다는 사실만 보장하고 전체 교수진으로 일반화하지 말라고 한다(`docs/FACULTY_STATS.md:90-105`). 구현 카피는 “현장에서 쓰이던 방법을 그대로 가져와요”라고 26명의 경력이 교육 내용으로 그대로 이전된다고 단정한다(`src/data/content.js:131-140`). 통계가 증명하지 않는 효익이다.

## 점수 및 총평

**6.1 / 10**

토스의 컬러 램프, 큰 여백, 읽기 쉬운 문장, 절제된 reveal을 꽤 정확하게 옮겼고 번들도 가볍다. 그러나 결과물은 공통 `.card`를 Why·Numbers·Apex·Programs에 반복해 다른 종류의 AI slop인 “밝은 SaaS 카드 랜딩”으로 수렴했고, 문서가 금지한 정확한 3열 카드까지 남았다. 더 심각한 문제는 브랜드 파랑 위 작은 흰색/연한 파랑 텍스트의 반복적 AA 실패와 불완전한 ARIA 탭 키보드 구현이다. `TOSS_ANALYSIS.md` 역시 색·브레이크포인트는 재현되지만 실제 폰트 스택을 축약하고 정밀 토큰의 selector/asset 근거를 남기지 않아 역설계 감사 문서로는 불충분하다. 공개 전에는 대비와 탭을 우선 차단 이슈로 보고, 카드 문법을 리스트·서사형 레이아웃으로 분산한 뒤 원격 폰트의 로딩 안정성을 보강해야 한다.
