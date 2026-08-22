#!/usr/bin/env node
/**
 * 라우트마다 완성된 HTML 을 미리 찍어 dist 에 넣는다.
 *
 * 이 사이트는 index.html 하나에 <div id="root"></div> 만 있는 SPA 다. GitHub
 * Pages 는 /ai-college 같은 경로에 파일이 없으면 404.html 을 404 상태로 내려주고,
 * 그 안의 스크립트가 브라우저에서 라우팅을 마친다. 사람 눈에는 멀쩡하지만
 *
 *   - 서브페이지가 전부 HTTP 404 로 응답한다. 본부에 낼 주소인데 링크 검사기나
 *     크롤러가 보면 죽은 링크다.
 *   - 자바스크립트를 돌리지 않는 쪽에는 본문이 한 글자도 없다.
 *   - 검색엔진이 서브페이지를 색인하지 않는다.
 *
 * 서버를 바꿀 수 없으니 파일을 만들어 둔다. 빌드된 결과를 띄우고 라우트마다
 * 브라우저로 들어가 렌더가 끝난 DOM 을 그대로 저장한다. dist/ai-college/index.html
 * 이 생기면 Pages 가 그걸 200 으로 내려준다.
 *
 * 저장한 HTML 에는 이미 본문이 들어 있고, 로드되면 React 가 같은 자리에 다시
 * 그린다. 내용이 같으므로 눈에 띄는 변화는 없다.
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const BASE = process.env.VITE_BASE ?? '/pnu-ai-college/'
const ROUTES = [
  '/',
  '/ai-college',
  '/ai-college/adpx',
  '/ai-college/schools',
  '/ai-college/roadmap',
]

// 학부 상세는 데이터에서 뽑는다. 손으로 적어두면 학부가 늘 때 조용히 빠진다.
const schools = (await readFile('src/data/schools.js', 'utf8')).match(/slug: '([^']+)'/g) ?? []
for (const m of schools) ROUTES.push('/ai-college/schools/' + m.slice(7, -1))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0])
  const rel = path.startsWith(BASE) ? path.slice(BASE.length) : path.replace(/^\//, '')
  let file = join('dist', rel)
  if (!extname(file) || !existsSync(file)) file = join('dist', 'index.html')
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404)
    res.end()
  }
})
await new Promise((r) => server.listen(0, r))
const port = server.address().port

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

for (const route of ROUTES) {
  const url = `http://localhost:${port}${BASE}${route.replace(/^\//, '')}`
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
  // 라우트가 실제로 그려졌는지 확인하고 저장한다. 빈 root 를 저장하면
  // 지금보다 나빠진다 — 내용 없는 파일이 200 으로 나가기 때문이다.
  await page.waitForSelector('#root > *', { timeout: 15_000 })
  await page.waitForTimeout(400)
  const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)

  const dir = route === '/' ? 'dist' : join('dist', route.replace(/^\//, ''))
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'index.html'), html)
  console.log(`  ${route.padEnd(34)} ${(html.length / 1024).toFixed(0)}KB`)
}

await browser.close()
server.close()

// 미리 찍지 않은 경로를 위한 대비책. 여기에도 홈이 그려진 판을 쓴다.
await writeFile('dist/404.html', await readFile('dist/index.html'))
console.log(`\n${ROUTES.length}개 라우트 + 404.html`)
