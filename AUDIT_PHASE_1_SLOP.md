# 1단계 감사 — AI Slop 코드 감사 (적대적 감사)

**감사 대상:** `E:\testFront\src` 전체
**기준:** `claude-premium-webdesign-system.md` 1단계 (+ 3·6단계 교차검증)
**감사 시각:** 2026-08-22 18:12–18:20 KST

> ⚠️ **감사 중 코드가 실시간으로 수정되었음.** `src/index.css`, `src/components/Curriculum.jsx`,
> `src/components/Research.jsx`가 18:14:41에, `src/components/Navbar.jsx`가 18:14:51에 변경됐다.
> 아래 모든 지적은 **18:16 이후 재확인한 현재 코드** 기준이다. 감사 도중 고쳐진 항목은
> §0에 따로 기록했다. `src/data/content.js`는 17:57:11 이후 무변경(md5 `33107e9c…`)이므로
> 카피 관련 지적은 전부 현재도 유효하다.

---

## 0. 감사 도중 수정된 항목 (선반영 확인)

감사 시작 시점에 존재했으나 18:14에 수정된 것들. 기록 목적으로만 남긴다.

| 항목 | 감사 시작 시점 | 현재 |
|---|---|---|
| `.pane` glassmorphism | `bg-raised/60 backdrop-blur-xl rounded-2xl` | `bg-surface` 불투명, `border-radius: var(--radius-card)` |
| Navbar `backdrop-blur-xl` | 2곳 (헤더·모바일 시트) | 제거, `bg-void/95` / `bg-void` 불투명 |
| Research 태그칩 `rounded-full backdrop-blur` | 존재 | 제거, `border-y border-r` 플러시 배치 |
| 반경 토큰 | 없음 | `--radius-card/tag/pill` 신설 |

**현재 `backdrop-blur`/`backdrop-filter`는 `src/` 전체에 0건이다.** 1단계 금지항목 ③의
"유리 효과" 절반은 실제로 해소됐다. 다만 아래 **F-03**에서 보듯 그 수정이 새 결함을 만들었고,
**F-02**에서 보듯 신설된 토큰은 대부분 죽어 있다.

---

## 1. 판정 요약

| ID | 심각도 | 항목 | 근거 |
|---|---|---|---|
| **F-01** | **BLOCKER** | H1이 전형적인 추상 AI 카피 | `content.js:13` |
| **F-02** | **MAJOR** | 디자인 토큰 7개 중 6개가 미사용 — 디자인 시스템이 장식 | `index.css:20-27` |
| **F-03** | **MAJOR** | 균일 4열 카드 랙 (금지항목 ② 실질 위반) | `Research.jsx:104` |
| **F-04** | **MAJOR** | 데이터 4종이 전부 동일 템플릿 — 기계 생성 지문 | `content.js:48-104` |
| **F-05** | **MAJOR** | 최종 전환 화면에 CTA가 없고 외부 링크 3개 나열 | `content.js:129-133`, `Admission.jsx:63-81` |
| **F-06** | **MAJOR** | 스크림 그라데이션이 5개 섹션의 유일한 이미지 처리 어휘 | 8곳 (§2) |
| **F-07** | **MINOR** | 히어로 1화면 2 CTA + "전공 살펴보기"는 금지된 뻔한 CTA | `Hero.jsx:89-105` |
| **F-08** | **MINOR** | `raised`/`surface` 색상 단차 — 18:14 수정이 만든 회귀 | `Research.jsx:118` vs `index.css:66` |
| **F-09** | **MINOR** | 통계 출처로 인용한 `/README.md`가 존재하지 않음 | `content.js:1` |
| **F-10** | **MINOR** | 푸터 기술스택 자랑 | `Footer.jsx:45-47` |
| **판정** | — | **NeuralField = slop / SynapseCore = 미완성** | §7 |

---

## 2. 금지항목 ① — 정형화된 그라데이션

### ✅ 문자 그대로의 금지는 지켜졌다

`grep -rniE "purple|indigo|violet|fuchsia|8b5cf6|6366f1|a855f7" src/ index.html` → **0건.**
팔레트는 `index.css:4-12`의 근흑(`#05070b`) + 단일 시안 액센트(`#22d3ee`)뿐이다.
문서가 가장 강하게 지목한 "Classic Indigo to Violet Fade"는 이 코드베이스에 존재하지 않는다. 이건 명확히 통과다.

### ❌ F-06 (MAJOR) — 그러나 "무의미하게 반복되는 그라데이션"은 성립한다

현재 `src/`의 그라데이션 9곳 중 8곳이 **동일한 한 가지 동작** — "사진 위에 void를 깔아 글자를 읽히게 한다" — 이다.

| 파일:줄 | 코드 |
|---|---|
| `Hero.jsx:57` | `bg-gradient-to-t from-void to-transparent` |
| `Pillars.jsx:65` | `bg-gradient-to-r from-void via-void/70 to-transparent` |
| `Research.jsx:118` | `bg-gradient-to-t from-raised via-raised/25 to-transparent` |
| `Graduate.jsx:51` | `bg-gradient-to-t from-void/80 via-transparent to-void/40` |
| `Admission.jsx:50` | `bg-gradient-to-t from-void via-transparent to-void` |
| `Partners.jsx:7,8` | `bg-gradient-to-r/-l from-void to-transparent` |
| `Navbar.jsx:32` | `bg-gradient-to-b from-void/85 to-transparent` |

