/**
 * 构建高频词库:从 ECDICT(MIT)SQLite 数据库提取高频词
 * 输入:/tmp/corpus/stardict.db
 * 输出:src/content/vocab.json —— [{w, ph, zh, pos, tags}]
 *
 * 运行:node scripts/build-vocab.mjs
 */
import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'

const OUT = new URL('../src/content/vocab.json', import.meta.url).pathname
const KNOWN = new Set(['zk', 'gk', 'cet4', 'cet6', 'ky', 'toefl', 'ielts', 'gre', 'oxford', 'gsl'])

const db = new DatabaseSync('/tmp/corpus/stardict.db')
const rows = db.prepare(`
  SELECT word, phonetic, translation, tag, bnc, frq
  FROM stardict
  WHERE (frq > 0 OR bnc > 0)
  ORDER BY COALESCE(NULLIF(frq, 0), COALESCE(NULLIF(bnc, 0), 999999)) ASC
  LIMIT 60000
`).all()

const seen = new Set()
const out = []
for (const r of rows) {
  const w = String(r.word).trim()
  if (!/^[a-z][a-z'-]*$/.test(w) || seen.has(w)) continue // 只收单个英文单词
  const zh = String(r.translation || '').split(/\n|\\n/).map((s) => s.trim()).filter(Boolean)[0] || ''
  if (!zh) continue
  const tags = String(r.tag || '').split(/\s+/).filter((t) => KNOWN.has(t))
  seen.add(w)
  out.push({
    w,
    ph: String(r.phonetic || '').trim().replace(/^\/+|\/+$/g, '').slice(0, 30),
    zh: zh.slice(0, 80),
    pos: '',
    tags
  })
  if (out.length >= 30000) break
}

fs.writeFileSync(OUT, JSON.stringify(out))
console.log(`已写出 ${OUT}:${out.length} 词,${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB`)
const withTags = out.filter((v) => v.tags.length > 0).length
console.log(`带考级标签:${withTags}`)
console.log('样例:', JSON.stringify(out.slice(0, 3), null, 0))
