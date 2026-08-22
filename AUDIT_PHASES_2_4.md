# 2·3·4단계 프로세스/파이프라인 적대적 감사

감사일: 2026-08-22 (Asia/Seoul)

## 판정 요약

- **2단계: MAJOR 미이행.** 기준 문서는 니치에 맞는 프론티어 레퍼런스 3개와 골드 스탠다드를 요구한다(`claude-premium-webdesign-system.md:16-21`). 저장소의 유일한 자체 Markdown은 기준 문서뿐이고, 구현 코드/에셋 스크립트에도 선정·분석 결과가 없다. 즉 “영상 두 편을 봤다”는 과정은 재현 가능한 벤치마크 산출물이 아니다.
- **3단계: MAJOR 부분 이행.** `@theme`은 색 10개와 글꼴 family 2개만 정의한다(`src/index.css:3-17`). 기준의 컬러·타이포·컴포넌트·에셋·인터랙션·플로우 규격화 요구(`claude-premium-webdesign-system.md:25-30`)에 크게 못 미친다.
- **4단계: BLOCKER 미이행.** 생성기는 `nano_banana_pro` 정지 이미지 호출뿐이고(`assets/gen.sh:7-13`), 실제 8개 job도 정지 이미지 프롬프트뿐이다(`assets/gen.sh:18-32`, `assets/jobs.txt:1-8`). 기준이 요구한 루핑 Lottie/Video 및 Seedance 계열 사용(`claude-premium-webdesign-system.md:34-43`)과 Gauntlet Loop가 없다.

## 2단계 — 벤치마킹

### 발견 2-1 — 분석 산출물 및 골드 스탠다드 부재 (MAJOR)

**근거:** 기준은 3개 니치 레퍼런스와 1개 골드 스탠다드 선정을 명시한다(`claude-premium-webdesign-system.md:16-21`). 반면 저장소에는 이를 기록한 파일이 없으며 `package.json`에도 분석/검증 작업이 없다(`package.json:6-10`). `assets/gen.sh`의 유일한 시각 방향은 일반적인 “cinematic still” 스타일 문자열이다(`assets/gen.sh:16-16`).

**수정안:** `docs/REFERENCES.md`를 추가하고 아래 3개에 대해 URL, 캡처 일자, desktop/mobile 캡처, grid/type/motion/content 모델, 적용/비적용 결정을 기록한다. PR 체크리스트에서 이 문서가 없는 디자인 변경을 실패시킨다.

### 실제 조사 결과 및 선정안

1. **EPFL AI Center — 골드 스탠다드**: https://ai.epfl.ch/
   - 대학 AI 센터라는 동일 니치이며, 홈페이지가 하나의 강한 선언과 번호가 붙은 7개 editorial story를 전면에 배치한다. “연구·혁신·교육”을 한 문장으로 묶는 정보 구조도 PNU AI와 직접 대응한다.
   - 훔칠 기법: (a) 히어로를 1개의 선언 + 한 개 행동으로 제한, (b) `1–7` 식의 명시적 진행 상태가 있는 full-bleed story rail, (c) 연구/뉴스/행사를 서로 다른 리듬의 editorial grid로 분리.
   - PNU 적용: 현재 2개 CTA인 히어로(`src/components/Hero.jsx:106-121`)를 대표 CTA 하나로 줄이고, 연구 4개 horizontal pin(`src/components/Research.jsx:95-104`)에 `01/04` 진행 지표와 키보드/버튼 이동을 추가한다.

2. **MIT Schwarzman College of Computing**: https://computing.mit.edu/
   - AI 교육·연구를 단일 학과가 아니라 전 대학을 잇는 구조로 설명하며, 실제 프로그램과 교차학문 구조를 전면에 둔다.
   - 훔칠 기법: (a) 건물/사람 사진과 큰 editorial typography의 교대, (b) 교육·연구·사회적 책임을 명확한 정보 계층으로 분리, (c) 숫자/인용/프로그램 링크를 장식이 아닌 신뢰 증거로 사용.
   - PNU 적용: 현재 수치 배열(`src/data/content.js:23-28`)마다 출처 링크를 붙이고, “두 대학, 하나의 학과” 설명(`src/data/content.js:30-46`)을 교차학문/교육/현장 검증 축으로 재구성한다.