9개 섹션 중 5개(Hero·Pillars·Research·Graduate·Admission)가 이미지 위 텍스트라는
같은 문제를 **완전히 같은 방법으로** 푼다. 이 사이트에는 이미지 처리 아이디어가 딱 하나 있다.
문서가 금지한 건 특정 색상이 아니라 *생각 없이 반복되는 기본값*이고, `from-void to-transparent`가
바로 그 기본값 역할을 하고 있다.

**가장 나쁜 사례 — `Admission.jsx:36-50`:**

```jsx
<img src="/img/campus.webp" ... />        // campus@2x.webp = 103KB
<div className="absolute inset-0 z-10 bg-void/80" />                                          // 49행
<div className="absolute inset-0 z-10 bg-gradient-to-t from-void via-transparent to-void" />  // 50행
```

- 49행의 `bg-void/80`이 이미 이미지를 **전면 80% 가린다.**
- 50행 그라데이션은 중앙이 `via-transparent`라 49행 위에 아무것도 더하지 않고,
  상·하단에서만 `from-void`/`to-void`로 알파를 1.0까지 끌어올린다.
- **결과: 103KB 이미지가 최대 20%만 보이고, 상단 1/3과 하단 1/3에서는 0% 보인다.**
  거기에 `Admission.jsx:35`의 `.grain` 오버레이까지 얹힌다.

이건 그라데이션 남용인 동시에 페이로드 낭비다. 이미지를 쓸 거면 보이게 하고, 안 보일 거면 빼야 한다.

**수정안:**

```jsx
// 1) 이중 스크림 → 단일 스크림. 49·50행을 아래 한 줄로 대체
<div className="absolute inset-0 z-10 bg-[radial-gradient(120%_90%_at_50%_38%,color-mix(in_srgb,var(--color-void)_55%,transparent),var(--color-void)_78%)]" />

// 2) 이미지를 살릴 생각이 없다면 36-48행 <picture> 블록 전체와 Admission.jsx:21-29의
//    data-cta-bg 패럴랙스 트윈을 삭제하고, campus.webp / campus@2x.webp (161KB) 도 제거.
```

그리고 5개 섹션이 같은 스크림을 쓰는 문제 자체는, 섹션마다 **다른 이미지 처리 어휘**를 주는 것으로 푼다.
예: Research는 스크림 대신 이미지를 흑백 듀오톤(`filter: grayscale(1)` + 시안 `mix-blend-mode: color`)으로
깔고 텍스트를 이미지 **바깥**에 두면, 그라데이션 없이 대비가 확보되고 Research만의 톤이 생긴다.

---

## 3. 금지항목 ② — 균일 N열 카드

### ❌ F-03 (MAJOR) — 가로 스크롤은 위장일 뿐, 실체는 균일 카드 랙

`Research.jsx:100-140`은 네 장의 카드를 렌더한다. 네 장 모두 **같은 className 한 줄**을 공유한다:

```jsx
// Research.jsx:104
className="pane group flex shrink-0 flex-col md:h-[58vh] md:w-[clamp(340px,30vw,460px)]"
```

- **높이 고정 동일** (`md:h-[58vh]`), **폭 고정 동일** (`md:w-[clamp(340px,30vw,460px)]`)
- 내부 구조도 4장 전부 동일: 이미지 → 스크림 → 태그칩 → `h3` → `p` → 키워드 리스트
- 코드 어디에도 카드별 분기(`i === 0 ? ... : ...`)가 **없다.**

문서의 금지 문구는 *"무지성으로 화면 중간에 똑같은 크기의 기능 소개 카드를 가로 배치하는 구성"* 이다.
개수가 3이 아니라 4이고 `grid` 대신 `flex` + 핀 스크롤이라는 점은 CSS 속성의 차이일 뿐,
**"똑같은 크기의 카드를 가로로 늘어놓는다"** 는 문장에 이 코드는 그대로 해당한다.
가로 스크롤은 이 배치를 더 정교하게 만든 게 아니라, 같은 배치를 스크롤로 감춘 것이다.

**편집 관점의 실제 손해:** 이 레이아웃은 "헬스케어·스마트팩토리·디지털금융·지능형물류가
정확히 동등한 비중이며 동등한 깊이를 가진다"고 선언한다. 그런데 이 사이트의 핵심 논지는
`Research.jsx:90-91`과 `content.js:74`에 있는 **부산항**이다 — 국내 최대 물류 현장이 캠퍼스 옆에 있다는 것.
그 최고의 무기가 나머지 셋과 똑같은 460px 상자 안에 들어가 네 번째 순서로 스크롤된다.

**수정안 — 카드별 가중치 부여:**

```jsx
// content.js RESEARCH 각 항목에 weight 추가
// { slug: 'r_logistics', weight: 'lead',  ... }   // 부산항
// { slug: 'r_health',    weight: 'major', ... }
// { slug: 'r_factory',   weight: 'minor', ... }
// { slug: 'r_finance',   weight: 'minor', ... }

// Research.jsx:104 — 균일 className을 가중치 맵으로 교체
const SIZE = {
  lead:  'md:h-[74vh] md:w-[clamp(520px,42vw,720px)]',
  major: 'md:h-[62vh] md:w-[clamp(380px,32vw,500px)]',
  minor: 'md:h-[48vh] md:w-[clamp(300px,24vw,380px)]',
}
// ...
className={`pane group flex shrink-0 flex-col self-end ${SIZE[r.weight]}`}
```

`self-end`로 하단 정렬까지 주면 높이 차이가 리듬이 되고, 랙이 "그리드"가 아니라
"편집된 지면"으로 읽힌다. `weight: 'lead'` 카드에만 본문 한 단락을 더 주면 위계가 완성된다.

