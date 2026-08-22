import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useMedia'
import { asset } from '../lib/asset'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [구조] 하나의 무대에서 장면과 문구가 스크롤에 따라 함께 교체된다
 *   toss 씬        : §2-1 송금 히어로 / 실사 영상
 *   캡처 파일       : assets/motion/toss-hero-progress-sheet1.jpg 프레임 000→001
 *   원본에서 본 것  : 첫 화면의 헤드라인이 아래로 밀리며 흐려지는 동시에 다음
 *                    장면(폰으로 송금하는 손)이 자리를 넘겨받고, 그 위에 새 문구
 *                    "몇 번만 누르면 끝나는 송금"이 얹힌다. 무대 자체는 그대로
 *                    있고 안의 내용만 바뀐다.
 *   그대로 가져온 것: 무대 고정 + 스크롤 진행에 따른 장면·문구 동시 교체
 *   바꾼 것과 이유  : toss 는 한 영상 안에서 컷이 바뀌지만 우리는 장면마다 별도
 *                    루프 파일을 둔다. 생성 모델로 컷 편집된 한 편을 만드는 것보다
 *                    네 개의 안정적인 루프를 교차시키는 편이 통제된다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [전환] 문구가 blur 와 opacity 로 교체된다
 *   toss 씬        : §2-3 텍스트 크로스페이드
 *   캡처 파일       : assets/motion/toss-scroll-64-120-sheet1.jpg 프레임 002→004,
 *                    009→011
 *   원본에서 본 것  : 퇴장하는 문구가 약 0.35 불투명도로 흐려진 뒤 사라지고,
 *                    입장하는 문구가 강한 블러·약 0.15 에서 두세 프레임에 걸쳐
 *                    선명해진다. 양방향 동시 겹침이 아니라 연속 교체다.
 *   그대로 가져온 것: blur+opacity 연속 교체와 그 순서
 *   바꾼 것과 이유  : 없음
 *   근거 강도       : 직접관찰(프레임)
 *
 * [배치] 영상이 화면을 채우고 헤드라인이 그 위 하단에 얹힌다
 *   toss 씬        : §2-1
 *   캡처 파일       : assets/motion/toss-hero-fine/008.png
 *   원본에서 본 것  : nav 아래부터 화면 하단까지 영상이 차고 좌우 약 20px 여백만
 *                    남는다. 헤드라인은 흰색으로 영상 위 하단에 놓인다.
 *   바꾼 것과 이유  : 우리 장면은 흰 스튜디오라 흰 글자가 읽히지 않는다.
 *                    글자를 어두운 색으로 두고 스크림을 뺐다. toss 와 명도가
 *                    반대인 소재라 같은 처리를 쓸 수 없다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * [좌측 인디케이터] 세로 눈금
 *   toss 씬        : §2-4 전역 sticky
 *   캡처 파일       : assets/motion/toss-hero-fine/008.png 좌측 y≈380~510
 *   그대로 가져온 것: 눈금 형태와 위치
 *   바꾼 것과 이유  : toss 는 전 페이지 고정이지만 우리는 히어로 네 장면만
 *                    가리킨다. 눈금 수도 장면 수에 맞췄다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * ── 영상 ──────────────────────────────────────────────────────────────
 * /video/scene_d|a|p|x — Higgsfield kling3_0_turbo 생성 (assets/hero4-loop.txt).
 * 정지 원본은 nano_banana_pro (assets/hero4-jobs.txt).
 * toss 영상의 연출을 참고한 것은 없다. toss 는 인물 실사에 컷 편집이고
 * 우리는 고정 카메라의 오브젝트 루프다. 참고한 것은 "스크롤이 장면을
 * 진행시킨다"는 구조뿐이고 영상 내용은 무관하다.
 *
 * ── 씬 대응 ───────────────────────────────────────────────────────────
 * toss §2-1(송금 히어로)에 대응시켰다. 첫 화면에서 풀블리드 영상 위에 문구를
 * 얹고 스크롤로 장면을 전개한다는 역할이 같다. 다만 toss 가 한 서비스의
 * 사용 순간을 보여주는 자리에 우리는 ADP+X 가치사슬을 놓았다.
 */

const SCENES = [
  {
    key: 'D',
    slug: 'scene_d',
    axis: 'Data',
    head: ['흩어진 데이터가', '줄을 맞춥니다'],
    body: '무엇을 믿을 수 있는 자료로 삼을지 가려내는 일에서 시작해요.',
  },
  {
    key: 'A',
    slug: 'scene_a',
    axis: 'AI',
    head: ['그 위에서', '모델이 만들어집니다'],
    body: '데이터가 정리되고 나서야 쓸 만한 모델이 나와요.',
  },
  {
    key: 'P',
    slug: 'scene_p',
    axis: 'Process',
    head: ['모델이 공정 안으로', '들어갑니다'],
    body: '실제로 돌아가는 프로세스에 넣어야 값이 생겨요.',
  },
  {
    key: 'X',
    slug: 'scene_x',
    axis: 'AX',
    head: ['같은 방법이', '다른 분야로 퍼집니다'],
    body: '한 곳에서 통한 방법을 산업 전체로 옮겨요.',
  },
]

