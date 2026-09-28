/**
 * 构建高频词库:从 ECDICT(MIT)最新 CSV 提取高频词
 * 输入:/tmp/corpus/ecdict-new.csv(word,phonetic,definition,translation,pos,collins,oxford,tag,bnc,frq,...)
 * 输出:src/content/vocab.json —— [{w, ph, zh, pos, tags}]
 * 牛津3000 来自独立的 oxford 列(旧版 SQLite 没有该数据,所以之前是空的)
 *
 * 运行:node scripts/build-vocab.mjs
 */
import fs from 'node:fs'
import readline from 'node:readline'

const OUT = new URL('../src/content/vocab.json', import.meta.url).pathname
const KNOWN = new Set(['zk', 'gk', 'cet4', 'cet6', 'ky', 'toefl', 'ielts', 'gre', 'oxford', 'gsl'])

// 带引号转义的 CSV 行解析
function parseCsvLine(line) {
  const out = []
  let cur = '', inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++ } else inQ = false }
      else cur += c
    } else {
      if (c === '"') inQ = true
      else if (c === ',') { out.push(cur); cur = '' }
      else cur += cur === '' && c === '' ? '' : c
    }
  }
  out.push(cur)
  return out
}

const rank = (r) => r.frq > 0 ? r.frq : (r.bnc > 0 ? r.bnc : 999999)
const rows = []

const rl = readline.createInterface({ input: fs.createReadStream('/tmp/corpus/ecdict-new.csv') })
let header = null
for await (const line of rl) {
  if (header === null) { header = parseCsvLine(line); continue }
  const c = parseCsvLine(line)
  if (c.length < 10) continue
  const w = c[0].trim()
  if (!/^[a-z][a-z'-]*$/.test(w)) continue
  const frq = Number(c[9]) || 0
  const bnc = Number(c[8]) || 0
  if (frq === 0 && bnc === 0) continue // 只要有人群使用频率的词
  const zh = String(c[3] || '').split(/\\n|\n/).map((s) => s.trim()).filter(Boolean)[0] || ''
  if (!zh) continue
  rows.push({
    w,
    ph: String(c[1] || '').trim().replace(/^\/+|\/+$/g, '').slice(0, 30),
    zh: zh.slice(0, 80),
    oxford: c[6] === '1',
    tags: String(c[7] || '').split(/\s+/).filter((t) => KNOWN.has(t)),
    rank: frq > 0 ? frq : (bnc > 0 ? bnc : 999999)
  })
}
console.log(`候选词(有频率):${rows.length}`)

// 高频前 30000 ∪ 全部牛津3000
rows.sort((a, b) => a.rank - b.rank)
const picked = []
const seen = new Set()
const push = (r) => { if (!seen.has(r.w)) { seen.add(r.w); picked.push(r) } }
for (const r of rows) { if (picked.length >= 30000) break; push(r) }
for (const r of rows) { if (r.oxford) push(r) }

picked.sort((a, b) => a.rank - b.rank || a.w.localeCompare(b.w))

const out = picked.map((r) => ({
  w: r.w, ph: r.ph, zh: r.zh, pos: '',
  tags: [...new Set([...r.tags, ...(r.oxford ? ['oxford'] : [])])]
}))

fs.writeFileSync(OUT, JSON.stringify(out))
console.log(`已写出 ${OUT}:${out.length} 词,${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB`)
const dist = {}
for (const v of out) for (const t of v.tags) dist[t] = (dist[t] || 0) + 1
console.log('标签分布:', JSON.stringify(dist))
console.log('样例:', JSON.stringify(out.filter((v) => v.tags.includes('oxford')).slice(0, 3), null, 0))
