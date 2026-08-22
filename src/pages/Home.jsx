import { useEffect } from 'react'
import HeroScene from '../scenes/HeroScene'
import FactSheetScene from '../scenes/FactSheetScene'
import SchoolRailScene from '../scenes/SchoolRailScene'
import ImpactScene from '../scenes/ImpactScene'

export default function Home() {

  useEffect(() => {
    document.title = '부산대학교 AI대학 — 2027년 3월 출범'
  }, [])

  return (
    <>
      <HeroScene />

      <FactSheetScene />

      <SchoolRailScene />

      <ImpactScene />
    </>
  )
}
