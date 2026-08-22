#!/usr/bin/env node
/**
 * The Gauntlet Loop — generate, judge, refine.
 *
 * Design-system step 4 asks for assets that survive review against a gold
 * standard rather than whatever the first prompt happened to return. This runs
 * that loop: Higgsfield generates, an independent judge scores the result
 * against written criteria, and a failing score feeds a revised prompt back in.
 *
 *   node scripts/gauntlet.mjs                 # run every spec in assets/specs.json
 *   node scripts/gauntlet.mjs hero r_factory  # run only these slugs
 *   node scripts/gauntlet.mjs --dry           # print what would run, generate nothing
 *
 * Every round is appended to assets/gauntlet-log.json so a rejected asset can
 * always be traced back to the prompt and the judge's reasoning.
 */
import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const runShell = promisify(exec)

const SPECS = 'assets/specs.json'
const LOG = 'assets/gauntlet-log.json'
const RAW = 'assets/raw'
const PASS_SCORE = 8 // out of 10
const MAX_ROUNDS = 3

const argv = process.argv.slice(2)
const DRY = argv.includes('--dry')
const only = argv.filter((a) => !a.startsWith('--'))

/*
 * Process plumbing, kept in one place because Windows makes both halves awkward:
 * `higgsfield` is installed as a .cmd shim that Node cannot spawn without a
 * shell, and prompts are long enough that argv quoting is a real hazard. So the
 * generator goes through a shell with explicit cmd-safe quoting, and the judge
 * receives its prompt on stdin and never touches argv at all.
 */
const WIN = process.platform === 'win32'

const quoteArg = (a) =>
  WIN ? `"${String(a).replace(/"/g, '""')}"` : `'${String(a).replace(/'/g, `'\''`)}'`

const higgsfield = async (args, timeout = 15 * 60_000) => {
  const cmd = ['higgsfield', ...args.map(quoteArg)].join(' ')
  const { stdout } = await runShell(cmd, {
    timeout,
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  })
  return stdout.trim()
}

/** Runs `claude -p` with the prompt piped in, so nothing has to be escaped. */
const askJudge = (prompt, timeout = 10 * 60_000) =>
  new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p'], { windowsHide: true, shell: WIN })
    let out = ''
    let err = ''
    const timer = setTimeout(() => {
      child.kill()
      reject(new Error('judge timed out'))
    }, timeout)

    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (err += d))
    child.on('error', reject)
    child.on('close', (code) => {
      clearTimeout(timer)
      code === 0 ? resolve(out.trim()) : reject(new Error(err.trim() || `judge exited ${code}`))
    })

    child.stdin.end(prompt)
  })

/** The CLI prints the bare job id on success. */
const createJob = async (model, params) => {
  const out = await higgsfield(['generate', 'create', model, ...params])
  const id = out.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)?.[0]
  if (!id) throw new Error(`no job id in higgsfield output: ${out.slice(0, 300)}`)
  return id
}

const pollJob = async (id, { intervalMs = 6000, timeoutMs = 12 * 60_000 } = {}) => {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const raw = await higgsfield(['generate', 'get', id, '--json'], 60_000)
    const job = JSON.parse(raw)
    if (job.status === 'completed') return job
    // `nsfw` is this API's catch-all moderation reject and fires on false
    // positives, so surface it as a distinct outcome rather than a crash.
    if (['failed', 'nsfw', 'canceled'].includes(job.status)) return job
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  throw new Error(`job ${id} did not settle in time`)
}

const download = async (url, dest) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download ${res.status} for ${url}`)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
  return dest
}

/**
 * An independent judge, deliberately a separate process from whoever wrote the
 * prompt. It reads the image itself and must answer in strict JSON.
 */
const judge = async (spec, filePath) => {
  const prompt = [
    `You are a ruthless art director reviewing one generated asset.`,
    `Gold standard: ${spec.goldStandard}`,
    `Intended use: ${spec.use}`,
    ``,
    `Read the image at: ${path.resolve(filePath)}`,
    ``,
    `Score it 0-10 against these criteria. Be harsh; 8+ means shippable as-is.`,
    ...spec.criteria.map((c, i) => `${i + 1}. ${c}`),
    ``,
    `Automatic failure (score <= 4) if any apply:`,
    `- readable text, letters, watermarks or logos appear anywhere`,
    `- nudity, or a human body rendered as the subject`,
    `- it reads as generic stock "AI art" with no specific point of view`,
    ``,
    `Reply with ONLY this JSON, no prose, no code fence:`,
    `{"score": <number>, "verdict": "<one sentence>", "worstFlaw": "<one sentence>", "revisedPrompt": "<a full replacement prompt fixing the flaw, or null if score >= ${PASS_SCORE}>"}`,
  ].join('\n')

  const out = await askJudge(prompt)
  const json = out.match(/\{[\s\S]*\}/)?.[0]
  if (!json) throw new Error(`judge returned no JSON: ${out.slice(0, 300)}`)
  return JSON.parse(json)
}

const appendLog = async (entry) => {
  const log = existsSync(LOG) ? JSON.parse(await readFile(LOG, 'utf8')) : []
  log.push(entry)
  await writeFile(LOG, JSON.stringify(log, null, 2) + '\n')
}

const main = async () => {
  const specs = JSON.parse(await readFile(SPECS, 'utf8'))
  const queue = only.length ? specs.filter((s) => only.includes(s.slug)) : specs
  if (!queue.length) {
    console.error(`no specs matched ${only.join(', ')}`)
    process.exit(1)
  }

  const summary = []

  for (const spec of queue) {
    let prompt = spec.prompt
    let accepted = null

    for (let round = 1; round <= MAX_ROUNDS; round++) {
      const params = [...spec.params, '--prompt', prompt]
      console.log(`\n[${spec.slug}] round ${round}/${MAX_ROUNDS}`)
      console.log(`  higgsfield generate create ${spec.model} ${params.map((p) => (p.length > 60 ? p.slice(0, 57) + '…' : p)).join(' ')}`)
      if (DRY) break

      const id = await createJob(spec.model, params)
      const job = await pollJob(id)

      if (job.status !== 'completed') {
        console.log(`  ✗ ${job.status} — retrying with a reworded prompt`)
        await appendLog({ slug: spec.slug, round, jobId: id, status: job.status, prompt })
        // Moderation rejects are usually one loaded word, not the whole idea.
        prompt = `${prompt} Clinical, architectural, entirely non-figurative.`
        continue
      }

      const ext = path.extname(new URL(job.result_url).pathname) || '.png'
      const file = path.join(RAW, `${spec.slug}${ext}`)
      await download(job.result_url, file)

      const v = await judge(spec, file)
      console.log(`  score ${v.score}/10 — ${v.verdict}`)
      await appendLog({ slug: spec.slug, round, jobId: id, prompt, file, ...v })

      if (v.score >= PASS_SCORE) {
        accepted = { file, score: v.score, round }
        console.log(`  ✓ accepted`)
        break
      }

      console.log(`  ✗ worst flaw: ${v.worstFlaw}`)
      if (!v.revisedPrompt) break
      prompt = v.revisedPrompt
    }

    summary.push({ slug: spec.slug, ...(accepted ?? { accepted: false }) })
  }

  console.log('\n─── gauntlet summary ───')
  for (const s of summary) {
    console.log(
      s.file
        ? `  ✓ ${s.slug.padEnd(14)} ${s.score}/10 (round ${s.round})`
        : `  ✗ ${s.slug.padEnd(14)} no round reached ${PASS_SCORE}/10`,
    )
  }
  if (summary.some((s) => !s.file) && !DRY) process.exitCode = 1
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
