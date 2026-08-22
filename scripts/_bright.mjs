import sharp from 'sharp'
import path from 'node:path'
import { readdir } from 'node:fs/promises'
const [slug, x, y, w, h] = process.argv.slice(2)
const files = (await readdir(path.join('assets/motion', slug))).filter(f=>/^\d{3}\.png$/.test(f)).sort()
for (const f of files) {
  const buf = await sharp(path.join('assets/motion', slug, f)).extract({left:+x,top:+y,width:+w,height:+h}).png().toBuffer()
  const st = await sharp(buf).stats()
  const m = st.channels.slice(0,3).map(c=>c.mean.toFixed(1)).join('/')
  console.log(f.replace('.png',''), 'rgb', m, 'sd', st.channels[0].stdev.toFixed(1))
}
