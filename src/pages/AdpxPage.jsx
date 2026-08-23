import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import AxisScene from '../scenes/AxisScene'
import ChainScene from '../scenes/ChainScene'


/**
 * ADP+X presented as four roles, not four ordered steps.
 *
 * The source defines the chain as "AI(A) is developed on top of data(D),
 * applied to process(P), spread as AX(X)" — so causally D precedes A while the
 * acronym reads A→D. An arrow diagram would show the picture contradicting the
 * sentence next to it, so the four are a list here and the chain appears
 * further down as one worked example.
 */
export default function AdpxPage() {
  return (
    <>
      <PageHead
        eyebrow="학사 구조"
        title={'ADP+X'}
        path="/ai-college/adpx/"
        lead="AI가 세상에 닿기까지 필요한 네 가지 역할을, 그대로 학사조직으로 만들었어요."
        crumbs={[
          { to: '/', label: '홈' },
          { to: '/ai-college', label: 'AI대학' },
        ]}
      />

      <AxisScene />

      <ChainScene />
    </>
  )
}
