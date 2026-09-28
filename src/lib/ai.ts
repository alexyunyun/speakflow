// ===== DeepSeek API 客户端 =====
// 传输层:优先走本地服务代理 /api/chat(推荐);若探测不到本地服务,
// 且用户在「设置」里填了 Key,则直接调用 api.deepseek.com。
// URL 参数加 ?demo=1 可进入演示模式(无需 Key,返回模拟数据,便于预览交互)。

const BASE_URL = 'https://api.deepseek.com'
export const MODEL = 'deepseek-chat'

export type ChatMsgInput = { role: 'system' | 'user' | 'assistant'; content: string }

let mode: 'proxy' | 'direct' | 'unknown' = 'unknown'
let proxyHasKey = false

export const isDemo = () => new URLSearchParams(location.search).has('demo')

export async function probe(): Promise<void> {
  if (isDemo()) { mode = 'proxy'; proxyHasKey = true; return }
  try {
    const r = await fetch('/api/health', { signal: AbortSignal.timeout(2500) })
    if (r.ok) {
      const j = await r.json()
      mode = 'proxy'
      proxyHasKey = Boolean(j.hasKey)
      return
    }
  } catch { /* 无本地服务 */ }
  mode = 'direct'
}

/** 当前配置下 AI 是否可用(userKey = 用户在设置里填的 Key)
 *  注意:只要用户填了 Key,本地代理和浏览器直连两种模式都能用
 *  (服务端优先使用请求头里的 x-api-key),因此可以同步判断,
 *  避免探测未完成时界面误显示"未配置"。 */
export function aiReady(userKey: string): boolean {
  if (isDemo()) return true
  if (userKey.trim()) return true
  return mode === 'proxy' && proxyHasKey
}

export function aiModeHint(userKey = ''): string {
  if (isDemo()) return '演示模式:返回模拟数据,不消耗额度'
  if (userKey.trim()) return mode === 'proxy' ? '已填 Key:将经由本地服务调用' : '已填 Key:浏览器直连 DeepSeek'
  if (mode === 'proxy') return proxyHasKey ? 'AI 已就绪(服务端 Key)' : 'AI 就绪需在设置里填入 Key'
  return '未检测到本地服务,需在设置里填 Key 直连 DeepSeek'
}

function friendlyError(status: number, raw: string): string {
  let detail = raw
  try {
    const j = JSON.parse(raw)
    detail = j?.message || j?.error?.message || raw
  } catch { /* keep raw */ }
  if (status === 401) return `API Key 无效或未配置:${detail}`
  if (status === 402) return `账户余额不足:${detail}`
  if (status === 429) return `请求过于频繁,稍后再试:${detail}`
  return `请求失败(${status}):${detail}`
}

/** 流式对话。返回完整回复文本。 */
export async function chatStream(
  messages: ChatMsgInput[],
  opts: {
    userKey?: string
    temperature?: number
    maxTokens?: number
    signal?: AbortSignal
    onDelta?: (delta: string) => void
  } = {}
): Promise<string> {
  const { userKey = '', temperature = 0.8, maxTokens = 512, signal, onDelta } = opts

  if (isDemo()) return demoStream(messages, onDelta)

  const url = mode === 'proxy' ? '/api/chat' : `${BASE_URL}/chat/completions`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (userKey.trim()) headers['x-api-key'] = userKey.trim()

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      temperature,
      max_tokens: maxTokens
    })
  })

  if (!resp.ok) throw new Error(friendlyError(resp.status, await resp.text().catch(() => '')))

  const reader = resp.body!.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let full = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() || ''
    for (const line of lines) {
      const l = line.trim()
      if (!l.startsWith('data:')) continue
      const payload = l.slice(5).trim()
      if (payload === '[DONE]') continue
      try {
        const j = JSON.parse(payload)
        const delta: string = j.choices?.[0]?.delta?.content || ''
        if (delta) { full += delta; onDelta?.(delta) }
      } catch { /* 跳过不完整行 */ }
    }
  }
  if (!full.trim()) throw new Error('AI 返回了空内容,请重试')
  return full
}

/** 非流式调用,解析 JSON 输出(用于反馈、生成等结构化任务) */
export async function completeJSON<T>(
  messages: ChatMsgInput[],
  opts: { userKey?: string; temperature?: number; maxTokens?: number } = {}
): Promise<T> {
  const { userKey = '', temperature = 0.3, maxTokens = 1024 } = opts

  if (isDemo()) {
    await sleep(600)
    return demoJSON(messages) as T
  }

  const url = mode === 'proxy' ? '/api/chat' : `${BASE_URL}/chat/completions`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (userKey.trim()) headers['x-api-key'] = userKey.trim()

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' }
    })
  })

  if (!resp.ok) throw new Error(friendlyError(resp.status, await resp.text().catch(() => '')))

  const j = await resp.json()
  const text: string = j.choices?.[0]?.message?.content || ''
  return parseJSON<T>(text)
}

