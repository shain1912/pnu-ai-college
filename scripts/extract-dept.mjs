import { readFile, writeFile } from 'node:fs/promises'

/**
 * Pulls the department synthesis out of the workflow's result envelope.
 * The value is a JS object literal that was JSON-string-encoded, so the escape
 * handling has to be done by hand rather than with a naive regex.
 */
const src = process.argv[2]
const raw = await readFile(src, 'utf8')

const key = '"synthesis"'
const at = raw.indexOf(key)
if (at === -1) throw new Error('no synthesis key in result')

const quote = raw.indexOf('"', raw.indexOf(':', at) + 1)
let i = quote + 1
let esc = false
const chars = []
while (i < raw.length) {
  const ch = raw[i]
  if (esc) {
    chars.push(ch)
    esc = false
  } else if (ch === '\\') {
    chars.push(ch)
    esc = true
  } else if (ch === '"') {
    break
  } else {
    chars.push(ch)
  }
  i++
}

const js = JSON.parse(`"${chars.join('')}"`)
await writeFile('docs/DEPT_RESEARCH.js.txt', js, 'utf8')

const slugs = [...js.matchAll(/^\s*'([a-z-]+)':\s*\{/gm)].map((m) => m[1])
console.log('chars:', js.length)
console.log('slugs:', slugs.join(', '))
