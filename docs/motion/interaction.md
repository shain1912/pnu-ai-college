# 마이크로 인터랙션과 라우트 전환 — toss.im vs 우리 사이트

관찰일: 2026-08-22  
뷰포트: `capture-motion.mjs` 기본 1440×900  
클릭/호버 리듬: 000은 휴식, 트리거 직후 001~005는 45ms, 이후는 120ms  
즉 001 = +45ms, 002 = +90ms, 003 = +135ms, 004 = +180ms, 005 = +225ms, 006 = +345ms.

시트는 스크린샷 상단 300px만 격자화하므로, 헤더·팝업·카드는 원본 PNG를 잘라 같이 봤다. 픽셀 차이는 `000` vs `001` raw 비교. 추측은 적지 않았고, 안 보이면 「관찰 못함」이다.

캡처 슬러그:

| 대상 | 슬러그 |
|---|---|
| toss 내비 「서비스」 hover | `ix-toss-nav-hover` |
| toss 「채용」 hover | `ix-toss-career-hover` |
| toss 앱 다운로드 hover / click | `ix-toss-dl-hover`, `ix-toss-dl-click` |
| toss 뉴스룸 카드 hover | `ix-toss-card-hover` |
| toss 메가메뉴 항목 hover | `ix-toss-megaitem-hover` |
| toss 연혁 화살표 click | `ix-toss-arrow-click` |
| toss 언어 드롭다운 click | `ix-toss-lang-click` |
| toss `/` → `/company` click | `ix-toss-route-click` |
| 우리 `button[role=tab]` click | `ix-adpx-tab` |
| 우리 `button[aria-expanded]` click | `ix-career-expand` |
| 우리 헤더 `a[href*="ai-college"]` hover | `ix-header-nav` |
| 우리 `a.card` hover | `ix-card-hover` |
| 우리 홈 → AI대학 click | `ix-route-home` |

---

## 1. toss.im 상호작용

### 1.1 내비 메뉴 hover — `button:has-text("서비스")`

시트 `ix-toss-nav-hover-sheet1.jpg`, 헤더 크롭 `nav-000`~`nav-002`.

- **000**: 「서비스」는 다른 항목과 같은 회색. 밑줄 없음. 히어로 영상이 선명.
- **001 (+45ms)**: 「서비스」가 검정 + 밑줄. 영상 위에 흰 반투명 오버레이. 메가메뉴 **열 제목만** 보임(「내 돈의 흐름을 파악하고」 등). 링크 목록은 아직 없음.
- **002 (+90ms)**: 4열 링크가 모두 보임. 오버레이가 더 불투명해 영상이 거의 사라짐. 「서비스」 밑줄 유지.
- **002→003**: 픽셀 변화 0.40%. 열린 상태로 정지.

무엇이 변하나: **글자색(회색→검정), 밑줄 추가, 본문 오버레이 opacity, 메가메뉴 등장.** 버튼 크기·배경 칠·그림자는 크롭에서 관찰 못함. 밑줄이 자라나는 중간 길이는 45ms 격자에 안 걸림.

열림은 두 단계: 제목(+오버레이) → 항목. 전체 약 90ms.

같은 내비의 「채용」(`a[href='https://toss.im/career/jobs']`, `job-000`/`job-001`): 메가메뉴 없이 **검정 + 밑줄만**. 000은 회색 「채용」, 001에서 검정 밑줄. 외부 화살표 아이콘은 두 프레임 모두 있음. 배경 칠 없음.

메가메뉴 항목 「자산 관리」(`ix-toss-megaitem-hover`, `mega-000`/`mega-001`): 메뉴가 열린 뒤 hover하면 **해당 링크만 검정 밑줄**. 행 배경, 이동, 확대는 관찰 못함. 000→001 전체 픽셀 1.32%.

### 1.2 앱 다운로드 hover와 click — `button[aria-expanded]`

**Hover** (`ix-toss-dl-hover`, 크롭 `dlh-000`~`dlh-003`):

- **000**: 흰 필 버튼, 「앱 다운로드」 가로로 읽힘.
- **001 (+45ms)**: 글자가 겹쳐 「다운로드」 뒤로 「앱」이 세로로 겹친 **글자 뒤섞임**.
- **002 (+90ms)**: 다시 「앱 다운로드」로 정렬. 001만 중간 상태.
- 정착 hover(002)와 휴식(000)의 배경색·크기는 이 크롭에서 구분 못함. 호버의 눈에 보이는 변화는 **45~90ms의 글자 재배열**이다.
- 홈 히어로 영상이 계속 움직이므로 전체 프레임 픽셀 차이(약 33%)는 버튼만의 변화가 아니다.

