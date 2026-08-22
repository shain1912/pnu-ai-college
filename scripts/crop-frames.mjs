#!/usr/bin/env node
/**
 * Stack a labelled crop of the same region from several frames, so a small
 * change (a corner radius, a word gap, an opacity step) can be read by eye at
 * full resolution instead of guessed at from a shrunken contact sheet.
 *
 *   node scripts/crop-frames.mjs <slug> --box x,y,w,h --frames 020,021,022 --out name [--scale 1]
 */
import sharp from 'sharp'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const slug = args[0]
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`)
  return i === -1 ? d : args[i + 1]
}
const [x, y, w, h] = flag('box', '0,0,1440,900').split(',').map(Number)
const scale = Number(flag('scale', 1))
const out = flag('out', 'crop')
const DIR = path.join('assets/motion', slug)

let stamps = {}
try {
  const json = JSON.parse(await readFile(path.join(DIR, 'frames.json'), 'utf8'))
  for (const f of json) stamps[f.file.replace(/\.\w+$/, '')] = f.ms
} catch {}

const listing = await readdir(DIR)
const names = flag('frames', '').split(',').filter(Boolean)
const rows = []
const W = Math.round(w * scale)
const H = Math.round(h * scale)
const BAR = 24

for (const n of names) {
  const file = listing.find((f) => f.startsWith(n) && /\.(jpg|png)$/.test(f))
  if (!file) throw new Error(`no frame ${n} in ${DIR}`)
  const body = await sharp(path.join(DIR, file))
    .extract({ left: x, top: y, width: w, height: h })
    .resize(W, H)
    .toBuffer()
  const ms = stamps[n] === undefined ? '' : `  +${stamps[n]}ms`
  const label = Buffer.from(
    `<svg width="${W}" height="${BAR}"><rect width="100%" height="100%" fill="#0b3"/>` +
      `<text x="6" y="17" font-family="monospace" font-size="15" fill="#000">${n}${ms}</text></svg>`,
  )
  rows.push(
    await sharp({ create: { width: W, height: H + BAR, channels: 3, background: '#111' } })
      .composite([
        { input: label, top: 0, left: 0 },
        { input: body, top: BAR, left: 0 },
      ])
      .png()
      .toBuffer(),
  )
}

const dest = path.join('assets/motion', `${slug}-${out}.jpg`)
await sharp({
  create: { width: W, height: (H + BAR) * rows.length, channels: 3, background: '#111' },
})
  .composite(rows.map((input, i) => ({ input, top: i * (H + BAR), left: 0 })))
  .jpeg({ quality: 92 })
  .toFile(dest)
console.log(`→ ${dest}  (${names.length} rows, ${W}x${H} each)`)
