# 모션 라이브러리 도입 결정

결론: **추가 라이브러리를 도입하지 않고 CSS + 기존 React 훅만 사용한다.** 현재 필요한 동작은 모두 CSS transition/keyframes와 소량의 DOM 상태 표시로 구현할 수 있고, 가장 작은 후보도 실제 프로덕션 번들을 15.88 kB(gzip) 늘렸다.

## 실제 번들 측정

2026-08-22에 각 패키지를 `npm install --no-save`로 실제 설치하고, 기능을 import한 상태에서 매번 `npm run build`를 실행했다. Vite가 트리 셰이킹하도록 실제 필요한 표면만 import했으며, 측정 뒤 임시 import와 패키지는 제거했다.

| 방식 | 측정 import | JS gzip | 기준 대비 |
|---|---|---:|---:|
| CSS만 | 없음 | 100.37 kB | 0 |
| anime.js v4 | `animate`, `createTimeline`, `stagger` | 116.26 kB | **+15.88 kB** |
| GSAP | `gsap` | 128.74 kB | **+28.37 kB** |
| Motion | `AnimatePresence`, `motion` (`motion/react`) | 143.37 kB | **+43.00 kB** |

원본 바이트도 각각 312,609 / 353,256 / 383,811 / 442,158 B였다. anime.js 전체 namespace를 강제로 포함한 참고 측정은 144.15 kB gzip이었지만, 권고 비교에는 현실적인 named import 결과를 사용했다.

## 필요한 동작과 필요성 판정

`ours.md`의 무전환 목록을 기능 단위로 묶었다.

| 필요한 동작 | CSS만 가능한가 | 판정 |
|---|---|---|
| ADP+X 탭 패널·오브젝트 교체 | 가능 | 상태 attribute + opacity/blur/translate transition. morph는 서로 다른 래스터 이미지라 라이브러리를 써도 진짜 morph가 되지 않는다. |
| 교원 경력 아코디언 높이·opacity·chevron | 가능 | 조건부 마운트 목록에 max-height keyframes, 화살표 transform 적용. |
| 라우트 이동 입장 | 가능 | 고정 헤더를 제외한 `main`에 1회 opacity/blur/8px transition. 전체 화면 막은 쓰지 않는다. |
| 카드·교원 행 hover | 가능 | color, shadow, 2px 이하 transform transition. |
| 첫 화면 1회 reveal/stagger | 가능 | 기존 `data-reveal`, transition-delay, IntersectionObserver만으로 충분하다. 아래 폴드는 즉시 표시한다. |
| 수치 카운트업 | 기술적으로 가능 | 구현하지 않음. Stripe도 135+/$1.9T 등의 지표를 최종값으로 즉시 표시하며, 기관 문서에서 수치 판독을 늦출 이유가 없다. |
| 타임라인 선 draw·노드 pulse | 가능 | 구현하지 않음. 네 레퍼런스 모두 스크롤 진입 모션이 없고, 반복/주의유도 장식은 기관 사이트 상한을 넘는다. |
| scroll rail | 가능 | rAF에서 CSS custom property 하나만 갱신한다. 타임라인 엔진이 필요 없다. |

## 네 레퍼런스가 보여 준 근거

`reference.md`는 배포 코드의 패키지명을 판정한 문서가 아니라 프레임 관찰 문서이므로, 어떤 npm 패키지를 썼다고 추정하지 않는다. 중요한 것은 **관찰된 결과가 모두 CSS 범위**라는 점이다.

- Linear: 첫 진입의 opacity + blur와 행 단위 약 45ms stagger, hover color 약 90ms. 스크롤 reveal 없음.
- Stripe: 첫 진입 없음, 메뉴는 90ms 안에 열림. 지속 그라데이션·마퀴가 있지만 우리 기관 페이지에 채택할 동작이 아니다. 지표 카운트업도 없음.
- EPFL: 캐러셀 패널 전체의 느린 수평 이동만 있으며 요소별 stagger가 없다. 스크롤 reveal 없음, nav hover는 색+밑줄뿐이다.
- MIT: 진입·스크롤 모션 없음. 카드 hover는 150ms 배경색, CTA는 화살표 회전뿐이다.

즉 네 곳의 **채택 대상 동작**에는 스프링 물리, 제스처 드래그, scroll-scrub timeline, SVG morph, shared-layout 계산이 없다. 이런 기능이 생길 때 라이브러리를 재검토하면 되며, 지금 15.88~43.00 kB gzip을 선납할 근거는 없다.

## 구현 원칙

- 모션 토큰은 기존 `--dur-fast/base/enter`, `--ease-standard/enter`만 사용한다.
- 첫 화면 진입은 1회, 아래 폴드 콘텐츠는 즉시 읽히게 한다.
- 모든 동작은 `prefers-reduced-motion: reduce`에서 animation/transition/transform/filter를 제거한다.
- blur는 탭·라우트의 상태 변경을 인지시키는 짧은 보간에만 쓰고, 수치나 본문 노출을 지연하지 않는다.
