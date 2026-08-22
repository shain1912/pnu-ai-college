// TEMPORARY — ChainScene 단독 미리보기. 캡처 검증이 끝나면 지운다.
import { createRoot } from 'react-dom/client'
import './src/index.css'
import ChainScene from './src/scenes/ChainScene'

createRoot(document.getElementById('root')).render(
  <main>
    <ChainScene />
  </main>,
)