function parseJSON<T>(text: string): T {
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  try { return JSON.parse(t) as T } catch { /* 尝试截取大括号 */ }
  const s = t.indexOf('{'), e = t.lastIndexOf('}')
  if (s >= 0 && e > s) return JSON.parse(t.slice(s, e + 1)) as T
  throw new Error('AI 返回的不是有效 JSON')
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ===== 演示模式(模拟数据,便于无 Key 预览) =====
const DEMO_REPLIES = [
  'Oh, that sounds interesting! How long have you been doing that?',
  'Nice! And what made you get into it in the first place?',
  'Totally get that. So what does a typical day look like for you?',
  "Really? I've never tried that before — is it hard to start?",
  "That's a great point. Have you thought about doing it more often?"
]

async function demoStream(messages: ChatMsgInput[], onDelta?: (d: string) => void): Promise<string> {
  const count = messages.filter((m) => m.role === 'user').length
  const text = DEMO_REPLIES[(count - 1 + DEMO_REPLIES.length) % DEMO_REPLIES.length]
  for (const w of text.split(' ')) {
    onDelta?.(w + ' ')
    await sleep(60)
  }
  return text
}

function demoJSON(messages: ChatMsgInput[]): unknown {
  const sys = messages.find((m) => m.role === 'system')?.content || ''
  if (sys.includes('speaking coach')) {
    return {
      corrected: 'I went to the cinema with my friends last weekend.',
      score: 78,
      issues: [
        { type: 'grammar', original: 'I go to cinema', fix: 'I went to the cinema', note: '过去的事用过去式;"cinema" 前要加定冠词 the。' },
        { type: 'phrase', original: 'with my friends', fix: 'with a couple of friends', note: '想更口语可以说 a couple of friends。' }
      ],
      natural: ['A few of us caught a movie last weekend.', 'We hit the theater together over the weekend.'],
      praise: '表达流畅,时态稍作调整就更地道了!'
    }
  }
  if (sys.includes('scenario designer')) {
    return {
      title: 'At the Farmers Market',
      zh: '农贸市场采购',
      emoji: '🥕',
      level: 'B1',
      desc: '在周末农贸市场挑菜、询价、闲聊',
      persona: 'You are a warm, chatty farmer selling vegetables at a weekend farmers market.',
      opener: 'Morning! Everything here is picked fresh — what are you looking for today?',
      phrases: [{ en: 'How much for a bunch of these?', zh: '这一把多少钱?' }],
      vocab: [{ en: 'in season', zh: '当季' }]
    }
  }
  if (sys.includes('pronunciation practice')) {
    return { en: 'I would appreciate it if you could get back to me by Friday.', zh: '如果你能在周五前回复我,我将不胜感激。' }
  }
  if (sys.includes('diagnostician')) {
    return {
      summary: '整体流利度不错,主要问题集中在 th 和词尾辅音上。',
      diagnosis: [
        { word: 'think', ipa: '/θɪŋk/', problem: '大概率把 /θ/ 读成了 /s/,听起来像 "sink"。', howto: '舌尖轻轻伸到上下齿之间,再送气,声带不振动。' },
        { word: 'asked', ipa: '/æskt/', problem: '词尾 -ed 的 /t/ 大概率被吞掉了。', howto: 'k 结束后舌尖立刻弹回齿龈,轻轻带出 /t/,不用加 "德" 音。' }
      ],
      practice: [
        { en: 'Think about it for a moment.', zh: '想一下这件事。', focus: '/θ/ TH 咬舌音' },
        { en: 'I asked for both tickets.', zh: '两张票我都要了。', focus: '/skt/ 词尾辅音簇' },
        { en: 'Something is better than nothing.', zh: '有点总比没有强。', focus: '/θ/ + 词尾 /ŋ/' }
      ]
    }
  }
  if (sys.includes('vocabulary tutor')) {
    return {
      meaning: 'n. 押韵;韵文 v. 押韵',
      pos: 'n./v.',
      example: 'The lyrics rhyme in a really clever way.',
      exampleZh: '这段歌词押韵押得很巧妙。',
      collocations: ['rhyme with…(与…押韵)', 'nursery rhymes(童谣)', 'without rhyme or reason(毫无道理)']
    }
  }
  return { ok: true }
}
