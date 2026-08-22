import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'assets/raw'
const OUT = 'public/img'

// slug -> max width on the web. Heroes stay large; cards are capped.
const WIDTHS = {
  hero_light: [2000, 1300],
  // wide concept renders sit in a half-width figure
  why_converge: [1200, 760],
  infra_gpu: [1200, 760],
  roadmap_path: [1200, 760],
  // wide concept renders added for the empty sections
  apex: [1200, 760],
  programs: [1200, 760],
  partners: [1200, 760],
  schools: [1200, 760],
  chain: [1200, 760],
  governance: [1200, 760],
  summary_sheet: [1200, 760],
  admissions: [1200, 760],
  // the as-is / to-be pair sits side by side at half width
  asis: [920, 520],
  tobe: [920, 520],
  // axis objects never render wider than ~460px, so 2x tops out at 920
  default: [920, 520],
}

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f))

for (const file of files) {
  const slug = path.parse(file).name
  const [w2x, w1x] = WIDTHS[slug] ?? WIDTHS.default
  const input = path.join(SRC, file)

  for (const [suffix, width] of [['@2x', w2x], ['', w1x]]) {
    const out = path.join(OUT, `${slug}${suffix}.webp`)
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(out)
    console.log(`${path.basename(out).padEnd(20)} ${String(info.width).padStart(5)}px  ${(info.size / 1024).toFixed(0)}KB`)
  }

  // tiny blurred placeholder for progressive loading
  const blur = await sharp(input).resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer()
  console.log(`${(slug + ' (lqip)').padEnd(20)}        ${(blur.length / 1024).toFixed(1)}KB base64`)
  await sharp(blur).toFile(path.join(OUT, `${slug}-lqip.webp`))
}
