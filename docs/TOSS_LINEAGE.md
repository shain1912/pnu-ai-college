# toss 계보 독립 감사

감사일: 2026-08-22  
범위: `docs/motion/*`, `docs/SCENES.md`, `src/scenes/*.jsx`, `src/index.css`, `src/hooks/useReveal.js`, 지정 컨택트시트, `public/video/*`, `assets/*-jobs.txt`  
주의: 이 문서는 구현자의 자기보고를 증거로 쓰지 않았다. 코드 주석은 의도를 보여 줄 뿐이므로, 프레임이나 실행 결과와 독립적으로 맞지 않으면 증거로 격상하지 않았다. 현재 `src/scenes/`에는 계약상 11개 중 4개 파일만 있고 나머지는 `src/pages/`에 인라인 구현되어 있다. 따라서 “씬 11개”는 `docs/SCENES.md`의 논리적 씬 목록을 뜻한다.

## 요약 판정

직접 계보가 강한 것은 세 가지뿐이다. (1) 홈 미디어의 인셋→확장, (2) 텍스트 blur+opacity 입장 어휘, (3) 화면 왼쪽의 전역 세로 진행 표시다. 그러나 첫째는 toss의 관찰상 약 40ms인 마지막 확장을 700ms로 크게 늦췄고, 둘째는 toss의 장별 sticky 교체를 일반 페이지의 최초 화면 리빌로 바꿨으며, 셋째만 구조적으로 가장 가깝다. 나머지 탭·카드·라우트·아코디언 동작은 일반 웹 UI 또는 다른 레퍼런스 계보다.

## 동작별 감사

### 홈 히어로 텍스트 리빌
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/pages/Home.jsx:88-103`의 eyebrow·H1·lead·CTA, `src/hooks/useReveal.js:53-92`, `src/index.css:213-227` |
| 우리 동작 | opacity 0→1, translateY(18px)→0, blur(6px)→0을 400ms 동안 `cubic-bezier(0.16,1,0.3,1)`로 전환한다. `revealDelay` 기본 70ms이며 홈은 0/70/140/210ms 지연이다. 실제 최초 화면은 RAF kick으로 `data-shown`이 붙는다. |
| toss 대응 챕터 | 1. 송금 히어로 / 실사 영상 |
| toss 캡처 근거 | `assets/motion/toss-load-20-sheet1.jpg`, 000~003 |
| 원본에서 관찰된 것 | 000은 본문이 없고 001~002에서 세 문구가 순차적으로 나타난다. 컨택트시트에서 위치 이동은 분명하지 않고 opacity 변화가 분명하다. blur의 정확한 양과 전체 지속시간은 이 시트만으로 특정 불가다. |
| 일치도 | 유사 |
| 그대로 가져온 것 | 여러 텍스트 덩어리를 짧은 지연으로 순차 노출하는 발상, opacity/blur 어휘 |
| 바꾼 것과 이유 | toss 하단 대형 문구를 중앙 H1·설명·CTA로 바꿨고 translateY 18px을 추가했다. 대학 사이트 가독성과 정보 위계를 위한 변경으로 보이나 이유는 코드에서 입증되지 않는다. |
| 근거 강도 | 직접관찰(프레임) + 코드확인; blur 수치와 변경 이유는 추정 |

### 홈 히어로 미디어 인셋 확장
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/pages/Home.jsx:104-121`의 atrium 영상 figure, `src/index.css:239-253` |
| 우리 동작 | opacity 0→1, scale 0.93→1, border-radius 40px→최종 클래스 반경을 각각 700ms, `cubic-bezier(0.16,1,0.3,1)`로 전환한다. |
| toss 대응 챕터 | 1. 송금 히어로 / 실사 영상 |
| toss 캡처 근거 | `assets/motion/toss-load-20-sheet1.jpg`, 001~003 |
| 원본에서 관찰된 것 | 실사 영상이 큰 둥근 인셋으로 나타난 뒤 좌우 여백이 사라져 풀 폭에 가까워진다. 관찰 가능한 마지막 확장은 약 40ms이나 시작점이 로딩과 겹쳐 전체 지속시간은 불명이다. |
| 일치도 | 유사 |
| 그대로 가져온 것 | 둥근 인셋 실사 미디어가 커지는 구성 |
| 바꾼 것과 이유 | toss의 폭 확장을 uniform scale 0.93과 700ms fade로 치환했다. ours-v3 000~002에서도 텍스트가 먼저 선명해지고 미디어는 이미 큰 폭으로 자리 잡아, toss만큼 극적인 인셋→풀블리드는 보이지 않는다. 안정적인 대학 홈 진입을 위한 것으로 추정한다. |
| 근거 강도 | 직접관찰(양쪽 프레임) + 코드확인; 이유는 추정 |

