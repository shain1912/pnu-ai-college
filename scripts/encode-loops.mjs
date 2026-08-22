/**
 * Loop videos -> web deliverables.
 *
 * Higgsfield returns a 1440x1440 24fps H.264 file with a silent AAC track.
 * The site plays these muted and autoplaying, so audio is dropped outright and
 * both a VP9/WebM and an H.264/MP4 are emitted — Safari still needs the MP4.
 * A WebP poster from frame 0 covers the gap before the first frame decodes.
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, mkdirSync, statSync } from 'node:fs'
import path from 'node:path'

const SRC = 'assets/video'
const OUT = 'public/video'
const POSTER = 'public/img'

// slug -> played-back width. Square object loops sit in a ~460px figure, so
// 900 covers 2x; the 16:9 concept loops sit in a wider figure.
const WIDTHS = {
  why_converge: 1200, infra_gpu: 1200, roadmap_path: 1200,
  apex: 1200, chain: 1200, schools: 1200, governance: 1200,
  programs: 1200, partners: 1200,
  default: 900,
}

// Kling does not always bring the last frame back to the first, so these clips
// visibly jump at the loop point. Playing them forward then reversed hides the
// seam at the cost of doubling the duration.
const PINGPONG = new Set(['infra_gpu'])

mkdirSync(OUT, { recursive: true })
mkdirSync(POSTER, { recursive: true })

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
const only = process.argv.slice(2)
const files = readdirSync(SRC).filter((f) => f.endsWith('.mp4'))

for (const file of files) {
  const slug = path.parse(file).name
  if (only.length && !only.includes(slug)) continue
  const input = path.join(SRC, file)
  const w = WIDTHS[slug] ?? WIDTHS.default
  const scale = PINGPONG.has(slug)
    ? `scale=${w}:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0`
    : `scale=${w}:-2`

  ff(['-i', input, '-an', '-vf', scale, '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0',
      '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', path.join(OUT, `${slug}.webm`)])
  ff(['-i', input, '-an', '-vf', scale, '-c:v', 'libx264', '-crf', '25', '-preset', 'slow',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, `${slug}.mp4`)])
  // first decoded frame is the poster; -frames:v 1 alone gets it without a
  // select filter, whose comma would need shell-specific escaping on Windows.
  ff(['-i', input, '-vf', `scale=${w}:-2`, '-frames:v', '1',
      '-c:v', 'libwebp', '-quality', '80', path.join(POSTER, `${slug}-poster.webp`)])

  const kb = (p) => (statSync(p).size / 1024).toFixed(0)
  console.log(
    `${slug.padEnd(14)} ${String(w).padStart(4)}px  ` +
    `webm ${kb(path.join(OUT, `${slug}.webm`)).padStart(4)}KB  ` +
    `mp4 ${kb(path.join(OUT, `${slug}.mp4`)).padStart(4)}KB  ` +
    `poster ${kb(path.join(POSTER, `${slug}-poster.webp`)).padStart(3)}KB`
  )
}
