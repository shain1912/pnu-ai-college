#!/usr/bin/env node
/**
 * Real-time frame capture via CDP Page.startScreencast.
 *
 * capture-motion.mjs takes a screenshot per frame, and a screenshot of a
 * video-heavy page costs 400-1000ms — far too coarse to see an entrance that
 * finishes in 800ms. This streams frames off the compositor instead, so the
 * cadence is the browser's own paint rate and every frame carries a real
 * millisecond offset.
 *
 *   node scripts/capture-screencast.mjs shoot <url> <slug> [--ms 4000] [--wait 0]
 *   node scripts/capture-screencast.mjs sheet <slug> [--from 0] [--to 2000] [--max 12]
 *
 * Frames land in assets/motion/<slug>/NNN.jpg with assets/motion/<slug>/frames.json
 * holding {file, ms} per frame. Sheets land at assets/motion/<slug>-sheetN.jpg,
 * each tile labelled "NNN +MMMms".
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import path from 'node:path'

const [mode, ...args] = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const VIEWPORT = { width: 1440, height: 900 }
const TILE = { w: 480, h: 300 }
const COLS = 3

if (mode === 'shoot') {
  const [url, slug] = args
  if (!url || !slug) throw new Error('shoot needs <url> <slug>')
  const durationMs = Number(flag('ms', 4000))
  const preWait = Number(flag('wait', 0)) // ms to idle before navigating (for scroll runs)
  const OUT = path.join('assets/motion', slug)
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
    locale: 'ko-KR',
  })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)

  const frames = []
  let t0 = null
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const ts = metadata.timestamp * 1000
    if (t0 === null) t0 = ts
    const n = frames.length
    const file = `${String(n).padStart(3, '0')}.jpg`
    frames.push({ file, ms: Math.round(ts - t0) })
    await writeFile(path.join(OUT, file), Buffer.from(data, 'base64'))
    try {
      await cdp.send('Page.screencastFrameAck', { sessionId })
    } catch {}
  })

  await cdp.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 80,
    maxWidth: VIEWPORT.width,
    maxHeight: VIEWPORT.height,
    everyNthFrame: 1,
  })
  if (preWait) await page.waitForTimeout(preWait)

  console.log(`→ ${url}`)
  page.goto(url, { waitUntil: 'commit', timeout: 60_000 }).catch(() => {})
  await page.waitForTimeout(durationMs)
  try {
    await cdp.send('Page.stopScreencast')
  } catch {}
  await page.waitForTimeout(200)
  await browser.close()

  await writeFile(path.join(OUT, 'frames.json'), JSON.stringify(frames, null, 1))
  const span = frames.length ? frames[frames.length - 1].ms : 0
  console.log(`${frames.length} frames over ${span}ms → ${OUT}`)
} else if (mode === 'sheet') {
  const [slug] = args
  const OUT = path.join('assets/motion', slug)
  const all = JSON.parse(await readFile(path.join(OUT, 'frames.json'), 'utf8'))
  const from = Number(flag('from', 0))
  const to = Number(flag('to', Infinity))
  const max = Number(flag('max', 12))
  const tag = flag('tag', '')
  const win = all.filter((f) => f.ms >= from && f.ms <= to)
  const stride = Math.max(1, Math.ceil(win.length / max))
  const picked = win.filter((_, i) => i % stride === 0).slice(0, max)

  const perSheet = COLS * 4
  for (let s = 0; s * perSheet < picked.length; s++) {
    const batch = picked.slice(s * perSheet, (s + 1) * perSheet)
    const tiles = await Promise.all(
      batch.map(async (f, i) => {
        const name = f.file.replace('.jpg', '')
        const label = Buffer.from(
          `<svg width="${TILE.w}" height="26"><rect width="100%" height="100%" fill="#111"/>` +
            `<text x="8" y="18" font-family="monospace" font-size="15" fill="#fff">${name}  +${f.ms}ms</text></svg>`,
        )
        const body = await sharp(path.join(OUT, f.file))
          .resize(TILE.w, TILE.h, { fit: 'contain', background: '#111' })
          .toBuffer()
        return sharp({ create: { width: TILE.w, height: TILE.h + 26, channels: 3, background: '#111' } })
          .composite([
            { input: label, top: 0, left: 0 },
            { input: body, top: 26, left: 0 },
          ])
          .png()
          .toBuffer()
          .then((input) => ({ input, left: (i % COLS) * TILE.w, top: Math.floor(i / COLS) * (TILE.h + 26) }))
      }),
    )
    const rows = Math.ceil(batch.length / COLS)
    const out = path.join('assets/motion', `${slug}${tag ? '-' + tag : ''}-sheet${s + 1}.jpg`)
    await sharp({
      create: { width: TILE.w * COLS, height: (TILE.h + 26) * rows, channels: 3, background: '#111' },
    })
      .composite(tiles)
      .jpeg({ quality: 88 })
      .toFile(out)
    console.log(`  sheet → ${out}  (${batch.map((b) => b.ms + 'ms').join(', ')})`)
  }
} else {
  throw new Error('usage: capture-screencast.mjs <shoot|sheet> ...')
}
