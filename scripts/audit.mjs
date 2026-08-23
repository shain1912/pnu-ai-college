#!/usr/bin/env node
/**
 * 코드와 자산이 서로 어긋난 곳을 찾는다.
 *
 * 19회차(roadmap_path)와 29회차(apex)에서 같은 일이 두 번 났다. 자산을 갈면서
 * 같은 슬러그를 쓰는 다른 자리를 두고 갔고, 그 자리는 쓰이지 않는 파일이라
 * 눈에 띄지 않았다. 눈으로 훑어서 잡을 수 있는 종류가 아니다.
 *
 *   1. import 되지 않는 컴포넌트·씬 (죽은 코드)
 *   2. 코드가 부르는데 없는 파일 (깨진 참조)
 *   3. 영상은 있는데 포스터가 없는 슬러그
 *   4. public 에 있는데 아무도 안 부르는 파일 (배포에 실리는 짐)
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs'
import { join, relative, basename } from 'node:path'

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.jsx?$/.test(name)) files.push(path)
  }
}
walk('src')
const src = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]))
const all = [...src.values()].join('\n')

// ── 1. 연결 안 된 파일 ────────────────────────────────────
const ENTRY = new Set(['main.jsx', 'App.jsx'])
const dead = files.filter((file) => {
  const name = basename(file).replace(/\.jsx?$/, '')
  if (ENTRY.has(basename(file))) return false
  const pattern = new RegExp(`from '[^']*/${name}'`)
  return ![...src].some(([other, text]) => other !== file && pattern.test(text))
})

// ── 2. 자산 슬러그 모으기 ────────────────────────────────
const slugs = new Set()
for (const text of src.values()) {
  // [a-zA-Z0-9_-]+ 가 탐욕적이라 -poster / -lqip 까지 슬러그로 물고 들어온다.
  // 잡은 뒤에 떼어낸다.
  for (const m of text.matchAll(/['"`](?:img|video)\/([a-zA-Z0-9_-]+)\.\w+['"`]/g)) {
    slugs.add(m[1].replace(/(@2x|-poster|-lqip)$/, ''))
  }
  for (const m of text.matchAll(/slug=(?:"|'|\{")([a-zA-Z0-9_-]+)(?:"|'|"\})/g)) slugs.add(m[1])
  for (const m of text.matchAll(/'([a-zA-Z0-9_]+_v)'/g)) slugs.add(m[1])
}
// 데이터에서 조립되는 것
for (const file of ['src/data/schools.js', 'src/data/content.js']) {
  for (const m of readFileSync(file, 'utf8').matchAll(/image: '([^']+)'/g)) slugs.add(m[1])
}

const missing = []
const noPoster = []
for (const slug of [...slugs].sort()) {
  const poster = existsSync(`public/img/${slug}@2x.webp`)
  const video = existsSync(`public/video/${slug}.webm`) || existsSync(`public/video/${slug}.mp4`)
  if (!poster && !video) missing.push(slug)
  else if (video && !poster) noPoster.push(slug)
}

// ── 3. public 에만 있는 것 ───────────────────────────────
const orphan = []
for (const dir of ['img', 'video']) {
  const base = join('public', dir)
  if (!existsSync(base)) continue
  for (const name of readdirSync(base)) {
    const stem = name.replace(/\.(webp|mp4|webm|png|jpg)$/, '').replace(/(@2x|-lqip|-poster)$/, '')
    if (slugs.has(stem) || all.includes(name)) continue
    orphan.push([`${dir}/${name}`, statSync(join(base, name)).size])
  }
}

console.log(`연결 안 된 파일 ${dead.length}`)
dead.forEach((f) => console.log('   ⚠', relative('.', f)))
console.log(`\n깨진 참조 (부르는데 파일 없음) ${missing.length}`)
missing.forEach((s) => console.log('   ⚠', s))
console.log(`\n포스터 없는 영상 ${noPoster.length}`)
noPoster.forEach((s) => console.log('   ⚠', s))
const bytes = orphan.reduce((a, b) => a + b[1], 0)
console.log(`\npublic 에만 있고 안 쓰임 ${orphan.length}개 ${(bytes / 1024 / 1024).toFixed(1)}MB`)
orphan.sort((a, b) => b[1] - a[1]).slice(0, 14).forEach(([f, s]) => console.log('   ', (s / 1024).toFixed(0).padStart(6) + ' KB', f))

if (dead.length || missing.length || noPoster.length) process.exitCode = 1
