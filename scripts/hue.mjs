#!/usr/bin/env node
/**
 * 채도 높은 화소의 색상(hue) 분포를 센다.
 *
 * 이미지의 dominant 색은 배경(거의 검정)이라 팔레트 비교에 쓸 수 없다.
 * 눈에 들어오는 것은 빛나는 강조색이므로, 채도와 밝기가 일정 이상인 화소만
 * 골라 hue 히스토그램을 낸다. 사이트 브랜드색과 몇 도 벌어졌는지가 바로 나온다.
 */
import sharp from 'sharp'

const rgbToHue = (r, g, b) => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  if (d === 0) return { h: 0, s: 0, v: max / 255 }
  let h
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return { h: (h * 60 + 360) % 360, s: d / max, v: max / 255 }
}

for (const file of process.argv.slice(2)) {
  const { data, info } = await sharp(file).resize(320, null, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true })
  const bins = new Array(36).fill(0)
  let kept = 0
  for (let i = 0; i < data.length; i += info.channels) {
    const { h, s, v } = rgbToHue(data[i], data[i + 1], data[i + 2])
    if (s < 0.35 || v < 0.25) continue // 회색과 어두운 배경은 뺀다
    bins[Math.floor(h / 10)] += 1
    kept += 1
  }
  const top = bins
    .map((n, i) => ({ deg: i * 10, pct: kept ? (100 * n) / kept : 0 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3)
    .map((x) => `${x.deg}\u00b0 ${x.pct.toFixed(0)}%`)
  console.log(String(file.split(/[\/]/).pop()).padEnd(22), `채도화소 ${(100 * kept / (data.length / info.channels)).toFixed(1)}%  →  ${top.join('  ')}`)
}
