#!/usr/bin/env node
/**
 * Frame-capture rig for studying motion by eye rather than by reading CSS.
 *
 * Reading a stylesheet tells you a transition exists; it does not tell you what
 * the page looks like while it runs. This drives a real browser, captures
 * frames on a fixed cadence during a scripted interaction, and lays them out as
 * numbered contact sheets that a vision model can actually read.
 *
 *   node scripts/capture-motion.mjs scroll <url> <slug> [--steps 14] [--settle 320]
 *   node scripts/capture-motion.mjs hover  <url> <slug> --sel "<css>" [--frames 10]
 *   node scripts/capture-motion.mjs click  <url> <slug> --sel "<css>" [--frames 12]
 *   node scripts/capture-motion.mjs load   <url> <slug> [--frames 16] [--every 90]
 *   node scripts/capture-motion.mjs clip   <url> <slug> [--seconds 8] [--scroll 1]
 *
 * Frames land in assets/motion/<slug>/, contact sheets beside them.
 * `clip` records a webm instead, for a reference a person can actually watch.
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, readdir, rename } from 'node:fs/promises'
import path from 'node:path'

const [mode, url, slug, ...rest] = process.argv.slice(2)
if (!mode || !url || !slug) {
  console.error('usage: capture-motion.mjs <scroll|hover|click|load> <url> <slug> [flags]')
  process.exit(1)
}

const flag = (name, fallback) => {
  const i = rest.indexOf(`--${name}`)
  return i === -1 ? fallback : rest[i + 1]
}

const OUT = path.join('assets/motion', slug)
const VIEWPORT = { width: 1440, height: 900 }
const TILE = { w: 480, h: 300 }
const COLS = 3

await mkdir(OUT, { recursive: true })

const RECORD = mode === 'clip'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  // Playwright writes one webm per page, named by hash, so the clip is renamed
  // to the slug once the context closes and the file is finalised.
  ...(RECORD ? { recordVideo: { dir: OUT, size: VIEWPORT } } : {}),
  // real UA so sites do not serve a stripped-down page to headless
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
  locale: 'ko-KR',
})
const page = await ctx.newPage()

const shot = (n) =>
  page.screenshot({ path: path.join(OUT, `${String(n).padStart(3, '0')}.png`) })

console.log(`→ ${url}`)
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })

let count = 0

if (mode === 'load') {
  // capture the entrance: frames from first paint onward
  const frames = Number(flag('frames', 16))
  const every = Number(flag('every', 90))
  for (let i = 0; i < frames; i++) {
    await shot(count++)
    await page.waitForTimeout(every)
  }
} else if (mode === 'scroll') {
  const steps = Number(flag('steps', 14))
  const settle = Number(flag('settle', 320))
  await page.waitForTimeout(1200) // let the entrance finish before scrolling
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const span = Math.max(0, height - VIEWPORT.height)
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((span * i) / steps)
    await page.evaluate((to) => window.scrollTo({ top: to, behavior: 'instant' }), y)
    await page.waitForTimeout(settle)
    await shot(count++)
  }
} else if (mode === 'hover' || mode === 'click') {
  const sel = flag('sel')
  if (!sel) throw new Error(`${mode} needs --sel "<css>"`)
  const frames = Number(flag('frames', mode === 'hover' ? 10 : 12))
  await page.waitForTimeout(1200)
  const el = page.locator(sel).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await shot(count++) // resting state
  if (mode === 'hover') await el.hover()
  else await el.click()
  // tight cadence right after the trigger, where the transition actually lives
  for (let i = 0; i < frames; i++) {
    await page.waitForTimeout(i < 5 ? 45 : 120)
    await shot(count++)
  }
} else if (mode === 'clip') {
  const seconds = Number(flag('seconds', 8))
  const doScroll = flag('scroll', '1') !== '0'
  await page.waitForTimeout(1500)
  if (doScroll) {
    // one slow continuous pass, the way a person reads the page
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    const span = Math.max(0, height - VIEWPORT.height)
    const steps = seconds * 20
    for (let i = 0; i <= steps; i++) {
      await page.evaluate((to) => window.scrollTo({ top: to, behavior: 'instant' }), Math.round((span * i) / steps))
      await page.waitForTimeout(50)
    }
  } else {
    await page.waitForTimeout(seconds * 1000)
  }
} else {
  throw new Error(`unknown mode ${mode}`)
}

const videoPath = RECORD ? await page.video()?.path() : null
await ctx.close()
await browser.close()

if (videoPath) {
  const dest = path.join('assets/motion', `${slug}.webm`)
  await rename(videoPath, dest)
  console.log(`  clip → ${dest}`)
}

// contact sheets, numbered so a reader can name a specific frame
if (RECORD) process.exit(0)
const files = (await readdir(OUT)).filter((f) => /^\d{3}\.png$/.test(f)).sort()
const perSheet = COLS * 4
for (let s = 0; s * perSheet < files.length; s++) {
  const batch = files.slice(s * perSheet, (s + 1) * perSheet)
  const tiles = await Promise.all(
    batch.map(async (f, i) => {
      const label = Buffer.from(
        `<svg width="${TILE.w}" height="26"><rect width="100%" height="100%" fill="#111"/>` +
          `<text x="8" y="18" font-family="monospace" font-size="14" fill="#fff">${f.replace('.png', '')}</text></svg>`,
      )
      const body = await sharp(path.join(OUT, f)).resize(TILE.w, TILE.h, { fit: 'cover', position: 'top' }).toBuffer()
      const withLabel = await sharp({
        create: { width: TILE.w, height: TILE.h + 26, channels: 3, background: '#111' },
      })
        .composite([{ input: label, top: 0, left: 0 }, { input: body, top: 26, left: 0 }])
        .png()
        .toBuffer()
      return { input: withLabel, left: (i % COLS) * TILE.w, top: Math.floor(i / COLS) * (TILE.h + 26) }
    }),
  )
  const rows = Math.ceil(batch.length / COLS)
  const out = path.join('assets/motion', `${slug}-sheet${s + 1}.jpg`)
  await sharp({
    create: { width: TILE.w * COLS, height: (TILE.h + 26) * rows, channels: 3, background: '#111' },
  })
    .composite(tiles)
    .jpeg({ quality: 80 })
    .toFile(out)
  console.log(`  sheet → ${out}`)
}

console.log(`${count} frames → ${OUT}`)