**Click** (`ix-toss-dl-click`, 크롭 `dlc-000`~`dlc-002`):

- **000**: 팝업 없음.
- **001 (+45ms)**: QR 카드가 **같은 자리·같은 크기로 반투명**. 닫기 ×, 카피 「QR코드를 스캔하면…」, QR 패턴이 비쳐 보임. 버튼 글자는 hover와 같이 겹침.
- **002 (+90ms)**: 흰 라운드 카드가 완전 불투명. 그림자 있음. 버튼 글자 복구.
- **003 이후**: 002와 같음.

무엇이 변하나: **팝업 opacity 0→1, 약 90ms. 위치 이동·스케일 중간값은 관찰 못함** (001이 이미 최종 크기). 배경 딤은 이 크롭에서 관찰 못함.

### 1.3 카드 hover

**뉴스룸 카드** `a[href="/newsroom/toss-new-homepage"]` (`ix-toss-card-hover`):

000·001·002 raw가 **픽셀 차이 0**. 배경, 그림자, 크기, 위치 모두 관찰 못함. 커서 변화는 스크린샷으로 관찰 못함.

토스에서 카드처럼 보이는 뉴스 타일은 hover 시각 처리가 없다. 호버 피드백은 1.1의 **텍스트 밑줄** 쪽에 있다.

### 1.4 화살표 버튼 click — `button[aria-label="다음 연혁 보기"]` (`/company`)

시트 `ix-toss-arrow-click-sheet1.jpg`, 하단 크롭 `arr-000`~`arr-002`.

- **000**: 2025 연혁 리스트 + 오른쪽 인물 사진. 화살표는 이 크롭 밖.
- **001 (+45ms)**: 무대가 2024–2021로 바뀜. 시트 상단에 사진 3장. 연도 「2024 - 2021」은 **회색·낮은 불투명도**. 화살표 자리에 잔상이 겹침.
- **002 (+90ms)**: 「2024 - 2021」이 검정으로 선명. 오른쪽에 「2020 - 2017」이 옅게. 활성 연도 아래 검정 언더라인.

무엇이 변하나: **콘텐츠 스냅 교체(≤45ms) + 연도 라벨 opacity(45~90ms) + 활성 밑줄.** 사진이 슬라이드하듯 가로로 밀리는 중간 위치는 관찰 못함. 화살표 자체의 색·크기 보간은 001의 잔상 말고는 특정 못함.

### 1.5 언어 드롭다운 click — `button:has-text("KOR")`

크롭 `lang-000`~`lang-002`.

- **000**: 「KOR ▾」만. 패널 없음.
- **001 (+45ms)**: 버튼 아래 흰 라운드 패널. 위 KOR, 아래 ENG. KOR 행이 더 진함.
- **002**: 001과 같음.

무엇이 변하나: **패널이 45ms 안에 최종 모습.** 스케일·슬라이드·중간 opacity는 관찰 못함. 셰브론 회전은 이 크롭에서 관찰 못함.

---

## 2. toss.im 라우트 전환 — `/`에서 `a[href="/company"]`

시트 `ix-toss-route-click-sheet1.jpg` + `sheet2`, 크롭 `rt-000`~`rt-006`.

| 프레임 | 시각 |
|---|---|
| 000 | 홈 히어로(열차 영상 + 「금융부터 일상까지…」). 헤더 「회사소개」는 회색. |
| 001 (+45ms) | **아직 홈.** 영상 프레임만 조금 바뀜. 흰 빈 화면 아님. |
| 002 (+90ms) | 회사 페이지. 헤더 유지, 「회사소개」가 검정. 본문은 흰 바탕에 「Daily」만 **강한 블러·낮은 불투명도**. |
| 003 (+135ms) | 「Daily Greatness」 두 단어. Daily는 더 진하고 Greatness는 아직 블러. |
| 004–005 | 제목 선명도 상승. |
| 006 (+345ms) | 제목 완전 선명. 연한 하늘 그라데이션. 부제 「일상 가까이에서…」는 앞 어절만 선명, 뒤는 블러. |
| 007 (+465ms) | 부제 전체 선명. |
| 008–011 | Vision 본문이 아래에서 진해짐. |
| 012 | 제목·부제·Vision 본문 모두 선명. |

판정:

