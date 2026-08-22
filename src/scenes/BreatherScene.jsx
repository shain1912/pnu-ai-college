import { WHY } from '../data/content'
import SceneVideo from '../components/SceneVideo'

/*
 * ── toss 출처 기록 ────────────────────────────────────────────────────────
 *
 * [숨 쉬는 화면] 밀도 높은 구간 사이에 문장 하나만 놓인 화면을 통으로 넣는다
 *   toss 씬        : 「온오프라인 경계 없이」
 *   캡처 파일       : assets/gap/home.jpg 행 5 (toss 열, 8단계 캡처)
 *   원본에서 본 것  : 흰 화면 한가운데에 검은 형태 하나가 서 있고 그 좌우로
 *                    문장이 두 토막으로 갈라져 있다. 다른 요소가 하나도 없다.
 *                    앞은 광고 카드 레일, 뒤는 제품 사진 — 둘 다 빽빽하다.
 *                    이 화면이 그 사이에서 눈을 쉬게 한다.
 *   그대로 가져온 것: 화면 하나를 문장 하나에 통째로 준다. 눈썹 문구도, 버튼도,
 *                    보조 설명도 두지 않는다.
 *   바꾼 것과 이유  : toss 는 문장을 좌우로 갈라 그 사이에 오브젝트를 세우지만
 *                    우리는 한 덩이로 둔다. 한국어 문장을 둘로 자르면 읽는
 *                    순서가 흔들린다. toss 문장은 「온오프라인」「경계 없이」로
 *                    끊어도 각각 뜻이 서는 짧은 구다.
 *   근거 강도       : 직접관찰(프레임)
 *
 * ── 왜 여기인가 ──────────────────────────────────────────────────────────
 * 앞은 규모·구조·준비 상황 세 묶음 표, 뒤는 학부 카드 다섯 장이다. 둘 다
 * 빽빽하다. toss 가 「온오프라인 경계 없이」를 광고 레일과 제품 사진 사이에
 * 둔 것과 같은 자리다.
 *
 * 내용을 이 문장으로 고른 이유는 따로 있다. 홈은 AI대학이 무엇인지, 몇 명인지,
 * 어느 학부가 오는지는 말하는데 **왜 만드는지는 한 번도 말하지 않았다.**
 * 그 답이 /ai-college 안쪽에만 있었다.
 * ────────────────────────────────────────────────────────────────────────
 */

export default function BreatherScene() {
  return (
    <section className="bg-canvas" aria-labelledby="why-line">
      <div className="edge grid min-h-[74svh] items-center gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-14">
        <h2
          id="why-line"
          className="max-w-[16ch] whitespace-pre-line text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.18] tracking-[-0.035em] text-ink"
        >
          {WHY.title}
        </h2>

        {/*
          25회차에 붙였다. toss 의 조용한 화면(「온오프라인 경계 없이」)에는 흰
          바탕 한가운데에 검은 오브젝트가 서 있는데, 우리 화면에는 문장뿐이라
          오른쪽 절반이 비어 있었다.

          자산 스무 개가 전부 어두운 환경이라 밝은 바탕에 놓을 물체가 하나도
          없었다. 그래서 받침보다 큰 덩어리를 새로 만들었다 — 「한 학과가
          감당할 수 있는 크기를 넘었다」를 형태로 그대로 옮긴 것이다.
        */}
        <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[--radius-xl] md:max-w-none">
          <SceneVideo
            slug="obj_outgrow_v"
            alt="받침보다 훨씬 큰 짙은 남색 덩어리가 작은 받침 위에 얹혀 사방으로 넘쳐 있다."
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  )
}