### 전역 세로 스크롤 진행바
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/index.css:255-279`, `src/components/ScrollRail.jsx`의 fixed rail/span |
| 우리 동작 | 좌측 2px fixed 선의 `scaleY(var(--progress))`가 스크롤 비율에 따라 0→1로 즉시 갱신된다. CSS transition은 없다. |
| toss 대응 챕터 | 1~10 전체를 관통하는 진행 내비게이션(특히 §4); 개별 챕터 대응은 없음 |
| toss 캡처 근거 | `assets/motion/toss-scroll-64-120-sheet1.jpg` 000~011, `sheet4.jpg` 036~047, `sheet6.jpg` 060~064 |
| 원본에서 관찰된 것 | 화면 왼쪽 같은 x 위치에 세로 눈금/현재점이 모든 챕터에서 지속된다. |
| 일치도 | 유사 |
| 그대로 가져온 것 | 화면 왼쪽에 전역 고정된 세로 진행 표시라는 구조 |
| 바꾼 것과 이유 | toss는 눈금과 현재 위치 표식처럼 보이나 우리는 파란 gradient 막대의 연속 scale이다. 구현 단순화로 보이나 명시 근거는 없다. |
| 근거 강도 | 직접관찰(프레임) + 코드확인 |

### 일반 첫 화면 리빌
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/hooks/useReveal.js:42-92`, 각 페이지/씬의 `[data-reveal]`, `src/index.css:213-227` |
| 우리 동작 | 첫 viewport 안 요소만 400ms blur(6px)+opacity+translateY(18px)로 입장한다. fold 아래 요소는 즉시 `data-shown` 처리되어 스크롤 도달 리빌이 없다. 목록은 보통 50~70ms stagger다. |
| toss 대응 챕터 | 대응 없음. 가장 가까운 것은 toss §3의 장면별 문구 blur+opacity 교체 |
| toss 캡처 근거 | `assets/motion/toss-scroll-64-120-sheet1.jpg` 009~011, `sheet4.jpg` 036~038; `assets/motion/toss-scroll-32-sheet2.jpg` 012~023 |
| 원본에서 관찰된 것 | toss는 sticky 무대의 현재 문구가 흐려져 퇴장하고 다음 문구가 흐림에서 선명해지는 연속 교체다. 일반 문서 블록의 viewport 입장은 아니다. |
| 일치도 | 발상만 차용 |
| 그대로 가져온 것 | blur+opacity로 초점을 맞추는 시각 어휘 |
| 바꾼 것과 이유 | scroll-linked 장면 교체를 최초 화면 1회 입장으로 제한했다. `useReveal.js:43-51`은 다른 레퍼런스의 비스크롤 원칙과 읽기 목적을 이유로 명시한다. |
| 근거 강도 | 코드확인 + 프레임 직접관찰 |

### 축 탭 전환
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/scenes/AxisScene.jsx:103-153`, `src/hooks/useReveal.js:28-35`, `src/index.css:311-322` |
| 우리 동작 | 클릭 시 대상 panel에 두 RAF 동안 switching 속성을 부여해 opacity 0→1, blur(4px)→0, translateY(6px)→0을 200ms `cubic-bezier(0.16,1,0.3,1)`로 전환한다. 선택 탭 자체의 배경·색·그림자 전환 duration은 클래스에 명시되지 않아 즉시 바뀐다. |
| toss 대응 챕터 | 대응 없음 |
| toss 캡처 근거 | toss 근거 없음. 우리 캡처 `assets/motion/axis-tab-sheet1.jpg` 000~011, `axis-tab2-sheet1.jpg` 000~011 |
| 원본에서 관찰된 것 | 우리 탭은 첫 캡처에서는 거의 변화가 잡히지 않고, 두 번째는 001에서 이전 패널이 흐려진 중간 상태, 002에서 새 탭/패널이 선명해진다. toss 10개 챕터에는 탭 UI가 없다. |
| 일치도 | 무관 |
| 그대로 가져온 것 | 없음이라고 판정 |
| 바꾼 것과 이유 | 해당 없음. blur 어휘만 공통이나 탭이라는 상호작용 계보는 toss 프레임으로 입증할 수 없다. |
| 근거 강도 | 직접관찰(우리 프레임) + 코드확인; toss 계보는 근거없음 |

### 카드 hover lift
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/index.css:161-175`, 각 `a.card` |
| 우리 동작 | box-shadow와 transform을 200ms `cubic-bezier(0.2,0,0,1)`로 전환하며 hover에서 translateY(-2px)와 더 큰 shadow로 바뀐다. |
| toss 대응 챕터 | 대응 없음 |
| toss 캡처 근거 | 지정 toss 전체 스크롤 캡처에는 hover가 없음 |
| 원본에서 관찰된 것 | 판정 불가. `docs/motion/interaction.md`의 toss 미시 상호작용 관찰과도 “모든 카드 lift”의 직접 대응은 성립하지 않는다. |
| 일치도 | 무관 |
| 그대로 가져온 것 | 입증 가능한 것 없음 |
| 바꾼 것과 이유 | 일반적인 카드 affordance를 적용했다. |
| 근거 강도 | 코드확인; toss 계보는 근거없음 |