### ✅ 나머지 그리드는 통과

- `Stats.jsx:45` — `grid-cols-2 lg:grid-cols-4`이지만 카드가 아니라 `<dl>` 수치 목록이다
  (테두리·배경 없음, `Stats.jsx:47`). 금지 대상인 "기능 소개 카드"가 아니다.
- `Curriculum.jsx:69,77` — `md:grid-cols-[auto_1fr]`, `md:grid-cols-[220px_1fr]`.
  비대칭 2열 타임라인이고 스파인 애니메이션(`Curriculum.jsx:60-62`)이 붙어 있다. 카드 랙 아님.
- **`src/` 어디에도 3열 기능 카드 그리드는 없다.** 이 부분은 명확히 통과다.

---

## 4. 금지항목 ③ — Glassmorphism + 획일 border-radius

### ✅ backdrop-blur는 현재 0건

18:14 수정으로 4곳 전부 제거됐다. 확인: `grep -rn "backdrop-blur\|backdrop-filter" src/ index.html` → 없음.
`index.css:60-64`의 새 주석("Cards are opaque stock, not frosted glass")도 의도를 명시하고 있다.
특히 `.pane`이 불투명해진 건 성능상으로도 옳다 — 이전 `backdrop-blur-xl`(24px)은
가로 스크롤 중 카드 4장이 매 프레임 배경을 재샘플링·재블러하게 만들었고, 그 배경은
평면 `#05070b` 단색이라 시각적 산출물이 **정확히 0픽셀**이었다.

### ❌ F-02 (MAJOR) — 반경/모션 토큰 7개 중 6개가 죽은 코드

`index.css:18-27`이 새로 선언한 토큰의 실제 참조 횟수를 전수 조사했다:

| 토큰 | 선언 | 참조 |
|---|---|---|
| `--radius-card` | `index.css:20` | `index.css:78` (1회) |
| `--radius-tag` | `index.css:21` | **0회** |
| `--radius-pill` | `index.css:22` | **0회** |
| `--ease-out-expo` | `index.css:24` | **0회** |
| `--dur-fast` | `index.css:25` | **0회** |
| `--dur-base` | `index.css:26` | **0회** |
| `--dur-slow` | `index.css:27` | **0회** |

Tailwind v4는 `@theme`의 `--radius-*`로부터 `rounded-card`/`rounded-tag`/`rounded-pill`
유틸리티를 자동 생성하는데, `grep -rn "rounded-card\|rounded-tag\|rounded-pill" src/` → **0건**이다.

동시에 하드코딩은 그대로 남아 있다:

```
index.css:24   --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
Hero.jsx:124   animation: intro-up .9s cubic-bezier(.22,1,.36,1) var(--d, 0s) forwards
Hero.jsx:126   animation: intro-line 1.1s cubic-bezier(.22,1,.36,1) var(--d, 0s) forwards
```

`--ease-out-expo`와 `Hero.jsx:124,126`의 값은 **완전히 동일**하고, `--dur-base: 0.9s`는 `.9s`와,
`--dur-slow: 1.1s`는 `1.1s`와 동일하다. 즉 **토큰은 기존 하드코딩 값에서 역으로 추출됐고,
다시 코드로 연결되지 않았다.** 그리고 `rounded-full`은 여전히 5곳에서 Tailwind 기본값으로 쓰인다
(`Hero.jsx:92,100`, `Admission.jsx:70`, `Navbar.jsx:62` 계열, `Curriculum.jsx:73`, `Partners.jsx:19`).

**더 나쁜 건 선언과 실제 렌더링이 어긋난다는 것이다.** `index.css:18-19` 주석은
"card 4px / tag 2px / pill 999px" 3단 체계를 선언하지만, 실제로 렌더되는 태그 반경은 **0px**이다:

```
Research.jsx:132    className="border-l border-line pl-2.5 ..."      → radius 0
Curriculum.jsx:91   className="border border-line bg-surface ..."    → radius 0
```

문서 3단계는 *"디자인 시스템 규칙을 코드로 명확히 정의하여 프로젝트 전체에 일관되게 주입"* 을 요구한다.
현재 상태는 그 반대다 — 규칙이 CSS 주석으로만 존재하고, 컴포넌트는 규칙을 모른다.
**"획일적 border-radius"를 피하려다 "강제되지 않는 border-radius"가 됐다.** 감사에는 더 취약한 상태다.

**수정안:**

```css
/* index.css — 토큰을 실제로 강제하는 유틸리티로 승격 */
@layer utilities {
  .chip { border-radius: var(--radius-tag); }
  .pill { border-radius: var(--radius-pill); }
}
```

```jsx
// Research.jsx:132
className="chip border-l border-line pl-2.5 font-mono text-[11px] text-dim"
// Curriculum.jsx:91
className="chip border border-line bg-surface px-3.5 py-2 text-sm text-ink/90"
// Hero.jsx:92,100 · Admission.jsx:70 · Navbar.jsx:62 — rounded-full → pill
```

```css
/* Hero.jsx:123-126 인라인 <style> — 하드코딩 제거 */
.intro      { animation: intro-up   var(--dur-base) var(--ease-out-expo) var(--d,0s) forwards }
.intro-line { animation: intro-line var(--dur-slow) var(--ease-out-expo) var(--d,0s) forwards }
```

