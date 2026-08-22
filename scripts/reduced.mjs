#!/usr/bin/env node
/**
 * 동작 줄이기(prefers-reduced-motion)를 켠 상태로 페이지를 훑는다.
 *
 * 씬마다 reduced 분기가 있지만 21회차까지 그 화면을 한 번도 렌더해 본 적이 없다.
 * 분기가 있다는 것과 그 결과가 읽히는 화면이라는 것은 다른 얘기다.
 * 스크롤에 묶인 절(히어로·레일·프로그램)이 특히 위험하다 — 스크롤 구동을 끄면
 * 무엇을 대신 보여주는지가 분기 안에 숨어 있다.
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] ?? 'https://shain1912.github.io/pnu-ai-college/'
const STEPS = Number(process.argv[3] ?? 12)
const VIEW = { width: 1280, height: 800 }

await mkdir('assets/reduced', { recursive: true })
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: VIEW, reducedMotion: 'reduce' })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(2500)

const info = await page.evaluate(() => ({
  matches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  height: document.documentElement.scrollHeight,
  // 빈 화면이 생기는지 보려고 절마다 높이를 같이 잰다
  sections: [...document.querySelectorAll('main > *, main > * > section')]
    .map((el) => ({ n: el.tagName.toLowerCase() + (el.id ? '#' + el.id : ''), h: Math.round(el.getBoundingClientRect().height) }))
    .filter((s) => s.h > 100),
}))
console.log('reduce 적용:', info.matches, '/ 총 높이', info.height + 'px')
info.sections.forEach((s) => console.log('  ', s.n.padEnd(22), s.h + 'px'))

const span = Math.max(0, info.height - VIEW.height)
const shots = []
for (let i = 0; i < STEPS; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round((span * i) / Math.max(1, STEPS - 1)))
  await page.waitForTimeout(600)
  shots.push(await page.screenshot())
}
await browser.close()

const TW = 480
const TH = 300
const cols = 4
const tiles = []
for (let i = 0; i < shots.length; i++) {
  tiles.push({
    input: await sharp(shots[i]).resize(TW, TH, { fit: 'cover', position: 'top' }).toBuffer(),
    left: (i % cols) * TW,
    top: Math.floor(i / cols) * TH,
  })
}
await sharp({ create: { width: TW * cols, height: TH * Math.ceil(shots.length / cols), channels: 3, background: '#111' } })
  .composite(tiles)
  .jpeg({ quality: 84 })
  .toFile('assets/reduced/sheet.jpg')
console.log('assets/reduced/sheet.jpg')