### 내비게이션 밑줄
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/index.css:177-200`, SiteLayout의 `.nav-underline` 링크 |
| 우리 동작 | 2px 선이 transform scaleX(0→1), 왼쪽 origin으로 200ms `cubic-bezier(0.2,0,0,1)` 전환한다. hover와 현재 페이지에 적용한다. |
| toss 대응 챕터 | 대응 없음(10개 본문 챕터 바깥의 헤더 상호작용) |
| toss 캡처 근거 | 지정 전체 스크롤 시트는 hover 실험이 아니므로 없음 |
| 원본에서 관찰된 것 | 해당 프레임에서는 헤더가 고정되어 보일 뿐 밑줄 성장 동작은 관찰되지 않는다. |
| 일치도 | 발상만 차용(별도 interaction 캡처를 전제할 때); 이번 지정 프레임 기준 무관 |
| 그대로 가져온 것 | 코드 주석은 toss의 좌→우 밑줄을 주장하지만, 이번 감사 프레임으로 독립 재확인하지 못했다. |
| 바꾼 것과 이유 | 200ms와 2px 수치는 우리 토큰에 맞춘 값이다. |
| 근거 강도 | 코드확인; toss 대응은 약한 문서 간접근거 |

### 라우트 진입
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/hooks/useReveal.js:18-25`, `src/index.css:298-309` |
| 우리 동작 | 새 main을 두 RAF 동안 opacity 0, blur(5px), translateY(8px)에 두었다가 400ms `cubic-bezier(0.16,1,0.3,1)`로 정상화한다. |
| toss 대응 챕터 | 대응 없음 |
| toss 캡처 근거 | 지정 toss 홈 스크롤/로드 프레임에는 라우트 전환이 없음 |
| 원본에서 관찰된 것 | 관찰 못함 |
| 일치도 | 무관 |
| 그대로 가져온 것 | blur+opacity라는 일반 어휘 외 없음 |
| 바꾼 것과 이유 | 페이지 전환 피드백을 추가한 독자 구현이다. |
| 근거 강도 | 코드확인; toss 계보는 근거없음 |

### 경력 아코디언과 행 hover
| 항목 | 내용 |
|---|---|
| 우리 위치 | `src/index.css:324-353`, `src/components/FacultyList.jsx` |
| 우리 동작 | 열릴 때 max-height 0→72rem, opacity 0→1, translateY(-4px)→0을 200ms `cubic-bezier(0.16,1,0.3,1)` keyframe으로 실행한다. 화살표는 90°→-90°를 200ms standard easing, 행 배경은 hover에서 120ms standard easing이다. 닫힘 애니메이션은 DOM 제거 방식이면 보장되지 않는다. |
| toss 대응 챕터 | 대응 없음 |
| toss 캡처 근거 | 지정 toss 챕터 프레임에 아코디언 없음 |
| 원본에서 관찰된 것 | 관찰 못함 |
| 일치도 | 무관 |
| 그대로 가져온 것 | 없음 |
| 바꾼 것과 이유 | 대학 교원 정보의 세부 내용 노출을 위한 고유 상호작용이다. |
| 근거 강도 | 코드확인; toss 계보는 근거없음 |