- **전환은 있다.** 공유 레이어나 크로스페이드로 홈이 회사로 녹는 것이 아니라, 다음 페이지가 마운트된 뒤 **히어로 카피가 blur+opacity로 순차 입장**.
- **브라우저 스타일 없는 흰 화면(FOUC)은 아니다.** 002의 흰 화면은 회사 히어로의 흰 캔버스이고, 헤더는 001→012 내내 남아 있다.
- 001이 홈에 남는 45ms는 내비게이션 지연이지 페이드가 아니다.

---

## 3. 우리 사이트

로컬 `http://localhost:5188` (basename 없음).

### 3.1 ADP+X 탭 — `button[role=tab][aria-selected=false]` (`/ai-college/adpx`)

시트 `ix-adpx-tab-sheet1.jpg`, 전체 `tab-000`/`tab-001`.

- **000**: A 탭이 파란 면 + 흰 글. 패널은 「AI컴퓨터공학부」와 정육면체.
- **001 (+45ms)**: D 탭이 파란 면, A는 회색 면. 패널 제목·칩·3D(원뿔)가 **이미 최종 상태**.
- **001→002**: 픽셀 1.02%. 이후 012까지 같은 선택.

무엇이 변하나: **탭 배경색(파랑↔회색), 글자색(흰↔검정), 패널 본문 교체, 3D 교체.** 중간 파랑/회색 혼합, 패널 opacity/blur, 이미지 크로스페이드는 관찰 못함. **스냅.** CSS `transition-colors 200ms`가 있어도 45ms 격자에는 중간색이 안 걸렸다.

### 3.2 경력 펼침 — `button[aria-expanded]` (`/ai-college/schools/ai-computer`)

전체 `car-000`/`car-001`.

- **000**: 「김정구 … 경력 3건」. 아래 행은 접힘.
- **001 (+45ms)**: 라벨이 「경력 접기」, 버튼에 **연한 파란 배경**. 경력 3줄이 회색 박스에 **이미 최종 높이**.
- 높이 보간(0→n px) 중간 프레임은 관찰 못함. **마운트 스냅.**
- 시트 002 이후 상단이 학과 인트로로 바뀌는 것은 뷰포트가 위로 이동한 결과이며, 펼침 모션의 중간 상태가 아니다.

### 3.3 헤더 링크 hover — `header nav a[href*="ai-college"]` (홈)

크롭 `our-nav-000`~`our-nav-002`.

- **000**: 「AI대학」 회색 글, 배경 없음.
- **001 (+45ms)**: 같은 자리에 **연한 회색 라운드 칩**. 글이 조금 진해 보임.
- **002**: 001과 눈으로 같음. 000→001 픽셀 0.77%, 001→002 0.85%(전환이 120ms 쪽으로 조금 남은 것으로 보임).

무엇이 변하나: **배경색 추가(칩). 밑줄·이동·확대는 관찰 못함.** 토스의 밑줄 패턴과 다르다.

### 3.4 카드 링크 hover — `a.card` (`/ai-college`)

크롭 `our-acard-000`/`001`, 차분 `our-card-diff.jpg`.

- 000과 001을 나란히 보면 카드 면은 거의 같다. 확대·이동·배경색 변화는 관찰 못함.
- 차분 이미지에서 **호버된 첫 카드(AI컴퓨터공학부) 둘레만 노란 테두리**. 그림자가 둘레에서 강해진 것.
- 000→001 전체 2.40%, 001→002 0.90%. 그림자 전환이 한 프레임 더 간다.
- 제목 「ADP+X, 네 개의 축」도 차분에 잡히지만, 000에서 이미 선명이라 호버가 아니라 잔여 안티앨리어싱/리빌로 본다.

무엇이 변하나: **그림자만. 매우 약함.** 리프트(`translateY`)·스케일은 관찰 못함.

### 3.5 라우트 — 홈 `a:has-text("AI대학 살펴보기")`

시트 `ix-route-home-sheet1.jpg`, 크롭 `our-rt-000`~`our-rt-003`.

| 프레임 | 시각 |
|---|---|
| 000 | 홈. 헤더 「AI대학」은 비활성 회색. |
| 001 (+45ms) | **이미 `/ai-college`.** 헤더 「AI대학」이 파란 칩(활성). 빵크럼 「홈 › AI대학」은 선명. H1 「AI대학」은 **블러·낮은 불투명도**. 뱃지 「2027년 3월 출범」도 옅음. |
| 002 (+90ms) | H1 선명 검정. 리드 문단은 아직 블러. |
| 003 (+135ms) | 리드까지 선명. |
| 012 | 아래 섹션 제목도 선명. |

