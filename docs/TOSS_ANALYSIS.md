# toss.im 디자인 언어 역설계

> 조사일: 2026-08-22 (KST)  
> 목적: 부산대학교 AI대학 랜딩페이지를 토스의 시각·언어 원칙에 맞게 재설계하기 위한 실행 명세  
> 사실 기준: 대학 관련 사실과 수치는 [`docs/_extract/SOURCE_FACTS.md`](./_extract/SOURCE_FACTS.md)만 사용한다.

## 0. 조사 방법과 신뢰도

이 문서는 세 종류의 근거를 구분한다.

- **공개 명시**: 토스가 공개 문서에서 직접 설명한 원칙.
- **실사이트 관찰**: 2026-08-22의 `https://toss.im/` HTML 및 배포 CSS에서 직접 확인한 값. 배포 개편으로 바뀔 수 있다.
- **적용 권고**: 위 근거를 부산대학교 AI대학 랜딩페이지에 맞게 번역한 토큰. 토스 내부 TDS의 공식 토큰이라고 주장하지 않는다.

주요 근거:

- 토스 홈: https://toss.im/
- TDS 컴포넌트 설계: https://toss.tech/article/toss-design-system
- 토스 브랜드 리서치: https://toss.tech/article/43061
- 앱인토스 UX 라이팅: https://developers-apps-in-toss.toss.im/design/ux-writing.html
- 토스 UX Writer 인터뷰: https://toss.im/tossfeed/article/uxwriter-interview
- 토스페이스: https://toss.im/tossface

## 1. 컬러

### 1.1 공개·실사이트 확인값

2026-08-22 toss.im 배포 CSS에서 가장 빈번한 브랜드 컬러는 `#3182F6`이다. 함께 확인되는 블루 단계는 `#E8F3FF`, `#C9E2FF`, `#90C2FF`, `#64A8FF`, `#3182F6`, `#2272EB`, `#1B64DA`다. 토스 브랜드 리서치는 토스의 인지 자산을 파랑 단독이 아니라 **흰 배경 + 파란 로고 + 검정 글자**의 조합으로 설명한다. 즉, 파랑을 넓은 면에 칠하는 것보다 흰 여백 속 제한된 강조색으로 쓰는 편이 더 토스답다.

실사이트 CSS에서 확인한 핵심 그레이는 아래와 같다.

| 역할 | 값 | 근거/용도 |
|---|---:|---|
| Gray 50 | `#F9FAFB` | 가장 옅은 배경 |
| Gray 100 | `#F2F4F6` | 섹션·카드 배경 |
| Gray 200 | `#E5E8EB` | 구분선·비활성 면 |
| Gray 300 | `#D1D6DB` | 강한 구분선 |
| Gray 400 | `#B0B8C1` | 비활성 요소 |
| Gray 500 | `#8B95A1` | 보조 텍스트 |
| Gray 600 | `#6B7684` | 본문 보조 텍스트 |
| Gray 700 | `#4E5968` | 본문 텍스트 |
| Gray 800 | `#333D4B` | 제목 텍스트 |
| Gray 900 | `#191F28` | 최강조 텍스트 |

위 램프는 TDS 전체 공식 팔레트를 복제했다는 뜻이 아니라, 현재 toss.im CSS에서 확인한 단계다. 오류 계열은 `#F04452`, 성공 계열은 `#03B26C`/`#029359`가 관찰된다.

### 1.2 프로젝트용 실행 토큰

```css
:root {
  --color-blue-50:  #e8f3ff;
  --color-blue-100: #c9e2ff;
  --color-blue-300: #90c2ff;
  --color-blue-500: #3182f6;
  --color-blue-600: #2272eb;
  --color-blue-700: #1b64da;

  --color-gray-50:  #f9fafb;
  --color-gray-100: #f2f4f6;
  --color-gray-200: #e5e8eb;
  --color-gray-300: #d1d6db;
  --color-gray-400: #b0b8c1;
  --color-gray-500: #8b95a1;
  --color-gray-600: #6b7684;
  --color-gray-700: #4e5968;
  --color-gray-800: #333d4b;
  --color-gray-900: #191f28;

  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --color-surface: #ffffff;
  --color-text-strong: #191f28;
  --color-text: #333d4b;
  --color-text-subtle: #6b7684;
  --color-text-disabled: #b0b8c1;
  --color-border: #e5e8eb;
  --color-focus: #3182f6;
}
```