### 버튼·탭·칩 색상 hover
| 항목 | 내용 |
|---|---|
| 우리 위치 | 예: `src/scenes/AxisScene.jsx:122-126`, `src/pages/AiCollege.jsx:112-123`, `src/pages/RoadmapPage.jsx:92-99` |
| 우리 동작 | `transition-colors`를 쓰는 링크는 Tailwind 기본 duration(프로젝트 코드에 명시 수치 없음)으로 배경색이 변한다. Axis 비선택 탭의 `hover:bg-gray-100`은 명시 transition이 없어 즉시 변화한다. |
| toss 대응 챕터 | 대응 없음 |
| toss 캡처 근거 | 지정 스크롤/로드 프레임은 hover 근거가 아님 |
| 원본에서 관찰된 것 | 관찰 못함 |
| 일치도 | 무관 |
| 그대로 가져온 것 | 없음 |
| 바꾼 것과 이유 | 일반 UI 피드백이다. |
| 근거 강도 | 코드확인; toss 계보는 근거없음 |

## 1. 씬 대응표

아래는 이름이 비슷해서가 아니라 화면 구조와 모션 계보가 실제로 겹치는지를 기준으로 분류했다.

| # | 우리 논리 씬 | 구현 위치 | toss 대응 | 판정과 이유 |
|---:|---|---|---|---|
| 1 | HeroScene | `src/pages/Home.jsx:82-122` | 1. 송금 히어로 / 실사 영상 | 직접 대응. 순차 텍스트와 둥근 실사 미디어 확장을 사용하되 대학 atrium·중앙 카피로 변경했다. |
| 2 | GatewayScene | `src/pages/Home.jsx:124-183` | 우리 고유 | 세 개 관문 카드 그리드는 toss 10개 챕터의 제품 sticky 무대/가로 레일과 구조가 다르다. |
| 3 | FactSheetScene | `src/pages/Home.jsx` 후반 summary | 우리 고유 | 대학 팩트 요약이다. 숫자 카드가 있다는 표면적 유사만으로 5장 판매·정산에 대응시키지 않는다. |
| 4 | BackgroundScene | `src/scenes/BackgroundScene.jsx` 및 AI대학 설립 배경 | 우리 고유 | As-Is→To-Be 비교행과 수렴 도형은 toss 챕터에 없다. |
| 5 | StructureScene | `src/pages/AiCollege.jsx:70-127` | 우리 고유 | 학부 카드 목록이다. toss의 제품 카드 레일은 가로 이동·교체하지만 우리는 정적 링크 그리드다. |
| 6 | ScaleScene | `src/scenes/ScaleScene.jsx` | 우리 고유 | GPU 미디어와 수치 4종. 7장 관리자 UI나 5장 정산 숫자와 기능·무대가 다르다. |
| 7 | ApexScene | `src/pages/AiCollege.jsx:168-212` | 우리 고유 | 운영기구 카드 목록. toss 대응 없음. |
| 8 | ProgramScene | `src/pages/AiCollege.jsx:214-256` | 우리 고유 | 프로그램/기업 목록. 광고 카드 레일(6장)과 상호작용·레이아웃이 다르다. |
| 9 | AxisScene | `src/scenes/AxisScene.jsx` | 우리 고유 | 탭으로 학부를 바꾸는 UI이며 toss 10장에 탭은 없다. 3D 오브젝트라는 표면만으로 2장에 대응시키지 않는다. |
| 10 | ChainScene | `src/scenes/ChainScene.jsx` 또는 `src/pages/AdpxPage.jsx:31-79` | 우리 고유 | 부산항 가치사슬의 단계형 설명이다. toss 제품 여정과 의미·모션 모두 다르다. |
| 11 | RoadmapScene | `src/pages/RoadmapPage.jsx:18-71` | 우리 고유 | 연도별 세로 타임라인이다. toss의 전역 좌측 rail과 모양은 일부 비슷하지만 역할이 달라 직접 대응이 아니다. |

결론적으로 11개 중 직접 대응은 HeroScene 하나뿐이다. 공통 전역 리빌과 진행바는 개별 씬 대응이 아니라 사이트 레벨 문법이다.

## 2. 영상 계보

`public/video`에는 6개 콘텐츠의 두 포맷, 총 12파일이 있다. 같은 basename의 mp4/webm은 같은 원본의 인코딩 변형으로 본다. 이 수량은 감사 종료 직전 다시 읽은 현재 작업트리 기준이다.

