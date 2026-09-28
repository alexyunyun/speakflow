import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SCENARIOS, GROUPS } from '../content/scenarios'
import type { ChatMsg, Scenario, SavedWord, SessionRec, Settings } from '../lib/types'
import { chatStream, completeJSON, aiReady } from '../lib/ai'
import { chatSystemPrompt, feedbackMessages, parseFeedback, scenarioGenMessages, type GeneratedScenario } from '../lib/coach'
import { loadChat, saveChat, uid } from '../lib/store'
import { Recognizer, SRSupported, speak, stopSpeaking } from '../lib/speech'
import { Btn, IMic, IPlus, ISparkles, ISquare, ISend, IStar, ITrash, IVolume, Modal, cx } from '../ui'

interface TalkProps {
  settings: Settings
  custom: Scenario[]
  addCustom: (s: Scenario) => void
  saveWord: (w: SavedWord) => void
  bumpMsgs: () => void
  bumpMinute: () => void
  addSession: (s: SessionRec) => void
  onOpenSettings: () => void
}

const seedMsgs = (s: Scenario): ChatMsg[] => [{ id: uid(), role: 'assistant', text: s.opener, ts: Date.now() }]

export function Talk({ settings, custom, addCustom, saveWord, bumpMsgs, bumpMinute, addSession, onOpenSettings }: TalkProps) {
  const all = useMemo(() => [...SCENARIOS, ...custom], [custom])
  const [scenId, setScenId] = useState(() => localStorage.getItem('sf.lastScenario') || 'free')
  const scenario = all.find((s) => s.id === scenId) || all[0]
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => loadChat(scenario.id) || seedMsgs(scenario))
  const [streaming, setStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [interim, setInterim] = useState('')
  const [micErr, setMicErr] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [showPhrases, setShowPhrases] = useState(true)

  const hasAI = aiReady(settings.apiKey)
  const recRef = useRef<Recognizer | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const stick = useRef(true)
  const sess = useRef({ start: Date.now(), msgs: 0 })

  // 切换场景:载入该场景的聊天记录(没有记录则以开场白起头)
  useEffect(() => {
    localStorage.setItem('sf.lastScenario', scenId)
    setMsgs(loadChat(scenId) || seedMsgs(all.find((s) => s.id === scenId) || all[0]))
    setInterim('')
    setInput('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenId])

  // 持久化聊天记录
  useEffect(() => {
    if (msgs.length) saveChat(scenId, msgs.slice(-80))
  }, [msgs, scenId])

  // 自动滚动(用户上翻时暂停)
  useEffect(() => {
    if (stick.current) endRef.current?.scrollIntoView({ block: 'end' })
  }, [msgs])

  // 学习时长(每分钟 1 次)与会话记录(离开时写入)
  useEffect(() => {
    sess.current = { start: Date.now(), msgs: 0 }
    const t = setInterval(() => bumpMinute(), 60000)
    return () => {
      clearInterval(t)
      if (sess.current.msgs > 0) {
        addSession({
          ts: Date.now(), scenarioId: scenId,
          title: `${scenario.emoji} ${scenario.zh}`,
          minutes: Math.max(1, Math.round((Date.now() - sess.current.start) / 60000)),
          msgs: sess.current.msgs
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenId])

  // 从给定数组构造对话历史
  const histFrom = (arr: ChatMsg[], upTo: number) =>
    arr.slice(0, upTo).filter((m) => !m.error).slice(-16)
      .map((m) => ({ role: m.role, content: m.text }))

  async function runFeedback(userId: string, base: ChatMsg[]) {
    setMsgs((m) => m.map((x) => (x.id === userId ? { ...x, fbState: 'loading' } : x)))
    try {
      const idx = base.findIndex((x) => x.id === userId)
      const raw = await completeJSON(
        feedbackMessages(scenario, settings.level, histFrom(base, idx + 1)),
        { userKey: settings.apiKey }
      )
      const fb = parseFeedback(raw)
      setMsgs((m) => m.map((x) => (x.id === userId ? { ...x, fb, fbState: 'done' } : x)))
    } catch {
      setMsgs((m) => m.map((x) => (x.id === userId ? { ...x, fbState: 'error' } : x)))
    }
  }

  async function send(text: string) {
    text = text.trim()
    if (!text || streaming) return
    stopSpeaking()
    setMicErr('')
    sess.current.msgs++
    bumpMsgs()

    const user: ChatMsg = { id: uid(), role: 'user', text, ts: Date.now() }
    const base = [...msgs, user]
    setMsgs(base)
    setInput('')
    setInterim('')

    // 即时教练反馈(并行,不阻塞对话)
    if (settings.instantFB && hasAI) void runFeedback(user.id, base)

    const ai: ChatMsg = { id: uid(), role: 'assistant', text: '', ts: Date.now() }
    setMsgs([...base, ai])
    setStreaming(true)
    try {
      const full = await chatStream(
        [{ role: 'system', content: chatSystemPrompt(scenario, settings.level) }, ...histFrom(base, base.length)],
        {
          userKey: settings.apiKey,
          onDelta: (d) => setMsgs((m) => m.map((x) => (x.id === ai.id ? { ...x, text: x.text + d } : x)))
        }
      )
      if (settings.autoTTS) speak(full, { voiceURI: settings.voiceURI, rate: settings.rate })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setMsgs((m) => m.map((x) => (x.id === ai.id ? { ...x, error: msg } : x)))
    } finally {
      setStreaming(false)
    }
  }

  function toggleRec() {
    setMicErr('')
    if (recording) {
      const final = recRef.current?.stop() || ''
      setRecording(false)
      if (final) send(final)
      return
    }
    if (!SRSupported) { setMicErr('当前浏览器不支持语音识别,可打字练习;建议使用 Chrome'); return }
    stopSpeaking()
    if (!recRef.current) {
      recRef.current = new Recognizer({
        onInterim: (t) => setInterim(t),
        onError: (kind, detail) => {
          setRecording(false)
          setInterim('')
          setMicErr(
            kind === 'denied' ? '麦克风权限被拒绝:请点击地址栏左侧的权限图标,允许使用麦克风'
            : kind === 'network' ? '语音识别服务网络异常,请检查网络后重试'
            : `识别出错:${detail || '未知错误'}`
          )
        }
      })
    }
    recRef.current.start()
    setRecording(true)
  }

  const pickScenario = (s: Scenario) => {
    setScenId(s.id)
    setShowPicker(false)
    if (settings.autoTTS) setTimeout(() => speak(s.opener, { voiceURI: settings.voiceURI, rate: settings.rate }), 300)
  }

  const savePhrase = (text: string) => {
    const first = text.split(/(?<=[.!?])\s/)[0].slice(0, 90)
    saveWord({ ...newWordObj(first, `${scenario.emoji} ${scenario.zh}`), context: text.slice(0, 160) })
  }

  const needSetup = !hasAI

  return (
    <div className="talk">
      <header className="talk-head">
        <button className="scen-btn" onClick={() => setShowPicker(true)} title="切换场景">
          <span className="scen-emoji">{scenario.emoji}</span>
          <span className="scen-name">{scenario.zh}</span>
          <span className="lvl-chip">{scenario.level}</span>
          <IconChevronSmall />
        </button>
        <div className="head-actions">
          <Btn variant="ghost" size="sm" onClick={() => setShowPhrases((v) => !v)}>{showPhrases ? '隐藏关键句' : '关键句'}</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { if (confirm('清空当前场景的对话记录?')) setMsgs(seedMsgs(scenario)) }} aria-label="清空对话"><ITrash size={15} /></Btn>
        </div>
      </header>

      {showPhrases && (
        <div className="phrase-strip">
          {scenario.phrases.map((p) => (
            <button key={p.en} className="phrase-chip" onClick={() => speak(p.en, { voiceURI: settings.voiceURI, rate: settings.rate })} title={`${p.zh} · 点击朗读`}>
              <IVolume size={13} /> {p.en}
            </button>
          ))}
        </div>
      )}

      <div className="chat-scroll" onScroll={(e) => {
        const el = e.currentTarget
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90
      }}>
        <div className="chat-inner">
          {needSetup && <SetupCard onOpenSettings={onOpenSettings} />}
          {msgs.map((m) => (
            m.role === 'user'
              ? (
                <div key={m.id} className="row user">
                  <Bubble>{m.text}</Bubble>
                  <FbFor m={m} saveWord={saveWord} source={`${scenario.emoji} ${scenario.zh}`} />
                </div>
              )
              : (
                <div key={m.id} className="row ai">
                  <div className="avatar">{scenario.emoji}</div>
                  <div className="col">
                    <Bubble>
                      {m.text || (m.error ? <span className="err-text">⚠️ {m.error}</span> : <Typing />)}
                    </Bubble>
                    {!m.error && m.text && (
                      <div className="bubble-tools">
                        <button onClick={() => speak(m.text, { voiceURI: settings.voiceURI, rate: settings.rate })} title="朗读"><IVolume size={14} /></button>
                        <button onClick={() => savePhrase(m.text)} title="收藏到生词本"><IStar size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              )
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="composer">
        {recording && (
          <div className="rec-bar">
            <span className="rec-dot" /> 正在聆听…{interim ? `「${interim}」` : '请开始说英文'}
          </div>
        )}
        {micErr && <div className="rec-err">{micErr}</div>}
        <div className="composer-row">
          <button className={cx('mic-btn', recording && 'rec')} onClick={toggleRec} aria-label={recording ? '结束并发送' : '开始语音'}>
            {recording ? <ISquare size={20} /> : <IMic size={22} />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
            }}
            placeholder={recording ? '正在聆听你的声音…' : '输入英文,或点左侧麦克风开口说…'}
            rows={1}
          />
          <button className="send-btn" onClick={() => send(input)} disabled={!input.trim() || streaming} aria-label="发送">
            <ISend size={18} />
          </button>
        </div>
        {!SRSupported && <div className="hint-line">当前浏览器不支持语音识别(建议 Chrome / Edge),你可以先打字练习</div>}
      </div>

      {showPicker && (
        <ScenarioPicker
          current={scenId}
          all={all}
          onPick={pickScenario}
          onClose={() => setShowPicker(false)}
          addCustom={addCustom}
          settings={settings}
        />
      )}
    </div>
  )
}

function newWordObj(term: string, source?: string): SavedWord {
  return { id: uid(), term: term.trim(), source, ts: Date.now(), box: 0, due: Date.now() }
}

// ===== 教练反馈卡片 =====
function FbFor({ m, saveWord, source }: { m: ChatMsg; saveWord: (w: SavedWord) => void; source: string }) {
  const [open, setOpen] = useState(false)
  if (m.fbState === 'loading') return <div className="fb fb-loading">✨ AI 教练批改中…</div>
  if (m.fbState === 'error') return null
  if (!m.fb) return null
  const fb = m.fb
  const grade = fb.score >= 90 ? '很地道' : fb.score >= 75 ? '不错' : '继续加油'
  return (
    <div className={cx('fb', open && 'open')}>
      <button className="fb-head" onClick={() => setOpen(!open)}>
        <span className="fb-score" data-g={fb.score >= 90 ? 'hi' : fb.score >= 75 ? 'mid' : 'lo'}>{fb.score}</span>
        <span className="fb-title">教练点评 · {grade}{fb.issues.length ? ` · ${fb.issues.length} 处建议` : ' · 无明显错误'}</span>
        <IconChevronSmall up={open} />
      </button>
      {open && (
        <div className="fb-body">
          {fb.corrected && fb.corrected !== m.text && (
            <div className="fb-corrected"><span className="tag">更正</span>{fb.corrected}</div>
          )}
          {fb.issues.map((i, k) => (
            <div key={k} className="fb-issue">
              <div className="fb-fix"><s>{i.original}</s> <b>→ {i.fix}</b></div>
              <div className="fb-note">{i.note}</div>
            </div>
          ))}
          {fb.natural.length > 0 && (
            <div className="fb-natural">
              <div className="tag-row"><span className="tag alt">更地道</span></div>
              {fb.natural.map((n) => (
                <div key={n} className="fb-alt">
                  <span>{n}</span>
                  <button onClick={() => saveWord({ ...newWordObj(n.split(/(?<=[.!?])\s/)[0].slice(0, 90), source), context: n })} title="收藏"><IPlus size={13} /></button>
                </div>
              ))}
            </div>
          )}
          {fb.praise && <div className="fb-praise">💬 {fb.praise}</div>}
        </div>
      )}
    </div>
  )
}

function IconChevronSmall({ up }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? 'rotate(180deg)' : undefined }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function Typing() {
  return <span className="typing"><i /><i /><i /></span>
}

function Bubble({ children }: { children: ReactNode }) {
  return <div className="bubble">{children}</div>
}

// ===== 首次使用引导卡 =====
function SetupCard({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="setup-card">
      <div className="setup-emoji">🔑</div>
      <div className="setup-title">先配置 DeepSeek API Key,开启 AI 对话</div>
      <ol>
        <li>在 <a href="https://platform.deepseek.com" target="_blank" rel="noreferrer">platform.deepseek.com</a> 创建 API Key</li>
        <li>点击下方「打开设置」粘贴即可(在线版 / 本地版都适用;本地版也可以填入 .env)</li>
        <li>也可以先用地址栏加 <code>?demo=1</code> 预览演示模式</li>
      </ol>
      <Btn variant="primary" onClick={onOpenSettings}>打开设置</Btn>
    </div>
  )
}

// ===== 场景选择器 =====
function ScenarioPicker({ current, all, onPick, onClose, addCustom, settings }: {
  current: string
  all: Scenario[]
  onPick: (s: Scenario) => void
  onClose: () => void
  addCustom: (s: Scenario) => void
  settings: Settings
}) {
  const [group, setGroup] = useState<'all' | Scenario['group']>('all')
  const [genOpen, setGenOpen] = useState(false)
  const [topic, setTopic] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const list = all.filter((s) => group === 'all' || s.group === group)

  async function generate() {
    if (!topic.trim() || busy) return
    setBusy(true); setErr('')
    try {
      const g = await completeJSON<GeneratedScenario>(scenarioGenMessages(topic.trim()), { userKey: settings.apiKey })
      const s: Scenario = {
        id: `c-${uid()}`, emoji: g.emoji || '✨', group: 'talk', custom: true,
        title: g.title || topic, zh: g.zh || topic, level: g.level || settings.level,
        desc: g.desc || '', persona: g.persona || `A friendly partner for practicing: ${topic}`,
        opener: g.opener || `Hi! Let's talk about ${topic}. Where should we start?`,
        phrases: Array.isArray(g.phrases) ? g.phrases.slice(0, 6) : [],
        vocab: Array.isArray(g.vocab) ? g.vocab.slice(0, 8) : []
      }
      addCustom(s)
      onPick(s)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal onClose={onClose} wide>
      <h2 className="modal-title">选择练习场景</h2>
      <div className="grp-row">
        <button className={cx('chip-btn', group === 'all' && 'on')} onClick={() => setGroup('all')}>全部</button>
        {GROUPS.map((g) => (
          <button key={g.id} className={cx('chip-btn', group === g.id && 'on')} onClick={() => setGroup(g.id)}>{g.zh}</button>
        ))}
      </div>
      <div className="scen-grid">
        {list.map((s) => (
          <button key={s.id} className={cx('scen-card', s.id === current && 'on')} onClick={() => onPick(s)}>
            <div className="scen-card-emoji">{s.emoji}</div>
            <div className="scen-card-zh">{s.zh}{s.custom && <em> 自定义</em>}</div>
            <div className="scen-card-en">{s.title}</div>
            <div className="scen-card-desc">{s.desc}</div>
            <span className="lvl-chip">{s.level}</span>
          </button>
        ))}
      </div>

      <div className="gen-box">
        {genOpen ? (
          <div className="gen-inner">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="描述任何想练的场景,如:在宠物医院给猫看病 / 和房东谈续租 / 跟外国朋友解释中医…"
              rows={2}
            />
            {err && <div className="rec-err">{err}</div>}
            <div className="gen-actions">
              <Btn variant="ghost" size="sm" onClick={() => setGenOpen(false)}>取消</Btn>
              <Btn variant="primary" size="sm" onClick={generate} disabled={!topic.trim() || busy}>
                {busy ? '生成中…' : '生成并开始'}
              </Btn>
            </div>
          </div>
        ) : (
          <button className="gen-open" onClick={() => setGenOpen(true)}>
            <ISparkles size={16} /> 想练的场景不在列表里?让 AI 为你定制(日常 / 专业 / 任意主题)
          </button>
        )}
      </div>
    </Modal>
  )
}
