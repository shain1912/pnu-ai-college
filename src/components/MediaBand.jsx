import SceneVideo from './SceneVideo'

/**
 * 글자 없는 전면 이미지 띠.
 *
 * toss 는 밀도 높은 정보 구간 사이에 화면을 꽉 채운 사진을 한 장 끼운다
 * (assets/motion/toss-rail-sheet2.jpg 프레임 015~018). 우리는 문구까지 빼고
 * 이미지만 둔다 — 앞뒤가 전부 글자라 눈이 쉴 자리가 필요한 자리에만 쓴다.
 *
 * 히어로와 같은 둥근 카드 기하를 쓴다. 각진 전면 사각형을 섞으면 히어로와
 * 기하가 충돌한다 (8회차에 파란 사각형을 걷어낸 이유).
 */
/*
 * 기본 비율에 모바일 단계를 따로 둔다. 21:7 을 그대로 좁은 화면에 쓰면
 * 370px 폭에서 높이가 123px 밖에 안 된다. 390px 실측에서 162px 였고, 건물도
 * 길도 무엇인지 알아볼 수 없는 조각이 된다. 손안에서는 3:2 로 세워 둔다.
 */
export default function MediaBand({ slug, ratio = 'aspect-[3/2] sm:aspect-[16/7] md:aspect-[21/7]', alt = '' }) {
  return (
    <div className="px-[10px] md:px-5">
      <div className={`relative overflow-hidden rounded-[var(--radius-xl)] bg-[#0a0a14] md:rounded-[var(--radius-2xl)] ${ratio}`}>
        <SceneVideo slug={slug} alt={alt} className="h-full w-full object-cover" />
      </div>
    </div>
  )
}