| 파일 | 코드 사용 여부 | 출처 판정 | 근거 |
|---|---|---|---|
| `atrium-loop.mp4`, `atrium-loop.webm` | `src/pages/Home.jsx:106-118`에서 사용 | 출처 불명; toss 참조 아님 | 어떤 `assets/*-jobs.txt`에도 `atrium` 항목이 없다. 영상 내용은 대학 atrium이며 toss 열차 영상의 원본 재사용은 아니다. 생성 방식은 기록만으로 확정 불가다. |
| `axis_a.mp4`, `axis_a.webm` | 현재 미사용(`AxisScene.jsx:13-17`가 video를 null로 둠) | Higgsfield 생성 작업 산출로 추정 | `assets/loop-jobs.txt:1`의 `axis_a` job ID. 다만 jobs 파일에는 프롬프트 문장이 없고 slug+ID뿐이어서 “프롬프트 출처”라고 부르기에는 불충분하다. |
| `axis_d.mp4`, `axis_d.webm` | 현재 미사용 | Higgsfield 생성 작업 산출로 추정 | `assets/loop-jobs.txt:2`; 프롬프트 본문 없음. |
| `axis_x.mp4`, `axis_x.webm` | 현재 미사용 | Higgsfield 생성 작업 산출로 추정 | `assets/loop-jobs.txt:4`; 프롬프트 본문 없음. |
| `why_converge.mp4`, `why_converge.webm` | 현재 미사용(Background는 poster/정지 이미지 경로) | Higgsfield 생성 작업 산출로 추정 | `assets/loop-jobs.txt:6`; 프롬프트 본문 없음. |
| `infra_gpu.mp4`, `infra_gpu.webm` | `src/scenes/ScaleScene.jsx:119-133`에서 사용 | Higgsfield 생성 작업 산출로 추정 | `assets/loop-jobs.txt:7`; 프롬프트 본문 없음. |

감사 도중 공유 작업트리의 에셋 상태가 변했다. 최초 열람 때 `infra_gpu` 두 파일은 없었으나 종료 직전 재열람에서는 존재했다. 위 표는 종료 시점 상태를 반영하며, 이 동시 변경의 작성자를 본 감사는 출처 증거로 사용하지 않는다.

toss 영상 연출 참조 판정: **홈 atrium의 “둥근 실사 미디어를 크게 노출”하는 컨테이너 연출만 1장 001~003과 유사하다. 영상 자체의 촬영·편집(열차 여성→폰 근접 컷)은 atrium 고정 카메라 루프와 다르므로 참고 근거 없음**. 축·수렴 영상은 toss 2장의 3D 폰이나 9장의 여행 영상과 형태가 다르고, 이를 참고했다는 프롬프트 기록도 없다.

## 3. 차용하지 않은 toss 요소

- 장별 sticky 고정 무대와 스크롤 하이재킹: 가져오지 않았다. 우리 페이지는 일반 문서 흐름이고 SCENES 계약이 패럴랙스·스크롤 하이재킹을 금지한다.
- 배경색의 흰색→검정→실사→흰색→검정→남색 연쇄 전환(040~064): 가져오지 않았다. 우리는 흰색/연회색 band를 교대할 뿐이며 전환 애니메이션이 없다.
- 가로 상품 카드 레일(5장 026~029)과 광고 카드 레일(6장 030~035): 가져오지 않았다. 카드들은 정적 grid/list다.
- 3D 폰 렌더를 고정하고 왼쪽 카피만 교체하는 무대(2장 008~012): 가져오지 않았다. Axis는 정적 3D 이미지와 클릭 탭이다.
- 검은 캡슐이 전 화면 검정으로 확장되는 interstitial(8장 040~042): 가져오지 않았다.
- 생활 사진 모자이크가 순차 충전되는 장면(9장 054~057): 가져오지 않았다.
- 작은 비행기 창 카드가 풀블리드 영상으로 확장되는 장면(9장 058~061): 가져오지 않았다.
- 와이어프레임 지구와 남색 gradient 피날레(10장 062~064): 가져오지 않았다.
- 제품 UI의 스크롤 동기화된 상태 교체와 실사 컷 편집: 가져오지 않았다.
- 전역 세로 진행바: **가져왔다**. 다만 눈금형 내비게이션을 2px gradient progress로 단순화했다.
- 히어로 인셋 미디어 확장과 문구 stagger: **부분적으로 가져왔다**.

## 4. 근거 없는 주장 목록

