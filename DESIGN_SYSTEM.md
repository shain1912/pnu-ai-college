# 디자인 시스템

토큰의 단일 출처는 `src/index.css`의 `@theme` 블록입니다. 이 문서는 그 토큰이
*무엇을 위한 것인지*, 그리고 코드만으로는 보존되지 않는 결정(금지 사례, 인터랙션 계약,
N/A 판정)을 기록합니다.

## 1. 컬러

| 토큰 | 값 | 역할 |
|---|---|---|
| `--color-void` | `#05070b` | 페이지 바탕. 이 위에만 흰 텍스트를 올린다 |
| `--color-surface` | `#0a0e15` | 카드·칩의 불투명 바탕 (`.pane`) |
| `--color-raised` | `#111823` | surface 위에 한 단 더 올라간 면 |
| `--color-line` | `#1c2634` | 모든 1px 경계선 |
| `--color-ink` | `#e9eef5` | 본문 최고 대비 |
| `--color-muted` | `#8695a9` | 본문 보조 |
| `--color-dim` | `#5b697d` | 캡션·메타 |
| `--color-accent` | `#22d3ee` | 유일한 액센트. 링크, 진행 표시, 임펄스 |
| `--color-accent-soft` | `#7dd3fc` | 헤드라인 마지막 줄, 액센트의 저채도 변형 |

**금지:** 두 번째 액센트 색 도입. 보라-인디고 계열 그라데이션. semantic 토큰을 두고
raw hex 직접 사용.

**스크림 레시피** — 사진 위 텍스트 가독성은 두 가지 방식만 쓴다.
- 대각 (`Hero`): `linear-gradient(100deg, void 88% → void 55% → transparent 72%)`
- 하단 페이드: `bg-gradient-to-t from-void`, 높이 1/3 이하

## 2. 타이포그래피

| 용도 | 서체 | 비고 |
|---|---|---|
| 본문·제목 | Pretendard Variable | SIL OFL 1.1, 상업 사용 가능. dynamic subset, `font-display: swap` |
| 라벨·수치 | IBM Plex Mono | SIL OFL 1.1. **한글 글리프 없음** → 스택에 Pretendard를 반드시 뒤에 둔다 |

트래킹은 크기별로 나눈다. 일괄 `-0.03em`은 120px 한글에서 글자가 겹친다.

| 요소 | letter-spacing |
|---|---|
| `h1` (clamp 44–120px) | `-0.012em` |
| `h2`, `h3` | `-0.025em` |
| 기타 헤딩 | `-0.02em` |

`word-break: keep-all`을 전역 적용해 한국어 단어가 줄 끝에서 쪼개지지 않게 한다.

**주의:** 새 weight를 쓰기 전에 `index.html`의 Google Fonts URL에 그 weight가
있는지 확인할 것. 없으면 브라우저가 합성 볼드를 만든다.

## 3. 형태 · 간격

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius-card` | `4px` | `.pane` 카드 |
| `--radius-tag` | `2px` | 칩·태그 |
| `--radius-pill` | `999px` | 버튼만 |

**의도적으로 불균일하다.** 모든 요소에 같은 반경을 주는 것이 템플릿의 신호이므로,
카드는 각지게, 컨트롤만 완전히 둥글게 간다.

컨테이너는 `.edge` 하나로 통일 (`max-w-[1440px]`, 패딩 24 → 40 → 64px).

## 4. 모션

| 토큰 | 값 |
|---|---|
| `--ease-out-expo` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-fast` | `0.3s` — hover, 색 전환 |
| `--dur-base` | `0.9s` — 요소 등장 |
| `--dur-slow` | `1.1s` — 헤드라인 라인 리빌 |

**규칙**
- 히어로 인트로는 **CSS 키프레임**으로만 한다. GSAP 타임라인은 StrictMode의
  마운트/정리/재마운트 주기에 중간에 죽어 요소가 얼어붙는다.
- GSAP은 ScrollTrigger 전용. `scrub`은 0.5–0.8 사이.
- 핀 고정 구간은 화면당 하나의 생각만 담을 때에만 쓴다.
- `prefers-reduced-motion`에서는 3D 캔버스를 **마운트하지 않고**, 비디오 대신
  포스터 이미지를 렌더하며, 모든 인트로 애니메이션이 최종 상태로 즉시 표시된다.

## 5. 컴포넌트

| 컴포넌트 | 변형 | 상태 |
|---|---|---|
| 버튼 | primary (accent 채움) / secondary (line 테두리) | hover: `-translate-y-0.5`, focus: 브라우저 기본 링 유지 |
| `.pane` | 단일 | `::before`로 상단 1px 액센트 하이라이트 |
| 태그 칩 | 단일 | `border-l` 플러시. 배경 없음 |
| 내비 | transparent / solid (`scrollY > 40`) | 상단에서는 뒤에 void 스크림을 깔아 대비 확보 |

**금지:** `backdrop-blur` / `backdrop-filter`. 유리 효과는 브리프가 금지했고,
사진 배경 위에서는 스크롤 프레임마다 전체 리페인트를 유발한다.
현재 `src/` 전체에 0건이며 그 상태를 유지한다.

## 6. 인증 플로우 — **N/A**

이 사이트에는 로그인·회원가입이 없다. 의도적 결정이며 누락이 아니다.
유일한 전환 경로는 입학 정보를 향한 외부 링크(`ADMISSION.links`)이고,
모두 `target="_blank" rel="noopener noreferrer"`로 연다.

## 7. 에셋 인벤토리

전 에셋은 Higgsfield CLI 생성물. 원본은 `assets/raw/`, 웹 최적화본은 `public/img/`.

| 슬러그 | 모델 | 비율 | 사용처 | alt |
|---|---|---|---|---|
| `hero-loop` | `seedance_2_5` (omni_reference) | 21:9 | Hero 배경 루프 | 장식 (`aria-hidden`) |
| `hero-poster` | 위 영상 1프레임 | 21:9 | 비디오 포스터 / reduced-motion 대체 | 장식 |
| `campus` | `nano_banana_pro` | 16:9 | Admission 배경 | 장식 |
| `lab` | `nano_banana_pro` | 16:9 | Graduate | "야간 머신러닝 연구실 전경" |
| `r_health` | `nano_banana_pro` | 4:5 | Research 카드 | 도메인명 |
| `r_factory` | `nano_banana_pro` | 4:5 | Research 카드 | 도메인명 |
| `r_finance` | `nano_banana_pro` | 4:5 | Research 카드 | 도메인명 |
| `r_logistics` | `nano_banana_pro` | 4:5 | Research 카드 | 도메인명 |
| `lattice` | `nano_banana_pro` | 1:1 | (예비) | — |

정확한 프롬프트와 job ID는 `assets/specs.json`, `assets/jobs.txt`,
`assets/gauntlet-log.json`에 있다.

## 8. 히어로 배경 그래프

`src/components/CurriculumField.jsx`가 렌더하는 것은 파티클 필드가 아니라
`COURSE_GRAPH`(`src/data/content.js`)에 정의된 **실제 선수과목 DAG**다.
노드는 16개 과목, 엣지는 실제 이수 선후관계, 임펄스는 선수 → 후수 방향으로 흐른다.
난수 좌표를 쓰지 않으므로 매 프레임 근접 탐색이 없고, 다른 학교가 복사할 수도 없다.

새 배경 효과를 추가하려면 먼저 답하라: **이것이 무엇을 지시하는가?**
답이 "그냥 예뻐서"라면 추가하지 않는다.
