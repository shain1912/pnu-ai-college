# 에셋 매니페스트 — 부산대학교 AI대학 사이트

생성일 2026-08-22 · 생성 담당 힉스필드 에셋 에이전트

모든 오브젝트는 하나의 형태 어휘를 공유한다. 각진 반투명 프로스티드 유리, 흰 바닥 위 부유,
접지 그림자 하나, 좌상단 스튜디오 조명, `#3182F6` 계열 쿨블루 + 흰색/연회색. 글자·숫자·로고·인물 없음.

- 정지 이미지 원본 `assets/raw/<slug>.png` → 최적화 `public/img/<slug>.webp`, `<slug>@2x.webp`, `<slug>-lqip.webp`
- 루프 영상 원본 `assets/video/<slug>.mp4` → 배포 `public/video/<slug>.webm`(VP9) + `<slug>.mp4`(H.264) + 포스터 `public/img/<slug>-poster.webp`
- 이미지 재생성 `npm run assets` · 영상 재인코딩 `node scripts/encode-loops.mjs [slug...]`

## 배선표

`<slug>` 하나가 정지 이미지와 루프 영상을 함께 가진다. 아래 "종류" 열의 `정지+영상`은
`<img>` 를 `<video autoplay muted loop playsinline poster>` 로 승격할 수 있다는 뜻이다.

| 슬러그 | 종류 | 비율 | 이미지 경로 | 영상 경로 | 들어갈 자리 | 모델 / job id | 크레딧 |
|---|---|---|---|---|---|---|---|
| `hero_light` | 정지 | 16:9 | `/img/hero_light@2x.webp` | `/video/atrium-loop.webm\|mp4` | `/` 히어로 — **기존 유지** | (기존 실사) | — |
| `why_converge` | 정지+영상 | 16:9 | `/img/why_converge@2x.webp` | `/video/why_converge.webm\|mp4` | `/ai-college` WHY 섹션 도형 | nano_banana_pro / kling3_0_turbo `db61e5fc` | 12 |
| `axis_a` | 정지+영상 | 1:1 | `/img/axis_a@2x.webp` | `/video/axis_a.webm\|mp4` | `/ai-college/adpx` A축 탭 · `schools/ai-computer` | nano_banana_pro / kling3_0_turbo `f801ac5b` | 12 |
| `axis_d` | 정지+영상 | 1:1 | `/img/axis_d@2x.webp` | `/video/axis_d.webm\|mp4` | ADP+X D축 탭 · `schools/data-science` | nano_banana_pro / kling3_0_turbo `9ebc9022` | 12 |
| `axis_p` | 정지+영상 | 1:1 | `/img/axis_p@2x.webp` | `/video/axis_p.webm\|mp4` | ADP+X P축 탭 · `schools/industrial` | nano_banana_pro `83cd1585` / kling3_0_turbo `4870d3d8` | 24 |
| `axis_x` | 정지+영상 | 1:1 | `/img/axis_x@2x.webp` | `/video/axis_x.webm\|mp4` | ADP+X X축 탭 · `schools/ax` | nano_banana_pro / kling3_0_turbo `318cd1fa` | 12 |
| `axis_stat` | 정지+영상 | 1:1 | `/img/axis_stat@2x.webp` | `/video/axis_stat.webm\|mp4` | `schools/statistics` 통계학과 | nano_banana_pro `2fe31373` / kling3_0_turbo `8f5f2932` | 24 |
| `infra_gpu` | 정지+영상 | 16:9 | `/img/infra_gpu@2x.webp` | `/video/infra_gpu.webm\|mp4` | `/ai-college` NUMBERS 섹션 | nano_banana_pro / kling3_0_turbo `46099690` | 12 |
| `roadmap_path` | 정지+영상 | 16:9 | `/img/roadmap_path@2x.webp` | `/video/roadmap_path.webm\|mp4` | `/ai-college/roadmap` 상단 | nano_banana_pro `10a8e0ac` / kling3_0_turbo `4acf462a` | 24 |
| `apex` | 정지+영상 | 16:9 | `/img/apex@2x.webp` | `/video/apex.webm\|mp4` | `/ai-college/adpx` 도입부 — **신규 자리** | nano_banana_pro `3fa27eda` / kling3_0_turbo `5e0fb68f` | 12 |
| `chain` | 정지+영상 | 16:9 | `/img/chain@2x.webp` | `/video/chain.webm\|mp4` | `/ai-college/adpx` CHAIN 섹션 — **신규 자리** | nano_banana_pro `8b13db2e` / kling3_0_turbo `b4d11cea` | 12 |
| `governance` | 정지+영상 | 16:9 | `/img/governance@2x.webp` | `/video/governance.webm\|mp4` | `/ai-college` `#apex` 운영 체계 — **신규 자리** | nano_banana_pro `74e93370` / kling3_0_turbo `a7ebed2f` | 12 |
| `programs` | 정지+영상 | 16:9 | `/img/programs@2x.webp` | `/video/programs.webm\|mp4` | `/ai-college` PROGRAMS 섹션 — **신규 자리** | nano_banana_pro `0e655c83` / kling3_0_turbo `1a7d668c` | 14 |
| `partners` | 정지+영상 | 16:9 | `/img/partners@2x.webp` | `/video/partners.webm\|mp4` | `/ai-college` PARTNERS 섹션 — **신규 자리** | nano_banana_pro `c5797ccb` / kling3_0_turbo `6c8159c0` | 14 |
| `schools` | 정지+영상 | 16:9 | `/img/schools@2x.webp` | `/video/schools.webm\|mp4` | `/ai-college/schools` 목록 상단 — **신규 자리** | nano_banana_pro `bb2c8796` / kling3_0_turbo `f1fcbb8f` | 12 |
| `summary_sheet` | 정지 | 16:9 | `/img/summary_sheet@2x.webp` | — | `/` `#summary` 정보 표 — **신규 자리** | nano_banana_pro `448f977f` | 2 |
| `admissions` | 정지 | 16:9 | `/img/admissions@2x.webp` | — | `/ai-college/roadmap` 수시모집 카드 — **신규 자리** | nano_banana_pro `2673d5a5` | 2 |
| `asis` | 정지 | 1:1 | `/img/asis@2x.webp` | — | `/ai-college` WHY — `tobe` 와 좌우 한 쌍 | nano_banana_pro `bf8e0541` | 2 |
| `tobe` | 정지 | 1:1 | `/img/tobe@2x.webp` | — | `/ai-college` WHY — `asis` 의 결과 상태 | nano_banana_pro `eda9426b` | 2 |