운용 규칙:

1. 전체 면적의 75% 이상은 흰색/Gray 50으로 둔다.
2. 블루는 CTA, 링크, 핵심 숫자, 선택 상태에만 쓴다. 한 뷰포트에서 강한 블루 면은 하나만 둔다.
3. 본문은 순검정 `#000` 대신 `#333D4B`, 제목은 `#191F28`을 쓴다.
4. 섹션 구분은 그림자보다 `#F2F4F6` 배경 전환과 여백으로 만든다.

### 1.3 다크모드

토스 공개 TDS 글은 다크모드용 팔레트를 만들고 밝은 팔레트와 **1:1 자동 대응**시키는 방식을 설명한다. 따라서 토스 제품은 다크모드를 고려하지만, 현재 toss.im 브랜드 홈의 대표 인상은 라이트 테마다. 대학 랜딩페이지의 1차 버전은 라이트를 기본으로 고정하고, 다크모드를 제공한다면 별도 의미 토큰으로만 추가한다. 현재의 상시 다크 시네마틱 배경을 토스 스타일이라고 부르면 안 된다.

## 2. 타이포그래피

### 2.1 실제 서체와 폴백

현재 toss.im CSS에서 다음 계열이 확인된다.

```css
font-family: "Toss Product Sans", Tossface, -apple-system,
  BlinkMacSystemFont, "Bazier Square", "Noto Sans KR", "Segoe UI",
  "Apple SD Gothic Neo", Arial, sans-serif;
```

다른 규칙에는 `Toss Product Sans OTF`도 사용된다. `Tossface`는 일반 본문용 한글 서체가 아니라 3,600개 이모지로 만든 폰트다. 토스페이스 페이지는 단순한 기본 도형, 작은 크기에서도 명료한 묘사, 균등한 시각 크기, 밝고 어두운 배경 모두에 대응하는 단일 팔레트를 원칙으로 밝힌다.

Toss Product Sans의 외부 사이트 재배포·사용 권한을 확인하지 않은 상태에서 파일을 복제하면 안 된다. 이 프로젝트의 안전한 기본값은 다음이다.

```css
--font-sans: "Pretendard Variable", Pretendard, -apple-system,
  BlinkMacSystemFont, "Noto Sans KR", "Segoe UI", sans-serif;
```

### 2.2 프로젝트용 타입 스케일

현재 toss.im CSS의 대표 반응형 대형 타이틀 단계로 44/48/56/64px가 관찰된다. 이를 대학 페이지에 적용 가능한 체계로 정리하면 다음과 같다.

| 토큰 | Desktop | Mobile | Weight | Line-height | Letter-spacing |
|---|---:|---:|---:|---:|---:|
| Display | 64px | 40px | 700 | 1.12 | -0.03em |
| H1 | 52px | 36px | 700 | 1.18 | -0.025em |
| H2 | 40px | 30px | 700 | 1.25 | -0.02em |
| H3 | 28px | 24px | 700 | 1.32 | -0.015em |
| Lead | 22px | 19px | 500 | 1.55 | -0.01em |
| Body L | 18px | 17px | 400 | 1.65 | -0.005em |
| Body | 16px | 16px | 400 | 1.6 | 0 |
| Caption | 14px | 14px | 500 | 1.45 | 0 |

이는 **프로젝트 권고 스케일**이다. 토스 내부 TDS의 공식 전체 타입 토큰이라는 뜻이 아니다.

한글 대형 타이틀 규칙:

- 2~3행 이내, 한 행 10~18자 정도로 의미 단위 개행한다.
- 영문처럼 극단적인 자간 축소를 하지 않는다. `-0.03em`보다 좁히지 않는다.
- 명사구를 길게 쌓기보다 동사가 있는 짧은 문장을 쓴다.
- 강조는 컬러 여러 개가 아니라 weight와 행 분리로 만든다.
- `uppercase`, 모노스페이스, 넓은 영문 자간을 한글 섹션 레이블에 쓰지 않는다.

## 3. 레이아웃

### 3.1 실사이트 관찰

