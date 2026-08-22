import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
const [url, slug, fromS, toS, stepsS, settleS] = process.argv.slice(2)
const from=Number(fromS), to=Number(toS), steps=Number(stepsS||11), settle=Number(settleS||350)
const OUT = path.join('assets/motion', slug)
await mkdir(OUT,{recursive:true})
const b = await chromium.launch()
const c = await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,
  userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',locale:'ko-KR'})
const p = await c.newPage()
await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000})
await p.waitForTimeout(2500)
console.log('scrollHeight', await p.evaluate(()=>document.documentElement.scrollHeight))
let n=0
for (let i=0;i<=steps;i++){
  const y = Math.round(from + (to-from)*i/steps)
  await p.evaluate(t=>window.scrollTo({top:t,behavior:'instant'}), y)
  await p.waitForTimeout(settle)
  await p.screenshot({path:path.join(OUT,`${String(n).padStart(3,'0')}.png`)})
  console.log(`  ${String(n).padStart(3,'0')}  y=${y}`)
  n++
}
await b.close()
const TILE={w:480,h:300}, COLS=3
const files=(await readdir(OUT)).filter(f=>/^\d{3}\.png$/.test(f)).sort()
const per=COLS*4
for(let s=0;s*per<files.length;s++){
  const batch=files.slice(s*per,(s+1)*per)
  const tiles=await Promise.all(batch.map(async(f,i)=>{
    const label=Buffer.from(`<svg width="${TILE.w}" height="26"><rect width="100%" height="100%" fill="#111"/><text x="8" y="18" font-family="monospace" font-size="14" fill="#fff">${f.replace('.png','')}</text></svg>`)
    const body=await sharp(path.join(OUT,f)).resize(TILE.w,TILE.h,{fit:'cover',position:'top'}).toBuffer()
    const wl=await sharp({create:{width:TILE.w,height:TILE.h+26,channels:3,background:'#111'}}).composite([{input:label,top:0,left:0},{input:body,top:26,left:0}]).png().toBuffer()
    return {input:wl,left:(i%COLS)*TILE.w,top:Math.floor(i/COLS)*(TILE.h+26)}
  }))
  const rows=Math.ceil(batch.length/COLS)
  const out=path.join('assets/motion',`${slug}-sheet${s+1}.jpg`)
  await sharp({create:{width:TILE.w*COLS,height:(TILE.h+26)*rows,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:82}).toFile(out)
  console.log(`  sheet → ${out}`)
}
