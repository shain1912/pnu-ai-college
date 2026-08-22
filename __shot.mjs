import { chromium } from 'playwright'
const url = process.argv[2], out = process.argv[3], w = +(process.argv[4]||1440)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 })
const errs = []
p.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
p.on('pageerror', e => errs.push('PAGEERROR '+e.message))
await p.goto(url, { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)
await p.screenshot({ path: out, fullPage: true })
console.log('errors:', errs.length ? errs.join('\n') : 'none')
console.log('height', await p.evaluate(() => document.body.scrollHeight))
await b.close()
