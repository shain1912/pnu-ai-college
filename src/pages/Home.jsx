import { useEffect } from 'react'
import HeroScene from '../scenes/HeroScene'
import FactSheetScene from '../scenes/FactSheetScene'
import BreatherScene from '../scenes/BreatherScene'
import StructureScene from '../scenes/StructureScene'
import ConnectScene from '../scenes/ConnectScene'
import SchoolRailScene from '../scenes/SchoolRailScene'
import FacultyScene from '../scenes/FacultyScene'
import PartnerScene from '../scenes/PartnerScene'
import ImpactScene from '../scenes/ImpactScene'
import ProgramScene from '../scenes/ProgramScene'
import RoadmapScene from '../scenes/RoadmapScene'
import ClosingScene from '../scenes/ClosingScene'

export default function Home() {

  useEffect(() => {
    document.title = '부산대학교 AI대학 — 2027년 3월 출범'
  }, [])

  return (
    <>
      <HeroScene />

      <FactSheetScene />

      <StructureScene />

      <BreatherScene />

      <SchoolRailScene />

      <ConnectScene />

      <FacultyScene />

      <PartnerScene />

      <ImpactScene />

      <ProgramScene />

      <RoadmapScene />

      <ClosingScene />
    </>
  )
}