현재 toss.im CSS에는 640/768/1024/1280px의 `min-width` 브레이크포인트가 있고, 1024/1440/1600px 이하에서 내비게이션 좌우 패딩이 각각 48/108/128px로 바뀌는 규칙이 관찰된다. 최대 폭으로 1120px, 1920px 등이 용도별로 존재한다. 따라서 ‘토스 컨테이너는 항상 단일 고정 폭’이라고 단정하는 것은 부정확하다. 콘텐츠 성격에 따라 폭을 달리하되, 큰 좌우 여백과 선명한 정렬축을 유지하는 방식이다.

### 3.2 프로젝트용 그리드와 리듬

```css
--container-copy: 1120px;
--container-wide: 1280px;
--gutter-desktop: 48px;
--gutter-tablet: 32px;
--gutter-mobile: 20px;

--section-y-xl: 160px;
--section-y-lg: 120px;
--section-y-md: 96px;
--section-y-mobile: 80px;
```

- Desktop(≥1024): 12열, gutter 24px. 본문은 7~8열, 비주얼은 나머지 4~5열.
- Tablet(768~1023): 8열, gutter 20px.
- Mobile(<768): 4열, gutter 16px, 좌우 20px.
- 섹션 기본 간격은 desktop 120px, 핵심 전환 섹션 160px, mobile 80px.
- 헤드라인과 본문 24px, 본문과 CTA 32px, 섹션 제목과 콘텐츠 48~64px.
- 카드 3개를 동일 크기 3열로 기계적으로 나열하지 않는다. 데이터 구조에 따라 2열, 리스트, 강조 1 + 보조 2를 선택한다.

## 4. 컴포넌트

공개 TDS 글은 컴포넌트를 다양한 문장 길이·화면·큰 글씨·VoiceOver까지 패턴화하고, 터치 시 배경을 한 단계 진하게 하며, 등장 위치·투명도·속도·가속도를 세밀하게 맞춘다고 설명한다. 아래 수치는 실사이트 분포(6/8/10/12/16/20px 및 pill radius)와 접근성 관행을 조합한 **프로젝트 실행 규격**이다.

### 버튼

| 종류 | 높이 | 좌우 padding | radius | 배경/글자 |
|---|---:|---:|---:|---|
| Primary L | 56px | 24px | 16px | `#3182F6` / white |
| Primary M | 48px | 20px | 14px | `#3182F6` / white |
| Secondary M | 48px | 20px | 14px | `#F2F4F6` / `#333D4B` |
| Text | 44px min | 8px | 10px | transparent / `#3182F6` |

상태:

- hover: primary `#2272EB`, secondary `#E5E8EB`.
- active: primary `#1B64DA`, transform은 최대 `scale(.98)`.
- focus-visible: 2px `#3182F6` outline + 2px offset.
- disabled: Gray 200 배경/Gray 400 글자, pointer 비활성.
- 링크형 CTA를 무조건 캡슐(`999px`)로 만들지 않는다.

### 카드·리스트·배지

- Card: radius 24px, padding 32px(desktop)/24px(mobile), 기본 배경 white 또는 Gray 50. 그림자는 꼭 필요한 떠 있는 레이어에만 `0 8px 24px rgba(0,0,0,.06)`.
- List row: 최소 높이 72px, 상하 16px, 좌우 0~20px, 구분선 Gray 200. 정보 탐색에는 카드보다 리스트를 우선한다.
- Badge: 높이 28px, padding 0 10px, radius 8px, 13px/600. 상태 배지는 의미 색을 쓰고 장식용 남발을 금지한다.
- Icon container: 48~56px, radius 14~16px, Gray 100 또는 Blue 50 배경.

### radius 운용 원칙

실사이트 CSS에서는 6/8/10/12/16/20px가 반복되고, CTA·칩에는 100/999px가 쓰인다. 즉 ‘모든 것을 pill로’가 아니라 크기와 기능에 비례한 계층이다.

```text
작은 배지 8 → 입력/작은 버튼 12~14 → 큰 버튼/아이콘 16 → 카드 20~24 → 진짜 pill만 999
```

## 5. 모션

