// Trace the video card's rectangle per frame by finding where the white page
// background stops. Confirms by measurement what the contact sheets show by eye.
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const slug = process.argv[2]
const DIR = path.join('E:/testFront/assets/motion', slug)
const frames = JSON.parse(await readFile(path.join(DIR, 'frames.json'), 'utf8'))

const isWhite = (r, g, b) => r > 246 && g > 246 && b > 246

for (const f of frames) {
  const { data, info } = await sharp(path.join(DIR, f.file))
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info
  const px = (x, y) => {
    const i = (y * W + x) * C
    return [data[i], data[i + 1], data[i + 2]]
  }
  const midY = Math.round(H * 0.5)
  let left = null
  for (let x = 0; x < W; x++) if (!isWhite(...px(x, midY))) { left = x; break }
  let right = null
  for (let x = W - 1; x >= 0; x--) if (!isWhite(...px(x, midY))) { right = x; break }
  const midX = Math.round(W * 0.5)
  let top = null
  for (let y = 0; y < H; y++) if (!isWhite(...px(midX, y))) { top = y; break }
  let bottom = null
  for (let y = H - 1; y >= 0; y--) if (!isWhite(...px(midX, y))) { bottom = y; break }
  // corner probe: walk the top edge inward to find where the card's top row starts
  let cornerRun = null
  if (top !== null && left !== null) {
    for (let x = left; x < W; x++) {
      if (!isWhite(...px(x, top + 1))) { cornerRun = x - left; break }
    }
  }
  console.log(
    `${f.file.replace('.jpg', '')} +${String(f.ms).padStart(4)}ms  left=${left} right=${right} top=${top} bottom=${bottom} w=${right !== null && left !== null ? right - left + 1 : '-'} h=${bottom !== null && top !== null ? bottom - top + 1 : '-'} cornerInset=${cornerRun}`,
  )
}
