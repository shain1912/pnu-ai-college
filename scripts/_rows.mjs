import sharp from 'sharp'
import path from 'node:path'
// report darkness profile per row in a crop, to detect vertical shift of text
const [slug, x, y, w, h, framesArg] = process.argv.slice(2)
for (const fr of framesArg.split(',')) {
  const f = fr.padStart(3, '0')
  const { data, info } = await sharp(path.join('assets/motion', slug, `${f}.png`))
    .extract({ left: +x, top: +y, width: +w, height: +h })
    .greyscale().raw().toBuffer({ resolveWithObject: true })
  const rows = []
  for (let r = 0; r < info.height; r++) {
    let sum = 0
    for (let c = 0; c < info.width; c++) sum += 255 - data[r * info.width + c]
    rows.push(sum)
  }
  const max = Math.max(...rows)
  // centroid of ink
  let num = 0, den = 0
  rows.forEach((v, i) => { num += v * i; den += v })
  const bands = []
  let inB = false, st = 0
  rows.forEach((v, i) => {
    const on = v > max * 0.25
    if (on && !inB) { inB = true; st = i }
    if (!on && inB) { inB = false; bands.push(`${st}-${i - 1}`) }
  })
  console.log(f, 'maxInk', max, 'centroid', (num / (den || 1)).toFixed(2), 'bands', bands.join(' '))
}