`--dur-fast`는 `duration-300`이 쓰인 8곳(`Navbar.jsx:59,84,89`, `Hero.jsx:93,96`,
`Admission.jsx:71,78`)의 공통값이므로, 그 8곳을 토큰으로 통일하지 않을 거면 토큰을 지우는 게 정직하다.
**쓰지 않을 토큰은 선언하지 않는 것이 디자인 시스템이다.**

### ❌ F-08 (MINOR) — 18:14 수정이 만든 색상 단차 회귀

`.pane` 배경이 `bg-raised/60` → `bg-surface`(`#0a0e15`)로 바뀌었는데,
그 안의 이미지 스크림은 갱신되지 않았다:

```jsx
// Research.jsx:118  — 그라데이션이 하단에서 raised(#111823)로 수렴
<div className="absolute inset-0 bg-gradient-to-t from-raised via-raised/25 to-transparent" />
// index.css:66     — 바로 아래 텍스트 패널은 surface(#0a0e15)
@apply relative overflow-hidden border border-line bg-surface;
```

이미지 하단 경계에서 `#111823 → #0a0e15` 단차가 생긴다. 어두운 화면에서 가로 밴드로 보인다.
게다가 `--color-raised`(`index.css:6`)는 이제 **이 한 줄에서만 쓰이며, 그 유일한 사용처가 버그다.**

**수정안:** `Research.jsx:118`을 `from-surface via-surface/25 to-transparent`로 바꾸고,
`--color-raised`를 유지할 이유가 남지 않으면 `index.css:6`에서 삭제.

### ✅ 정당한 잔여 사례

`Navbar.jsx:30-34`의 새 그라데이션은 주석대로 히어로 유리벽 위 링크 가독성용이고
`solid` 상태에서 `opacity-0`으로 사라진다(`Navbar.jsx:33`) — 조건부이고 목적이 명확하다.

---

## 5. 금지항목 ④ — 영혼 없는 AI 카피

`src/data/content.js`는 17:57:11 이후 무변경. 아래 전부 현재 유효하다.

### ❌ F-01 (BLOCKER) — H1이 정확히 금지된 그 문장이다

```js
// content.js:13
lines: ['지능의', '다음 장을', '여는 곳'],
```

`Hero.jsx:66`에서 `clamp(2.75rem, 9vw, 7.5rem)`로 렌더된다. **사이트에서 가장 큰 글자다.**

"지능의 다음 장을 여는 곳" — 이 문장은

- 어떤 고통도 지목하지 않고 (6단계 원칙 2 위반)
- 어떤 약속도 하지 않으며
- **부산대를 카이스트로, 서울대로, 세계 어느 AI 학과 이름으로 바꿔도 그대로 성립한다.**

문서가 금지 예시로 든 "Empower your workflow" / "Maximize efficiency"와 구조가 같다:
추상명사 + 진취적 동사 + 장소/상태. 한국어로 번역된 같은 슬롭이다.

**아이러니한 건, 바로 다음 줄에 훨씬 좋은 문장이 있다는 것이다:**

```js
// content.js:14
sub: '... 병원에서, 공장에서, 항만에서 실제로 작동하는 지능을 만듭니다.'
```

**"병원에서, 공장에서, 항만에서"** — 이게 6단계 원칙 5가 요구하는 구체적 장면이다.
현재 이 문장은 `Hero.jsx:81-87`에서 `text-muted`, `text-base`로 강등돼 있다.
**좋은 카피를 써놓고 나쁜 카피를 7.5rem으로 키운 상태다.**

**수정안 — 데이터 3줄 교체:**

```js
// content.js:11-15
export const HERO = {
  eyebrow: 'Pusan National University · School of AI',
  lines: ['병원에서,', '공장에서, 항만에서', '작동하는 지능'],
  sub: '부산대 인공지능전공은 논문에서 끝나는 모델을 만들지 않습니다. 캠퍼스에서 한 시간 안에 있는 의료기관·제조 클러스터·부산항이 그대로 실험실입니다.',
}
```

`Hero.jsx:71-73`의 마지막 줄 `text-accent-soft` 강조는 그대로 두면 "작동하는 지능"에 걸려
의미상으로도 맞아떨어진다. 코드 변경 불필요.

### ❌ F-04 (MAJOR) — 데이터가 기계 생성 템플릿임을 수치로 증명

기계적으로 세어봤다:

```
RESEARCH   키워드 개수: 3, 3, 3, 3
RESEARCH   본문 문장수: 2, 2, 2, 2
CURRICULUM 과목 개수:  4, 4, 4, 4
```

`content.js:48-77`의 RESEARCH 네 항목은 **문장 구조까지 동일하다:**

| 항목 | 구조 |
|---|---|
| `content.js:53` | `의료 영상 판독, 생체 신호 기반 조기 진단, 임상 의사결정 지원.` + 지역근거 1문장 |
| `content.js:60` | `설비 이상 탐지, 공정 최적화, 비전 기반 품질 검사.` + 지역근거 1문장 |
| `content.js:67` | `이상거래 탐지, 신용 리스크 모델링, 시계열 예측.` + 지역근거 1문장 |
| `content.js:74` | `항만 하역 스케줄링, 수요 예측, 경로 최적화.` + 지역근거 1문장 |

**`[명사구, 명사구, 명사구]. [지역적 근거 한 문장].`** — 네 번 반복된 하나의 틀이다.
`content.js:30-46`의 PILLARS 세 항목도 전부 `[주장 1문장]. [설계의도 1문장].`이고,
`content.js:79-104`의 CURRICULUM 네 항목도 전부 `[선언 1문장]. [부연 1문장].`에 과목이 정확히 4개씩이다.

