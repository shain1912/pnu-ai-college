import { useEffect } from 'react'
import HeroScene from '../scenes/HeroScene'
import GatewayScene from '../scenes/GatewayScene'
import FactSheetScene from '../scenes/FactSheetScene'

export default function Home() {

  useEffect(() => {
    document.title = '부산대학교 AI대학 — 2027년 3월 출범'
  }, [])

  return (
    <>
      <HeroScene />

      <GatewayScene />

      <FactSheetScene />
    </>
  )
}
