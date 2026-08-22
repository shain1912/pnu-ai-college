# 히어로 루프 영상 샷 리스트

생성일: 2026-08-22  
출력: `public/video/hero_s1..s5.{mp4,webm}` / `public/img/hero_s1..s5.png`

## 아트디렉션 결정

원문의 다크 네이비 보이드·시안 파티클은 사용하지 않았다. 사이트가 흰 배경과 브랜드 블루 `#3182F6`로 확정되어 있고, 기존 `axis_*` 에셋이 각진 반투명 프로스티드 글라스·흰 스튜디오·접지 그림자로 하나의 세계를 이미 만들었기 때문이다. `ASSET_AUDIT_AGY.md`와 `ASSET_AUDIT_CODEX.md`도 다크 시네마틱/네온 톤을 기각했으므로, 원문의 연출·카메라·구성은 유지하되 재질과 색조를 기존 세트에 맞췄다.

학과 의미는 현재 학과명이 아니라 2027년 ADP+X 축으로 재배치했다.

- S1 — A / AI컴퓨터공학부: 무질서한 파티클이 코드 같은 수평 스트림으로 정렬된다.
- S2 — D / 데이터사이언스학부·통계학과: 스트림이 계산적 데이터 네트워크로 분기한다.
- S3 — P / 산업공학부: 데이터가 확률 곡선·회귀선·산점으로 정리되어 모델링/최적화를 뜻한다.
- S4 — X / AX융합학부: 분석 구조가 네 개의 모듈형 글라스 클러스터로 조립된다.
- S5 — ADP+X 통합: 네 형상이 하나로 모였다가 파티클로 해체되어 S1로 돌아간다.

## 공통 재질 문구

`warm-white seamless studio, angular translucent frosted glass, soft contact shadows, restrained Pusan blue #3182F6 accent, high-key daylight from upper left, premium institutional 3D render; no text, letters, numbers, logo, watermark, people, face, dark background or neon cyan`

## 컷별 최종 프롬프트와 작업 ID

### S1 — A / 질서가 되는 코드

- 모델/비용: Kling 3.0 Turbo, 1080p, 5초 / 10 크레딧
- Job ID: `537c9e37-cb2b-43af-be63-66c11848a7d3`
- 시작 프레임: `hero_anchor_1` (`a9e9521d-92b0-4bbb-9468-b5dff1c153cf`, 2 크레딧)
- 프롬프트: `The dispersed frosted glass particle cloud slowly self-organizes into horizontal streams of abstract code-like rhythm without any characters. Slow dolly in, calm precise motion, warm white studio, restrained Pusan blue accent, soft contact shadows, no cuts, no text, no letters, no numbers, no logo, no people, no dark background.`

### S2 — D / 데이터 네트워크

- 모델/비용: Seedance 2.5, 1080p, 5초 / 45 크레딧
- Job ID: `22f05751-5427-4512-b3e8-fd2ec39bd9f3`
- 시작/끝: `hero_anchor_2` → `hero_anchor_3` (`fd1bf0ee-9bea-44bd-a371-870b967c6c3f` → `ad85da6a-cc4f-4ca0-96ce-4358d7e2505f`, 각 2 크레딧)
- 프롬프트: `The same horizontal streams of angular glass particles flow and branch into a computational neural data network, gentle pulse, translucent angular membranes, non-biological. Slow orbit left with very subtle vertigo, warm white studio and exposure stay constant, restrained Pusan blue accent, one continuous transformation, no cuts, no text, no letters, no logo, no people, no organ, no dark background.`

### S3 — P / 확률과 최적화

- 모델/비용: Seedance 2.5, 1080p, 5초 / 45 크레딧
- Job ID: `b3592b28-8fb7-433a-b8a4-5164022f7ae1`
- 시작/끝: `hero_anchor_3` → `hero_anchor_4` (`ad85da6a-cc4f-4ca0-96ce-4358d7e2505f` → `f993fcc2-40fa-4294-8668-76ada3b1e5a9`, 각 2 크레딧)
- 프롬프트: `The abstract branching computational network disperses into particles and converges into a smooth unlabeled probability curve and regression line, scattered points settling on a faint grid. Gentle crane up and dolly out, warm white studio and exposure stay constant, restrained Pusan blue accent, one continuous transformation, no cuts, no text, no numbers, no chart labels, no logo, no people, no dark background.`

