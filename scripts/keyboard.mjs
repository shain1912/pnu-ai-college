#!/usr/bin/env node
/**
 * 탭 키만으로 페이지를 끝까지 훑는다.
 *
 * 마우스로는 멀쩡한 페이지가 키보드로는 막히는 일이 흔하다. 초점이 화면 밖에
 * 있거나, 테두리가 안 보이거나, 스크롤에 묶인 절에서 순서가 뒤집히거나,
 * 눈에 없는 요소가 순서에 남아 있거나.
 *
 * 각 정지점에서 무엇에 초점이 갔는지 · 화면 안인지 · 초점 표시가 보이는지를
 * 함께 남긴다.
 */
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'https://shain1912.github.io/pnu-ai-college/'
const MAX = Number(process.argv[3] ?? 60)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(2000)
await page.evaluate(() => window.scrollTo(0, 0))

const seen = []
let offscreen = 0
let invisible = 0
let noRing = 0

for (let i = 0; i < MAX; i++) {
  await page.keyboard.press('Tab')
  // 브라우저가 초점 요소로 스크롤할 시간을 준다. 바로 재면 아직 화면 밖이다.
  await page.waitForTimeout(600)
  const info = await page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    let hidden = false
    let node = el
    while (node && node !== document.body) {
      const s = getComputedStyle(node)
      if (s.visibility === 'hidden' || s.display === 'none' || s.opacity === '0') { hidden = true; break }
      node = node.parentElement
    }
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent ?? '').trim().slice(0, 30).replace(/\s+/g, ' '),
      inView: r.top >= -4 && r.bottom <= window.innerHeight + 4 && r.width > 0,
      hidden,
      ring: cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px',
      y: Math.round(r.top),
    }
  })
  if (!info) break
  const key = info.tag + '|' + info.text + '|' + info.y
  if (seen.some((s) => s.key === key)) break // 한 바퀴 돌았다
  seen.push({ key, ...info })
  if (!info.inView) offscreen++
  if (info.hidden) invisible++
  if (!info.ring) noRing++
}

console.log(`정지점 ${seen.length}개 · 화면 밖 ${offscreen} · 안 보이는데 초점 ${invisible} · 초점 표시 없음 ${noRing}`)
for (const s of seen) {
  const flags = [!s.inView && '화면밖', s.hidden && '안보임', !s.ring && '표시없음'].filter(Boolean).join(' ')
  console.log(`  ${s.tag.padEnd(6)} ${String(s.text).padEnd(32)} ${flags}`)
}
await browser.close()
