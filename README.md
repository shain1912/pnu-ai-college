# 부산대학교 AI대학 홍보 페이지

2027년 3월 출범하는 부산대학교 AI대학의 출범 홍보 및 내용 정리 사이트.
React + Vite + Tailwind v4, 다중 페이지(react-router).

> **승인 전 계획안입니다.** 이 사이트가 정리한 학사조직 개편은 관련 위원회 심의와
> 학칙 제·개정을 거쳐 확정됩니다. 학부·학과 편제, 정원, 교육과정은 확정 과정에서
> 달라질 수 있습니다. 최종 기준은 대학의 공식 발표와 모집요강입니다.
> 기준일 2026년 8월.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run assets     # assets/raw/*.png → public/img/*.webp (2x/1x/LQIP)
npm run gauntlet   # 에셋 생성 → 심사 → 재생성 루프
```

## 페이지 구조

| 경로 | 내용 |
|---|---|
| `/` | 출범 선언 · 3개 관문(AI대학 / A.U.R.A / Google for Education) · 한눈에 보기 |
| `/ai-college` | 설립 배경, 학사구조 요약, 규모, PNU-APEX, 특화 프로그램 |
| `/ai-college/adpx` | ADP+X 상세 — 네 역할, 축별 학부, 가치사슬 사례 |
| `/ai-college/schools` | 편제 대상 학부·학과 목록 |
| `/ai-college/schools/:slug` | 학과 기본정보 + 소속 교원 |
| `/ai-college/roadmap` | 2026–2030 추진 일정, 모집 일정 |

A.U.R.A 마스터플랜과 Google for Education은 기존
[arise-ai.pusan.ac.kr](https://arise-ai.pusan.ac.kr/)에 있는 페이지로 연결합니다.
이 저장소에서 다시 만들지 않습니다.

## 콘텐츠 출처

모든 수치는 `docs/`의 대학 제공 원본에서 나왔습니다. 추출본은 `docs/_extract/`,
정리본은 [`docs/_extract/SOURCE_FACTS.md`](docs/_extract/SOURCE_FACTS.md)에 있습니다.

| 항목 | 값 | 원본 |
|---|---|---|
| 출범 | 2027년 3월 | 보도자료, 제안서 |
| 입학정원 | 424명 | 보도자료 · 제안서 인포그래픽 |
| 모집단위 | AI컴퓨터공학부 214 · 데이터사이언스학부·통계학과 114 · 산업공학부 69 · AX융합학부 27 | 보도자료 |
| 설계 원칙 | AI 가치사슬 기반 ADP+X | 제안서 |
| 운영 체계 | PNU-APEX — 총장 직속 3개 기구 + 대학본부 AX정보화혁신본부 | 제안서 인포그래픽 |
| GPU | 256장 (H100·A100·A6000 및 PC급) | 제안서 인포그래픽 |
| 추진 일정 | 2026–2030 5개년 | 제안서 |
| 2027학년도 수시 원서접수 | 2026년 9월 8일 ~ 11일 | 보도자료 |
| 교원 | 60명 | AI대학교원정보 |

**"국내 최대 규모"** 는 대학이 제안서에서 쓴 표현입니다. 사이트에서는 대학의 주장임을
밝혀 인용하고, 독립적으로 검증된 사실처럼 쓰지 않습니다.

## 이미지·영상

배경 이미지와 루프 영상은 **Higgsfield CLI**로 생성했습니다. 실제 시설이나 특정 인물을
촬영한 기록이 아니며, 사이트에 그 사실을 표기합니다.

- 원본 `assets/raw/`, 웹 최적화본 `public/img/`, 영상 `public/video/`
- 생성 프롬프트와 job ID는 `assets/specs.json`, `assets/light-jobs.txt`,
  `assets/gauntlet-log.json`
- 히어로 루프: `seedance_2_5` (omni_reference, 첫/끝 프레임 고정) → ffmpeg WebM/MP4 + poster

## 문서

- [`docs/CORE.md`](docs/CORE.md) — 요구사항 명세 (원본)
- [`docs/_extract/SOURCE_FACTS.md`](docs/_extract/SOURCE_FACTS.md) — 확정 사실
- [`docs/TOSS_ANALYSIS.md`](docs/TOSS_ANALYSIS.md) — toss.im 디자인 언어 역설계
- [`docs/CONTENT_PLAN.md`](docs/CONTENT_PLAN.md) — 정보구조·카피 설계
- [`docs/FACULTY_STATS.md`](docs/FACULTY_STATS.md) — 교원 집계 산정 기준
- [`docs/EVAL_*.md`](docs/) — 다중 에이전트 교차 평가 결과
- [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) — 토큰·컴포넌트·모션