단어 하나하나는 구체적이다(이게 이 사이트가 대부분의 슬롭보다 나은 점이다).
그러나 **네 항목이 소수점까지 같은 리듬을 갖는 건 사람이 쓴 글의 특성이 아니다.**
실제 커리큘럼에 학년마다 정확히 4과목이 배정되는 일은 없다. 이 균일성이 곧 생성 지문이고,
§3의 균일 카드 레이아웃은 이 균일 데이터의 필연적 결과다 — 레이아웃만 고쳐도 소용없다.

**수정안 — 의도적 비대칭 주입:**

```js
// content.js RESEARCH — 부산항만 편집적으로 확장하고, 나머지는 오히려 줄인다
{
  slug: 'r_logistics', tag: 'Intelligent Logistics', title: '지능형 물류',
  body: '2024년 부산항 컨테이너 물동량은 2,430만 TEU였습니다. 그 숫자 뒤에는 선석 배정, 장치장 재배치, 반출입 예약이라는 세 개의 스케줄링 문제가 있고, 셋 다 아직 사람이 엑셀로 풉니다. 학부 4학년 캡스톤 과제 중 셋이 이 문제에서 나왔습니다.',
  keywords: ['선석배정', '장치장최적화', '반출입예약', 'ETA예측', '강화학습'],  // 5개
},
{
  slug: 'r_finance', tag: 'Digital Finance', title: '디지털금융',
  body: '이상거래 탐지에서 정확도보다 먼저 요구되는 건 "왜 막았는지" 설명하는 능력입니다.',
  keywords: ['설명가능AI', '이상거래탐지'],  // 2개
},
```

키워드 2·3·5개, 본문 1·2·3문장으로 흩어놓으면 §3의 `weight` 위계와 맞물려
레이아웃과 카피가 같은 편집 판단을 공유하게 된다.
※ 위 수치(2,430만 TEU 등)는 예시다. 반드시 실제 출처로 검증 후 반영할 것 — **F-09** 참조.

### ❌ F-05 (MAJOR) — 마지막 화면에 CTA가 없다

```js
// content.js:128
body: '... 부산대학교 입학본부와 정보컴퓨터공학부 홈페이지에서 확인할 수 있습니다.'
// content.js:129-133
links: [
  { label: '정보컴퓨터공학부', href: 'https://cse.pusan.ac.kr/...' },
  { label: 'AI대학원',        href: 'https://ai.pusan.ac.kr/' },
  { label: '부산대학교',       href: 'https://www.pusan.ac.kr/' },
]
```

`Admission.jsx:63-81`이 이 셋을 나란히 렌더한다. 문제:

1. **CTA가 아니라 링크 덤프다.** 세 개 다 기관 홈페이지 최상단으로 나가는 이탈 링크다.
2. **6단계 원칙 3 (One Ask Per Screen) 위반** — 한 화면에 동등한 선택지가 3개다.
   `Admission.jsx:72-74`가 첫 번째만 `bg-accent`로 강조하지만, 하필 그 첫 번째가
   가장 덜 구체적인 학부 홈페이지다.
3. **6단계 원칙 4 위반** — 문서는 "Get Started" 대신 "Start your first lesson"을 요구한다.
   "정보컴퓨터공학부"는 "Get Started"보다도 못하다. 동사가 아예 없다.
4. **본문이 "다른 데 가서 알아보세요"라고 말한다.** 사이트 전체가 쌓아온 설득이
   마지막 문장에서 사용자를 밖으로 내보낸다.

**수정안 — 단일 구체 CTA + 부가정보 강등:**

```js
// content.js:126-134
export const ADMISSION = {
  title: '다음 학번은\n당신일 수 있습니다',
  body: '2026학년도 수시 원서접수는 9월 8일에 시작합니다. 인공지능전공은 정보컴퓨터공학부 내 단일 모집이며, 정원은 68명입니다.',
  primary: { label: '2026 수시 모집요강 보기', href: 'https://go.pusan.ac.kr/' },
  secondary: [
    { label: '정보컴퓨터공학부', href: 'https://cse.pusan.ac.kr/cse/70536/subview.do' },
    { label: 'AI대학원',        href: 'https://ai.pusan.ac.kr/' },
  ],
}
```

```jsx
// Admission.jsx:63-81 — primary 하나만 버튼, 나머지는 텍스트 링크로 강등
<div data-cta-in className="reveal mt-12 flex translate-y-6 flex-col items-center gap-6">
  <a href={ADMISSION.primary.href} target="_blank" rel="noopener noreferrer"
     className="pill group inline-flex items-center gap-2.5 bg-accent px-9 py-4 text-base font-semibold text-void">
    {ADMISSION.primary.label}
    <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
  </a>
  <p className="flex gap-6 text-sm text-dim">
    {ADMISSION.secondary.map((l) => (
      <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
         className="underline underline-offset-4 hover:text-accent">{l.label}</a>
    ))}
  </p>
</div>
```

※ 날짜·정원은 반드시 실제 모집요강으로 검증할 것. **F-09** 참조.

### ❌ F-07 (MINOR) — 히어로도 같은 병이다

```jsx
// Hero.jsx:89-105
<a href="#about">전공 살펴보기 →</a>      // 91-97행
<a href="#admission">입학 안내</a>         // 98-104행
```

- **"전공 살펴보기"** 는 문서가 금지한 "Get Started(시작하기)"의 한국어판이다.
  "살펴보기"는 사용자에게 아무 약속도 하지 않는다.
