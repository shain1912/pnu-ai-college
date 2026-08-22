# 부산대학교 AI대학 홍보 사이트 에셋 기술 감사

검사 기준: `docs/ASSET_BRIEF.md`. 검사 대상은 `assets/raw`의 지정 9장 원본이며, 접촉시트만으로 판단하지 않고 각 PNG를 원본 해상도로 직접 열어 보았다. 판정 원칙상 절대 금지 항목이 하나라도 보이면 불합격이다.

## 1. 이미지별 전수 검사

| 슬러그 | 판정 | 발견된 금지 위반 전부 | 위치 |
|---|---|---|---|
| `hero_light` | **합격** | 없음. 글자·로고·금지색·인물 클로즈업이 없고, 밝은 자연광/화이트/연한 우드/파랑 단일 액센트를 충족한다. | 해당 없음 |
| `why_converge` | **불합격** | 의도 실패: 세 조직의 통합이 아니라 벽에 붙인 사진 세 장으로 읽힌다. 등장 인물 대부분이 한국 대학 구성원으로 읽히지 않는다. 빨강·마룬 의류/소품이 여러 곳에 있다. | 좌측 패널 전경의 체크 상의, 중앙 패널 하단·중앙의 빨강 상의와 소품, 우측 패널 좌하단 빨강 상의 및 우측 중단 마룬 상의. 세 패널 전체의 인물군. |
| `infra_gpu` | **불합격** | GPU 서버가 전혀 없고 흰 수납장/로커 복도로 보인다. 좌측 화면은 검정 베젤과 어두운 청색 화면으로 다크 디스플레이 인상이 강하다. 빨강 소형 장치가 있다. 수납장 손잡이 주변의 반복 얼룩/표식은 생성 결함처럼 보인다. | 좌측 가장자리 화면, 좌상단 벽의 빨강·검정 장치, 우측 벽 전체 손잡이 열. |
| `dept_ai` | **불합격** | 화이트보드에 읽히는 실제 단어와 깨진 가짜 영문 다수. 대형 화면에도 깨진 가짜 문자열. 빨간 글씨/마커와 시안 선. 노트북에 Apple 유사 로고가 최소 2개. 전경 남학생 등 일부 인물이 한국인으로 읽히지 않는다. | 화이트보드 중앙·좌측(`Software` 및 가짜 문구들), 좌측 대형 화면 중앙, 중앙 및 우중단 노트북 덮개, 좌전경 인물. |
| `dept_data` | **불합격** | 우중단 남성의 마룬/적갈색 셔츠. 등장 인물 전원이 한국 대학 구성원으로 읽히지 않는다. 데이터사이언스 장면이라기보다 추상 원형 벽화 앞 발표로, 분석 화면·도구가 없다. | 우중단 셔츠, 화면 전역 인물군, 배경 벽 전체. |
| `dept_stat` | **불합격** | 교수와 학생 다수가 한국 대학 구성원으로 읽히지 않는다. 화이트보드 그림은 통계 그래프라기보다 무의미한 한 줄 낙서이며 학과 개념 표현이 약하다. 빨강 마커/지우개가 소품 금지색을 위반한다. | 중앙 교수와 전경 학생들, 화이트보드 전체, 보드 하단 우측 빨강 물체. |
| `dept_ie` | **불합격** | 좌측 남성의 마룬 티셔츠. 등장 인물 전원이 한국 대학 구성원으로 읽히지 않는다. 컨베이어와 로봇 본체에 읽히거나 로고처럼 보이는 제조 라벨이 여럿 있다. 창 아래 빨강/분홍 색띠가 있다. 임시 조립품 같은 거친 배선·비현실적 로봇 손상 표현으로 기관 신뢰감이 낮다. | 좌측 상의, 컨베이어 전면 하단 라벨, 로봇 베이스 전면 라벨, 우측 창 하단, 중앙 장비 전체. |
| `dept_ax` | **불합격** | 우측 인물 등판에 읽히는 가짜 영문/인쇄. 중앙 노트북에 Apple 유사 로고. 일부 화면과 종이에 글자·스케치가 보인다. 좌측 여성의 분홍/빨강 바지, 좌상단 의류 랙의 빨강·주황 의류. 등장 인물 전원이 한국 대학 구성원으로 읽히지 않는다. 의류 샘플 랙과 난잡한 종이, 캐주얼 회의 연출 때문에 대학 융합교육보다 패션 스타트업 회의처럼 보인다. | 우측 전경 흰 상의 등판, 중앙 노트북 덮개, 전경/중앙 노트북 화면과 테이블 종이, 좌하단 바지, 좌상단 의류 랙, 인물군 전체. |
| `roadmap_campus` | **불합격** | 파란 키오스크에 깨진 가짜 글자/표식이 여러 줄 있다. 중앙 보행자의 빨강 체크 상의. 인물이 한국 대학생으로 명확히 읽히지 않는다. | 좌중단 파란 키오스크 전면, 키오스크 뒤 중앙 보행자 3명 중 좌측 인물. |

