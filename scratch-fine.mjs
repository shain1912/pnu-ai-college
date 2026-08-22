import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
const [url, slug, fromS, toS, stepsS, settleS] = process.argv.slice(2)
const from=+fromS, to=+toS, steps=+stepsS, settle=+settleS
const OUT=path.join('assets/motion',slug)
const VIEWPORT={width:1440,height:900}
await mkdir(OUT,{recursive:true})
const browser=await chromium.launch()
const ctx=await browser.newContext({viewport:VIEWPORT,deviceScaleFactor:1,
 userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',locale:'ko-KR'})
const page=await ctx.newPage()
await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000})
await page.waitForTimeout(2500)
let n=0
for(let i=0;i<=steps;i++){
  const y=Math.round(from+(to-from)*i/steps)
  await page.evaluate(t=>window.scrollTo({top:t,behavior:'instant'}),y)
  await page.waitForTimeout(settle)
  await page.screenshot({path:path.join(OUT,`${String(n++).padStart(3,'0')}.png`)})
}
await browser.close()
const files=(await readdir(OUT)).filter(f=>/^\d{3}\.png$/.test(f)).sort()
const TILE={w:480,h:300},COLS=3,perSheet=12
for(let s=0;s*perSheet<files.length;s++){
  const batch=files.slice(s*perSheet,(s+1)*perSheet)
  const tiles=await Promise.all(batch.map(async(f,i)=>{
    const label=Buffer.from(`<svg width="${TILE.w}" height="26"><rect width="100%" height="100%" fill="#111"/><text x="8" y="18" font-family="monospace" font-size="14" fill="#fff">${f.replace('.png','')}</text></svg>`)
    const body=await sharp(path.join(OUT,f)).resize(TILE.w,TILE.h,{fit:'cover',position:'top'}).toBuffer()
    const wl=await sharp({create:{width:TILE.w,height:TILE.h+26,channels:3,background:'#111'}})
      .composite([{input:label,top:0,left:0},{input:body,top:26,left:0}]).png().toBuffer()
    return {input:wl,left:(i%COLS)*TILE.w,top:Math.floor(i/COLS)*(TILE.h+26)}
  }))
  const rows=Math.ceil(batch.length/COLS)
  const out=path.join('assets/motion',`${slug}-sheet${s+1}.jpg`)
  await sharp({create:{width:TILE.w*COLS,height:(TILE.h+26)*rows,channels:3,background:'#111'}})
    .composite(tiles).jpeg({quality:82}).toFile(out)
  console.log('sheet →',out)
}
console.log(n,'frames')
