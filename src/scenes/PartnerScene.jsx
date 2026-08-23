import { PARTNERS } from '../data/content'
import SceneVideo from '../components/SceneVideo'

/*
 * ── 왜 이 절이 필요했나 ──────────────────────────────────────────────────
 * 배포본을 16단계로 재보니 전면 이미지가 행 0~4 와 행 14 이후에만 있다.
 * **행 5부터 13까지 아홉 화면 연속으로 전면 이미지가 하나도 없다.** 표 → 숨
 * 쉬는 화면 → 레일 → 이름 벽 → 부산항 → 프로그램이 전부 흰 바탕 안쪽에서
 * 끝난다. toss 는 흰 화면과 전면 사진을 계속 번갈아 간다.
 *
 * 그 자리에 마침 홈에 없던 내용이 하나 있었다 — 협력 기업. 이름 벽(누가
 * 가르치나) 바로 다음에 「수업에 기업이 들어와요」가 오면 사람 이야기가
 * 학교 밖으로 이어진다.
 *
 * ── 구도 ──────────────────────────────────────────────────────────────────
 * 전면 어두운 화면 위에 문구와 기업 이름 줄. 마무리(강의실)와 같은 전면 구성
 * 이지만 그쪽은 문장 하나로 닫고 여기는 이름을 늘어놓는다.
 *
 * 로고를 쓰지 않고 글자로만 적는다. 생성 이미지에 상표를 그려 넣는 것은
 * 물론이고 실제 로고 파일을 쓰는 것도 사용 허락이 필요한 일이다. 대학이
 * 공개한 자료에 적힌 이름을 그대로 옮기는 선에서 멈춘다.
 * ────────────────────────────────────────────────────────────────────────
 */

export default function PartnerScene() {
  const alt =
    '밤의 임해 산업도시를 높은 곳에서 내려다본 화면. 공장과 항만 크레인, 사무동이 안개 속으로 물러나고 건물 사이를 파란 선이 잇는다.'

  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a14]" aria-labelledby="partners-title">
      <div className="absolute inset-0">
        <SceneVideo slug="industry_night_v" alt={alt} className="h-full w-full object-cover" />
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-[#05050c]/60" />

      <div className="edge relative flex min-h-[68svh] flex-col justify-end py-20 md:py-24">
        <p className="text-[13px] font-bold tracking-[0.08em] text-sky-300">{PARTNERS.eyebrow}</p>
        <h2
          id="partners-title"
          className="mt-4 max-w-[20ch] text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.18] tracking-[-0.03em] text-white"
        >
          {PARTNERS.title}
        </h2>
        <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.7] text-white/75">{PARTNERS.body}</p>

        <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-3">
          {PARTNERS.names.map((name) => (
            <li
              key={name}
              className="rounded-[var(--radius-pill)] border border-white/25 px-4 py-2 text-[15px] font-semibold text-white/90"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
