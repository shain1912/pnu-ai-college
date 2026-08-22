import { chromium } from 'playwright'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1,
  userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', locale:'ko-KR' })
const p = await ctx.newPage()
await p.goto('https://toss.im/', { waitUntil:'domcontentloaded', timeout:60000 })
await p.waitForTimeout(2000)
// force lazy render
for (let y=0; y<52000; y+=900) { await p.evaluate(t=>scrollTo({top:t,behavior:'instant'}), y); await p.waitForTimeout(60) }
await p.evaluate(()=>scrollTo({top:0,behavior:'instant'})); await p.waitForTimeout(800)
const info = await p.evaluate(() => {
  const H = document.documentElement.scrollHeight
  // find the deepest common container whose children are the scroll sections
  const kids = []
  const main = document.querySelector('main') || document.body
  const walk = (el, d) => {
    for (const c of el.children) {
      const r = c.getBoundingClientRect()
      if (r.height > 1200) kids.push({ d, tag:c.tagName, cls:(c.className||'').toString().slice(0,40), top:Math.round(r.top+scrollY), h:Math.round(r.height) })
      if (d < 3) walk(c, d+1)
    }
  }
  walk(main, 0)
  const sticky = [...document.querySelectorAll('*')].filter(el=>{const cs=getComputedStyle(el);return cs.position==='sticky'||cs.position==='fixed'})
    .map(el=>{const cs=getComputedStyle(el);const r=el.getBoundingClientRect();return {tag:el.tagName,cls:(el.className||'').toString().slice(0,30),pos:cs.position,h:Math.round(r.height),y:Math.round(r.top+scrollY),parentH:Math.round(el.parentElement.getBoundingClientRect().height)}})
  return { H, kids, sticky }
})
console.log('H=',info.H)
console.log('--- big blocks (h>1200) ---')
for (const k of info.kids) console.log(`d${k.d} ${k.tag}.${k.cls} top=${k.top} h=${k.h}`)
console.log('--- sticky/fixed ---')
for (const s of info.sticky) console.log(`${s.pos} ${s.tag}.${s.cls} y=${s.y} h=${s.h} parentH=${s.parentH}`)
await b.close()
