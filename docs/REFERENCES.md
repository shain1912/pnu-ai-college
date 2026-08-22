# 벤치마킹 레퍼런스

디자인 시스템 문서 2단계가 요구하는 산출물. 백지에서 상상하지 않고, 같은 니치에서
이미 검증된 사이트를 분석해 골드 스탠다드를 지정한다.

조사일: 2026-08-22

## 골드 스탠다드 — EPFL AI Center

<https://ai.epfl.ch/>

대학 AI 허브라는 **동일 니치**. 하나의 선언 + 번호 붙은 editorial story로 홈을 구성하고,
"연구·혁신·교육"을 한 문장으로 묶는 정보 구조가 이 프로젝트와 그대로 대응한다.

**가져올 기법**
1. 히어로를 선언 하나 + 행동 하나로 제한 — 화면당 하나의 요구
2. `01–07` 식 명시적 진행 표시가 있는 full-bleed 스토리 레일
3. 연구·뉴스·행사를 서로 다른 리듬의 editorial grid로 분리

**적용 현황**
- ✅ 히어로 CTA를 1개로 축소 (`src/components/Hero.jsx`)
- ✅ Research 가로 레일에 `01/04` 진행 지표 부착 (`src/components/Research.jsx`)
- ⬜ 키보드 좌우 이동 (미적용)

## 보조 1 — MIT Schwarzman College of Computing

<https://computing.mit.edu/>

AI 교육을 단일 학과가 아니라 대학 전체를 잇는 구조로 설명한다. 신뢰의 근거를 장식이 아니라
실제 프로그램과 숫자로 제시한다.

**가져올 기법**
1. 건물·사람 사진과 큰 editorial 타이포의 교대
2. 교육 / 연구 / 사회적 책임의 명확한 정보 계층 분리
3. 숫자·인용·프로그램 링크를 신뢰 증거로 사용

**적용 현황**
- ✅ 모든 수치의 출처를 `README.md` 표로 명시
- ⬜ `STATS` 각 항목에 출처 링크 인라인 부착 (미적용)

## 보조 2 — Stanford Human-Centered AI

<https://hai.stanford.edu/>

연구·교육·정책이라는 복잡한 활동을 대표 영상, 보고서, 연구 프로그램, 뉴스로 계층화한다.

**가져올 기법**
1. 대표 영상에 명시적 컨트롤과 poster 제공
2. flagship report를 독립 시각 블록으로 격상
3. research card를 실제 fellowship/grant/student program으로 연결

**적용 현황**
- ✅ 히어로 루프는 무음 autoplay + poster, reduced-motion에서는 poster만 렌더
- ⬜ Research 카드에서 연구실·교수·프로젝트 상세로 가는 링크 (미적용)

## 참고한 제작 기법 (디자인 레퍼런스 아님)

- JavaScript Mastery, *I Vibe Coded a $50K Website in One Weekend Using AI* —
  스크롤 시네마틱 연출과 "리서치 → 목표 → 마스터 프롬프트 → 외과적 반복" 워크플로우
- JavaScript Mastery, *Master Creative Frontend in 2 Hours with React, Three.js & GSAP* —
  핀 고정 섹션, 3D 씬 구성, 반응형 처리

이 둘은 **기법 출처**이지 디자인 골드 스탠다드가 아니다. 시각적 기준은 위 세 대학 사이트다.
