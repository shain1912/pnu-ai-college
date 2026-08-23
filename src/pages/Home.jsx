import { useEffect } from 'react'
import HeroScene from '../scenes/HeroScene'
import FactSheetScene from '../scenes/FactSheetScene'
import BreatherScene from '../scenes/BreatherScene'
import StructureScene from '../scenes/StructureScene'
import ConnectScene from '../scenes/ConnectScene'
import FacultyScene from '../scenes/FacultyScene'
import PartnerScene from '../scenes/PartnerScene'
import ImpactScene from '../scenes/ImpactScene'
import ProgramScene from '../scenes/ProgramScene'
import RoadmapScene from '../scenes/RoadmapScene'
import GalleryScene from '../scenes/GalleryScene'
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

      <ConnectScene />

      <FacultyScene />

      <PartnerScene />

      <ImpactScene />

      <ProgramScene />

      <RoadmapScene />

      <GalleryScene />

      <ClosingScene />
    </>
  )
}