- 1화면 2 CTA — 원칙 3 위반. 게다가 `Hero.jsx:108-117`의 "Scroll" 큐까지 있어
  히어로 한 화면이 사용자에게 **세 가지 다른 행동**을 제안한다.

**수정안:** 두 번째 버튼(`Hero.jsx:98-104`) 삭제 — 상단 Navbar(`Navbar.jsx:60-67`)에
이미 "입학 안내"가 상시 노출돼 있으므로 정보 손실이 없다. 첫 버튼은 목적지를 말하게 바꾼다:

```jsx
<a href="#research" className="pill group inline-flex items-center gap-2.5 bg-accent px-7 py-3.5 text-sm font-semibold text-void ...">
  부산항이 실험실인 이유
  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
</a>
```

### ✅ MANIFESTO는 이 사이트 최고의 카피다

```js
// content.js:17-21
'모델을 학습시키는 법은 어디서든 배울 수 있습니다.',
'어떤 문제에 그 모델을 써야 하는지를 아는 사람은 드뭅니다.',
'우리는 후자를 길러냅니다.',
```

실제 구분을 짓고, 관점이 있고, 세 문장의 길이가 서로 다르다(§F-04의 템플릿 병이 여기엔 없다).
`Manifesto.jsx:14-24`가 단어 단위로 밝혀주는 연출과도 맞다 — 문장이 논증이라 한 단어씩 읽힐 가치가 있다.
**이 문장의 화자를 H1에 앉히면 F-01이 해결된다.**

### ❌ F-09 (MINOR) — 인용한 출처 파일이 없다

```js
// content.js:1
// Every figure below comes from PNU's own published material — see /README.md for sources.
```

`ls README.md` → **No such file or directory.** 루트에 README.md가 없다.
`content.js:23-28`의 STATS는 정원 68명, 공동학과 128명, 2023년 신설 등 검증 가능한 사실을 주장하는데,
그 근거로 지목된 파일이 존재하지 않는다. 6단계가 말하는 신뢰도 문제다.

**수정안:** README.md에 각 수치별 출처 URL·확인일자를 적거나, 그럴 계획이 없으면
`content.js:1` 주석을 실제 출처 URL로 교체하라. 존재하지 않는 파일을 가리키는 주석이 최악이다.

### ❌ F-10 (MINOR) — 푸터 기술스택 자랑

```jsx
// Footer.jsx:45-47
<p className="font-mono">Built with Higgsfield CLI · Three.js · GSAP</p>
```

고등학생과 학부모가 보는 학과 사이트에서 빌드 툴체인을 자랑하는 건 관객을 잘못 잡은 것이고,
"AI로 만들었습니다"를 자진 신고하는 꼴이라 1단계 취지와 정면으로 어긋난다.

**수정안:** 삭제하거나 실제로 유용한 정보로 교체 — 최종 업데이트 일자, 문의 이메일 등.

---

## 6. 잘 지켜진 항목 (짧게)

- **팔레트:** 퍼플-인디고 0건. `index.css:4-12` 단일 시안 액센트 체계는 절제돼 있고 일관적이다.
- **3열 기능 카드:** `src/` 전체에 없음. `Stats`는 `<dl>` 수치, `Curriculum`은 비대칭 타임라인이다.
- **backdrop-blur:** 현재 0건 (18:14 수정으로 해소).
- **접근성:** 스킵 링크(`App.jsx:31-37`), 캔버스 `aria-hidden`(`NeuralField.jsx:147`,
  `SynapseCore.jsx:143`), `prefers-reduced-motion` 14곳 처리, `Partners.jsx:12`의
  중복 행 `aria-hidden`. 이 수준까지 챙긴 건 드물다.
- **정직성:** `Footer.jsx:33-44`가 비공식 컨셉 사이트임을 명시한다. 옳다.
- **Hero 대각 스크림:** `Hero.jsx:56`의 `color-mix` 100deg 스크림은 Tailwind 기본값이 아니라
  사진에 맞춰 손으로 튜닝한 값이다. §F-06의 예외로 인정한다.

---

## 7. 독창성 판정 — NeuralField / SynapseCore

### `NeuralField.jsx` → **판정: SLOP**

**근거 1 — 구현이 particles.js 링크모드의 재작성이다.**

| `NeuralField.jsx` | 클리셰 레시피 |
|---|---|
| `:12` `LINK_DIST = 2.15` + `:86-104` 매 프레임 O(n²) 근접 링크 재계산 | particles.js `linkedParticles` 그 자체 |
| `:25-30` 노드 위치·속도 전부 `Math.random()` | 무의미 난수 배치 |
| `:117-125` 방사형 그라데이션 스프라이트 + `AdditiveBlending` | 표준 글로우 파티클 |
| `:123` `color="#9fe8ff"` / `:129` `#22d3ee` (Tailwind cyan-400) | 시안-on-근흑 = AI 사이트 기본 배색 |
| `:109-111` 커서 방향 그룹 회전 패럴랙스 | 표준 마우스 패럴랙스 |

직접 짰다는 사실은 독창성이 아니다. **손으로 쓴 클리셰일 뿐이다.**
2015년 이후 AI·블록체인·SaaS 랜딩의 기본 배경이 정확히 이 조합이다.

**근거 2 — 아무것도 의미하지 않는다.** `:25-30`이 증명한다. 노드는 난수다.
부산대와도, AI 교육과도, 어떤 실제 데이터와도 무관하다. "신경망"이라는 의미를 *주장하지만*
실제로는 지시 대상이 없는 장식이다. §F-04의 템플릿 카피와 같은 종류의 실패다 —
의미의 형식만 갖추고 내용은 비어 있다.

