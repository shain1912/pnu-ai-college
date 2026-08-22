# 씬 계약 (Scene Contract)

여러 에이전트가 동시에 씬을 만든다. 이 문서는 그 결과가 합쳐질 수 있게 하는 규약이다.
**계약을 벗어난 산출물은 통합 단계에서 버려진다.**

## 1. 파일 소유권 — 가장 중요

각 씬 에이전트는 **자기 씬 파일 하나만** 만들고 수정한다.

```
src/scenes/<SceneName>.jsx      ← 너의 소유. 여기만 쓴다.
```

**절대 건드리지 말 것** (다른 에이전트가 동시에 작업 중):

| 경로 | 소유자 |
|---|---|
| `src/index.css`, `src/hooks/`, `src/motion/` | 모션 시스템 에이전트 |
| `assets/`, `public/img/`, `public/video/` | 힉스필드 에이전트 |
| `src/pages/`, `src/layout/`, `src/App.jsx` | 통합 에이전트 |
| `src/data/` | 아무도 수정하지 않음 (읽기 전용) |

씬을 페이지에 배선하는 것은 통합 에이전트의 일이다. 너는 컴포넌트만 완성해 두면 된다.

## 2. 씬 컴포넌트 시그니처

```jsx
// src/scenes/ExampleScene.jsx
export default function ExampleScene() {
  return <section id="..." className="band bg-canvas">...</section>
}
```

- props 없이 자립해야 한다. 데이터는 `src/data/*` 에서 직접 import 한다.
- 최상위는 `<section>` 하나. 페이지가 여러 씬을 세로로 쌓는다.
- `id` 는 씬 목록표에 지정된 값을 그대로 쓴다 (앵커 링크가 걸려 있다).

## 3. 디자인 토큰 — 새로 만들지 말 것

| 용도 | 토큰 |
|---|---|
| 배경 | `bg-canvas` (흰색) / `bg-canvas-subtle` (연회색) |
| 텍스트 | `text-ink` / `text-ink-muted` / `text-ink-subtle` / `text-ink-faint` |
| 브랜드 | `text-brand` `bg-brand` (장식용) · `bg-brand-strong` (**흰 글자를 얹는 면은 반드시 이것**) |
| 경계 | `border-line` |
| 여백 | `.band` (섹션 상하) · `.band-tight` · `.edge` (1120px) · `.edge-wide` (1280px) |
| 타이포 | `.display` `.h1` `.h2` `.h3` `.lead` |
| 카드 | `.card` |
| 반경 | `--radius-sm/md/lg/xl/pill` |
| 모션 | `--dur-fast(120ms)` `--dur-base(200ms)` `--dur-enter(400ms)` `--ease-standard` `--ease-enter` |

`bg-brand`(#3182F6) 위에 작은 흰 글자를 올리면 WCAG AA 미달이다(3.71:1).
흰 글자를 얹어야 하면 `bg-brand-strong`(#1B64DA, 5.41:1)을 쓴다.

## 4. 모션 규칙 — 근거 있는 것만

`docs/motion/reference.md` 실측: Linear·Stripe·EPFL·MIT **네 곳 모두 스크롤 진입
애니메이션이 없다**. 같은 스크롤 위치를 두 번 찍어 픽셀 diff 0.00으로 검증됐다.

- **최초 화면 진입 1회만** 애니메이션한다. `data-reveal` 을 쓰면 훅이 알아서 처리한다.
  스크롤해서 도달하는 요소에는 붙이지 마라.
- 상호작용(hover·click·탭·아코디언)에는 전환을 **반드시** 넣는다. 네 레퍼런스 모두 가지고 있다.
- 기관 사이트(MIT·EPFL) 절제 수준이 상한선이다. 상업 사이트 화법을 베끼지 마라.
- 금지: 패럴랙스, 스크롤 하이재킹, 장식용 파티클, 자석 커서, 상시 그라데이션 배경.
- `prefers-reduced-motion` 에서 모든 동작이 최종 상태로 즉시 표시돼야 한다.

## 5. 에셋 참조

힉스필드 에이전트가 `public/img/` 와 `public/video/` 를 채운다.
씬은 **경로로만 참조**하고, 파일이 아직 없어도 코드를 완성해 둔다.

```jsx
<img src="/img/<slug>@2x.webp" alt="..." width={...} height={...} loading="lazy" decoding="async" />
```

영상이 있는 자리는 `prefers-reduced-motion` 에서 poster 이미지로 대체한다
(`src/hooks/useMedia.js` 의 `useReducedMotion`).

필요한 에셋이 없으면 씬 파일 상단 주석에 적어라. 힉스필드 에이전트가 읽는다.

```jsx
/* ASSET-REQUEST: <slug> — 16:9 — 무엇을 보여줘야 하는지 한 문장 */
```

## 6. 사실 규칙

수치와 명칭은 `src/data/content.js`, `src/data/schools.js`, `src/data/departments.js`
에서만 가져온다. **직접 쓰지 마라.** 원문에 없는 사실을 지어내면 통합 단계에서 폐기된다.

## 7. 문체

해요체로 통일한다. 합니다체 혼용 금지.

## 8. 검증 — 제출 전 필수

```bash
npm run build            # 통과해야 한다
node scripts/capture-motion.mjs load http://localhost:5188/<경로> <slug> --frames 12 --every 90
```

캡처한 컨택트시트를 **Read 로 직접 열어 보고**, 의도한 대로 보이는지 확인한 뒤 제출한다.
안 보이면 고쳐라. "구현했다"로 끝내지 마라.

## 9. 씬 목록

| # | 씬 파일 | id | 배치 경로 | 내용 |
|---|---|---|---|---|
| 1 | `HeroScene.jsx` | `top` | `/` | 출범 선언, 히어로 영상, 단일 CTA |
| 2 | `GatewayScene.jsx` | `gateway` | `/` | 3개 관문 카드 (AI대학 / A.U.R.A / Google) |
| 3 | `FactSheetScene.jsx` | `summary` | `/` | 한눈에 보기 팩트시트 |
| 4 | `BackgroundScene.jsx` | `why` | `/ai-college` | 설립 배경, As-Is → To-Be 4행 |
| 5 | `StructureScene.jsx` | `structure` | `/ai-college` | ADP+X 요약, 5개 학부 카드 |
| 6 | `ScaleScene.jsx` | `numbers` | `/ai-college` | 규모와 인프라, 숫자 4종 |
| 7 | `ApexScene.jsx` | `apex` | `/ai-college` | PNU-APEX 4대 기구 |
| 8 | `ProgramScene.jsx` | `programs` | `/ai-college` | 특화 프로그램 3종 + 참여 기업 |
| 9 | `AxisScene.jsx` | `axes` | `/ai-college/adpx` | 네 역할 + 축별 탭 |
| 10 | `ChainScene.jsx` | `chain` | `/ai-college/adpx` | 가치사슬 사례 (부산항 4단계) |
| 11 | `RoadmapScene.jsx` | `roadmap` | `/ai-college/roadmap` | 2026–2030 5개년 |

기존 페이지의 해당 섹션을 씬으로 옮기는 작업이다. 현재 구현은 `src/pages/*.jsx` 에 있으니
읽고 출발점으로 삼되, **모션과 시각 완성도를 끌어올리는 것이 목적**이다. 그대로 복사하지 마라.