3. **Stanford Human-Centered AI**: https://hai.stanford.edu/
   - 연구·교육·정책이라는 복잡한 기관 활동을 대표 영상, 보고서, 연구 프로그램, 뉴스로 계층화한다.
   - 훔칠 기법: (a) 대표 영상에 명시적 Play/Mute/Skip 컨트롤과 poster 제공, (b) flagship report를 독립 시각 블록으로 격상, (c) research cards를 실제 fellowship/grant/student program으로 연결.
   - PNU 적용: 루프는 장식 배경으로 무음 autoplay하되 reduced-motion에서는 poster로 대체하고, 정보성 영상에는 Stanford처럼 네이티브 컨트롤을 제공한다. 현재 연구 카드는 정적 article일 뿐 링크가 없다(`src/components/Research.jsx:100-137`); 연구실/교수/프로젝트 상세 링크를 추가한다.

**골드 스탠다드 판정:** EPFL AI Center. 동일한 대학 AI 허브 니치, cinematic/editorial 전개, 연구·혁신·교육의 균형이 이 프로젝트 목적에 가장 직접적이다. MIT는 신뢰/구조, Stanford HAI는 콘텐츠 계층과 접근 가능한 영상의 보조 표준으로 둔다.

## 3단계 — 디자인 시스템 코드화

### 발견 3-1 — 토큰 체계가 family 수준에 머묾 (MAJOR)

**근거:** `@theme`에는 색과 font-family만 있다(`src/index.css:3-17`). 실제 heading 크기는 컴포넌트마다 임의 clamp로 반복되고(`src/components/Hero.jsx:83-83`, `src/components/Research.jsx:84-88`, `src/components/Curriculum.jsx:52-56`), GSAP duration/ease도 로컬 숫자로 하드코딩된다(`src/components/Hero.jsx:15-29`, `src/components/Research.jsx:25-35`).

**빠진 것 전부:**

- 컬러: semantic role(`bg/content/border/action/status`), hover/pressed/disabled/focus, light/high-contrast 여부, gradient/scrim recipe.
- 타이포: display/h1/h2/h3/body/caption scale, weight, line-height, tracking, Korean/Latin fallback 및 line-break 규칙.
- 공간/형태: spacing scale, container/gutter, radius, border, shadow/elevation, z-index.
- 모션: duration/easing/stagger/distance, scroll scrub/pin 정책, reduced-motion 대체 규칙.
- 버튼/컴포넌트: primary/secondary/text button variant와 size/state, link/card/tag/nav/media 컴포넌트 API 및 접근성 계약.
- 에셋 인벤토리: 파일명, job ID, 원본 prompt/model, ratio, intrinsic size, poster/LQIP, 사용 섹션, alt/장식 여부, 라이선스.
- 인터랙션: hover/focus/keyboard/touch, horizontal rail 조작, autoplay 정책, loading/error fallback.
- 플로우: 본 사이트에 인증 기능이 없다면 login/signup은 **N/A로 명시**해야지 조용히 누락하면 안 된다. 대신 입학 CTA → 외부 사이트 전환/오류/복귀 흐름을 문서화한다.

**수정안:** 위 항목을 `@theme` 토큰과 `src/components/ui/{Button,Link,Card,Media}.jsx`로 옮기고, `motion.js`에서 GSAP preset을 export한다. raw hex `#22d3ee`(`src/components/Curriculum.jsx:36-40`)와 임의 색 `#2a3546`(`src/components/Manifesto.jsx:32-38`)을 semantic token으로 교체한다.

### 발견 3-2 — 별도 `DESIGN_SYSTEM.md` 부재 (MAJOR)

**판정:** 위반이다. 기준은 분석한 레퍼런스를 바탕으로 자체 가이드를 “개발 환경에 저장”하고 이후 섹션에도 일관되게 주입하라고 요구한다(`claude-premium-webdesign-system.md:25-30`). CSS만으로는 에셋 provenance, 사용 규칙, 금지 사례, interaction contract, N/A 결정을 보존할 수 없다.

