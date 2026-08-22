#!/usr/bin/env node
/**
 * 화면 낭독기가 붙잡는 것들을 훑는다.
 *
 * 눈으로 보는 순서와 낭독기가 읽는 순서는 다르다. 낭독기 사용자는 제목 목록으로
 * 건너뛰고 표지(landmark)로 구역을 오간다. 그 둘이 제대로 서 있는지 본다.
 */
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'https://shain1912.github.io/pnu-ai-college/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
await page.waitForTimeout(2000)

const out = await page.evaluate(() => {
  const visible = (el) => {
    let n = el
    while (n && n !== document.body) {
      const s = getComputedStyle(n)
      if (s.visibility === 'hidden' || s.display === 'none') return false
      n = n.parentElement
    }
    return true
  }
  const label = (el) =>
    el.getAttribute('aria-label') ||
    (el.getAttribute('aria-labelledby') &&
      (document.getElementById(el.getAttribute('aria-labelledby'))?.textContent ?? '').trim().slice(0, 30)) ||
    ''

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    lv: Number(h.tagName[1]),
    text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 40),
    vis: visible(h),
  }))

  const landmarks = [...document.querySelectorAll('main,nav,header,footer,aside,section[aria-labelledby],section[aria-label]')].map((el) => ({
    role: el.tagName.toLowerCase(),
    label: label(el),
  }))

  const media = [...document.querySelectorAll('img,video')].map((el) => ({
    tag: el.tagName.toLowerCase(),
    alt: el.tagName === 'IMG' ? el.getAttribute('alt') : el.getAttribute('aria-label'),
    hidden: el.getAttribute('aria-hidden') === 'true',
    src: (el.currentSrc || el.getAttribute('src') || el.querySelector('source')?.getAttribute('src') || '').split('/').pop(),
  }))

  // 이름 없는 구역: section 인데 제목도 라벨도 없는 것
  const unlabeled = [...document.querySelectorAll('main section')].filter(
    (el) => !el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label') && !el.querySelector('h1,h2,h3'),
  ).length

  return { headings, landmarks, media, unlabeled, h1: headings.filter((h) => h.lv === 1).length }
})

console.log(`제목 ${out.headings.length}개 (h1 ${out.h1}개) · 표지 ${out.landmarks.length}개 · 이름 없는 구역 ${out.unlabeled}개`)

let prev = 0
const skips = []
console.log('\n제목 뼈대')
for (const h of out.headings) {
  if (prev && h.lv > prev + 1) skips.push(`h${prev} → h${h.lv}: ${h.text}`)
  prev = h.lv
  console.log('  ' + '  '.repeat(h.lv - 1) + `h${h.lv} ${h.text}${h.vis ? '' : '  (안 보임)'}`)
}
if (skips.length) console.log('\n⚠ 단계 건너뜀\n  ' + skips.join('\n  '))

const badMedia = out.media.filter((m) => !m.hidden && !m.alt)
console.log(`\n미디어 ${out.media.length}개 · aria-hidden ${out.media.filter((m) => m.hidden).length} · 이름 있음 ${out.media.filter((m) => m.alt).length} · 둘 다 없음 ${badMedia.length}`)
badMedia.slice(0, 8).forEach((m) => console.log('   ⚠', m.tag, m.src))

console.log('\n표지')
out.landmarks.forEach((l) => console.log('  ', l.role.padEnd(8), l.label))
await browser.close()
