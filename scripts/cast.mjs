#!/usr/bin/env node
/**
 * 자산 전체의 평균 색을 재서 사이트 색띠 밖으로 나간 것을 찾는다.
 *
 * scripts/hue.mjs 와 묻는 것이 다르다. 저쪽은 채도 35% 이상인 화소만 골라
 * **강조색**이 브랜드색과 몇 도 벌어졌는지를 본다. 회색과 어두운 배경은
 * 일부러 버린다.
 *
 * 그런데 38회차에 걸린 문제는 정확히 그 버려지는 자리에 있었다. 스튜디오
 * 렌더 세 장의 바탕이 따뜻한 크림색이었는데 채도가 2~4% 라 hue.mjs 에는
 * 아무것도 잡히지 않았다. 화면에서 가장 넓은 면인데도 그랬다.
 *
 * 그래서 여기서는 거르지 않고 **전부** 평균 낸다. 넓은 면이 무슨 색인지가
 * 이 도구의 질문이다.
 *
 *   node scripts/cast.mjs public/img/*.webp
 *
 * 39장을 재보니 서른여섯 장이 209~232° 에 몰려 있었고 셋만 20° / 27° / 315°
 * 였다. 띠가 저절로 드러나므로 기준을 미리 정해 둘 필요가 없다.
 */
import sharp from 'sharp'

const hueOf = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  if (!d) return { h: 0, s: 0, v: mx / 255 }
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: (h * 60 + 360) % 360, s: d / mx, v: mx / 255 }
}

const rows = []
for (const file of process.argv.slice(2)) {
  const { data, info } = await sharp(file).resize(64, 64, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true })
  let r = 0, g = 0, b = 0, n = 0
  const bins = new Map()
  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n += 1
    // 5비트로 뭉쳐 가장 넓은 면 몇 개를 뽑는다
    const key = `${data[i] >> 5},${data[i + 1] >> 5},${data[i + 2] >> 5}`
    const rec = bins.get(key) ?? { n: 0, r: 0, g: 0, b: 0 }
    rec.n += 1; rec.r += data[i]; rec.g += data[i + 1]; rec.b += data[i + 2]
    bins.set(key, rec)
  }
  const mean = [r / n, g / n, b / n]
  const { h, s } = hueOf(...mean)
  const top = [...bins.values()].sort((a, b2) => b2.n - a.n).slice(0, 3)
  rows.push({
    name: file.split(/[\\/]/).pop(),
    hue: Math.round(h),
    sat: Math.round(s * 100),
    mean: mean.map(Math.round),
    top: top.map((v) => `rgb(${Math.round(v.r / v.n)},${Math.round(v.g / v.n)},${Math.round(v.b / v.n)}) ${Math.round((v.n / n) * 100)}%`),
  })
}

for (const row of rows) {
  console.log(`${row.name.padEnd(28)} 평균 rgb(${row.mean})  색상각 ${String(row.hue).padStart(3)}°  채도 ${String(row.sat).padStart(2)}%`)
  console.log('   ' + row.top.join('  '))
}

// 띠는 자산들이 스스로 만든다. 가운데 절반이 어디에 있는지를 띠로 삼고
// 거기서 멀리 떨어진 것만 이름을 부른다.
if (rows.length >= 6) {
  const hues = rows.map((r) => r.hue).sort((a, b) => a - b)
  const q = (p) => hues[Math.floor((hues.length - 1) * p)]
  const [lo, hi] = [q(0.25), q(0.75)]
  const span = Math.max(20, (hi - lo) * 2)
  const out = rows.filter((r) => r.hue < lo - span || r.hue > hi + span)
  console.log(`\n색띠 ${lo}~${hi}°  (허용 ${lo - span}~${hi + span}°)`)
  console.log(out.length ? `띠 밖 ${out.length}장\n` + out.map((r) => `  ${r.name.padEnd(28)} ${r.hue}°`).join('\n') : '띠 밖 없음')
}
