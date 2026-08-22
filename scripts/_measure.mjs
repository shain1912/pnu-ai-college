import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
const dir = process.argv[2]
// region of the hero headline: x 60..900, y 240..420 (line1) and y 340..410 (line2)
async function profile(file, x, y, w, h) {
  const { data, info } = await sharp(file).extract({ left:x, top:y, width:w, height:h })
    .greyscale().raw().toBuffer({ resolveWithObject:true })
  const rows = []
  for (let r=0;r<info.height;r++){
    let s=0
    for (let c=0;c<info.width;c++) s += data[r*info.width+c]
    rows.push(s/info.width)
  }
  const bg = Math.min(...rows)
  const adj = rows.map(v=>v-bg)
  const peak = Math.max(...adj)
  // brightness-weighted centroid of rows above 25% of peak
  let num=0, den=0
  adj.forEach((v,i)=>{ if(v>peak*0.25){ num+=v*i; den+=v } })
  // horizontal sharpness: mean abs gradient along x on the brightest row
  const br = adj.indexOf(peak)
  let grad=0
  for (let c=1;c<info.width;c++) grad += Math.abs(data[br*info.width+c]-data[br*info.width+c-1])
  return { peak:+peak.toFixed(1), centroid: den? +(y+num/den).toFixed(1) : null, sharp:+(grad/info.width).toFixed(2) }
}
const files = (await readdir(dir)).filter(f=>/^\d{3}\.png$/.test(f)).sort()
console.log('frame | L1 peak/centroidY/sharp | L2 peak/centroidY/sharp | sub peak | shot peak | pill peak')
for (const f of files){
  const p = path.join(dir,f)
  const l1 = await profile(p, 78, 270, 820, 70)   // headline line 1 band
  const l2 = await profile(p, 78, 340, 820, 70)   // headline line 2 band
  const sub= await profile(p, 78, 430, 520, 32)   // subhead
  const sh = await profile(p, 300, 600, 800, 200) // app screenshot body
  const pl = await profile(p, 1170,432, 200, 30)  // "New Coding Sessions" pill
  console.log(`${f.replace('.png','')} | ${l1.peak}/${l1.centroid}/${l1.sharp} | ${l2.peak}/${l2.centroid}/${l2.sharp} | ${sub.peak} | ${sh.peak} | ${pl.peak}`)
}
