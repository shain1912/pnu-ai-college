#!/usr/bin/env node
/**
 * Puts our site and toss.im side by side at the same scroll depth.
 *
 * The gap between the two has been found by the client, not by us, every time
 * so far. This makes the comparison cheap enough to run after every change:
 * one command produces a labelled sheet a vision model can judge directly.
 *
 *   node scripts/gap.mjs [ourPath] [steps]
 *
 * Rows are scroll depths, columns are toss | ours, so a reader compares across
 * rather than trying to hold two separate captures in mind.
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const ourPath = process.argv[2] ?? ''
const STEPS = Number(process.argv[3] ?? 5)
const VIEW = { width: 1280, height: 800 }
const TILE = { w: 620, h: 388 }

const OURS = `https://shain1912.github.io/pnu-ai-college/${ourPath}`
const TOSS = 'https://toss.im/'

await mkdir('assets/gap', { recursive: true })

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })

const shootAll = async (url) => {
  const page = await browser.newPage({ viewport: VIEW })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(2500)

  /*
   * 먼저 페이지를 한 번 훑어 내려간다.
   *
   * 36회차에 toss 열이 통째로 흰 화면으로 찍혔다. toss 는 아래쪽 절을 화면에
   * 닿을 때 불러오는데, 바로 목표 위치로 뛰면 그 절이 아직 비어 있다. 우리
   * 사이트도 22회차부터 영상을 같은 방식으로 늦춰 받으므로 양쪽 다 해당된다.
   *
   * 빈 프레임을 놓고 "격차" 를 논하면 매 회차 판단이 틀어진다.
   */
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const span = Math.max(0, height - VIEW.height)
  for (let y = 0; y <= span; y += Math.round(VIEW.height * 0.8)) {
    await page.evaluate((to) => window.scrollTo({ top: to, behavior: 'instant' }), y)
    await page.waitForTimeout(260)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(900)

  const shots = []
  for (let i = 0; i < STEPS; i++) {
    // sample the readable part of the page, not the footer
    const y = Math.round((span * i) / Math.max(1, STEPS))
    await page.evaluate((to) => window.scrollTo({ top: to, behavior: 'instant' }), y)
    await page.waitForTimeout(1400)
    shots.push(await page.screenshot())
  }
  await page.close()
  return shots
}

const [toss, ours] = await Promise.all([shootAll(TOSS), shootAll(OURS)])
await browser.close()

const label = (text, w) =>
  Buffer.from(
    `<svg width="${w}" height="24"><rect width="100%" height="100%" fill="#111"/>` +
      `<text x="8" y="17" font-family="monospace" font-size="13" fill="#fff">${text}</text></svg>`,
  )

const cell = async (buf, text) =>
  sharp({ create: { width: TILE.w, height: TILE.h + 24, channels: 3, background: '#111' } })
    .composite([
      { input: label(text, TILE.w), top: 0, left: 0 },
      {
        input: await sharp(buf).resize(TILE.w, TILE.h, { fit: 'cover', position: 'top' }).toBuffer(),
        top: 24,
        left: 0,
      },
    ])
    .png()
    .toBuffer()

const rows = Math.min(toss.length, ours.length)
const tiles = []
for (let i = 0; i < rows; i++) {
  tiles.push({ input: await cell(toss[i], `toss  ${i}`), left: 0, top: i * (TILE.h + 24) })
  tiles.push({ input: await cell(ours[i], `ours  ${i}`), left: TILE.w, top: i * (TILE.h + 24) })
}

const out = `assets/gap/${ourPath.replace(/\//g, '-') || 'home'}.jpg`
await sharp({
  create: { width: TILE.w * 2, height: rows * (TILE.h + 24), channels: 3, background: '#111' },
})
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile(out)

console.log(out)