판정:

- 헤더는 유지. 스타일 없는 흰 빈 화면은 없음.
- 전환 오버레이는 없음. 다음 페이지가 바로 깔리고 `data-reveal`의 blur+opacity가 돈다.
- 토스와 달리 **001에서 이미 도착 페이지**. 제목 선명은 약 90ms, 리드 약 135ms. 토스 회사 제목은 006(+345ms)까지 블러가 남는다.

---

## 4. 비교표

| 상호작용 | toss.im | 우리 사이트 | 없고 / 빠르고 / 느린 것 |
|---|---|---|---|
| 내비 hover | 회색→검정 + 밑줄. 메가메뉴는 오버레이+2단 스태거(45ms 제목, 90ms 항목) | 회색 라운드 칩. 밑줄 없음. 메가메뉴 없음 | 밑줄·오버레이·메뉴 스태거가 없음. 칩은 45ms에 거의 끝 |
| 앱 다운로드 hover | 45~90ms 글자 재배열 | 대응 버튼 없음. CTA는 색만(`hover:bg-blue-700`, 이번 캡처 대상 아님) | 글자 모션은 채택하지 말 것(브랜드 장난). 색 전환은 있음 |
| 앱 다운로드 click | QR 패널 opacity 약 90ms. 스케일 중간값 관찰 못함 | 대응 팝오버 없음 | 패널 fade-in 패턴 자체가 없음 |
| 카드 hover | 뉴스룸 카드 픽셀 0. 메가메뉴 링크는 밑줄 | `a.card` 그림자만, 리프트/스케일 관찰 못함 | 우리 그림자는 너무 약함. 토스 뉴스 카드도 hover 면 처리가 없음 |
| 화살표/탭 click | 연혁 콘텐츠 스냅(≤45ms) + 연도 라벨 opacity 45~90ms | 탭 색·패널·3D 전부 ≤45ms 스냅 | 둘 다 본문 크로스페이드가 없음. 토스만 라벨 opacity가 보임 |
| 드롭다운/아코디언 | KOR 패널 ≤45ms로 최종 모습 | 경력 리스트 ≤45ms 마운트 스냅. 높이 보간 관찰 못함 | 둘 다 너무 빠름. 열림 중간 상태가 프레임에 안 남음 |
| 라우트 전환 | 001은 이전 페이지. 002부터 도착 흰 히어로. 제목 blur 입장 ~345ms, 부제 ~465ms. 헤더 유지 | 001에 이미 도착. H1 90ms, 리드 135ms에 선명. 헤더 유지 | 우리 리빌이 토스보다 2~3배 빠름. 흰 FOUC는 둘 다 없음 |

---

## 5. 채택안과 Tailwind v4

토큰: `--dur-fast` 120ms, `--dur-base` 200ms, `--dur-enter` 400ms, `--ease-standard`, `--ease-enter`.

글자 뒤섞임·메가메뉴 4열은 대학 사이트에 안 옮긴다. 옮기는 것은 **밑줄형 호버, 약한 리프트 그림자, 패널 opacity, 탭/아코디언의 짧은 보간, 라우트 리빌을 토스 길이로 늘리는 것**.

### 5.1 내비 hover — 칩 대신 색+밑줄 (토스 001)

```html
<NavLink
  className={({ isActive }) =>
    `px-3.5 py-2 text-[15px] font-medium transition-colors duration-[--dur-fast] ease-[--ease-standard]
     ${isActive
       ? 'bg-blue-50 text-blue-700 rounded-[--radius-sm]'
       : 'text-ink-muted hover:text-ink hover:underline hover:underline-offset-[6px] decoration-[1.5px]'}`
  }
/>
```

활성만 칩(우리 001의 파란 칩은 유지). hover는 토스처럼 칠하지 않는다.

### 5.2 카드 hover — 보이는 그림자 + 1~2px 리프트

지금 그림자는 차분으로만 보인다. `--dur-base`로 키운다.

```html
<Link
  className="card flex h-full items-start gap-5 p-6 md:p-7
             transition-[box-shadow,transform] duration-[--dur-base] ease-[--ease-standard]
             hover:-translate-y-0.5
             hover:shadow-[0_2px_4px_rgb(25_31_40/0.06),0_12px_32px_rgb(25_31_40/0.12)]"
/>
```

스케일·배경 틴트는 넣지 않는다. 토스 뉴스 카드도 면을 안 칠한다.

### 5.3 탭 — 면 색은 `--dur-fast`, 패널은 blur+opacity

