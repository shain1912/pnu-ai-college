#!/usr/bin/env node
/**
 * 첫 화면까지 실제로 내려받는 양을 잰다.
 *
 * 저속 회선에서 이 페이지를 처음 여는 사람이 무엇을 기다리는지가 여기서 나온다.
 * 스크롤하지 않고 2초만 두고 끊는다 — 첫인상이 결정되는 구간이다.
 */
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'https://shain1912.github.io/pnu-ai-college/'
const HOLD = Number(process.argv[3] ?? 4000)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

const byType = new Map()
const big = []
page.on('response', async (res) => {
  try {
    const h = res.headers()
    const len = Number(h['content-length'] ?? 0)
    if (!len) return
    const ct = (h['content-type'] ?? '').split('/')[0] || 'other'
    byType.set(ct, (byType.get(ct) ?? 0) + len)
    if (len > 150_000) big.push({ n: res.url().split('/').pop(), kb: Math.round(len / 1024) })
  } catch {}
})

const t0 = Date.now()
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
const dcl = Date.now() - t0
await page.waitForTimeout(HOLD)

const total = [...byType.values()].reduce((a, b) => a + b, 0)
console.log(`DOM 준비 ${dcl}ms · ${HOLD}ms 동안 전송 ${(total / 1024 / 1024).toFixed(2)}MB`)
for (const [k, v] of [...byType].sort((a, b) => b[1] - a[1])) {
  console.log('  ', k.padEnd(12), (v / 1024).toFixed(0).padStart(7) + ' KB')
}
if (big.length) {
  console.log('  150KB 넘는 것:')
  big.sort((a, b) => b.kb - a.kb).slice(0, 10).forEach((x) => console.log('    ', String(x.kb).padStart(5) + ' KB', x.n))
}
await browser.close()