## 검수에서 반려하고 재생성한 것

받은 결과를 전부 실제로 열어서 봤다. 아래 다섯은 형태·재질 어휘를 위반해 반려하고 다시 만들었다.

| 슬러그 | 반려 사유 | 조치 |
|---|---|---|
| `axis_p` | 둥근 튜브가 얽힌 **매듭** — 유기적·고무 느낌, 각진 면이 전혀 없고 채도도 회색이었다 | 각진 유리 블록 4개의 계단 형태로 재생성. 루프도 새 스틸에서 다시 뽑음 |
| `axis_stat` | **불투명 무광 플라스틱** 종 안에 둥근 알갱이 — 반투명 유리도 아니고 기하학적이지도 않았다 | 각진 유리 슬래브 9개가 만드는 계단형 종 실루엣으로 재생성 |
| `roadmap_path` | 불투명 **구체** 다섯 개가 곡선 리본 위에 놓인 형태 — 어휘 전체가 어긋났다 | 직선 유리 빔에 각진 마커 5개가 상승하는 형태로 재생성 |
| `partners` | 오브젝트가 프레임에 **잘려** 실루엣이 안 보였고 색이 회색이었다 | 카메라를 물리고 여백을 확보, 채도를 올려 재생성 |
| `programs` | 색이 거의 빠져 무채색이었다 | `#3182F6` 채도를 명시해 재생성 |

`axis_p` · `axis_stat` · `roadmap_path` 는 반려된 원본이 이미 `public/video/` 에 인코딩돼 들어와 있었다.
배포되지 않도록 삭제하고 재생성분으로 교체했다.

## 배선 지시 — src 는 건드리지 않았다

`src/` 는 애니메이션 에이전트가 작업 중이라 파일을 수정하지 않았다. 아래대로 넣으면 된다.
줄 번호는 계속 바뀌므로 섹션 식별자로만 적는다.

### 1. 이미 `<img>` 가 있는 자리 — 영상으로 승격

`why_converge` · `axis_a/d/p/x` · `axis_stat` · `infra_gpu` · `roadmap_path` 는 이제 루프 영상이 있다.
기존 `<img src="/img/<slug>@2x.webp">` 를 그대로 두고 감싸거나, 아래 형태로 바꾸면 된다.

```jsx
<video autoPlay muted loop playsInline poster={`/img/${slug}-poster.webp`}>
  <source src={`/video/${slug}.webm`} type="video/webm" />
  <source src={`/video/${slug}.mp4`} type="video/mp4" />
</video>
```

