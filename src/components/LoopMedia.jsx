import SceneVideo from './SceneVideo'

/**
 * 생성된 오브젝트를 5초 루프로, 안 되면 같은 프레임의 정지컷으로 보여준다.
 *
 * 22회차에 SceneVideo 로 속을 갈았다. 그전에는 autoPlay + preload="metadata" 라
 * 문서에 있기만 하면 화면 밖이어도 곧바로 받아왔다. 이제 뷰포트에 닿기 한 화면
 * 앞에서 받는다. 바깥에서 쓰는 방식은 그대로다.
 */
export default function LoopMedia({ slug, alt = '', className = '', eager = false }) {
  return <SceneVideo slug={slug} alt={alt} className={className} eager={eager} />
}
