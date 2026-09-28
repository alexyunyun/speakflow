/**
 * 构建教材句库:从 Tatoeba 开源平行语料(CC-BY 2.0 FR)生成英中对照分级句库
 * 输入:/tmp/corpus/ 下的 tsv 文件 + google-10000 词频表
 * 输出:src/content/corpus.json(轻量字段:id/en/zh/l/t)
 *
 * 运行:node scripts/build-corpus.mjs
 */
import fs from 'node:fs'
import readline from 'node:readline'

const DIR = '/tmp/corpus'
const OUT = new URL('../src/content/corpus.json', import.meta.url).pathname

// ---- 词频表 ----
const ranks = new Map()
for (const [i, w] of fs.readFileSync(`${DIR}/google10k.txt`, 'utf8').split('\n').entries()) {
  const k = w.trim().toLowerCase()
  if (k && !ranks.has(k)) ranks.set(k, i + 1)
}

// ---- 需要的句子 id(先读链接表,再按需读取句子文本,省内存) ----
const links = []
for (const line of fs.readFileSync(`${DIR}/eng-cmn_links.tsv`, 'utf8').split('\n')) {
  const [a, b] = line.split('\t')
  if (a && b) links.push([Number(a), Number(b)])
}
const needEng = new Set(links.map((l) => l[0]))
const needCmn = new Set(links.map((l) => l[1]))

async function loadTexts(file, need, map) {
  const rl = readline.createInterface({ input: fs.createReadStream(file) })
  for await (const line of rl) {
    const t = line.split('\t')
    const id = Number(t[0])
    if (need.has(id) && t.length >= 3) map.set(id, t[2])
  }
}

const eng = new Map(), cmn = new Map()
await loadTexts(`${DIR}/eng_sentences_detailed.tsv`, needEng, eng)
await loadTexts(`${DIR}/cmn_sentences_detailed.tsv`, needCmn, cmn)
console.log(`对照句对:${links.length},英文文本:${eng.size},中文文本:${cmn.size}`)

// ---- 繁体字黑名单(大陆用户以简体为主,含这些字的句子多半是繁体) ----
const TRAD = new Set('們說話學來對會個麼裡邊車東門遠樣經見聽寫讀書開關愛國時間運動飛機買賣錢飯貓語這還進過後發現覺頭臉龍風雲兒處樂氣醫藥體點問誰認識請謝誤歲齡婦寶貴讓變電腦視覽標誌網絡業務傷勸雙歷歸靈憶禦驚麗築顯響鐘齊豐實寧寬察專導層廠廢張從徵應戰捨揚敵構槍潑潔澤熱營環確積節級練總續髒質盤衝補製複討記設訪許腦餘館駕齣據鍵盤屬廣沒帶單嗎隻惡該當兩課馬鳥魚與幾彈蘋線專'.split(''))

// ---- 话题关键词 ----
const TOPICS = {
  food: ['eat', 'food', 'cook', 'dinner', 'lunch', 'breakfast', 'hungry', 'restaurant', 'menu', 'rice', 'coffee', 'tea', 'pizza', 'cake', 'fruit', 'vegetable', 'drink', 'delicious', 'meal', 'bread', 'wine', 'beer', 'salt', 'sugar', 'taste'],
  travel: ['travel', 'trip', 'train', 'flight', 'airport', 'hotel', 'ticket', 'bus', 'station', 'luggage', 'passport', 'map', 'tourist', 'journey', 'vacation', 'abroad', 'subway', 'taxi', 'ship', 'beach'],
  work: ['work', 'job', 'boss', 'meeting', 'office', 'salary', 'company', 'project', 'career', 'interview', 'business', 'manager', 'employee', 'deadline', 'report', 'customer', 'contract', 'team'],
  school: ['school', 'teacher', 'student', 'exam', 'homework', 'class', 'study', 'university', 'lesson', 'learn', 'test', 'college', 'textbook', 'graduate', 'essay'],
  family: ['mother', 'father', 'mom', 'dad', 'sister', 'brother', 'wife', 'husband', 'son', 'daughter', 'family', 'parents', 'grandmother', 'grandfather', 'child', 'children', 'baby', 'uncle', 'aunt'],
  health: ['doctor', 'sick', 'pain', 'medicine', 'hospital', 'healthy', 'sleep', 'tired', 'exercise', 'diet', 'headache', 'fever', 'dentist', 'cough', 'injury', 'allergy'],
  money: ['money', 'buy', 'cheap', 'expensive', 'price', 'pay', 'cost', 'dollar', 'rich', 'poor', 'spend', 'save', 'shop', 'shopping', 'discount', 'bargain', 'rent'],
  tech: ['computer', 'phone', 'internet', 'software', 'email', 'website', 'online', 'app', 'machine', 'robot', 'digital', 'program', 'battery', 'screen', 'data', 'password'],
  nature: ['weather', 'rain', 'snow', 'tree', 'river', 'mountain', 'sun', 'wind', 'animal', 'dog', 'cat', 'bird', 'flower', 'sea', 'sky', 'star', 'moon', 'forest', 'spring', 'summer', 'autumn', 'winter'],
  social: ['love', 'happy', 'sad', 'angry', 'friend', 'afraid', 'worry', 'feel', 'party', 'date', 'married', 'relationship', 'smile', 'laugh', 'cry', 'sorry', 'congratulations', 'invite'],
  time: ['yesterday', 'tomorrow', 'morning', 'week', 'month', 'year', 'clock', 'time', 'today', 'tonight', 'hour', 'minute', 'monday', 'sunday', 'weekend', 'birthday']
}
const TOPIC_KEYS = Object.keys(TOPICS)

