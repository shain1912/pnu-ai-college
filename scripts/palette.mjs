#!/usr/bin/env node
/**
 * 사이트 토큰으로 팔레트 참조판을 만든다.
 *
 * 프롬프트에 "azure blue" 라고 적는 것만으로는 모델이 청록으로 흘러간다.
 * 9회차에 생성한 네 장이 190~200° 로 나온 게 그 결과다 (사이트 brand 는 215°).
 * 색을 글자가 아니라 그림으로 물려주면 훨씬 덜 흔들린다.
 */
import sharp from 'sharp'

const RAMP = ['#e8f3ff', '#c9e2ff', '#90c2ff', '#3182f6', '#2272eb', '#1b64da', '#0f3f8f', '#0a1a33', '#050a14']
const W = 1024
const H = 1024
const band = Math.floor(H / RAMP.length)

const tiles = RAMP.map((hex, i) => ({
  input: { create: { width: W, height: i === RAMP.length - 1 ? H - band * i : band, channels: 3, background: hex } },
  top: band * i,
  left: 0,
}))

await sharp({ create: { width: W, height: H, channels: 3, background: '#050a14' } })
  .composite(tiles)
  .png()
  .toFile('assets/raw/_palette.png')

console.log('assets/raw/_palette.png —', RAMP.join(' '))