`prefers-reduced-motion` 이면 영상 대신 `/img/<slug>@2x.webp` 를 쓴다.
`src/hooks/useMedia.js` 의 `useReducedMotion` 이 이미 `Home.jsx` 히어로에서 같은 용도로 쓰이고 있다.

### 2. 시각 자산이 비어 있던 자리 — 새로 채운 것

| 파일 | 섹션 | 넣을 슬러그 |
|---|---|---|
| `src/pages/Home.jsx` | `<section id="summary">` (fact sheet, `SUMMARY`) | `summary_sheet` — 정지 |
| `src/pages/AiCollege.jsx` | `<section id="apex">` (`{/* 운영 체계 */}`, `APEX`) | `governance` — 정지+영상 |
| `src/pages/AiCollege.jsx` | `{/* 특화 프로그램 + 기업 */}` (`PROGRAMS`) | `programs` — 정지+영상 |
| `src/pages/AiCollege.jsx` | `PARTNERS` 섹션 | `partners` — 정지+영상 |
| `src/pages/AiCollege.jsx` | `WHY` 섹션 | `asis` / `tobe` 좌우 한 쌍 — 정지 |
| `src/pages/AdpxPage.jsx` | 도입부 (A/D/P/X 축 소개) | `apex` — 정지+영상 |
| `src/pages/AdpxPage.jsx` | `CHAIN` 섹션 (하나의 문제가 네 번 손을 바꿔요) | `chain` — 정지+영상 |
| `src/pages/SchoolsIndex.jsx` | 목록 `<section className="band bg-canvas">` 상단 | `schools` — 정지+영상 |
| `src/pages/RoadmapPage.jsx` | `ADMISSION` 카드 | `admissions` — 정지 |

기존 figure 들이 쓰는 껍데기와 같은 형태로 맞추면 된다.

```jsx
<figure data-reveal className="rounded-[--radius-xl] bg-gray-50 p-4 md:p-6">
  <img src="/img/<slug>@2x.webp" alt="" />
</figure>
```

### 3. 알아둘 것

- **`asis` / `tobe` 는 한 쌍이다.** `asis` 는 흩어진 조각, `tobe` 는 같은 조각이 하나로 맞춰진 상태다.
  나란히 놓거나 스크롤에 맞춰 cross-fade 하면 "왜 모으는가" 가 그림 하나로 설명된다.
- **`infra_gpu` 는 10초다.** 다른 루프는 5초인데, 이 클립만 마지막 프레임이 첫 프레임으로 돌아오지 않아
  정방향+역방향(핑퐁)으로 이어 붙였다. 이음매는 없다.
- **`hero_light` 와 `atrium-loop` 은 실사다.** 오브젝트 세트와 어휘가 다르다.
  실사를 폐기하기로 했다면 히어로도 오브젝트로 교체해야 하는데, 이건 아트디렉션 결정이라
  임의로 바꾸지 않고 남겨 뒀다. 교체하기로 하면 말해 달라 — 히어로용 오브젝트를 만들겠다.
- 새 슬러그를 추가하면 `scripts/optimize-assets.mjs` 의 `WIDTHS`,
  `scripts/encode-loops.mjs` 의 `WIDTHS` 에 폭을 같이 넣어야 한다.

## 비용

내가 쓴 크레딧은 126이다 (628.68 → 502.68). 잔액 502.68.

| 항목 | 건수 | 단가 | 합계 |
|---|---|---|---|
| 신규 오브젝트 정지 (`governance` `summary_sheet` `admissions`) | 3 | 2 | 6 |
| 반려 재생성 정지 (`partners` `programs` `axis_p` `axis_stat` `roadmap_path`) | 5 | 2 | 10 |
| 신규 오브젝트 루프 (`apex` `chain` `schools` `governance` `programs` `partners`) | 6 | 10 | 60 |
| 반려 재생성 루프 (`axis_p` `axis_stat` `roadmap_path`) | 3 | 10 | 30 |
| 앞선 세션에서 발주돼 이번에 회수한 루프 (`axis_*` `why_converge` `infra_gpu`) | 5 | (기발주) | — |
| 웹 인코딩 · 최적화 | — | 0 | 0 |

정지 이미지는 `nano_banana_pro` 2k, 루프 영상은 `kling3_0_turbo` 1080p 5초(`--start-image` 로 해당 슬러그의 정지 이미지를 물림)로 만들었다.