// ---- 过滤 + 分级 ----
const wordOf = (w) => w.toLowerCase().replace(/^['’-]+|['’s-]+$/g, '')

function gradeEn(en) {
  if (en.length < 16 || en.length > 110) return null
  if (!/^[A-Z]/.test(en) || !/[.!?]$/.test(en)) return null
  if (/http|www\.|@|<|>|_|=|\||\/\/|&quot|&/.test(en)) return null
  const rawWords = en.split(/\s+/)
  if (rawWords.length < 4 || rawWords.length > 14) return null
  let allcaps = 0
  for (const w of rawWords) if (w.length > 1 && /^[A-Z]+$/.test(w)) allcaps++
  if (allcaps > 1) return null

  let maxRank = 0, unknown = 0, total = 0
  for (let i = 0; i < rawWords.length; i++) {
    const raw = rawWords[i]
    const clean = raw.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '') // 剥掉首尾标点
    if (!clean) continue
    if (!/^[A-Za-z'’-]+$/.test(clean) && !/^\d+([.,]\d+)?$/.test(clean)) return null
    if (/^\d/.test(clean)) continue
    if (i > 0 && /^[A-Z]/.test(raw)) continue // 专有名词不参与分级
    const w = wordOf(clean)
    total++
    const r = ranks.get(w)
    if (r) maxRank = Math.max(maxRank, r)
    else unknown++
  }
  if (total < 3) return null
  const ratio = unknown / total
  if (ratio > 0.34) return 'C1'
  if (maxRank <= 1800 && ratio === 0) return 'A'
  if (maxRank <= 4200 && ratio <= 0.15) return 'B1'
  if (maxRank <= 7000 && ratio <= 0.25) return 'B2'
  return 'C1'
}

function cleanZh(zh) {
  if (zh.length < 2 || zh.length > 40) return null
  if (!/[\u4e00-\u9fff]/.test(zh)) return null
  if (/[a-zA-Z]{4,}|http|@|<|>|\|/.test(zh)) return null
  for (const c of zh) if (TRAD.has(c)) return null
  return zh
}

// 预编译整词匹配(避免 homework 误命中 work 这类子串)
const TOPIC_RES = TOPIC_KEYS.map((k) => [k, TOPICS[k].map((kw) => new RegExp(`\\b${kw}s?\\b`))])

function topicOf(enLower) {
  let best = 'general', hits = 0
  for (const [k, regs] of TOPIC_RES) {
    let n = 0
    for (const re of regs) if (re.test(enLower)) n++
    if (n > hits) { hits = n; best = k }
  }
  return best
}

// ---- 汇总(去重) ----
const byEn = new Map(), byZh = new Set()
for (const [eid, cid] of links) {
  const en = eng.get(eid), zhRaw = cmn.get(cid)
  if (!en || !zhRaw) continue
  const zh = cleanZh(zhRaw.trim())
  if (!zh) continue
  const enTrim = en.trim()
  const key = enTrim.toLowerCase()
  if (byEn.has(key) || byZh.has(zh)) continue
  const level = gradeEn(enTrim)
  if (!level) continue
  byEn.set(key, true); byZh.add(zh)
  byEn.set(`@${eid}`, { id: eid, en: enTrim, zh, l: level, t: topicOf(key) })
}
const all = [...byEn.entries()].filter(([k]) => k.startsWith('@')).map(([, v]) => v)
console.log(`清洗后可用:${all.length}`)

// ---- 采样:按 (级别, 话题) 设上限 ----
const seed = 42
let rnd = seed
const rand = () => { rnd = (rnd * 1664525 + 1013904223) % 4294967296; return rnd / 4294967296 }
for (const arr of Object.values(byLevelTopic(all))) { /* 原地打乱各桶 */ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]] } }

function byLevelTopic(items) {
  const m = new Map()
  for (const it of items) {
    const k = it.l + '/' + it.t
    if (!m.has(k)) m.set(k, [])
    m.get(k).push(it)
  }
  return m
}

// ---- 全量收录(不再采样,多多益善) ----
const out = all.slice()
out.sort((a, b) => (a.l + a.t).localeCompare(b.l + b.t) || a.id - b.id)

const stats = {}
for (const it of out) { stats[it.l] = (stats[it.l] || 0) + 1; stats[it.t] = (stats[it.t] || 0) + 1 }
console.log('最终句数:', out.length)
console.log(JSON.stringify(stats, null, 0))

fs.writeFileSync(OUT, JSON.stringify(out))
const mb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2)
console.log(`已写出 ${OUT}(${mb} MB)`)
