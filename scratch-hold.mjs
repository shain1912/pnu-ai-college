import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
const [url, slug, yS, framesS, everyS, cropS] = process.argv.slice(2)
const Y=+yS, frames=+framesS, every=+everyS
const crop = cropS ? cropS.split(',').map(Number) : null
const OUT=path.join('assets/motion',slug)
const VIEWPORT={width:1440,height:900}
await mkdir(OUT,{recursive:true})
const browser=await chromium.launch()
const ctx=await browser.newContext({viewport:VIEWPORT,deviceScaleFactor:1,
 userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',locale:'ko-KR'})
const page=await ctx.newPage()
await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000})
await page.waitForTimeout(2500)
// jump straight to target so the section enters the viewport at once
await page.evaluate(t=>window.scrollTo({top:t,behavior:'instant'}),Y)
let n=0
for(let i=0;i<frames;i++){
  await page.screenshot({path:path.join(OUT,`${String(n++).padStart(3,'0')}.png`)})
  await page.waitForTimeout(every)
}
await browser.close()
const files=(await readdir(OUT)).filter(f=>/^\d{3}\.png$/.test(f)).sort()
const TW = crop?crop[2]:480, TH = crop?crop[3]:300
const COLS=3, perSheet=12
for(let s=0;s*perSheet<files.length;s++){
  const batch=files.slice(s*perSheet,(s+1)*perSheet)
  const tiles=await Promise.all(batch.map(async(f,i)=>{
    const label=Buffer.from(`<svg width="${TW}" height="26"><rect width="100%" height="100%" fill="#111"/><text x="8" y="18" font-family="monospace" font-size="14" fill="#0f0">${f.replace('.png','')}</text></svg>`)
    let img=sharp(path.join(OUT,f))
    if(crop) img=img.extract({left:crop[0],top:crop[1],width:crop[2],height:crop[3]})
    else img=img.resize(TW,TH,{fit:'cover',position:'top'})
    const body=await img.toBuffer()
    const wl=await sharp({create:{width:TW,height:TH+26,channels:3,background:'#111'}})
      .composite([{input:label,top:0,left:0},{input:body,top:26,left:0}]).png().toBuffer()
    return {input:wl,left:(i%COLS)*TW,top:Math.floor(i/COLS)*(TH+26)}
  }))
  const rows=Math.ceil(batch.length/COLS)
  const out=path.join('assets/motion',`${slug}-sheet${s+1}.jpg`)
  await sharp({create:{width:TW*COLS,height:(TH+26)*rows,channels:3,background:'#111'}})
    .composite(tiles).jpeg({quality:86}).toFile(out)
  console.log('sheet →',out)
}
console.log(n,'frames')
