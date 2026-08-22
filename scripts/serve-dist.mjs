#!/usr/bin/env node
/**
 * 빌드 결과를 GitHub Pages 와 같은 방식으로 내려준다.
 *
 * vite preview 는 SPA 라 어느 경로든 index.html 을 200 으로 준다. Pages 는
 * 그렇지 않다 — 파일이 있으면 200, 없으면 404.html 을 404 로 준다.
 * 미리 찍은 HTML 이 제대로 자리에 놓였는지는 이 규칙으로 봐야 확인된다.
 *
 *   node scripts/serve-dist.mjs   →  http://localhost:5201/pnu-ai-college/
 */
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
const T = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.webp':'image/webp', '.jpg':'image/jpeg', '.mp4':'video/mp4', '.webm':'video/webm' }
createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]).replace('/pnu-ai-college/', '').replace(/^\//, '')
  let f = join('dist', u || 'index.html')
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html')
  if (!existsSync(f)) { res.writeHead(404, {'content-type':'text/html; charset=utf-8'}); return res.end(readFileSync('dist/404.html')) }
  res.writeHead(200, { 'content-type': T[extname(f)] ?? 'application/octet-stream' })
  res.end(readFileSync(f))
}).listen(5201, () => console.log('5201'))