토스 공개 TDS 글이 강조하는 핵심은 화려함이 아니라 인지적으로 자연스러운 위치, 투명도, 속도, 가속도와 터치 피드백이다. 현재 toss.im은 영상과 스크롤 연동 장면 전환을 적극 사용하지만, 사용자의 휠 입력을 강제로 재해석하는 전역 스크롤 하이재킹을 디자인 원칙으로 제시하지 않는다. 따라서 ‘토스 스타일 = 모든 섹션 pin/scrub’은 잘못된 번역이다.

프로젝트 모션 토큰:

```css
--duration-fast: 120ms;
--duration-base: 200ms;
--duration-slow: 320ms;
--duration-enter: 400ms;
--ease-standard: cubic-bezier(.2, 0, 0, 1);
--ease-enter: cubic-bezier(.16, 1, .3, 1);
--ease-exit: cubic-bezier(.4, 0, 1, 1);
```

- hover/press 120~200ms, 일반 UI 전환 200~320ms, 큰 콘텐츠 진입 400ms 이내.
- reveal은 opacity 0→1 + y 16~24px 정도로 한 번만.
- 섹션 pin은 핵심 설명 한 곳에만 예외적으로 허용하고, 모바일에서는 해제한다.
- `prefers-reduced-motion`에서 영상 자동재생, scrub, parallax를 끈다.
- 내비게이션과 핵심 정보는 애니메이션 완료를 기다리지 않아도 읽고 누를 수 있어야 한다.

## 6. 카피라이팅

### 6.1 공개 원칙

앱인토스 UX 라이팅 가이드는 제품 문구에 다음을 요구한다.

1. 모든 문구에 일관된 **해요체**를 쓴다.
2. 수동형보다 능동형을 쓴다.
3. 부정형을 줄이고 긍정형으로 말한다.
4. 과한 경어를 줄이되, 사용자의 상황을 추정하거나 선의를 구할 때는 정중하게 묻는다.
5. ‘명사 + 명사’와 어려운 한자어를 풀어 동사 중심으로 쓴다.
6. 부정적 사실을 꼭 알려야 한다면 이유와 다음 행동을 함께 안내한다.

UX Writer 인터뷰는 어려운 금융 정보를 쉽게 가공하고, 한 사람이 말하는 듯 일관된 톤을 만들며, 오류 상황의 불쾌감을 줄이는 것이 목표라고 설명한다.

### 6.2 실제 헤드라인 예시

아래는 2026-08-22 toss.im 한국어 홈 HTML에 포함된 실제 문구다. 인용은 분석 목적의 짧은 문장으로 제한했다.

1. “금융부터 일상까지 마침내 토스 하나로.”
2. “토스가 바꾼 일상”
3. “토스가 바꿀 일상”
4. “금융과 일상을 품고, 이제는 사장님 곁으로”
5. “바라보는 순간, 끝나는 결제”
6. “어떤 공간에도 어울리는 디자인”
7. “고객이 알아서 스스로 주문하는 매장”
8. “매일 하는 쇼핑도 이제는 토스로”
9. “구매가 확정되면 2일 안에 정산해드려요.”

공통점:

- 기능명보다 사용자의 달라진 순간과 결과를 먼저 말한다.
- 한 문장에 한 메시지만 두고, 2~3행의 말맛 있는 개행을 쓴다.
- ‘혁신·플랫폼·솔루션’ 같은 추상 명사보다 ‘바라보다, 끝나다, 주문하다, 정산하다’ 같은 동사를 쓴다.
- 숫자는 효익과 붙인다(“2일 안에”).
- 단정적인 제목 뒤 설명은 해요체로 부드럽게 이어간다.

AI대학 적용 예시(모두 SOURCE_FACTS 기반):

- “AI를 배우고, 데이터로 증명하고, 세상을 바꿔요.”
- “424명이 함께 시작하는 국내 최대 규모 AI대학”
- “AI에서 AX까지, 전공의 경계를 넘어 배워요.”
- “2027년 3월, 부산대학교 AI대학이 출범해요.”

‘국내 최대 규모’는 SOURCE_FACTS에 명시된 표현이므로 사용할 수 있다. 반면 취업률, 장학금, 기업 채용 연계처럼 원문에 없는 효익은 만들지 않는다.

## 7. 토스 디자인의 본질과 대학 페이지로의 번역

