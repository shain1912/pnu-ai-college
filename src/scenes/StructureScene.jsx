import { Link } from 'react-router-dom'
import { ADPX } from '../data/content'
import ParticleField from '../components/ParticleField'

/*
 * ── 참조 ──────────────────────────────────────────────────────────────────
 * pnu-ai-college-2027.netlify.app 의 「AI대학 핵심 ADP+X 구조」 화면.
 * 캡처: assets/motion/ref-main-sheet1.jpg 프레임 008~010.
 *
 * 원본에서 본 것: 짙은 남색 공간 한가운데 「ADP + X」 코어가 떠 있고, 그 둘레를
 * 학부 표식들이 곡선 궤도로 감싼다. 배경에 커다란 A D P X 글자가 옅게 깔린다.
 *
 * 그대로 가져온 것: 코어 하나에 네 축이 각자 궤도로 도는 구성, 배경의 큰 글자.
 *
 * 바꾼 것: 원본은 표식을 궤도 위에 3D 로 띄우는데 우리는 아래 목록으로 내렸다.
 * 궤도 위 표식은 돌면서 서로 가려져 어느 순간에는 두 개가 겹친다. 네 축을
 * 나란히 비교하는 것이 이 절의 목적이라 읽히는 쪽을 골랐다.
 *
 * ── 왜 홈에 두는가 ────────────────────────────────────────────────────────
 * ADP+X 는 이 대학의 설계 원칙인데 홈에서는 팩트 표의 한 줄(「AI 가치사슬 기반
 * ADP+X 집적」)로만 있었다. 히어로가 네 축을 차례로 보여주지만 그건 컷마다
 * 흩어져 있어 넷을 한눈에 견주지 못한다.
 * ────────────────────────────────────────────────────────────────────────
 */

export default function StructureScene() {
  return (
    <section
      id="adpx"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#050a14]"
      aria-labelledby="structure-title"
    >
      <ParticleField kind="orbit" className="absolute inset-0" />

      {/* 배경 글자. 원본이 A D P X 를 옅게 깔아 공간에 축을 준다. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[clamp(6rem,26vw,20rem)] font-extrabold leading-none tracking-[0.12em] text-white/[0.04]"
      >
        ADPX
      </p>

      <div className="edge relative flex min-h-[96svh] flex-col justify-center py-24">
        <div className="max-w-[42rem]">
          <p className="text-[13px] font-bold tracking-[0.12em] text-sky-300">{ADPX.eyebrow}</p>
          <h2
            id="structure-title"
            className="mt-5 whitespace-pre-line text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.14] tracking-[-0.035em] text-white"
          >
            {ADPX.title}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-white/70 md:text-[17px]">{ADPX.body}</p>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[--radius-xl] bg-white/12 md:mt-20 md:grid-cols-4">
          {ADPX.axes.map((axis) => (
            <li key={axis.key} className="bg-[#0a1224]/85 p-6 backdrop-blur-sm md:p-7">
              <p className="flex items-baseline gap-2">
                <span className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-sky-300">
                  {axis.key}
                </span>
                <span className="text-[13px] font-bold tracking-[0.08em] text-white/50">{axis.name}</span>
              </p>
              <p className="mt-5 text-[16px] font-bold leading-[1.4] text-white md:text-[17px]">{axis.person}</p>
              <p className="mt-3 text-[14px] leading-[1.65] text-white/60">{axis.role}</p>
              <p className="mt-4 text-[13px] font-semibold text-white/45">
                {axis.school} · {axis.seats}명
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/ai-college/adpx"
            className="rounded-[--radius-pill] bg-white px-6 py-3 text-[15px] font-bold text-gray-950 transition-transform duration-[--dur-base] hover:-translate-y-0.5"
          >
            ADP+X 구조 자세히 보기
          </Link>
          <span className="text-[14px] text-white/55">{ADPX.closing}</span>
        </p>
      </div>
    </section>
  )
}
