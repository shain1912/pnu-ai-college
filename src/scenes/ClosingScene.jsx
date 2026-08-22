import { asset } from '../lib/asset'
import { useReducedMotion } from '../hooks/useMedia'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [사람으로 닫는다] 마지막에 실제 사람이 있는 장면을 통으로 넣는다
 *   toss 씬        : 「토스가 바꾼 일상」
 *   캡처 파일       : assets/gap/home.jpg 행 6 (toss 열, 7단계 캡처)
 *   원본에서 본 것  : 기능 설명이 끝난 뒤 마지막 화면이 사람 사진 넉 장이다.
 *                    앞의 모든 화면이 제품인데 끝은 사람이다.
 *   바꾼 것과 이유  : 우리 페이지에는 사람이 한 명도 없었다. 대학 홍보
 *                    페이지에서 이건 그 자체로 결함이다. toss 는 사진 넉 장을
 *                    쓰지만 우리는 강의실 한 장면을 통으로 쓴다. 앞쪽에 이미
 *                    학부 카드 줄과 부산항 타일이 있어 카드를 또 놓으면 같은
 *                    화면이 세 번 된다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * 원래 ImpactScene 안에 있었다. 14회차에 추진 일정 절을 마무리 앞에 끼우면서
 * 따로 뺐다. 마무리는 페이지의 끝이어야 해서 순서를 바꿀 수 없었다.
 * ────────────────────────────────────────────────────────────────────────
 */

export default function ClosingScene() {
  const reduced = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a14]" aria-labelledby="closing-title">
      <div className="absolute inset-0">
        {reduced ? (
          <img
            src={asset('img/lecture_v@2x.webp')}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <video
            aria-hidden="true"
            className="h-full w-full object-cover"
            poster={asset('img/lecture_v@2x.webp')}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={asset('video/lecture_v.webm')} type="video/webm" />
            <source src={asset('video/lecture_v.mp4')} type="video/mp4" />
          </video>
        )}
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-[#05050c]/65" />

      <div className="edge relative flex min-h-[70svh] flex-col justify-end py-24">
        <p className="text-[13px] font-bold tracking-[0.08em] text-sky-300">2027년 3월</p>
        <h2
          id="closing-title"
          className="mt-4 max-w-[26rem] text-[clamp(1.875rem,4.4vw,3.25rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-white"
        >
          그 모든 게 강의실에서 시작해요
        </h2>
        <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.7] text-white/75">
          424명이 한 단과대학 안에서 데이터부터 현장까지 한 바퀴를 다 돌아봐요.
        </p>
      </div>
    </section>
  )
}