### S4 — X / 모듈 융합

- 모델/비용: Kling 3.0 Turbo, 1080p, 5초 / 10 크레딧
- Job ID: `66e729d9-b9d0-4292-8e3f-5aac411c92dc`
- 시작 프레임: `hero_anchor_4` (`f993fcc2-40fa-4294-8668-76ada3b1e5a9`, 2 크레딧)
- 프롬프트: `The probability curve and regression line snap cleanly into a modular grid of floating translucent angular glass panels, four distinct clusters become visible. Slow pan right with a gentle arc, warm white studio, restrained Pusan blue accent, soft contact shadows, Bauhaus balance, no cuts, no text, no letters, no labels, no logo, no people, no dark background.`

### S5 — ADP+X / 통합과 루프 폐쇄

- 모델/비용: Kling 3.0 Turbo, 1080p, 5초 / 10 크레딧
- Job ID: `fbb6fe57-4e0d-46aa-8711-db59608c34e6`
- 시작 프레임: `hero_anchor_5` (`305a6b26-5ed3-4c29-8310-f40734ab0dc2`, 2 크레딧)
- 프롬프트: `Four distinct angular frosted glass formations converge and overlap into one radiant translucent sphere at center, restrained energy pulse expands outward, then the sphere dissolves back into a calm dispersed particle cloud. Slow zoom out then camera becomes still, symmetrical composition, warm white studio, restrained Pusan blue accent, no cuts, no text, no letters, no logo, no people, no dark background.`
- 루프 처리: 생성 원본 마지막 1초에 `hero_anchor_1`을 0.5초 크로스페이드하여 S5의 마지막 프레임과 S1의 첫 프레임을 파일 수준에서 일치시켰다. 검수 프레임은 `assets/raw/hero_s5_last.png`와 `assets/raw/hero_s1_first.png`이다.

정지 앵커 5장 10 크레딧 + 영상 120 크레딧 = 총 130 크레딧. 공유 계정의 동시 작업으로 잔액이 줄어 S5의 양끝 고정 Seedance 제출은 결제 단계에서 거절되었으며 과금되지 않았다. 대신 허용된 편집 크로스페이드로 정확한 루프 종단을 만들었다.

## 검수 결과

원본 앵커 5장과 영상별 1초 간격 콘택트시트(`assets/raw/hero_s*_contact.png`)를 직접 열어 확인했다. 깨진 글자·로고·워터마크·사람/얼굴·다크 배경·네온 시안·의학 기구/장기 표현은 없고, 다섯 컷 모두 흰 스튜디오와 동일 계열 글라스 재질을 유지한다. S5 마지막 프레임과 S1 첫 프레임도 육안상 일치한다.

## `src` 배선 지시

이 작업에서는 동시 작업자의 소유 범위인 `src/`를 수정하지 않았다. 히어로 컴포넌트에서는 다음 순서로 무음 자동 재생하고, 각 `<video>`에 같은 번호의 PNG 포스터를 지정한다.

```html
<video muted playsinline preload="metadata" poster="/img/hero_s1.png">
  <source src="/video/hero_s1.webm" type="video/webm" />
  <source src="/video/hero_s1.mp4" type="video/mp4" />
</video>
```

S1→S2와 S4→S5는 180~250ms opacity crossfade, S2→S3은 프레임 고정 모프이므로 짧은 교체 또는 같은 crossfade를 권장한다. S5→S1은 이미 영상 내부 끝 프레임이 맞으므로 별도 흰 플래시 없이 즉시 전환한다. `prefers-reduced-motion: reduce`에서는 `/img/hero_s1.png` 한 장만 표시하고, 로고·헤드라인·한글은 반드시 영상 밖 CSS/HTML 오버레이로 유지한다.
