#!/usr/bin/env node
/**
 * 사이트의 디자인 토큰을 실측해서 뽑는다.
 *
 * 35회차까지 나는 toss 와 우리를 나란히 찍어놓고 눈으로 보고 판단했다. 그건
 * 평가 방법이 아니라 그냥 내 감이고, 그 감이 못 미더운 것이 지금 문제다.
 *
 * 잴 수 있는 것은 재야 한다. getComputedStyle 로 실제 값을 뽑아 두 사이트를
 * 숫자로 대조한다. 값이 여러 개 모이면 먼저 비율을 의심한다 — 픽셀값이
 * 제각각으로 보여도 em 으로 환산하면 하나인 경우가 많다.
 *
 *   node scripts/tokens.mjs https://toss.im/ toss
 *   node scripts/tokens.mjs https://shain1912.github.io/pnu-ai-college/ ours
 *
 * 결과는 assets/tokens/<name>.json 에 남고, 두 개가 모이면 diff 를 찍는다.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const url = process.argv[2]
const name = process.argv[3] ?? 'site'
if (!url) {
  console.error('사용법: node scripts/tokens.mjs <url> <이름>')
  process.exit(1)
}

await mkdir('assets/tokens', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(2500)

// SPA 는 한 번 훑어야 아래쪽 절이 DOM 에 올라온다. 훑지 않고 재면 히어로만 잡힌다.
const height = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < height; y += 800) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(140)
}
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)

const data = await page.evaluate(() => {
  const px = (v) => Math.round(parseFloat(v) * 100) / 100
  const seen = (el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }

  /* ── 타입 스케일 ─────────────────────────────────────────────
     글자가 실제로 들어 있는 요소만 본다. 래퍼는 상속값이라 스케일을 흐린다. */
  const typeMap = new Map()
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,span,a,button')) {
    if (!seen(el)) continue
    const text = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).length
    if (!text) continue
    const cs = getComputedStyle(el)
    const size = px(cs.fontSize)
    if (size < 10) continue
    const rec = typeMap.get(size) ?? { size, n: 0, ls: new Set(), lh: new Set(), w: new Set() }
    rec.n += 1
    rec.ls.add(px(cs.letterSpacing === 'normal' ? '0' : cs.letterSpacing))
    rec.lh.add(cs.lineHeight === 'normal' ? 'normal' : px(cs.lineHeight))
    rec.w.add(cs.fontWeight)
    typeMap.set(size, rec)
  }
  const type = [...typeMap.values()]
    .filter((r) => r.n >= 2)
    .sort((a, b) => b.size - a.size)
    .map((r) => {
      const ls = [...r.ls].sort((a, b) => a - b)
      // 여러 크기에서 같은 em 이 나오면 그게 규칙이다
      const em = ls.map((v) => Math.round((v / r.size) * 1000) / 1000)
      return { size: r.size, n: r.n, letterSpacing: ls, em, lineHeight: [...r.lh], weight: [...r.w].sort() }
    })

  /* ── 모서리 반경 ───────────────────────────────────────────── */
  const radii = new Map()
  for (const el of document.querySelectorAll('*')) {
    if (!seen(el)) continue
    const r = px(getComputedStyle(el).borderTopLeftRadius)
    if (!r || r > 200) continue
    const box = el.getBoundingClientRect()
    if (box.width < 40 || box.height < 40) continue
    radii.set(r, (radii.get(r) ?? 0) + 1)
  }

  /* ── 컨테이너 폭 ───────────────────────────────────────────
     섹션마다 다를 수 있다. 하나로 통일돼 있다고 가정하지 않는다. */
  const widths = new Map()
  for (const el of document.querySelectorAll('section,div,main,article')) {
    if (!seen(el)) continue
    const cs = getComputedStyle(el)
    if (cs.marginLeft !== cs.marginRight || cs.marginLeft === '0px') continue
    const w = Math.round(el.getBoundingClientRect().width)
    if (w < 600 || w > 1600) continue
    widths.set(w, (widths.get(w) ?? 0) + 1)
  }

  /* ── 색 ─────────────────────────────────────────────────────
     화면을 실제로 덮는 배경색을 면적 순으로. 토큰 목록이 아니라
     "무슨 색이 이 페이지를 이루는가" 를 본다. */
  const area = new Map()
  for (const el of document.querySelectorAll('body *')) {
    if (!seen(el)) continue
    const bg = getComputedStyle(el).backgroundColor
    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue
    const box = el.getBoundingClientRect()
    area.set(bg, (area.get(bg) ?? 0) + Math.round((box.width * box.height) / 1000))
  }

  const top = (m, n) =>
    [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ value: k, count: v }))

  return {
    docHeight: document.documentElement.scrollHeight,
    type: type.slice(0, 14),
    radii: top(radii, 8),
    containers: top(widths, 8),
    colors: top(area, 8),
  }
})
await browser.close()

const file = `assets/tokens/${name}.json`
await writeFile(file, JSON.stringify(data, null, 2) + '\n')

const show = (label, rows, fmt) => {
  console.log(`\n${label}`)
  rows.forEach((r) => console.log('  ' + fmt(r)))
}
console.log(`${name} — ${url}\n문서 높이 ${data.docHeight}px`)
show('타입 스케일 (px · letter-spacing · em · line-height · weight)', data.type, (r) =>
  `${String(r.size).padStart(6)}px  ls ${r.letterSpacing.join('/')}  = ${r.em.join('/')}em  lh ${r.lineHeight.join('/')}  w ${r.weight.join('/')}`,
)
show('모서리 반경 (40px 이상 상자)', data.radii, (r) => `${String(r.value).padStart(6)}px  ×${r.count}`)
show('가운데 정렬 컨테이너 폭', data.containers, (r) => `${String(r.value).padStart(6)}px  ×${r.count}`)
show('배경색 (면적 순)', data.colors, (r) => `${r.value.padEnd(26)} ${r.count}`)

// 둘 다 있으면 대조표
const other = name === 'ours' ? 'toss' : 'ours'
if (existsSync(`assets/tokens/${other}.json`)) {
  const b = JSON.parse(await readFile(`assets/tokens/${other}.json`, 'utf8'))
  const mine = name === 'ours' ? data : b
  const theirs = name === 'ours' ? b : data
  console.log('\n\n═══ 대조 (toss ↔ ours) ═══')
  console.log('\n반경')
  console.log('  toss:', theirs.radii.map((r) => r.value).join(' / '))
  console.log('  ours:', mine.radii.map((r) => r.value).join(' / '))
  console.log('\n컨테이너 폭')
  console.log('  toss:', theirs.containers.map((r) => r.value).join(' / '))
  console.log('  ours:', mine.containers.map((r) => r.value).join(' / '))
  console.log('\n타입 스케일 상위')
  console.log('  toss:', theirs.type.slice(0, 8).map((r) => r.size).join(' / '))
  console.log('  ours:', mine.type.slice(0, 8).map((r) => r.size).join(' / '))
}
console.log(`\n→ ${file}`)