**수정안:** `DESIGN_SYSTEM.md`를 단일 규범 문서로 추가하고 토큰 이름 ↔ 코드 위치 표, 컴포넌트 variant/state 표, motion matrix, asset manifest 링크, accessibility/reduced-motion 규칙을 둔다. Stylelint/ESLint로 raw color·임의 duration을 금지한다.

### 짧은 인정

기본 색 역할과 font family는 중앙화되어 있고(`src/index.css:3-17`), `.edge/.eyebrow/.pane` 반복 패턴도 일부 추출돼 있다(`src/index.css:47-63`). reduced-motion에서 reveal을 복구하는 최소 방어도 있다(`src/index.css:80-87`). 다만 이것은 완성된 디자인 시스템이 아니라 출발점이다.

## 4단계 — Higgsfield/비디오/Gauntlet

### 발견 4-1 — 루핑 비디오 0개, Seedance 미사용 (BLOCKER)

**근거:** 8개 생성 호출은 모두 `nano_banana_pro`이고(`assets/gen.sh:10-12`, `assets/gen.sh:18-32`), job ledger도 정확히 8개뿐이다(`assets/jobs.txt:1-8`). Hero는 `<img>`만 렌더한다(`src/components/Hero.jsx:56-66`). 패키지의 에셋 자동화는 정지 이미지 최적화 명령 하나뿐이다(`package.json:6-10`). 이는 Lottie/Video와 Seedance 명시 요구(`claude-premium-webdesign-system.md:34-43`)의 직접 위반이다.

**수정안:** 아래 3개 중 우선순위 1을 먼저 생성·평가하고 `public/video/*.webm` + H.264 fallback + poster로 배치한다. `<video autoPlay muted loop playsInline poster>`를 사용하되 `prefers-reduced-motion`에서는 video를 mount하지 말고 poster만 보인다.

### 실제 CLI 확인

`higgsfield model list --video` 결과 Seedance job type은 `seedance1_5`, `seedance_2_0`, `seedance_2_0_mini`, **`seedance_2_5`**다. `higgsfield model get seedance_2_5`의 핵심 파라미터는 `mode=t2v|omni_reference|video_edit|video_extension`, `prompt` 필수, `aspect_ratio`, `duration`(기본 5), `resolution=480p|720p|1080p`, `bitrate_mode=standard|high`, `generate_audio`, reference media, `start_image/end_image`; start/end는 `omni_reference`에서만 허용된다.

### 배치 우선순위와 완성 명령어 (실제 생성 금지, 제안만)

가장 효과가 큰 곳은 **Hero 배경**이다. 첫 화면에서 “cinematic” 약속을 즉시 증명하고 현재 정지 hero를 그대로 loop anchor로 쓸 수 있다(`src/components/Hero.jsx:51-73`). 2순위는 Research의 smart-factory 카드, 3순위는 Manifesto↔Stats 사이의 neural transition이다.

각 명령은 먼저 동일 인자를 `generate cost`에 넣어 확인했고 **45크레딧**, 합계 **135크레딧**이다(약 900 잔액 대비 약 15%). 실제 실행 명령:

```powershell
higgsfield generate create seedance_2_5 --mode omni_reference --prompt "Seamless five-second loop. A monumental university AI research atrium at blue hour; the camera is completely locked. A suspended cyan neural lattice breathes outward and returns exactly to its initial geometry, volumetric haze drifts cyclically, no people, no text, no logo, no cut, no camera movement, first and last frame identical." --start-image assets/raw/hero.png --end-image assets/raw/hero.png --aspect-ratio 21:9 --duration 5 --resolution 1080p --bitrate-mode high --generate-audio=false --json

higgsfield generate create seedance_2_5 --mode omni_reference --prompt "Seamless five-second loop from the supplied smart-factory still. Locked camera. One cyan laser scan travels across the robotic arm and conveyor, sparse sensor nodes pulse in sequence, then every light and haze pattern returns precisely to frame one. Premium restrained navy graphite grade, no text, no logo, no cuts, no camera motion, perfect loop." --start-image assets/raw/r_factory.png --end-image assets/raw/r_factory.png --aspect-ratio 4:3 --duration 5 --resolution 1080p --bitrate-mode high --generate-audio=false --json

higgsfield generate create seedance_2_5 --mode omni_reference --prompt "Seamless five-second macro loop from the supplied neural lattice texture. Locked orthographic camera. Cyan impulses travel through filaments in a circular wave, nodes brighten and dim, particles complete closed trajectories, and the final frame matches the first exactly. Dark void background, subtle premium motion, no text, no logo, no cut, no zoom." --start-image assets/raw/lattice.png --end-image assets/raw/lattice.png --aspect-ratio 1:1 --duration 5 --resolution 1080p --bitrate-mode high --generate-audio=false --json
```

