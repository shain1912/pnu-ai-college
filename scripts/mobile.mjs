#!/usr/bin/env node
/**
 * 좁은 화면에서 페이지를 훑는다.
 *
 * 18회차까지 모든 캡처가 1280x800 이었다. 홍보 페이지를 실제로 여는 화면은
 * 대부분 손안이다. 가로 넘침과 잘림을 함께 잡는다.
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] ?? 'https://shain1912.github.io/pnu-ai-college/'
const STEPS = Number(process.argv[3] ?? 10)
// 폭을 인자로 받는다. 390 은 손안, 820 은 태블릿 세로, 1024 는 태블릿 가로다.
const W = Number(process.argv[4] ?? 390)
const VIEW = { width: W, height: W >= 768 ? 1180 : 844 }

await mkdir('assets/mobile', { recursive: true })
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: VIEW, deviceScaleFactor: 2, isMobile: W < 768, hasTouch: true })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(2500)

// 가로 넘침부터. 문서 폭이 화면보다 넓으면 좌우로 흔들린다.
const overflow = await page.evaluate((w) => {
  const doc = document.documentElement
  const wide = [...document.querySelectorAll('body *')]
    .filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width > w + 1 || r.right > w + 1
    })
    .slice(0, 12)
    .map((el) => {
      const r = el.getBoundingClientRect()
      return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''} → ${Math.round(r.width)}px, right ${Math.round(r.right)}`
    })
  return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, wide }
}, VIEW.width)

console.log(`문서 폭 ${overflow.scrollWidth}px / 화면 ${overflow.clientWidth}px`)
if (overflow.scrollWidth > overflow.clientWidth) console.log('⚠ 가로 넘침')
overflow.wide.forEach((w) => console.log('  ', w))

const height = await page.evaluate(() => document.documentElement.scrollHeight)
const span = Math.max(0, height - VIEW.height)
const shots = []
for (let i = 0; i < STEPS; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round((span * i) / Math.max(1, STEPS - 1)))
  await page.waitForTimeout(700)
  shots.push(await page.screenshot())
}
await browser.close()

const TW = W >= 768 ? 380 : 300
const TH = W >= 768 ? 546 : 650
const cols = W >= 768 ? 4 : 5
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
  .toFile(`assets/mobile/sheet-${W}.jpg`)
console.log(`assets/mobile/sheet-${W}.jpg`)
