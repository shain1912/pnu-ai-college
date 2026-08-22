import { chromium } from 'playwright'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1,
  userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', locale:'ko-KR' })
const p = await ctx.newPage()
await p.goto('http://localhost:5188/', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1200)
const h = await p.evaluate(() => document.documentElement.scrollHeight)
console.log('scrollHeight', h)
const span = Math.max(0, h - 900)
for (let i=0;i<=5;i++){
  const y = Math.round(span*i/5)
  await p.evaluate((to)=>window.scrollTo({top:to,behavior:'instant'}), y)
  await p.waitForTimeout(420)
  const now = await p.evaluate(()=>window.scrollY)
  await p.screenshot({ path: `C:/Users/shain/AppData/Local/Temp/claude/E--testFront/611941de-5e8a-4000-8d1b-3903a34ec567/scratchpad/s${i}.png` })
  const after = await p.evaluate(()=>window.scrollY)
  console.log('step',i,'target',y,'before-shot',now,'after-shot',after)
}
await b.close()