요약: 9장 중 합격 1장(`hero_light`), 조건부 0장, 불합격 8장이다. 브리프가 선기록한 결함 외 추가 치명점은 `dept_ai`의 Apple 유사 로고, `dept_ie`의 장비 라벨과 창가 빨강 띠, `dept_ax`의 등판 인쇄·노트북 로고·의류 랙, `dept_stat`의 빨강 마커, `why_converge`의 패널 내부 다수 금지색이다.

## 2. 세트 일관성

9장을 나란히 놓으면 하나의 아트디렉션으로 보이지 않는다.

- 색온도: `hero_light`는 깨끗한 중성-온난 우드 톤이다. `dept_ai`는 우드가 과도하게 황색이고, `dept_stat`/`dept_ie`는 차갑고 청록 기운이 돌며, `roadmap_campus`는 따뜻한 가을 수목과 청색 그림자가 섞인다.
- 노출/명암: `hero_light`와 `infra_gpu`는 극단적 하이키, `why_converge` 중앙 패널과 `roadmap_campus` 수목은 중간톤·암부가 무겁다. `dept_ie`는 창가 대비가 강하고 얼굴/장비가 상대적으로 어둡다.
- 채도: `hero_light`는 투명한 연청색 하나로 절제됐지만 `dept_ai` 화면의 전기청색, `dept_ax` 티셔츠·화면, `dept_ie` 후드가 고채도다. 마룬·분홍까지 섞여 팔레트 규칙이 무너진다.
- 카메라 높이/렌즈감: `hero_light`와 `roadmap_campus`는 정면 건축 사진, `why_converge`는 비현실적 갤러리 합성, 학과 장면은 눈높이 다큐/스톡 사진이 뒤섞였다. `dept_ax`는 광각 근접, `dept_data`는 행사 사진, `dept_stat`는 뒤좌석 관찰 시점이다.
- 인물 연출: `dept_ai`는 정돈된 기업 회의, `dept_data`는 발표 행사, `dept_stat`는 구식 강의, `dept_ie`는 데모 촬영, `dept_ax`는 스타트업 브레인스토밍으로 톤이 모두 다르다. 동일 한국 대학의 수업·연구 시리즈라는 연결성이 없다.
- 공간 정체성: 현대 대학 건축(`hero_light`)과 오래된 흰 방/임대 스튜디오 같은 학과 사진들이 충돌한다. 특히 `dept_ax`의 의류 랙과 `dept_ie`의 빈 벽은 대학 기관의 신뢰감을 훼손한다.

