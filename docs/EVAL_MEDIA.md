# 평가 3 — 비주얼 에셋 및 모션 전략

조사일: 2026-08-22 (KST)  
대상: `https://toss.im/` 한국어 홈, `E:\testFront\src`  
결론: **라이트 톤 전환은 옳지만, 미디어와 서사적 모션까지 삭제한 것은 명백한 퇴행이다.** 현재 toss.im 자체가 첫 화면의 실사 영상, 포스터/프레임 이미지, Motion 기반 전환을 적극 사용한다. 이 프로젝트도 다크 에셋을 그대로 되살릴 것이 아니라, 흰 화면에 맞춘 새 Higgsfield 에셋과 제한된 모션을 복구해야 한다.

## 1. toss.im 실측

### 조사 방법과 근거 범위

- 현재 한국어 홈 HTML을 직접 내려받아 `<head>` preload, 정적 에셋 URL, 배포 JS를 검사했다. 원문: [toss.im](https://toss.im/).
- 실제 배포 에셋인 [`intro-main.mp4`](https://static.toss.im/assets/toss-im/asset/intro-main.mp4)를 내려받아 `ffprobe`로 측정했다. H.264 1920×1080, 24fps, **4.053초**, 1,251,900 bytes이며 AAC 스트림도 들어 있다.
- 실제 [`intro-main-poster.webp`](https://static.toss.im/assets/toss-im/asset/intro-main-poster.webp)와 [`hero-frame-3/frame_00001.webp`](https://static.toss.im/assets/toss-im/asset/hero-frame-3/frame_00001.webp)를 원본 해상도로 열어 확인했다.
- 현재 배포 JS의 `ClassicVideo` 구현은 기본값이 `autoPlay=true`, `loop=true`, `muted=true`, `playsInline=true`이며, 재생 실패 시 poster를 유지한다. 홈 HTML은 위 MP4를 `as="video"`, `type="video/mp4"`, `fetchPriority="high"`로 preload한다.
- 인앱 브라우저 연결은 런타임 메타데이터 오류로 실패했다. 따라서 아래에는 다운로드한 실제 HTML·JS·미디어로 확인 가능한 사실만 적고, 화면을 임의로 추정하지 않는다.

### 히어로와 영상

현재 홈은 **히어로급 첫 화면에 실사 영상**을 쓴다. 장면은 밝은 낮, 창가 좌석에서 흰 스마트폰을 보는 인물의 클로즈업이다. 화면 대부분이 흰 창광과 저채도 회색이고, 어두운 시네마틱 톤이 아니다. 16:9 풀프레임 실사이며 제품(휴대폰)은 생활 장면 안에 자연스럽게 포함된다.

확인된 재생 조건은 `autoplay + loop + muted + playsInline`; 파일 길이는 4.053초다. 즉 토스의 방식은 “긴 브랜드 필름”이 아니라 **짧고 가벼운 생활 장면 루프**에 가깝다. poster와 첫 프레임 WebP를 별도로 preload해 영상이 뜨기 전 빈 화면을 만들지 않는다. AAC 스트림이 파일에는 있으나 `muted`가 기본이므로 홈 자동재생에서 소리를 들려주지 않는다.

### 이미지 종류와 비율

이번 홈의 첫 화면에서 실측 가능한 주역은 실사 영상/실사 poster다. 포스터와 첫 프레임도 16:9이며, 별도의 무거운 프레임·그림자·카드 안에 가두지 않고 장면 자체가 넓게 보인다. 로고는 투명 배경 PNG다. 따라서 “토스는 3D 일러스트만 쓴다”거나 “제품 목업만 쓴다”는 주장은 현재 홈 근거로 성립하지 않는다.

전체 페이지의 제품 목업·3D·일러스트·실사 비율은 클라이언트 렌더가 완료된 전 페이지를 안정적으로 캡처하지 못했으므로 수치화하지 않는다. **확인된 첫 화면 표본만 놓고 보면 실사 1, 제품 목업 단독 0, 3D 렌더 0, 일러스트 0**이다. 이 한정 범위를 벗어난 비율은 추측하지 않는다.

### 흰 배경 위 처리

실제 poster에서 인물의 흰 니트, 창밖의 하이키 배경, 회색 좌석, 흰 휴대폰을 사용해 페이지의 흰색과 자연스럽게 이어진다. 짙은 비네팅이나 다크 오버레이는 보이지 않는다. 피사체는 오른쪽에 두고 왼쪽에 밝은 여백을 넓게 남겨 카피와 공존할 수 있는 구도다. 관찰된 히어로 에셋 자체에는 카드형 라운딩이나 드롭 섀도가 없으며, **밝은 장면의 넓은 블리드 + 카피 여백**이 핵심이다.

### 스크롤/전환 모션

배포 번들에는 Framer Motion 계열의 animation, spring, transform, reduced-motion 처리 코드가 포함되어 있고, 비디오 컴포넌트는 재생 성공/실패에 따라 poster와 video의 visibility를 전환한다. 정적 HTML의 내비게이션 문자도 초기 `opacity:0`, `translateY(16px)`와 표시 상태가 함께 렌더되어 텍스트 진입 전환이 존재함을 확인할 수 있다.

반면 GSAP/ScrollTrigger 문자열은 배포 홈 번들 검사에서 확인되지 않았다. 전역 휠 재해석이나 강제 스크롤 스냅도 확인하지 못했다. 그러므로 근거 있는 판정은 **“모션은 적극 사용하지만 GSAP식 전역 스크롤 하이재킹은 근거가 없다”**이다. 프레임 단위 scrub이나 pin의 정확한 개수는 관찰하지 못했으므로 단정하지 않는다.

## 2. 현재 사이트의 결손 진단

`public/`에는 `favicon.svg`만 있고, `src/`에는 `<img>`, `<picture>`, `<video>`가 하나도 없다. `package.json`에도 GSAP·Motion이 없으며, 모션은 `IntersectionObserver`가 `data-shown`을 붙이는 단일 reveal뿐이다.

| 위치 | 현재 상태 | 들어가야 할 미디어/모션 |
|---|---|---|
| `src/components/Hero.jsx:5` | 흰 배경 텍스트 히어로 시작 | 16:9 실사 hero loop 또는 poster. 카피 왼쪽/피사체 오른쪽의 넓은 블리드 |
| `src/components/Hero.jsx:19` | 숫자 badge만 있는 상단 정보 | 영상 위에 겹치지 않는 독립 카피; 로드 시 카피 stagger와 poster→video fade |
| `src/components/Why.jsx:6` | 비교 문장/행만 이어짐 | 세 단과대가 한 AI대학으로 모이는 밝은 편집 일러스트 1장. 진입 시 세 요소가 중앙으로 모이는 짧은 transform |
| `src/components/Adpx.jsx:24` | A/D/P/X 탭과 색 블록 | 4개 전공 역할을 보여주는 동일 아트디렉션의 4장 이미지; 탭 전환 시 crossfade/짧은 x 이동 |
| `src/components/Chain.jsx:11` | 부산항 사례가 텍스트 단계뿐 | 부산항 컨테이너·크레인·데이터 오버레이 장면. 단계 진입 때 경로선이 순차적으로 드러남 |
| `src/components/Numbers.jsx:8` | 424/17/256/300 숫자 카드 | GPU·공동 인프라의 밝은 제품 렌더 1장; 숫자 count-up은 1회만 |
| `src/components/Apex.jsx:6` | 4기관 카드/도식만 존재 | 네 조직이 하나의 중심으로 연결되는 공간형 3D/아이소메트릭 렌더; 연결선 draw-on |
| `src/components/Programs.jsx:6` | 3개 프로그램 텍스트 카드 | 학생의 연구→창업 장면 1장 또는 3컷 strip; 카드 hover에 미세한 이미지 scale |
| `src/components/Roadmap.jsx:6` | 2026–2029 텍스트 타임라인 | 작은 장식 이미지를 더하기보다 기존 선/노드 reveal에 집중(에셋 우선순위 낮음) |
| `src/components/Admission.jsx:6` | 파란 CTA 색면뿐 | 캠퍼스/학생의 밝은 실사 wide image를 CTA 옆에 분리 배치; 이미지 위 텍스트 금지 |
| `src/hooks/useReveal.js:6-8` | “Toss는 scroll-linked가 없다”는 주석 | 현재 실측과 충돌. 일반 reveal은 유지하되 hero video, 탭 전환, 선 draw, 숫자 모션은 별도 계층 필요 |
| `src/index.css:158-180` | opacity+y 20px, 400ms 한 종류 | 에셋 로딩/교체/축소 모션과 reduced-motion poster 대체 규칙이 없음 |

특히 `useReveal.js:6-8`의 단정은 수정 대상이다. toss.im에서 영상과 Motion 번들이 실제 확인되므로 “짧은 entrance만 있고 scroll-linked는 없다”는 서술은 증거보다 강하다.

## 3. 라이트 톤 Higgsfield 에셋 명세

### 비용 기준

실제 실행한 `higgsfield generate cost` 결과:

- `nano_banana_pro`, 2K: **2 credits/장**
- `soul_cinematic`, 2K: **0.12 credits/장**
- `text2image_soul_v2`, 2K: **0.12 credits/장**
- `kling3_0_turbo`, 1080p, 5초: **10 credits/영상**
- 대안 `seedance_2_0_mini`, 720p, 5초, 무음: **12.5 credits/영상**
- `higgsfield account status --json` 실측 잔액: **845 credits** (과업 설명의 약 857보다 12 낮음). 아래 권장안 8 이미지+영상 1개는 24 credits로 잔액의 약 2.8%다.

프롬프트 공통 금지어는 `no dark navy, no cyan neon, no cyberpunk, no black background, no embedded text, no logos, no watermark`다. 생성 후 웹 전달본은 AVIF/WebP로 별도 최적화한다.

### A1. Hero poster / video 시작 프레임 — 최우선

- 장면: 밝은 낮의 부산대 현대식 AI 실습실. 한국인 대학생 3명이 흰 테이블에서 노트북과 소형 로봇 팔을 함께 다룬다. 피사체는 오른쪽 55%, 왼쪽 45%는 카피를 위한 하이키 여백. 창밖은 부산의 산 능선이 흐릿하게 보이되 랜드마크를 조작하지 않는다.
- 모델: `soul_cinematic`
- 완성 프롬프트: `Bright cinematic lifestyle photograph inside a modern Korean university AI lab in Busan, three Korean undergraduate students naturally collaborating around a white table with a laptop and a small educational robot arm, soft daylight, airy white and very light gray interior, restrained Toss blue #3182F6 accents on one notebook and one interface light only, subjects grouped on the right 55 percent, generous clean high-key negative space on the left for headline, authentic candid expressions, premium commercial photography, natural skin, subtle distant mountain silhouette through the window, no readable screen text, no university logo, no dark navy, no cyan neon, no cyberpunk, no black background, no embedded text, no watermark`
- 비율/해상도: 16:9, 2K (최종 desktop 1920×1080, mobile은 중앙/오른쪽 crop 별도 검수)
- 실측 비용: **0.12 credits**

### A2. Hero loop — 최우선

- 장면: A1과 같은 장면에서 학생 한 명이 로봇 팔을 가볍게 조정하고 다른 학생이 화면을 보며 고개를 끄덕인다. 카메라는 2–3%만 느리게 push-in. 시작/끝 자세와 노출을 맞춘 5초 루프, 음성·대사 없음.
- 모델: `kling3_0_turbo` (A1을 `start_image`로 사용)
- 완성 프롬프트: `Create a seamless five-second loop from the supplied bright AI lab still. The student nearest the small robot arm makes one subtle adjustment, the other two exchange a small nod while continuing to look at the laptop, gentle 2 percent camera push-in, stable daylight and exposure, restrained motion, natural candid behavior, keep the left side clean for website copy, white and light gray palette with minimal Toss blue #3182F6 accents, first and last pose visually compatible for looping, no speaking, no dramatic gesture, no flicker, no camera shake, no darkening, no text, no logo`
- 비율/해상도: 16:9, 1920×1080, 5초, 24fps 권장; 전달 시 H.264 MP4 + WebM, poster=A1
- 실측 비용: **10 credits**

### A3. Why 통합 구조

- 장면: 세 개의 밝은 학습 공간(컴퓨팅·데이터·산업)이 중앙의 하나의 AI대학 아트리움으로 연결되는 아이소메트릭 편집 렌더. 글자 없는 구조적 비주얼.
- 모델: `nano_banana_pro`
- 완성 프롬프트: `Clean premium isometric editorial render on a pure white background: three distinct university learning zones — computing with servers and code-shaped abstract blocks, data science with translucent charts and data cubes, industrial engineering with a miniature production line — connected by soft curved paths into one open central AI college atrium, restrained Toss blue #3182F6 and pale blue #E8F3FF accents, warm light gray materials, abundant whitespace, realistic soft contact shadows, friendly and precise, no labels, no letters, no logos, no people close-up, no dark navy, no cyan neon, no cyberpunk, no black background, no watermark`
- 비율/해상도: 4:3, 2K (최종 1600×1200)
- 실측 비용: **2 credits**

### A4–A7. ADPX 역할 4종

- 공통 모델: `nano_banana_pro`; 각 4:3, 2K (1600×1200); **각 2 credits, 합계 8**
- 공통 프롬프트 접미사: `Bright premium editorial product scene on a pure white seamless background, Korean university context, restrained Toss blue #3182F6 and pale blue #E8F3FF accents, light gray materials, generous whitespace, soft contact shadow, consistent camera at eye level, no readable text, no logos, no dark navy, no cyan neon, no cyberpunk, no black background, no watermark`
- A/AI 프롬프트: `A Korean undergraduate student testing a small friendly vision robot beside an open laptop, a few translucent model-layer shapes floating near the device, natural focused expression. ` + 공통 접미사.
- D/Data 프롬프트: `A Korean undergraduate student validating a clean dataset at a white workstation, physical translucent data cubes and a subtle statistical chart shape arranged like desk objects, careful analytical mood. ` + 공통 접미사.
- P/Process 프롬프트: `A Korean undergraduate student improving a miniature smart logistics line with small containers and a robotic crane on a white tabletop, clear flow from input to output. ` + 공통 접미사.
- X/AX 프롬프트: `Two Korean undergraduate students applying one AI solution across miniature harbor, factory, and hospital modules connected by one soft blue path, practical transformation rather than science fiction. ` + 공통 접미사.

### A8. 부산항 Chain 장면

- 장면: 흰 스튜디오 위 부산항 미니어처. 컨테이너·크레인·선박 사이를 A/D/P/X의 네 단계가 색과 형태로 이어지되 글자는 넣지 않는다.
- 모델: `nano_banana_pro`
- 완성 프롬프트: `Premium miniature editorial diorama of Busan harbor on a seamless white studio background, container ship, quay cranes, neatly arranged containers and a compact logistics control desk, four visually distinct but connected stages shown through one continuous restrained Toss blue #3182F6 path with small data particles, prediction, validation, process optimization and transfer to other industries expressed only through objects, airy high-key lighting, soft contact shadows, precise realistic materials, generous whitespace, no letters, no labels, no logos, no dark navy, no cyan neon, no cyberpunk, no black background, no watermark`
- 비율/해상도: 16:9, 2K (1920×1080)
- 실측 비용: **2 credits**

### A9. Numbers / GPU 인프라

- 장면: 흰 서버실의 GPU 랙과 학생 1명. 랙은 거대하거나 위협적이지 않고 교육 인프라로 보인다. 숫자 256은 HTML로 얹으므로 이미지에 쓰지 않는다.
- 모델: `nano_banana_pro`
- 완성 프롬프트: `Bright architectural product photograph of a clean university GPU learning facility, one Korean undergraduate student standing beside two elegant light-gray compute racks, subtle blue status lights matching Toss blue #3182F6, white ceiling and walls, airy daylight-balanced illumination, calm accessible educational atmosphere, composition weighted to the right with whitespace for a large statistic on the left, realistic scale and hardware, no readable labels, no brand marks, no numbers, no dark server room, no cyan neon, no cyberpunk, no black background, no watermark`
- 비율/해상도: 16:9, 2K (1920×1080)
- 실측 비용: **2 credits**

### 총비용

A1 0.12 + A2 10 + A3 2 + A4–A7 8 + A8 2 + A9 2 = **24.12 credits**. 프롬프트별 `cost`는 같은 모델·해상도 조합에서 동일했고, 실제 생성은 수행하지 않았다. 첫 시도 실패를 고려해 A1/A2 각각 2회, 나머지 이미지 각 2회까지 생성해도 약 48.24 credits로 현재 845의 5.8% 이하다.

## 4. 모션 전략

### 판정

GSAP을 전부 뺀 행위 자체는 문제의 핵심이 아니다. **복잡한 pin/scrub와 전역 scroll hijacking을 제거한 것은 유지해야 하지만, 영상·상태 전환·서사적 도식 모션까지 함께 삭제한 것은 잘못이다.** toss.im 실측은 4초 자동 루프, poster fallback, 진입 transform, Motion/reduced-motion 코드를 보여준다.

### 라이브러리 권고: Motion 재도입

- 1순위는 `motion`(React)이다. 현재 React 컴포넌트 구조에 자연스럽고, hero poster/video crossfade, ADPX 탭의 `AnimatePresence`, 숫자 진입, SVG pathLength를 한 도구로 다룬다. 현재 toss.im 번들에도 Motion 계열 코드가 확인되어 레퍼런스와 결이 맞는다.
- GSAP 재도입은 **보류**한다. 현재 필요한 동작은 pin, scrub timeline, canvas orchestration이 아니므로 번들과 imperative cleanup 비용이 과하다. 추후 단 하나의 복잡한 스크롤 장면이 확정될 때만 좁은 범위에서 검토한다.
- CSS만으로는 hover와 단순 reveal은 충분하지만, 탭 교체의 exit/enter, media load 상태, SVG 진행도, reduced-motion 분기를 여러 컴포넌트에서 일관되게 관리하기 어렵다.

### 구체적 동작

1. Hero: poster를 즉시 표시하고 video `canplay` 후 300ms opacity crossfade. `autoplay loop muted playsInline`; viewport를 벗어나면 pause, 돌아오면 play. `prefers-reduced-motion`에서는 video를 로드/재생하지 않고 poster만 표시한다.
2. Hero copy: 페이지 로드 시 badge→headline→body→CTA를 y 20→0, opacity 0→1로 60–80ms stagger, 전체 520ms 이내. 영상과 카피를 scroll progress로 지우지 않는다.
3. Why: 섹션 30% 진입 시 세 외곽 모듈이 16px씩 중앙으로 이동하며 연결선이 0→1. 600ms 1회, 되감지 않는다.
4. ADPX: 탭 클릭 시 현재 이미지 opacity 1→0 + x -12, 새 이미지 x 12→0 + opacity 0→1, 240ms. 키보드/스크린리더 상태는 즉시 바뀌고 애니메이션을 기다리지 않는다.
5. Chain: viewport 진입에 맞춘 4단계 pathLength reveal(총 800ms)과 카드 70ms stagger. 휠 입력을 가로채거나 섹션을 pin하지 않는다.
6. Numbers: 숫자 count-up 700ms, 1회. reduced-motion에서는 최종값을 즉시 표시한다.
7. APEX: 네 연결선만 500ms draw-on; 중심 카드는 1.00→1.03 정도의 짧은 강조 후 정지. 무한 펄스 금지.
8. 공통: transform/opacity만 애니메이션하고 layout 속성은 피한다. IntersectionObserver로 시작점만 잡고 scroll position에 매 프레임 결박하지 않는다. 모든 정보는 애니메이션 전후 동일하게 접근 가능해야 한다.

## 5. 효과 대비 우선순위 — 딱 3개

1. **Hero A1+A2 복구 (10.12 credits)**: 첫 화면의 텍스트-only 인상을 즉시 뒤집는다. toss.im이 실제로 쓰는 “밝은 실사 + 4초대 자동 루프 + poster” 패턴과 가장 직접적으로 대응한다.
2. **ADPX A4–A7 4종 (8 credits)**: 이 대학의 핵심 차별점인 네 역할을 색 블록이 아니라 사람과 실제 행위로 이해시킨다. 한 스타일로 4장을 묶어 반복 노출 효과도 가장 크다.
3. **부산항 A8 + Chain path 모션 (2 credits)**: 부산이라는 장소성과 A→D→P→X의 작동 방식을 한 장면에서 동시에 설명한다. 이미지 한 장과 가벼운 SVG 모션만으로 긴 텍스트 구간을 강하게 바꾼다.

이 3개만 먼저 하면 이미지 6장+영상 1개, 총 **20.12 credits**다. A3/A9는 다음 라운드로 미뤄도 핵심 서사는 보존된다.

## 실행 시 검수 체크

- 생성 전에 부산대 실제 공간/브랜드 사용 허가 여부를 확인하고, 생성물이 실제 시설·사업의 기록 사진처럼 오인되지 않게 필요 시 “연출 이미지”를 표기한다.
- 모바일에서는 hero 피사체가 카피 뒤에 겹치지 않는지 390×844에서 별도 crop을 검수한다.
- LCP는 poster로 잡고 hero MP4는 1.5MB 안팎을 목표로 한다. 아래 섹션 이미지는 lazy-load, 명시적 width/height, AVIF/WebP `srcset`을 사용한다.
- 자동재생 영상은 무음·정지 가능·reduced-motion 정적 대체를 지킨다.
- 이미지 위에 본문을 올리지 않는다. 흰 배경에서는 20–28px 라운드 컨테이너 또는 full-bleed 중 하나만 선택하고, 그림자는 `0 8px 24px rgba(25,31,40,.06)` 이하의 접촉감으로 제한한다.