**근거 3 — 사이트 스스로도 안 믿는다.** `Hero.jsx:59`에서 `opacity-45`로 렌더되고,
그 위아래로 `Hero.jsx:56`, `:57` 스크림 두 겹과 `.grain`(`Hero.jsx:40`)이 덮는다.
WebGL 캔버스 하나와 프레임당 약 1,900회(62²/2) 거리 계산을 쓰면서, 결과물은
네 겹에 눌려 거의 보이지 않는다. **비용은 실재하고 산출은 희미하다.**

#### 대체안 (권장순)

**A안 — 난수를 실제 커리큘럼 DAG로 교체 (노드 그래프를 유지하되 정보로 전환)**

`content.js`의 CURRICULUM 16과목을 노드로, 실제 선수과목 관계를 엣지로 쓴다.
같은 렌더러를 쓰되 난수만 없앤다.

```js
// content.js — 추가
export const COURSE_GRAPH = {
  nodes: [
    { id: 'prog', label: '프로그래밍 기초',   year: 1 },
    { id: 'disc', label: '이산수학',         year: 1 },
    { id: 'lin',  label: '선형대수',         year: 1 },
    { id: 'prob', label: '확률과 통계',      year: 1 },
    { id: 'ds',   label: '자료구조·알고리즘', year: 2 },
    { id: 'ml',   label: '기계학습',         year: 2 },
    // ... 4학년 캡스톤까지
  ],
  edges: [['prog','ds'], ['lin','ml'], ['prob','ml'], ['ds','ml'], ['ml','dl']],
}
```

```jsx
// NeuralField.jsx — :20-37 초기화를 교체
// 1) positions를 학년별 레이어로 배치 (x = year, y/z = 레이어 내 분산)
//    → 그래프가 왼쪽(1학년)에서 오른쪽(4학년)으로 흐르는 형태가 된다
// 2) :86-104의 O(n²) 근접 탐색을 COURSE_GRAPH.edges 고정 리스트 순회로 교체
//    → 매 프레임 거리 계산이 사라져 오히려 가벼워진다
// 3) 엣지를 따라 시안 임펄스를 흘려보내 "선수과목 → 후수과목" 방향성을 보여준다
```

이러면 (a) 배경이 실제 정보가 되고, (b) 다른 학교가 복사할 수 없으며,
(c) `Hero.jsx:59`의 `opacity-45`를 걷어내고 당당히 보여줄 이유가 생기고,
(d) O(n²)가 사라져 성능이 개선된다.

**B안 — 부산항 실데이터 필드.** 부산항 선석 배치나 컨테이너 물동량 시계열을 필드로 렌더한다.
이 사이트의 실제 논지(`content.js:74`, `Research.jsx:90-91`)와 정확히 일치하고,
"부산에 있다는 것이 곧 커리큘럼"이라는 주장을 배경이 증명하게 된다.

**C안 (최소비용) — 히어로에서 WebGL 제거.** `Hero.jsx:59` 한 줄과 `NeuralField.jsx` 전체를 삭제.
`Hero.jsx:56`의 잘 만든 대각 스크림과 `.grain`, 그리고 큰 타이포만으로 히어로는 성립한다.
어차피 `opacity-45`로 안 보이는 것을 지우는 것이므로 **시각적 손실이 거의 없고 번들과
프레임 예산이 줄어든다.** F-01 카피 수정만 해도 히어로는 지금보다 강해진다.

---

### `SynapseCore.jsx` → **판정: 구조상 slop 아님. 그러나 현재 상태로는 의미가 전달되지 않음 (미완성)**

**slop이 아니라고 보는 근거 — 이건 앰비언트가 아니라 서사에 묶여 있다.**

- `:14-55`가 세 개의 명시적 목표 형상을 정의한다: `sphereTargets`(구) → `latticeTargets`(격자) → `burstTargets`(발산).
- `:86` `progressRef.current`가 `Pillars.jsx:32-34`의 ScrollTrigger `onUpdate`와 연결돼,
  모프가 **스크롤 진행도에 의해 저작된다.** 시간에 따라 그냥 도는 배경이 아니다.
- `:46-47` `const lobe = i % 4` — 발산 형상이 네 갈래인 건 우연이 아니라
  `content.js:48-77`의 응용 4개 영역과 대응시킨 것이다.
- `:8-9` 주석이 의도를 명시한다: "raw data → learned structure → applied in the field."
- `Pillars.jsx:36` `progressRef`를 ref로 흘려 스크롤 중 React 리렌더가 없다 — 엔지니어링도 단정하다.

**그러나 그 의미는 오직 주석에만 존재한다.**

`SynapseCore`는 `Pillars.jsx:61-64`에 핀으로 붙어 있다. 그런데 PILLARS 카피(`content.js:30-46`)는
무엇을 말하는가?

| 패널 | 카피 주제 (`content.js`) | 같은 순간의 3D 형상 |
|---|---|---|
| 01 | 두 대학, 하나의 학과 — **거버넌스** | 구 (원시 데이터) |
| 02 | 문제에서 출발하는 교육 — **교수법** | 격자 (학습된 구조) |
| 03 | 학부에서 대학원까지 — **진학 경로** | 발산 (현장 적용) |

