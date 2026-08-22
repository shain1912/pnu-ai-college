import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:5188/__scene-scale.html', { waitUntil: 'networkidle' })
await p.waitForTimeout(600)
const out = await p.evaluate(() => {
  const g = (sel, props) => {
    const el = document.querySelector(sel); if (!el) return sel + ' :: NOT FOUND'
    const cs = getComputedStyle(el)
    return sel + ' :: ' + props.map(k => k + '=' + cs[k]).join(' | ')
  }
  const lines = []
  lines.push(g('#numbers p span.tabular-nums', ['fontSize','fontWeight']))
  lines.push(g('#numbers ul.card', ['display','gridTemplateColumns']))
  lines.push(g('#numbers ul.card > li:nth-child(2)', ['borderInlineStartWidth','borderInlineStartColor','borderTopWidth']))
  lines.push(g('#numbers figure video, #numbers figure img', ['maxWidth','width']))
  lines.push(g('#numbers figure', ['maxWidth','width']))
  const infra = document.querySelectorAll('#numbers .edge > div')
  lines.push('infra grid cols=' + getComputedStyle(document.querySelector('#numbers figure').parentElement).gridTemplateColumns)
  lines.push('sheet rules containing clamp in class: ' + [...document.styleSheets].flatMap(s=>{try{return [...s.cssRules]}catch{return []}}).filter(r=>r.selectorText&&r.selectorText.includes('clamp')).length)
  return lines.join('\n')
})
console.log(out)
await b.close()