1. “Axis 탭 전환은 toss 같다” — toss 10개 챕터에 탭이 없고 우리 캡처만 존재한다.
2. “카드 hover lift는 toss에서 가져왔다” — 지정 toss 프레임은 hover를 기록하지 않으며, 모든 카드 lift에 대한 직접 프레임 근거가 없다.
3. “라우트 blur 진입은 toss 계보다” — toss 홈 load와 SPA 라우트 전환은 다른 사건이며 라우트 프레임이 없다.
4. “일반 섹션 리빌이 toss 스크롤 모션 재현이다” — 실제 구현은 fold 아래를 즉시 노출하고, toss는 sticky 무대 안에서 스크롤 연동 교체한다.
5. “700ms 히어로 확장이 toss의 타이밍을 재현한다” — toss 시트에서 확실히 보이는 마지막 확장은 약 40ms이며 전체 시작은 관찰 실패다. 700ms의 근거가 없다.
6. “Pretendard, 파란색·회색 팔레트, radius 토큰 때문에 toss와 같은 화면이다” — 이는 정적 스타일 유사성일 뿐 이 감사의 모션 프레임 계보 증거가 아니다.
7. “영상들이 toss 연출을 참고했다” — jobs 파일에는 프롬프트 본문이 없고 toss 챕터명도 없다. atrium은 job 기록조차 없다.
8. “영상 파일 전부가 실제 사용 중이다” — `axis_*`, `why_converge`는 존재하지만 코드에서 video가 null이거나 정지 이미지를 사용한다. `infra_gpu`는 사용되지만, 작업 중 파일이 추가된 동시 변경이라 최초 감사 시점과 종료 시점의 상태가 달랐다.
9. “씬 11개가 모두 `src/scenes/*.jsx`로 완성돼 있다” — 실제 파일은 4개뿐이며 나머지 논리 씬은 페이지 인라인 구현이다.
10. “toss의 배경 전환·가로 레일·제품 sticky 무대를 재현했다” — 코드와 우리 홈 프레임 어디에도 없다.

## 5. 총 판정

### 나란히 본 결과

| 비교축 | toss 프레임 | 우리 프레임 | 판정 |
|---|---|---|---|
| 홈 진입 | `toss-load-20-sheet1` 000~003: 빈 흰 화면→둥근 실사→폭 확장, 하단 3구절 | `ours-v3-sheet1` 000~002: 중앙 제목 blur 해소, CTA, 하단 atrium 미디어 | 구성 발상은 보이지만 카피 위치·속도·확장 강도가 다르다. |
| 전체 스크롤 | `toss-scroll-64-120` 000~064: 실사·3D·UI·검정 interstitial·모자이크·여행·지구를 sticky 무대로 연속 교체 | 우리 사이트: 흰/연회색 문서형 band, 카드·리스트·탭 중심 | 같은 종류의 화면으로 보기 어렵다. |
| 전역 표식 | 왼쪽 눈금형 진행 내비게이션이 전 장 지속 | 왼쪽 2px 파란 progress | 가장 분명한 계보지만 표현은 단순화됐다. |
| 상호작용 | scroll-driven 제품 장면 교체가 핵심 | 클릭 탭과 일반 hover가 핵심 | 상호작용 모델이 다르다. |

**총점: 3.5/10.**  
히어로의 둥근 대형 미디어, blur/fade 어휘, 좌측 진행바 때문에 “toss를 참고한 흔적”은 보인다. 하지만 toss 홈의 정체성인 긴 sticky 제품 시네마, 배경색 전환, 가로 카드 레일, 실사/3D/UI의 연속 변환을 거의 모두 쓰지 않았고, 우리 화면은 일반적인 대학 정보 사이트의 카드·문서 흐름이다. 따라서 **toss와 같은 종류의 화면은 아니다**. “toss 계보”라고 부를 수 있는 범위는 전역 디자인 시스템 전체가 아니라, 제한된 세 가지 모션 모티프에 그친다.

## 감사 한계

- 지정 컨택트시트는 샘플 간격이 있으므로 실제 CSS easing이나 완전한 duration을 역산할 수 없다. toss 시간 수치는 `docs/motion/toss.md`의 캡처 간격과 보이는 프레임 구간만 사용했다.
- `assets/*-jobs.txt`는 프롬프트가 아니라 slug와 job ID만 보존한다. 따라서 Higgsfield 작업 존재는 추정할 수 있어도 프롬프트 문구나 toss 참조 여부는 입증할 수 없다.
- 우리 구현의 수치는 소스에서 직접 읽었지만 Tailwind 기본 `transition-colors`처럼 프로젝트 코드에 duration이 없는 경우 임의 수치를 쓰지 않았다.