**완전히 다른 두 이야기가 같은 화면에서 동시에 진행된다.**
거버넌스·교수법·진학경로를 읽는 동안, 화면에서는 데이터→구조→응용이 벌어진다.
사용자에게 이 대응을 알려주는 텍스트는 화면 어디에도 없다. 결과적으로 관객이 보는 것은
**"스크롤에 반응해 모양이 바뀌는 파란 파티클 덩어리"** — 즉 NeuralField와 구분되지 않는 장식이다.

정교하게 설계했으나 그 설계가 사용자에게 도달하지 않는다. **slop이라서가 아니라, 전달되지 않아서 미완성이다.**

#### 수정안 (택1)

**A안 — 카피를 형상에 맞춘다 (권장, 변경 최소).**
PILLARS를 3D가 실제로 말하는 것으로 다시 쓴다. 현재의 거버넌스·교수법·진학경로 내용은
Graduate 섹션(`content.js:115-124`)과 상당 부분 중복이므로 옮겨도 손실이 적다.

```js
// content.js:30-46
export const PILLARS = [
  { n: '01', title: '데이터는 정리되어 오지 않는다',
    body: '병원 PACS에서 나온 영상에는 촬영 기기가 열두 종류 섞여 있습니다. 1·2학년 과정은 이 상태의 데이터를 다루는 법에서 시작합니다.' },
  { n: '02', title: '구조를 찾아내는 것이 학습이다',
    body: '2학년 기계학습은 라이브러리를 부르기 전에 경사하강을 직접 구현합니다. 무엇이 일어나는지 아는 사람만이 실패한 모델을 고칠 수 있습니다.' },
  { n: '03', title: '현장에서만 드러나는 제약이 있다',
    body: '4학년 캡스톤은 실제 기관의 데이터와 실제 마감에 묶입니다. 항만 스케줄러는 0.3초 안에 답해야 하고, 그 제약이 모델 선택을 바꿉니다.' },
]
```

이러면 구→격자→발산이 각 패널의 주장을 **문자 그대로 그린다.** 3D가 삽화가 되고,
`SynapseCore.jsx:8-9`의 주석이 주장하던 의미가 처음으로 화면에 나타난다.

**B안 — 형상을 Research로 옮긴다.**
`burstTargets`의 4개 로브(`:46-47`)가 이미 4개 연구영역과 대응하므로,
`SynapseCore`를 `Pillars`에서 `Research`로 이동하고 발산 로브가 실제 4장의 카드 위치로
수렴하도록 하면 대응이 눈에 보인다. 다만 Research는 이미 가로 핀 스크롤이라 충돌 위험이 있어 A안보다 비싸다.

**어느 쪽이든 `SynapseCore.jsx:8-9` 주석은 코드 주석이 아니라 화면 위 텍스트가 되어야 한다.**

---

### 이 사이트의 진짜 독창성은 어디에 있는가

적대적으로 뒤졌지만, 세 가지는 진짜다:

1. **`Manifesto.jsx:14-24` + `content.js:17-21`** — 단어 단위 밝힘 연출과, 그 연출을 견딜
   만큼 논증인 3문장. 사이트에서 가장 좋은 30초다.
2. **지역 논지** — `content.js:90-91`의 "동남권은 병원, 제조 클러스터, 금융, 그리고 부산항을
   한 시간 거리 안에 가지고 있습니다." 이건 다른 어떤 AI 학과도 복사할 수 없는 주장이다.
   **이 사이트의 유일한 진짜 자산이다.**
3. **`Hero.jsx:56`** — 사진에 맞춰 손으로 튜닝한 `color-mix` 대각 스크림.

**결론:** 이 사이트의 차별점은 3D가 아니라 **부산이라는 지리적 논증**이다.
그런데 현재 그 논증은 `content.js:90`의 부제 한 줄과 네 장 중 네 번째 카드에 묻혀 있고,
화면 면적과 프레임 예산의 대부분은 어느 AI 사이트에나 있는 파란 파티클이 가져간다.
**F-01(H1 교체)과 F-03(부산항 카드 확대) 두 가지만 고쳐도 이 사이트는 지금과 다른 사이트가 된다.**
NeuralField 대체(§7 A/B안)까지 하면 배경조차 이 학교만의 것이 된다.

---

## 8. 권장 처리 순서

| 순서 | 항목 | 예상 변경량 | 효과 |
|---|---|---|---|
| 1 | **F-01** H1 교체 | `content.js` 3줄 | 가장 큰 글자가 슬롭에서 논증으로 |
| 2 | **F-05** Admission 단일 CTA | `content.js` + `Admission.jsx` 20줄 | 전환 화면 복구 |
| 3 | **F-03** 카드 위계 (`weight`) | `content.js` + `Research.jsx` 15줄 | 금지항목 ② 실질 해소 |
| 4 | **F-04** 데이터 비대칭화 | `content.js` | 생성 지문 제거 |
| 5 | **F-02** 토큰 실배선 or 삭제 | `index.css` + 6개 컴포넌트 | 3단계 요건 충족 |
| 6 | **F-06** Admission 이중 스크림 정리 | `Admission.jsx` 2줄 | 161KB 절감 |
| 7 | **F-08** `raised`→`surface` | `Research.jsx:118` 1줄 | 회귀 수정 |
| 8 | **NeuralField** A안 또는 C안 | 신규 or 삭제 | 배경이 정보가 됨 |
| 9 | **SynapseCore** A안 (PILLARS 재작성) | `content.js:30-46` | 3D 의미 전달 |
| 10 | F-07 / F-09 / F-10 | 각 1-5줄 | 마감 |