### 본질 정의

토스 디자인의 본질은 파란색, 둥근 카드, 3D 그래픽 같은 표면 장식이 아니라 **복잡한 정보를 사용자가 지금 이해하고 다음 행동을 고를 수 있는 단위로 줄이는 사용성**이다. 토스 자체 리서치에서도 사용자는 토스를 “군더더기 없다”, “실용적이다”, “편리하다”고 기억했고, 시각 자산은 흰 배경·검정 글자·파란 로고의 조합으로 인지했다. 따라서 토스다움은 여백이 큰 라이트 화면, 강한 정보 위계, 쉬운 동사형 문장, 예측 가능한 상호작용이 한 시스템으로 작동할 때 생긴다.

### 그대로 가져올 것 3개

1. **정보를 한 번에 하나씩 설명하는 위계**: ADP+X, 424명, PNU-APEX를 한 화면에 장식적으로 겹치지 않고 질문별 섹션으로 나눈다. 복잡성을 줄인다는 토스 핵심 사용성과 맞는다.
2. **흰 배경 + 진한 텍스트 + 제한된 블루**: 브랜드 리서치가 확인한 토스 인지 조합이며, 수험생과 학부모가 긴 정보를 읽기에도 적합하다.
3. **쉬운 동사형 카피와 접근성**: 큰 글씨 대응, 명확한 링크명, 해요체 설명을 적용한다. 공개 TDS와 UX Writing 원칙에 직접 근거한다.

### 반드시 바꿔야 할 것 3개

1. **앱 설치 중심 CTA → 신뢰 형성·정보 탐색 CTA**: 토스는 앱 다운로드/서비스 전환이 목적이지만 대학은 지원 판단이 목적이다. 1차 CTA는 ‘모집 일정 보기’, ‘학부 구성 보기’, ‘입학정보 확인하기’여야 한다.
2. **짧은 효익 중심 서사 → 근거가 보이는 설명 구조**: 금융 앱은 즉시 효익을 말해도 되지만 대학 선택은 고관여 의사결정이다. 424명의 구성(214+114+69+27), ADP+X 역할, PNU-APEX 체계를 표·목록·원문 출처로 검증 가능하게 보여준다.
3. **토스 브랜드 자산 복제 → 부산대 정체성 보존**: Toss Product Sans, 토스 로고, Tossface를 무단 차용하지 않는다. 토스의 사용성 원칙을 가져오되 부산대학교 명칭·공식 색·입학 링크가 주인공이어야 한다.

## 8. 현재 다크 시네마틱 구현에서 버려야 할 것

아래는 2026-08-22 현재 소스 기준이다. ‘파일:줄’은 삭제 또는 토스식 재설계 대상의 시작 지점을 뜻한다.