export default function HeroScene() {
  const reduced = useReducedMotion()
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(reduced)

  useEffect(() => {
    if (reduced) return
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [reduced])

  /*
   * The section is four viewports tall and its inner stage is sticky, so
   * scrolling advances the scene instead of moving the stage. This is the
   * structure toss uses across its chapters — the stage holds, the content
   * swaps — rather than hijacking the wheel, which none of the reference
   * sites do (docs/motion/reference.md).
   */
  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = rootRef.current
      if (!el) return
      const span = el.offsetHeight - window.innerHeight
      const p = span > 0 ? Math.min(0.999, Math.max(0, -el.getBoundingClientRect().top / span)) : 0
      setActive(Math.floor(p * SCENES.length))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative bg-canvas"
      style={{ height: reduced ? 'auto' : `${SCENES.length * 100}svh` }}
    >
      <div className="sticky top-16 px-[10px] pb-[10px] md:top-[72px] md:px-5 md:pb-5">
        <div className="relative h-[calc(100svh-84px)] overflow-hidden rounded-[10px] bg-gray-50 md:h-[calc(100svh-96px)]">
          {SCENES.map((scene, i) => (
            <div
              key={scene.key}
              aria-hidden={i !== active}
              className="absolute inset-0 transition-[opacity,filter] duration-[600ms] ease-[--ease-enter]"
              style={{
                opacity: i === active ? 1 : 0,
                filter: i === active ? 'blur(0px)' : 'blur(14px)',
              }}
            >
              {reduced ? (
                <img
                  src={asset(`img/${scene.slug}@2x.webp`)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  className="h-full w-full object-cover"
                  poster={asset(`img/${scene.slug}@2x.webp`)}
                  autoPlay={i === active}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? 'auto' : 'metadata'}
                >
                  <source src={asset(`video/${scene.slug}.webm`)} type="video/webm" />
                  <source src={asset(`video/${scene.slug}.mp4`)} type="video/mp4" />
                </video>
              )}
            </div>
          ))}

          {/* scene ticks */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex"
          >
            {SCENES.map((s, i) => (
              <span
                key={s.key}
                className={`block h-[2px] rounded-full bg-gray-900 transition-all duration-[--dur-base] ${
                  i === active ? 'w-6 opacity-80' : 'w-3 opacity-25'
                }`}
              />
            ))}
          </div>

          {/* copy — swapped with the scene, not fixed */}
          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-14 md:pb-14">
            <div className="relative grid">
              {SCENES.map((scene, i) => (
                <div
                  key={scene.key}
                  aria-hidden={i !== active}
                  className="transition-[opacity,filter,transform] duration-[600ms] ease-[--ease-enter]"
                  style={{
                    gridArea: '1 / 1',
                    opacity: i === active ? 1 : 0,
                    filter: i === active ? 'blur(0px)' : 'blur(10px)',
                    transform: i === active ? 'none' : 'translateY(14px)',
                    pointerEvents: i === active ? 'auto' : 'none',
                  }}
                >
                  <p className="text-[14px] font-bold tracking-[0.08em] text-brand">
                    {scene.key} · {scene.axis}
                  </p>
                  <h1 className="mt-3">
                    {scene.head.map((line) => (
                      <span
                        key={line}
                        className="block text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-gray-900"
                      >
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="mt-4 max-w-[32rem] text-[16px] leading-[1.6] text-ink-muted md:text-[18px]">
                    {scene.body}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={`mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 transition-[opacity,transform] duration-[700ms] ease-[--ease-enter] ${
                entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <Link
                to="/ai-college"
                className="rounded-[--radius-pill] bg-brand-strong px-7 py-3.5 text-[16px] font-bold text-white transition-transform duration-[--dur-base] hover:-translate-y-0.5"
              >
                AI대학 살펴보기
              </Link>
              <p className="text-[15px] font-medium text-ink-subtle">
                2027년 3월 출범 · 입학정원 424명
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-2.5 max-w-[1120px] px-1 text-[12px] text-ink-faint">
          배경 영상은 생성형 AI로 제작했어요. 실제 시설을 촬영한 것이 아니에요.
        </p>
      </div>
    </section>
  )
}
