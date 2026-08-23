import { Link } from 'react-router-dom'
import { SCHOOLS, D_AXIS_SEATS, facultyOf } from '../data/schools'
import ParticleField from '../components/ParticleField'

/*
 * ── 참조 ──────────────────────────────────────────────────────────────────
 * pnu-ai-college-2027.netlify.app 의 「연결될수록 커지는 AI의 가능성」 화면.
 * 캡처: assets/motion/ref-main-sheet1.jpg 프레임 006~007.
 *
 * 원본에서 본 것: 흰 바탕 위에 점으로 이루어진 파동 면이 깔리고, 그 위에
 * 학부 이름이 붙은 작은 표가 흩어져 있다. 면은 계속 오르내린다.
 *
 * 바꾼 것: 배경을 어둡게 뒤집었다. 원본은 흰 바탕이라 옅은 파랑 점이
 * 잘 보이지만, 우리 페이지는 이 자리 앞뒤가 어두운 전면 화면이라 흰 면을
 * 끼우면 그 두 개가 끊긴다. 어두운 바탕에서는 같은 점이 빛으로 읽힌다.
 *
 * 표식 자리는 3D 투영으로 계산하지 않고 비율로 박았다. 투영하면 파동이
 * 오르내릴 때 표식도 같이 흔들려 이름이 읽히지 않는다. 원본도 표식은
 * 가만히 있고 면만 움직인다.
 * ────────────────────────────────────────────────────────────────────────
 */

/*
 * 파동 위에 흩어 놓을 자리.
 * 위쪽(제목)과 아래쪽(학부 목록)을 피해 가운데 띠에만 둔다. 처음에 y 를 86 까지
 * 내렸더니 「X · AX융합학부」 표식이 아래 목록의 「통계학과」 위에 겹쳐 앉았다.
 */
const SPOTS = [
  { x: 15, y: 57 },
  { x: 34, y: 66 },
  { x: 57, y: 62 },
  { x: 80, y: 52 },
  { x: 46, y: 46 },
]

const seats = (school) => (school.seats === null ? `D축 합산 ${D_AXIS_SEATS}명` : `${school.seats}명`)

export default function ConnectScene() {
  // 표식 하나에 축·이름·정원을 다 담는다. 아래에 목록을 또 두면 같은 다섯
  // 이름을 한 화면에서 두 번 읽게 된다.
  const nodes = SCHOOLS.map((school, index) => ({
    label: `${school.axis} · ${school.name}`,
    note: seats(school),
    ...SPOTS[index % SPOTS.length],
  }))

  return (
    <section
      className="relative isolate overflow-hidden bg-[#050a14]"
      aria-labelledby="connect-title"
    >
      <ParticleField kind="wave" nodes={nodes} className="absolute inset-0" />

      <div className="edge relative flex min-h-[96svh] flex-col justify-start pb-24 pt-24 md:pt-28">
        <p className="text-[13px] font-bold tracking-[0.12em] text-sky-300">2027.03 · PNU COLLEGE OF AI</p>
        <h2
          id="connect-title"
          className="mt-5 max-w-[22ch] text-[clamp(2rem,5.2vw,4rem)] font-extrabold leading-[1.14] tracking-[-0.035em] text-white"
        >
          연결될수록 커지는 AI의 가능성
        </h2>
        <p className="mt-6 max-w-[36rem] text-[16px] leading-[1.75] text-white/70 md:text-[17px]">
          세 개 단과대학에 흩어져 있던 다섯 학문단위가 한 면 위에 놓여요. 따로 돌던 교육과정과
          장비, 연구가 같은 자리에서 만나요.
        </p>

        {/*
          레일에서 옮겨온 것. 다섯 학문단위의 상세로 가는 유일한 입구라
          레일을 걷어낼 때 같이 사라지면 안 된다.
        */}
        <ul className="mt-auto flex flex-wrap gap-2 border-t border-white/15 pt-8">
          {SCHOOLS.map((school) => (
            <li key={school.slug}>
              <Link
                to={`/ai-college/schools/${school.slug}`}
                className="group flex items-baseline gap-2 rounded-[--radius-pill] border border-white/20 px-4 py-2.5 transition-colors duration-[--dur-base] hover:border-white/45 hover:bg-white/5"
              >
                <span className="text-[14px] font-bold text-white">{school.name}</span>
                <span className="text-[13px] text-white/50">교원 {facultyOf(school).length}명</span>
                <span aria-hidden="true" className="text-white/45 transition-transform duration-[--dur-base] group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