| 파일:줄 | 현재 요소 | 조치 |
|---|---|---|
| `src/index.css:4` | `#05070B` void 전역 배경 | 흰색/Gray 50 의미 토큰으로 교체 |
| `src/index.css:5` | `#0A0E15` dark surface | 밝은 surface 체계로 교체 |
| `src/index.css:11` | cyan `#22D3EE` accent | Toss blue `#3182F6` 중심으로 교체 |
| `src/index.css:18` | IBM Plex Mono 보조 서체 | 숫자 코드 표현 외 제거; 한글 UI는 sans 통일 |
| `src/index.css:79` | 11px uppercase + `0.28em` eyebrow | 한글형 14px/600 레이블로 교체 |
| `src/index.css:103` | accent linear-gradient | 장식적 광선 제거, 단색 면/여백 사용 |
| `src/index.css:116` | SVG noise overlay | 필름 그레인 제거 |
| `src/components/Hero.jsx:24` | hero 전체 scrub | 스크롤에 따른 배경/카피 소멸 제거 |
| `src/components/Hero.jsx:47` | 시네마틱 poster | 정보 전달에 필수 아니면 제거 또는 정적 캠퍼스 비주얼로 대체 |
| `src/components/Hero.jsx:54` | 자동재생 hero video | 제거; 유지 시 명확한 의미·poster·reduced-motion 대체 필수 |
| `src/components/Hero.jsx:71` | dark cinematic gradient wall | 제거 |
| `src/components/Hero.jsx:72` | void fade | 제거 |
| `src/components/Hero.jsx:74` | WebGL curriculum field overlay | Hero 장식에서 제거; 선수과목 정보 섹션의 정적 도식으로 이동 |
| `src/components/Hero.jsx:86` | 마지막 줄 cyan 강조 | 한 가지 blue 강조 또는 weight 강조로 단순화 |
| `src/components/Hero.jsx:122` | 모노스페이스 “Scroll” cue | 제거; 첫 화면에서 다음 정보가 자연스럽게 보이게 구성 |
| `src/components/Pillars.jsx:30` | 3개 패널 pin | 일반 문서 흐름/탭 또는 순차 리스트로 교체 |
| `src/components/Pillars.jsx:31` | `scrub: 0.8` | 제거, 짧은 진입 모션만 허용 |
| `src/components/Pillars.jsx:65` | void→transparent gradient | 제거 |
| `src/components/SynapseCore.jsx:71` | radial glow canvas texture | 제거 |
| `src/components/SynapseCore.jsx:132` | cyan wireframe mesh | 제거 |
| `src/components/SynapseCore.jsx:144` | Three.js Canvas centerpiece | 제거; ADP+X는 접근 가능한 HTML/SVG 정보 구조로 구현 |
| `src/components/Research.jsx:32` | 가로 레일 pin | 데스크톱/모바일 모두 자연 스크롤 그리드나 리스트로 교체 |
| `src/components/Research.jsx:33` | `scrub: 0.7` | 제거 |
| `src/components/Research.jsx:146` | 이미지 위 dark gradient | 텍스트를 이미지 밖 카드 본문으로 이동 |
| `src/components/Research.jsx:147` | dark overlay + mono badge | 밝은 배지 토큰으로 교체 |
| `src/components/Admission.jsx:49` | `bg-void/80` 사진 암막 | 제거; 텍스트와 이미지를 분리해 대비 확보 |
| `src/components/Admission.jsx:50` | 상하 void gradient | 제거 |
| `src/components/Admission.jsx:70` | 모든 CTA `rounded-full` | 14~16px radius 버튼 위계로 교체 |
| `src/components/Navbar.jsx:26` | `bg-void/95` 내비 | white/95 + Gray border로 교체 |
| `src/components/Navbar.jsx:32` | dark gradient 내비 배경 | 제거 |
| `src/components/Navbar.jsx:46` | 영문 mono/uppercase 서브브랜드 | 일반 sans 보조 텍스트로 교체 또는 삭제 |
| `src/components/Navbar.jsx:68` | 반투명 dark CTA | solid blue 또는 Gray 100 버튼으로 교체 |
| `src/components/CurriculumField.jsx:79` | radial particle sprite | 제거 |
| `src/components/CurriculumField.jsx:161` | WebGL Canvas | 정적 SVG/HTML 그래프로 대체 |

### 삭제 우선순위

1. 전역 다크/시안/노이즈 토큰과 오버레이.
2. Hero video + WebGL 두 겹 장식.
3. Pillars/Research의 pin·scrub 기반 스크롤 연출.
4. 모노스페이스·uppercase·과도한 자간.
5. 이미지 위 텍스트와 암막 그라데이션.

## 9. 구현자가 바로 사용할 최소 토큰 세트

```css
:root {
  --blue: #3182f6;
  --blue-hover: #2272eb;
  --blue-pressed: #1b64da;
  --blue-soft: #e8f3ff;
  --bg: #ffffff;
  --bg-subtle: #f9fafb;
  --text-strong: #191f28;
  --text: #333d4b;
  --text-subtle: #6b7684;
  --border: #e5e8eb;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-card: 24px;
  --container: 1120px;
  --gutter: clamp(20px, 4vw, 48px);
  --section-y: clamp(80px, 10vw, 160px);
  --ease-enter: cubic-bezier(.16, 1, .3, 1);
  --duration-ui: 200ms;
  --duration-enter: 400ms;
}
```

최종 판단 기준은 간단하다. 토스처럼 보이게 장식했는지가 아니라, 수험생과 학부모가 **AI대학이 무엇인지, 무엇을 배우는지, 언제 어떻게 확인해야 하는지**를 더 빠르고 정확하게 이해하는지를 검증해야 한다.