탭 면이 스냅으로 보이므로 색만 짧게. 패널 본문은 토스 라우트 002~006처럼 교체 시 리빌.

```html
<button
  role="tab"
  className={`rounded-[--radius-lg] p-5 text-left md:p-6
              transition-colors duration-[--dur-fast] ease-[--ease-standard]
              ${on ? 'bg-brand-strong text-white' : 'bg-gray-100 text-ink hover:bg-gray-200'}`}
/>
```

```html
<div
  role="tabpanel"
  className="card mt-3 p-6 md:p-8 transition-[opacity,filter,transform]
             duration-[--dur-enter] ease-[--ease-enter]
             data-[switching]:opacity-0 data-[switching]:blur-[6px] data-[switching]:translate-y-2"
>
```

`data-switching`을 클릭 직후 한 프레임 붙였다가 떼면, 001에 중간 블러가 걸린다.

### 5.4 경력 아코디언 — 높이 보간

```html
<button
  type="button"
  aria-expanded={isOpen}
  className="rounded-[--radius-sm] px-2.5 py-1.5 text-[14px] font-semibold text-brand
             transition-colors duration-[--dur-fast] ease-[--ease-standard] hover:bg-blue-50"
>
  {isOpen ? '경력 접기' : `경력 ${p.career.length}건`}
</button>

<div
  className={`grid transition-[grid-template-rows] duration-[--dur-base] ease-[--ease-standard]
              ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
>
  <ul className="overflow-hidden border-t border-line bg-canvas-subtle px-5 py-5 md:px-7">
    …
  </ul>
</div>
```

지금은 001에 최종 높이가 이미 있다. 이 그리드 방식이면 45ms 격자에 중간 높이가 걸린다.

### 5.5 팝오버(언어·다운로드 대체) — opacity만, 스케일 없음

토스 QR 001은 자리 고정 + 반투명. 스케일 중간값 관찰 못함.

```html
<div
  className="absolute right-0 mt-2 rounded-[--radius-lg] bg-surface p-4
             shadow-[0_8px_24px_rgb(25_31_40/0.12)]
             transition-opacity duration-[--dur-fast] ease-[--ease-standard]
             data-[open=false]:pointer-events-none data-[open=false]:opacity-0"
>
```

`--dur-fast`(120ms)가 토스 팝업 ~90ms에 가장 가깝다. `--dur-enter` 400ms는 이 용도에 느리다.

### 5.6 라우트 입장 — 길이만 토스에 맞출 것

패턴은 이미 같다(도착 페이지 + blur/opacity/translateY). 우리 H1은 90ms에 선명, 토스 제목은 ~345ms. `--dur-enter` 400ms가 이미 토큰에 있다. 문제 는 duration이 아니라 **지연 스태거가 짧고, 001에 이미 거의 끝나는 것**.

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(18px);
  filter: blur(6px);
  transition:
    opacity var(--dur-enter) var(--ease-enter),
    transform var(--dur-enter) var(--ease-enter),
    filter var(--dur-enter) var(--ease-enter);
  transition-delay: var(--reveal-delay, 0ms);
}
[data-reveal][data-shown] {
  opacity: 1;
  transform: none;
  filter: none;
}
```

권고: 히어로 제목 `--reveal-delay`를 0 / 80 / 160ms처럼 어절 단위로 벌리고, 리드·다음 블록은 200~320ms. 페이지 전체 오버레이나 흰 플래시는 만들지 말 것 — 토스 002의 흰 화면은 도착 히어로 배경이지 전환 막이 아니다.

### 5.7 하지 말 것

- 앱 다운로드 글자 재배열: 토스 브랜드 장난. 대학 CTA에는 색만 `--dur-fast`.
- 뉴스 카드형 타일에 강한 hover 틴트: 토스 뉴스룸은 0픽셀.
- 라우트에 400ms를 넘는 풀스크린 페이드: 토스도 헤더를 유지한 채 카피만 입장한다.

---

## 6. 한 줄 요약

토스 마이크로는 **밑줄·짧은 opacity·2단 스태거**이고, 면 색·스케일·카드 리프트는 거의 없다. 우리는 **칩 배경과 너무 약한 그림자, 탭/아코디언 스냅, 토스보다 빠른 리빌**이 있다. 채택은 내비 밑줄, 카드 리프트 그림자, 패널/아코디언의 `--dur-fast`~`--dur-base` 보간, 라우트 리빌을 `--dur-enter` 스태거로 늘리는 네 가지다.
