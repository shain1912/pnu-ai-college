import sharp from 'sharp'
import path from 'node:path'
// args: outName  then triples: file,left,top,width,height
const [out, ...specs] = process.argv.slice(2)
const items = specs.map(s => { const [f,l,t,w,h] = s.split(','); return {f, l:+l, t:+t, w:+w, h:+h} })
const bufs = []
for (const it of items) {
  const b = await sharp(it.f).extract({ left:it.l, top:it.t, width:it.w, height:it.h }).toBuffer()
  const lab = Buffer.from(`<svg width="${it.w}" height="22"><rect width="100%" height="100%" fill="#111"/><text x="6" y="16" font-family="monospace" font-size="13" fill="#0f0">${path.basename(path.dirname(it.f))}/${path.basename(it.f)}</text></svg>`)
  bufs.push(await sharp({create:{width:it.w,height:it.h+22,channels:3,background:'#111'}}).composite([{input:lab,top:0,left:0},{input:b,top:22,left:0}]).png().toBuffer())
}
const W = items[0].w, RH = items[0].h+22
await sharp({create:{width:W,height:RH*bufs.length,channels:3,background:'#111'}})
  .composite(bufs.map((b,i)=>({input:b,top:i*RH,left:0}))).jpeg({quality:92}).toFile(out)
console.log('→', out)
