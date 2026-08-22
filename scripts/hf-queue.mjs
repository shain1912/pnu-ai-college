#!/usr/bin/env node
/**
 * A patient queue for Higgsfield jobs.
 *
 * The plan allows six concurrent jobs, so a burst of submissions gets a
 * rate_limit_reached response rather than a job id — which is easy to miss when
 * the id is scraped out of stdout. This submits one at a time, waits for a slot
 * instead of failing, polls each job to completion, downloads it, and
 * transcodes video to the web formats the site actually loads.
 *
 *   node scripts/hf-queue.mjs assets/queue.json
 *
 * Each entry: { slug, model, args: [...], kind: "image" | "video" }
 * State is written back to the same file, so re-running resumes rather than
 * re-spending credits on work already done.
 */
import { exec as execCb } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

// execFile 은 첫 인자를 실행 파일 경로로 본다. 여기서는 인자까지 붙은 한 줄을
// 넘기므로 셸을 거치는 exec 여야 한다. execFile 로 두면 PowerShell 에서는
// 우연히 통과하지만 bash 에서는 ENOENT 로 죽는다.
const exec = promisify(execCb)
const WIN = process.platform === 'win32'
const sh = async (cmd, timeout = 15 * 60_000) => {
  const { stdout } = await exec(cmd, { timeout, maxBuffer: 32 * 1024 * 1024, windowsHide: true })
  return stdout.trim()
}
const q = (s) => (WIN ? `"${String(s).replace(/"/g, '""')}"` : `'${String(s).replace(/'/g, `'\\''`)}'`)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/

const file = process.argv[2] ?? 'assets/queue.json'
const queue = JSON.parse(await readFile(file, 'utf8'))
await mkdir('assets/raw', { recursive: true })
await mkdir('assets/video', { recursive: true })
await mkdir('public/video', { recursive: true })
await mkdir('public/img', { recursive: true })

const save = () => writeFile(file, JSON.stringify(queue, null, 2) + '\n')

const submit = async (item) => {
  const cmd = ['higgsfield', 'generate', 'create', item.model, ...item.args.map(q)].join(' ')
  for (let attempt = 0; attempt < 40; attempt++) {
    let out
    try {
      out = await sh(cmd)
    } catch (e) {
      out = String(e.stdout ?? '') + String(e.stderr ?? e.message)
    }
    const id = out.match(UUID)?.[0]
    if (id) return id

    // The CLI reports a full queue as rate_limit_reached, but a timeout or a
    // dropped connection comes back with nothing at all. Both mean "try again
    // later", so an empty response waits rather than aborting the whole queue.
    const busy = /rate_limit_reached|timeout|ETIMEDOUT|ECONNRESET/i.test(out) || out.trim() === ''
    if (busy) {
      console.log(`  ${item.slug}: 재시도 대기 (${attempt + 1}) ${out.slice(0, 80).replace(/\s+/g, ' ')}`)
      await sleep(45_000)
      continue
    }
    throw new Error(`${item.slug}: ${out.slice(0, 200)}`)
  }
  throw new Error(`${item.slug}: 슬롯을 못 잡았다`)
}

const settle = async (id) => {
  for (let i = 0; i < 120; i++) {
    // 만료됐거나 없는 작업이면 CLI 가 0 이 아닌 코드로 죽는다. 그걸 그대로
    // 던지면 큐 전체가 멈춘다. 죽은 작업 하나로 나머지를 막지 않는다.
    let raw
    try {
      raw = await sh(`higgsfield generate get ${id} --json`, 60_000)
    } catch (error) {
      const text = String(error.stderr ?? error.message)
      if (/not found|404/i.test(text)) return { status: 'gone' }
      throw error
    }
    const job = JSON.parse(raw)
    if (job.status === 'completed') return job
    if (['failed', 'nsfw', 'canceled', 'gone'].includes(job.status)) return job
    await sleep(8000)
  }
  throw new Error(`${id}: 시간 초과`)
}

/*
 * Two passes. The first collects anything already finished, the second submits
 * what is left. A single pass processes in list order, so one item waiting on a
 * concurrency slot blocks every completed job behind it from ever being
 * downloaded — which is exactly what happened.
 */
const pending = []
for (const item of queue) {
  if (!item.jobId) {
    pending.push(item)
    continue
  }
  await handle(item)
}
for (const item of pending) await handle(item)

console.log('\n대기열 완료')

async function handle(item) {
  const done =
    item.kind === 'video' ? existsSync(`public/video/${item.slug}.webm`) : existsSync(`assets/raw/${item.slug}.png`)
  if (done) return console.log(`✓ ${item.slug} (이미 있음)`)

  if (!item.jobId) {
    if (!item.args?.length) return console.log(`- ${item.slug} (제출 인자 없음, 건너뜀)`)
    item.jobId = await submit(item)
    await save()
    console.log(`→ ${item.slug} 제출 ${item.jobId}`)
  }

  const job = await settle(item.jobId)
  if (job.status !== 'completed') {
    item.status = job.status
    item.jobId = null // let a re-run resubmit
    await save()
    return console.log(`✗ ${item.slug}: ${job.status}`)
  }

  const dest = item.kind === 'video' ? `assets/video/${item.slug}.mp4` : `assets/raw/${item.slug}.png`
  const res = await fetch(job.result_url)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))

  if (item.kind === 'video') {
    const w = item.width ?? 1280
    await sh(
      `ffmpeg -y -loglevel error -i ${q(dest)} -an -vf ${q(`scale=${w}:-2`)} -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good ${q(`public/video/${item.slug}.webm`)}`,
    )
    await sh(
      `ffmpeg -y -loglevel error -i ${q(dest)} -an -movflags +faststart -pix_fmt yuv420p -vf ${q(`scale=${w}:-2`)} -c:v libx264 -crf 26 -preset fast ${q(`public/video/${item.slug}.mp4`)}`,
    )
  }

  item.status = 'done'
  await save()
  console.log(`✓ ${item.slug}`)
}

console.log('\n대기열 완료')
