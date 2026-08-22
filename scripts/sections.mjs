#!/usr/bin/env node
/**
 * 절마다 페이지의 몇 %를 차지하는지 잰다.
 *
 * "히어로가 길다" 는 눈으로는 판단이 갈린다. 캡처 몇 단계에 걸리느냐도
 * 표본 간격에 따라 달라진다. 픽셀 높이로 재면 다툴 여지가 없다.
 */
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'https://shain1912.github.io/pnu-ai-college/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(2000)

const out = await page.evaluate(() => {
  const total = document.documentElement.scrollHeight
  const nodes = [...document.querySelectorAll('main > *, main > * > section')]
  return {
    total,
    rows: nodes
      .map((el) => ({
        name: el.tagName.toLowerCase() + (el.id ? '#' + el.id : ''),
        h: Math.round(el.getBoundingClientRect().height),
      }))
      .filter((r) => r.h > 150)
      .map((r) => ({ ...r, pct: +((100 * r.h) / total).toFixed(1) })),
  }
})
await browser.close()

console.log(`총 ${out.total}px ≈ ${Math.round(out.total / 800)}화면`)
for (const r of out.rows.sort((a, b) => b.h - a.h)) {
  console.log(r.name.padEnd(22), String(r.h).padStart(6) + 'px', String(r.pct).padStart(5) + '%')
}
