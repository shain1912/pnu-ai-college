import { chromium } from 'playwright'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1,
  userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', locale:'ko-KR' })
const p = await ctx.newPage()
await p.goto('https://toss.im/', { waitUntil:'domcontentloaded', timeout:60000 })
await p.waitForTimeout(2500)
const info = await p.evaluate(() => {
  const H = document.documentElement.scrollHeight
  const secs = [...document.querySelectorAll('section, main > div')].map((el,i) => {
    const r = el.getBoundingClientRect()
    return { i, tag: el.tagName, cls:(el.className||'').toString().slice(0,60), top: Math.round(r.top + scrollY), h: Math.round(r.height) }
  }).filter(s => s.h > 300)
  const sticky = [...document.querySelectorAll('*')].filter(el => {
    const cs = getComputedStyle(el); return cs.position === 'sticky' || cs.position === 'fixed'
  }).map(el => { const cs=getComputedStyle(el); const r=el.getBoundingClientRect(); return {tag:el.tagName, cls:(el.className||'').toString().slice(0,50), pos:cs.position, top:cs.top, h:Math.round(r.height), y:Math.round(r.top+scrollY)} })
  return { H, vh: innerHeight, secCount: secs.length, secs, sticky }
})
console.log(JSON.stringify(info, null, 1))
await b.close()