재검증용 비용 명령은 각 줄에서 `generate create`만 `generate cost`로 바꾸면 된다.

### 발견 4-2 — Gauntlet Loop 부재 (BLOCKER)

**근거:** 생성 함수는 job ID를 텍스트에 append하고 끝난다(`assets/gen.sh:4-14`). 평가, 임계값, 재생성, 버전 비교, 비용 상한이 없다. `package.json`에도 관련 script가 없다(`package.json:6-10`). 기준의 다중 judge 반복 평가 요구와 정면 충돌한다(`claude-premium-webdesign-system.md:37-41`).

**구체적 스크립트 설계:**

1. `assets/manifest.yaml`: asset마다 section, gold-standard URL/screenshot, model/params/prompt, budget, maxAttempts(3), thresholds를 선언.
2. `scripts/gauntlet.mjs generate <slug>`: `higgsfield generate cost`를 먼저 실행해 누적 180크레딧/asset 또는 잔액 reserve 500을 넘으면 중단; create → job poll/download → `assets/candidates/<slug>/vNN.mp4`와 JSON receipt 저장.
3. `scripts/evaluate-video.mjs`: ffmpeg로 첫/끝 프레임과 12개 sample 추출. 자동 지표는 seam SSIM ≥ .97, black-frame 0, frozen-frame ratio < .15, duration 4.8–5.2초, 해상도 1080p, 무음 여부, optical-flow 시작/끝 속도 차이 임계값을 검사.
4. 세 judge를 분리: `brand`(EPFL식 editorial restraint/색), `motion`(loop seam/camera drift/flicker), `usability`(텍스트 대비, CTA 방해, reduced-motion poster). 각 judge는 `{score, defects[], promptPatch}` JSON을 내고 평균 ≥ 8.5, 각 항목 ≥ 7.5일 때만 pass.
5. fail이면 결함을 다음 prompt에 구조적으로 병합하되 원 프롬프트/seed/모델을 보존하고 최대 3회 재생성. 최종 best를 점수로 선택해 WebM/MP4/poster/LQIP 생성 후 `public/video`로 promote한다.
6. `assets/reports/<slug>.json`에 모든 비용·job ID·prompt diff·지표·judge 결과를 기록하고 `npm run gauntlet -- hero` 및 `npm run gauntlet:verify`를 `package.json`에 추가한다. CI는 생성하지 않고 기존 report와 파일의 hash/threshold만 검증한다.

주의: judge의 미학 점수만으로 자동 재생성을 무한 반복하면 크레딧을 소모한다. hard metric 실패 → 즉시 재생성, 미학 실패 → 최대 2회, 총 3회/asset이라는 이중 차단기가 필수다.

### 짧은 인정

원본과 배포용 파생물을 분리했고(`assets/gen.sh:4-5`, `scripts/optimize-assets.mjs:5-8`), 8개 이미지의 스타일 문장을 공유해 최소한의 색감 일관성은 확보했다(`assets/gen.sh:16-32`). 그러나 영상·평가 루프가 0이므로 4단계 준수로 볼 수는 없다.

## 수정 우선순위

1. **BLOCKER:** Hero Seedance 루프 1개 + poster/reduced-motion fallback + provenance manifest.
2. **BLOCKER:** 비용 상한과 seam 검사가 있는 Gauntlet 최소 버전.
3. **MAJOR:** `docs/REFERENCES.md` 및 EPFL 골드 스탠다드 공식화.
4. **MAJOR:** `DESIGN_SYSTEM.md`, semantic token, UI/motion preset 코드화.