재생성 시 모든 실사 학과 이미지를 같은 규칙(눈높이 1.5m, 35mm 상당, 자연광, 중성 화이트밸런스, 부드러운 하이키, 흰색/연회색/연우드, #3182F6만 액센트, 한국인 구성원, 관찰형 수업 연출)으로 고정해야 한다.

## 3. 실제 웹 배치 적합성

원본 8장은 정확히 2048×1152(16:9)이며 `hero_light`는 5504×3072(약 1.792:1)라 16:9 변환 시 좌우 합계 약 43px만 잘린다.

| 슬러그 | 16:9 크롭 안전성 | 텍스트 오버레이/명암 권고 | 실제 배치 적합성 |
|---|---|---|---|
| `hero_light` | 안전. 극소량 좌우 크롭만 발생. | 우하단·하단 중앙은 밝아 흰 글자 부적합. 좌하단 우드/계단 위에는 흰 글자도 대비가 불안정하므로 진한 남색 글자 또는 반투명 흰 패널 권장. | 적합 |
| `why_converge` | 이미 16:9. 세 패널이 좌·중·우 끝에 있어 추가 반응형 크롭 시 바깥 패널이 즉시 잘린다. | 상단 회색 여백은 넓지만 회색 대비가 약해 진한 글자만 가능. 흰 글자는 불가. | 개념·반응형 모두 부적합 |
| `infra_gpu` | 16:9 자체는 안전하나 핵심 피사체가 애초에 없다. | 우측은 흰 벽이라 진한 글자 가능. 흰 글자는 불가. | 부적합 |
| `dept_ai` | 좌우 인물이 프레임 끝에 걸려 모바일/좁은 크롭에서 잘린다. | 상단은 보드 텍스트가 가득해 오버레이 공간 없음. 하단 테이블도 복잡. | 부적합 |
| `dept_data` | 좌우 인물과 우측 인물이 이미 절단돼 추가 크롭에 취약. | 상단 밝은 벽화 여백에 진한 글자는 가능하나 원형 패턴과 겹친다. 흰 글자는 불가. | 부적합 |
| `dept_stat` | 중앙 교수는 안전하나 전경 학생들이 하단과 좌우를 막는다. | 상단 보드는 넓지만 낙서와 충돌. 진한 글자만 가능. | 조건 없이 사용하기 어려움 |
| `dept_ie` | 좌우 인물 발·팔이 가장자리에 밀려 추가 크롭 시 절단. 중앙 장비는 안전. | 상단 중앙 흰 벽에 진한 글자 가능. 흰 글자는 불가. | 금지 위반 때문에 부적합 |
| `dept_ax` | 좌우 전경 인물이 크게 잘리고, 중앙 인물만 안전. | 우상단 흰 벽에 진한 글자 가능. 흰 글자는 불가. | 금지 위반·스타트업 톤 때문에 부적합 |
| `roadmap_campus` | 중앙 건물과 길은 안전. 좌측 키오스크는 좁은 크롭에서 사라질 수 있으나 제거 대상이라 문제없음. | 상단 하늘은 매우 밝아 진한 글자만 가능. 우측 수목에 흰 글자는 가능하나 반응형 위치 변화에 취약. | 금지 위반 때문에 부적합 |

## 4. 불합격 이미지 재생성 명세

비용은 2026-08-22에 실제로 `higgsfield generate cost`로 확인했다: `soul_cinematic --quality 2k --aspect-ratio 16:9` = **0.12 크레딧**, `nano_banana_pro --resolution 2k --aspect-ratio 16:9` = **2 크레딧**. 아래 프롬프트는 그대로 복사해 사용할 수 있으며 실제 생성은 수행하지 않았다.

### `why_converge`

- 모델: **nano_banana_pro 2k**. 추상 통합 개념을 인물 사진보다 정밀한 3D 오브젝트로 통제해야 하며, 액자/세 방의 병치로 오독되는 것을 막기 쉽다.
- 비율/해상도/비용: 16:9, 2048×1152급, 2 크레딧.
- 프롬프트 전문:

```text
Premium editorial 3D object render for a Korean national university website, 16:9 landscape. On a seamless warm-white architectural surface, show exactly three distinct streams of small matte modules entering from the left, upper-left, and lower-left, then visibly merging through one elegant central junction into one larger coherent blue-and-white structure extending to the right. The visual must unmistakably communicate “three previously separate colleges converge into one AI college,” through physical flow and convergence, not through three framed pictures, three rooms, or three separate teams. Materials: matte white ceramic, very light gray, pale natural wood, and one restrained Pusan-blue accent close to #3182F6 only. Bright open natural daylight, soft shadows, high-key institutional sophistication, ample clean negative space in the upper-right for dark Korean web copy, eye-level three-quarter camera, 35mm-equivalent perspective, realistic premium architectural visualization. No people are required. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND, no numbers, no labels, no signage, no logos, no brands, no university emblems or emblem-like symbols, no framed pictures, no red, maroon, orange, pink, neon strips, cyan glow, black background, dark sci-fi styling, startup-office styling, flags, screens, charts, arrows, watermark, or close-up faces.
```

### `infra_gpu`

- 모델: **nano_banana_pro 2k**. 서버 랙의 반복 구조·냉각·케이블링을 제어하면서 제조사 라벨과 가짜 텍스트를 완전히 배제해야 하므로 정밀 3D 렌더가 실사 생성보다 안전하다.
- 비율/해상도/비용: 16:9, 2048×1152급, 2 크레딧.
- 프롬프트 전문:

```text
Photorealistic premium 3D architectural render of a large Korean university GPU computing facility, 16:9 landscape. Show two long orderly rows of unmistakable full-height GPU server racks with perforated white and very-light-gray doors, visible dense compute chassis through subtle openings, clean overhead cooling and cable trays, and strong depth that implies a 256-GPU institutional cluster without displaying any number. Bright high-key natural-white lighting, soft shadows, clean pale floor, restrained #3182F6 blue only on small non-luminous structural accents, credible university research infrastructure rather than an empty corridor, warehouse, or sci-fi data center. Camera at 1.5 m eye level, 28–35mm-equivalent lens, symmetric but natural composition, central aisle leading inward, leave modest clean space at upper-left for dark web copy. No people. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND, no numbers, no labels, no status text, no screens with UI, no signage, no logos, no brands, no university emblems, no red, maroon, orange, pink, neon strips, cyan glow, black background, dark racks dominating the frame, dark sci-fi mood, smoke, watermark, or empty locker-like cabinets.
```

### `dept_ai`

- 모델: **soul_cinematic 2k**. 한국인 학생·교원의 자연스러운 수업 장면과 공간 사실성이 핵심이다.
- 비율/해상도/비용: 16:9, 2048×1152급, 0.12 크레딧.
- 프롬프트 전문:

```text
Bright documentary-style editorial photograph inside a modern Korean national university AI and computer engineering classroom, 16:9 landscape. Six to eight clearly Korean university students in their early twenties and one clearly Korean professor in their forties collaborate around a pale-wood lab table, studying a small unbranded circuit board and a simple educational robot with no markings. Their poses are natural, attentive, and academic, not a corporate meeting; faces are medium-distance environmental portraits, no face close-ups. White and very-light-gray architecture, pale natural wood, large windows with soft daylight, high-key exposure, neutral white balance, gentle shadows, restrained #3182F6 blue only in one or two plain clothing accents. All laptop lids are blank and turned so screens show only soft abstract blue shapes with no interface. A completely blank whiteboard is visible in the background. Camera height 1.5 m, 35mm-equivalent lens, balanced composition, key group centered and protected for responsive crop, clean upper-right wall space for dark web copy. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND anywhere, no handwriting, equations, code, UI, labels, book titles, posters, signage, clothing print, logos, brands, Apple marks, university emblems, red, maroon, orange, pink, neon strips, cyan glow, black background, dark mood, startup-office styling, celebrity likeness, non-Korean-looking cast, watermark, malformed hands, or duplicated people.
```

### `dept_data`

- 모델: **soul_cinematic 2k**. 사람 중심의 한국 대학 데이터 분석 수업을 자연스럽게 연출하는 데 적합하다.
- 비율/해상도/비용: 16:9, 2048×1152급, 0.12 크레딧.
- 프롬프트 전문:

```text
Bright editorial photograph of a data science workshop at a modern Korean national university, 16:9 landscape. Five clearly Korean university students and one clearly Korean female professor work together around a pale-wood table, comparing a large printed visualization made only of unlabeled blue dots and lines and two laptop screens showing abstract blue data points without axes, text, numbers, or interface elements. The scene must read as rigorous university data analysis, not a business pitch or event presentation. Natural candid interaction, medium-wide environmental view, no face close-ups. White and very-light-gray room, pale wood, generous daylight, high-key exposure, soft shadows, neutral color, only restrained #3182F6 blue accents on plain objects. Camera at 1.5 m, 35mm-equivalent lens, key subjects centered with safe margins, leave calm bright wall space at upper-left for dark web copy. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND, no numbers, labels, axes, code, UI, handwriting, book titles, posters, signage, clothing print, logos, brands, university emblems, red, maroon, orange, pink, neon strips, cyan glow, black background, dark mood, startup-office styling, celebrity likeness, non-Korean-looking cast, watermark, malformed hands, or duplicated people.
```

### `dept_stat`

- 모델: **soul_cinematic 2k**. 통계학 강의의 실제적인 교수-학생 상호작용이 핵심이다.
- 비율/해상도/비용: 16:9, 2048×1152급, 0.12 크레딧.
- 프롬프트 전문:

```text
Bright documentary editorial photograph of an undergraduate statistics class at a modern Korean national university, 16:9 landscape. One clearly Korean professor in their forties guides six clearly Korean university students seated in a shallow semicircle around a pale-wood teaching table. The professor points to a large wall display containing only a clean abstract arrangement of blue dots and one smooth curve, with absolutely no axes, numbers, letters, legends, or interface. Students discuss printed sheets containing only unlabeled blue geometric data marks. The atmosphere is serious, curious, and institutional, not corporate. Medium-wide view, faces small to medium in frame, no close-up. White/light-gray architecture, pale wood, bright natural daylight, high-key neutral exposure, soft shadows, #3182F6 as the only accent. Camera height 1.5 m, 35mm-equivalent lens, professor and display inside the central crop-safe area, calm upper-right negative space for dark web copy. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND, no equations, numbers, axes, handwriting, UI, labels, book titles, posters, signage, clothing print, logos, brands, university emblems, red, maroon, orange, pink, neon strips, cyan glow, black background, dark mood, startup-office styling, celebrity likeness, non-Korean-looking cast, watermark, malformed hands, or duplicated people.
```

### `dept_ie`

- 모델: **soul_cinematic 2k**. 산업공학 실험실에서 한국인 구성원과 장비가 자연스럽게 상호작용하는 실사 장면이 필요하다.
- 비율/해상도/비용: 16:9, 2048×1152급, 0.12 크레딧.
- 프롬프트 전문:

```text
Bright high-end editorial photograph in a Korean national university industrial engineering teaching laboratory, 16:9 landscape. Four clearly Korean university students and one clearly Korean professor evaluate a compact, professionally finished tabletop production-line demonstrator: a small conveyor, one clean robotic arm, and plain colorless bins, all unbranded and free of labels. The equipment must look credible, complete, safe, and university-grade, with tidy hidden wiring, not a damaged prototype. Students observe cycle flow and ergonomics with natural academic concentration; no corporate pitch, no theatrical pose, no face close-ups. White/light-gray laboratory, pale wood work surface, broad natural daylight, high-key neutral exposure, soft shadows, restrained #3182F6 blue only on one plain safety accent. Eye-level 1.5 m camera, 35mm-equivalent lens, equipment and people centered with responsive crop safety, upper-left clean wall space for dark web copy. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND, no numbers, labels, stickers, product plates, UI, screens, book titles, posters, signage, clothing print, logos, brands, university emblems, red, maroon, orange, pink, neon strips, cyan glow, black background, dark mood, startup-office styling, celebrity likeness, non-Korean-looking cast, watermark, exposed chaotic wires, malformed machinery, malformed hands, or duplicated people.
```

### `dept_ax`

- 모델: **soul_cinematic 2k**. 서로 다른 전공의 한국인 학생들이 대학 프로젝트로 협업하는 인물 중심 장면이 필요하다.
- 비율/해상도/비용: 16:9, 2048×1152급, 0.12 크레딧.
- 프롬프트 전문:

```text
Bright institutional editorial photograph of an interdisciplinary AX convergence studio at a modern Korean national university, 16:9 landscape. Exactly six clearly Korean university students from visibly different academic practices collaborate at one large pale-wood table: one works with an unbranded circuit board, one with a small material sample, one with a simple physical model, and others compare abstract blue diagrams made only of unlabeled shapes. The scene must feel like supervised university project-based learning with academic seriousness, not a startup meeting, fashion studio, coworking office, or sales workshop. Natural candid gestures, medium-wide environmental framing, no face close-ups. White/light-gray architecture, pale wood, daylight, high-key neutral exposure, soft shadows, only restrained #3182F6 blue accents on plain objects and one garment. Camera at 1.5 m, 35mm-equivalent lens, all six people and project artifacts safely inside the center 80 percent, clean upper-right wall space for dark web copy. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND, no numbers, handwriting, UI, labels, book titles, posters, signage, clothing print, logos, brands, Apple marks, university emblems, red, maroon, orange, pink, clothing racks, neon strips, cyan glow, black background, dark mood, startup-office styling, celebrity likeness, non-Korean-looking cast, watermark, paper clutter, malformed hands, or duplicated people.
```

### `roadmap_campus`

- 모델: **soul_cinematic 2k**. 실제 대학 캠퍼스의 자연광과 한국인 학생 흐름을 사진적으로 만드는 편이 적합하다.
- 비율/해상도/비용: 16:9, 2048×1152급, 0.12 크레딧.
- 프롬프트 전문:

```text
Bright premium architectural editorial photograph of a contemporary Korean national university campus walkway, 16:9 landscape. A modern white and light-gray academic building with pale wood accents anchors the center; five to seven clearly Korean university students walk and converse naturally at medium-to-long distance, carrying plain unbranded bags. The campus feels active, trustworthy, and public-institutional, with young green trees, restrained landscaping, an open accessible path, soft spring daylight, high-key neutral exposure, gentle shadows, and one subtle #3182F6 blue architectural accent only. No signboards or kiosks anywhere. Eye-level 1.5 m camera, 28–35mm-equivalent lens, centered building and walkway protected for responsive crops, generous clean bright sky at upper-left for dark web copy. ABSOLUTELY NO TEXT OR LETTERS OF ANY KIND, no numbers, signs, kiosks, maps, plaques, posters, labels, clothing print, logos, brands, university emblems or emblem-like shapes, red, maroon, orange, pink, neon strips, cyan glow, black background, dark mood, celebrity likeness, non-Korean-looking cast, close-up faces, watermark, malformed architecture, or duplicated people.
```

### 비용 합계

| 모델 | 수량 | 장당 실측 비용 | 소계 |
|---|---:|---:|---:|
| nano_banana_pro 2k | 2 | 2.00 | 4.00 |
| soul_cinematic 2k | 6 | 0.12 | 0.72 |
| **합계** | **8** |  | **4.72 크레딧** |

잔액 798 크레딧 기준 8장 1회 재생성 후 793.28 크레딧이 남는다. 다만 실무 검수용으로 각 장 2안 생성 시 9.44 크레딧이므로, 2안 생성 후 한 안을 고르는 편이 안전하다.

## 5. 개념 표현 방식 재검토

### `why_converge`: 실사보다 다이어그램형 3D 오브젝트가 낫다

“세 단과대학에 흩어진 역량이 하나로 모인다”는 것은 한 순간의 실제 사진으로 증명하기 어려운 추상적 변화다. 세 방·세 팀·세 사진을 나열하면 현재 결과처럼 “세 개가 따로 있음”만 강화한다. 반면 세 경로가 한 결절로 실제 합류해 하나의 구조가 되는 무문자 3D 오브젝트는 시작-합류-결과의 인과를 한 프레임에서 읽게 한다. 사이트의 파랑 단일 액센트와도 가장 잘 맞으며, 텍스트·로고·인종·금지 의류 리스크도 제거한다. 따라서 **nano_banana_pro 기반의 밝은 무문자 3D 컨버전스 렌더**를 권고한다.

### `infra_gpu`: 실사풍 정밀 3D 렌더가 낫다

GPU 256장이라는 규모는 외관만으로 정확히 셀 수 없지만, 최소한 다수의 서버 랙·냉각·케이블 트레이·깊은 중앙 통로가 있어야 컴퓨팅 인프라로 즉시 읽힌다. 실제 서버실 사진은 제조사 로고, 랙 라벨, 경고 스티커, 상태 UI, 검정 랙과 다크 톤을 피하기 어렵다. 정밀 3D는 서버의 물리적 신뢰성은 유지하면서 모든 라벨을 없애고 흰색/연회색/#3182F6 팔레트를 통제할 수 있다. 단, 지나친 네온·시안 글로우를 쓰면 SF 데이터센터가 되므로 **밝은 대학 시설 사진처럼 보이는 포토리얼 3D**여야 한다.

## 최종 권고

월요일 제출본에는 `hero_light`만 유지하고 나머지 8장은 교체하는 것이 브리프의 절대 기준에 부합한다. 우선순위는 의미 자체가 틀린 `why_converge`, `infra_gpu`, 절대 금지 위반이 가장 밀집한 `dept_ai`, `dept_ax`, `dept_ie`, 이후 `roadmap_campus`, `dept_data`, `dept_stat` 순이다. 생성 후에는 원본 해상도로 다시 열어 글자·로고·금지색·한국인 인물 요건을 동일 체크리스트로 재검수해야 한다.
