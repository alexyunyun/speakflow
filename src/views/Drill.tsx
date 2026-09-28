import { useEffect, useMemo, useRef, useState } from 'react'
import { DRILL_PACKS, DRILL_GROUP_LABEL } from '../content/drills'
import type { DrillSentence, DrillResult, PronDiagnosis, Settings, DrillGroup } from '../lib/types'
import { completeJSON, aiReady, isDemo } from '../lib/ai'
import { drillGenMessages, parseDrill, pronDiagnosisMessages, parsePronDiagnosis } from '../lib/coach'
import { tokenize, scoreReading } from '../lib/diff'
import { useLS } from '../lib/store'
import { Recognizer, SRSupported, speak, stopSpeaking } from '../lib/speech'
import { Btn, Empty, IMic, IPlay, IRefresh, ISparkles, ISquare, IVolume, Ring, cx } from '../ui'

interface Props {
  settings: Settings
  bumpDrills: () => void
  seed?: { q: string; ts: number }
}

const GROUPS: DrillGroup[] = ['function', 'scene', 'work', 'native', 'pron']

// ===== 教材句库(Tatoeba 平行语料,懒加载) =====
interface CorpusEntry { id: number; en: string; zh: string; l: string; t: string }
const LEVEL_ZH: Record<string, string> = { A: 'A2 入门', B1: 'B1 进阶', B2: 'B2 中高', C1: 'C1 高级' }
const TOPIC_ZH: Record<string, string> = {
  all: '全部话题', general: '综合', food: '饮食', travel: '旅行', work: '职场', school: '校园',
  family: '家庭', health: '健康', money: '消费', tech: '科技', nature: '自然', social: '社交', time: '时间'
}
const TOPIC_KEYS = Object.keys(TOPIC_ZH).filter((k) => k !== 'all')

type Mode = 'pack' | 'corpus'

export function Drill({ settings, bumpDrills, seed }: Props) {
  const [mode, setMode] = useLS<Mode>('sf.drillMode', 'pack')
  const [packId, setPackId] = useLS('sf.drillPack', 'clarify')
  const [group, setGroup] = useLS<DrillGroup>('sf.drillGroup', 'function')
  const [extra, setExtra] = useLS<Record<string, DrillSentence[]>>('sf.drillExtra', {})
  const [best, setBest] = useLS<Record<string, number>>('sf.drillBest', {})

  // 教材句库状态
  const [corpus, setCorpus] = useState<CorpusEntry[] | null>(null)
  const [corpusLoading, setCorpusLoading] = useState(false)
  const [cLevel, setCLevel] = useLS('sf.corpusLevel', 'all')
  const [cTopic, setCTopic] = useLS('sf.corpusTopic', 'all')
  const [cQuery, setCQuery] = useState('')
  const [cIdx, setCIdx] = useState(0)
  const [idx, setIdx] = useState(0)

  const [recording, setRecording] = useState(false)
  const [interim, setInterim] = useState('')
  const [result, setResult] = useState<DrillResult | null>(null)
  const [micErr, setMicErr] = useState('')
  const [genBusy, setGenBusy] = useState(false)
  const [diag, setDiag] = useState<PronDiagnosis | null>(null)
  const [diagBusy, setDiagBusy] = useState(false)
  const [diagErr, setDiagErr] = useState('')
  const [haveMyAudio, setHaveMyAudio] = useState(false)

  // 精选句包
  const groupPacks = useMemo(() => DRILL_PACKS.filter((p) => p.group === group), [group])
  const pack = groupPacks.find((p) => p.id === packId) || groupPacks[0] || DRILL_PACKS[0]
  const list = useMemo(() => [...pack.sentences, ...(extra[pack.id] || [])], [pack, extra])
  const packSent: DrillSentence = list[Math.min(idx, list.length - 1)]

  // 句库索引与懒加载
  function ensureCorpus() {
    if (corpus || corpusLoading) return
    setCorpusLoading(true)
    import('../content/corpus.json').then((mod) => {
      setCorpus(mod.default as unknown as CorpusEntry[])
      setCorpusLoading(false)
    }).catch(() => { setCorpusLoading(false); setMicErr('教材句库加载失败,请刷新重试') })
  }
  useEffect(() => { if (mode === 'corpus') ensureCorpus(); /* eslint-disable-line */ }, [mode])

  // 从词汇模块跳转:自动切到教材句库并搜索该词
  useEffect(() => {
    if (seed) {
      setMode('corpus')
      setCQuery(seed.q)
      setCTopic('all')
      setCLevel('all')
      ensureCorpus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])

  const filtered = useMemo(() => {
    if (!corpus) return [] as CorpusEntry[]
    const q = cQuery.trim().toLowerCase()
    return corpus.filter((s) =>
      (cLevel === 'all' || s.l === cLevel) &&
      (cTopic === 'all' || s.t === cTopic) &&
      (!q || s.en.toLowerCase().includes(q) || s.zh.includes(cQuery.trim())))
  }, [corpus, cLevel, cTopic, cQuery])

  useEffect(() => { setCIdx(0); setResult(null); setDiag(null); setHaveMyAudio(false) }, [cLevel, cTopic, cQuery, mode])

  const hasAI = aiReady(settings.apiKey)
  const corpusSent = filtered.length ? filtered[Math.min(cIdx, filtered.length - 1)] : null

  // 当前练习句(统一两种模式)
  const cur = mode === 'pack'
    ? { en: packSent.en, zh: packSent.zh, tip: packSent.tip, key: packSent.id, meta: `${Math.min(idx + 1, list.length)} / ${list.length} · ${pack.title}` }
    : corpusSent
      ? { en: corpusSent.en, zh: corpusSent.zh, tip: undefined as string | undefined, key: `c${corpusSent.id}`, meta: `${Math.min(cIdx + 1, filtered.length)} / ${filtered.length} · ${TOPIC_ZH[corpusSent.t] || corpusSent.t} · ${LEVEL_ZH[corpusSent.l] || corpusSent.l}` }
      : null

  const recRef = useRef<Recognizer | null>(null)
  const t0 = useRef(0)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const myAudioRef = useRef<HTMLAudioElement | null>(null)
  const diagFor = useRef('')

  // 切换精选句包时复位
  useEffect(() => { setIdx(0); setResult(null); setDiag(null); setInterim(''); setMicErr(''); setHaveMyAudio(false) }, [packId])

  function say(slow = false) {
    if (!cur) return
    speak(cur.en, { voiceURI: settings.voiceURI, rate: settings.rate * (slow ? 0.7 : 1) })
  }

  function playMine() {
    if (!myAudioRef.current) return
    stopSpeaking()
    myAudioRef.current.currentTime = 0
    void myAudioRef.current.play().catch(() => {})
  }

  function startMicCapture() {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        chunksRef.current = []
        const mr = new MediaRecorder(stream)
        mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data) }
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
          if (myAudioRef.current) URL.revokeObjectURL(myAudioRef.current.src)
          myAudioRef.current = new Audio(URL.createObjectURL(blob))
          setHaveMyAudio(true)
          stream.getTracks().forEach((t) => t.stop())
        }
        mr.start()
        mediaRef.current = mr
      }).catch(() => { /* 采集失败不影响评分 */ })
    } catch { /* 浏览器不支持 MediaRecorder */ }
  }

  function stopMicCapture() {
    try { mediaRef.current?.stop() } catch { /* ignore */ }
  }

  function applyResult(r: DrillResult) {
    setResult(r)
    setDiag(null); setDiagErr(''); diagFor.current = ''
    if (cur) setBest((b) => ({ ...b, [cur.key]: Math.max(b[cur.key] || 0, r.score) }))
    bumpDrills()
  }

  // 生成一次模拟结果(演示模式下无法真实识别时使用,便于体验评分与诊断流程)
  function simulateResult() {
    setRecording(false)
    setInterim('')
    stopMicCapture()
    if (!cur) return
    const tokens = tokenize(cur.en)
    let ok = 0
    const diff = tokens.map((w) => {
      const r = Math.random()
      if (r < 0.78) { ok++; return { status: 'ok' as const, target: w } }
      if (r < 0.9) return { status: 'sub' as const, target: w, said: 'xxx' }
      return { status: 'miss' as const, target: w }
    })
    applyResult({
      score: Math.round((ok / Math.max(tokens.length, 1)) * 100),
      diff, extras: [], seconds: 4, said: cur.en
    })
  }

  function toggleRec() {
    setMicErr('')
    if (recording) {
      // 演示模式下无法真实识别时,回退到模拟结果
      if (isDemo() && !SRSupported) { simulateResult(); return }
      const said = recRef.current?.stop() || ''
      setRecording(false)
      setInterim('')
      stopMicCapture()
      if (!said || !cur) return
      applyResult(scoreReading(cur.en, said, (Date.now() - t0.current) / 1000))
      return
    }
    if (!SRSupported && !isDemo()) { setMicErr('当前浏览器不支持语音识别,建议使用 Chrome / Edge'); return }
    stopSpeaking()
    setResult(null)
    startMicCapture()
    if (!recRef.current) {
      recRef.current = new Recognizer({
        onInterim: (t) => setInterim(t),
        onError: (kind, detail) => {
          setRecording(false); setInterim(''); stopMicCapture()
          if (kind === 'network' && isDemo()) { simulateResult(); return }
          setMicErr(kind === 'denied' ? '麦克风权限被拒绝:请在地址栏允许麦克风'
            : kind === 'network' ? '语音识别服务网络异常,请检查网络'
            : `识别出错:${detail || '未知错误'}`)
        }
      })
    }
    t0.current = Date.now()
    recRef.current.start()
    setRecording(true)
  }

  function goto(delta: number) {
    setResult(null); setDiag(null); setHaveMyAudio(false)
    if (mode === 'pack') setIdx((i) => (i + delta + list.length) % list.length)
    else if (filtered.length) setCIdx((i) => (i + delta + filtered.length) % filtered.length)
  }

  function randomOne() {
    if (!filtered.length) return
    setResult(null); setDiag(null); setHaveMyAudio(false)
    setCIdx(Math.floor(Math.random() * filtered.length))
  }

  async function diagnose() {
    if (!result || !cur || diagBusy || !hasAI) return
    const key = cur.key + result.said
    if (diagFor.current === key) return
    setDiagBusy(true); setDiagErr('')
    try {
      const problems = result.diff.filter((d) => d.status !== 'ok').map((d) => d.status === 'sub' ? `${d.target} (读成了 ${d.said})` : d.target)
      const d = parsePronDiagnosis(await completeJSON(
        pronDiagnosisMessages(cur.en, result.said, problems),
        { userKey: settings.apiKey }
      ))
      setDiag(d)
      diagFor.current = key
    } catch (e) {
      setDiagErr(e instanceof Error ? e.message : String(e))
    } finally {
      setDiagBusy(false)
    }
  }

  async function genSentence() {
    if (genBusy || !hasAI || mode !== 'pack') return
    setGenBusy(true)
    try {
      const s = parseDrill(await completeJSON(drillGenMessages(`${pack.title} (${pack.zh})`, settings.level), { userKey: settings.apiKey }))
      if (s.en) setExtra((e) => ({ ...e, [pack.id]: [...(e[pack.id] || []), s] }))
    } catch (e) {
      setMicErr(e instanceof Error ? e.message : String(e))
    } finally {
      setGenBusy(false)
    }
  }

  const bestScore = cur ? best[cur.key] : undefined
  const trained = Object.keys(best).length

  return (
    <div className="drill">
      <header className="view-head">
        <h1>影子跟读</h1>
        <p>听一句 · 跟读一句 · 逐词打分 + AI 纠音 · 精选 362 句 + 教材句库 {corpus ? corpus.length.toLocaleString() : '32,832'} 句 · 已练 {trained} 句</p>
      </header>

      <div className="grp-row">
        <button className={cx('chip-btn mode-btn', mode === 'pack' && 'on')} onClick={() => setMode('pack')}>📚 精选句包</button>
        <button className={cx('chip-btn mode-btn', mode === 'corpus' && 'on')} onClick={() => setMode('corpus')}>
          🎓 教材句库{corpus ? ` · ${corpus.length.toLocaleString()} 句` : ''}
        </button>
      </div>

      {mode === 'pack' ? (
        <>
          <div className="grp-row">
            {GROUPS.map((g) => (
              <button key={g} className={cx('chip-btn', group === g && 'on')} onClick={() => { setGroup(g); setPackId(DRILL_PACKS.find((p) => p.group === g)!.id) }}>
                {DRILL_GROUP_LABEL[g].emoji} {DRILL_GROUP_LABEL[g].zh}
              </button>
            ))}
          </div>
          <div className="pack-row">
            {groupPacks.map((p) => (
              <button key={p.id} className={cx('chip-btn', p.id === pack.id && 'on')} onClick={() => setPackId(p.id)}>
                {p.emoji} {p.zh}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="corpus-filters">
          <div className="grp-row">
            {['all', 'A', 'B1', 'B2', 'C1'].map((l) => (
              <button key={l} className={cx('chip-btn', cLevel === l && 'on')} onClick={() => setCLevel(l)}>
                {l === 'all' ? '全部难度' : LEVEL_ZH[l]}
              </button>
            ))}
            <select className="topic-select" value={cTopic} onChange={(e) => setCTopic(e.target.value)}>
              {TOPIC_KEYS.map((t) => <option key={t} value={t}>{TOPIC_ZH[t]}</option>)}
            </select>
          </div>
          <div className="search-box">
            <input value={cQuery} onChange={(e) => setCQuery(e.target.value)} placeholder="在句库里搜句子:英文或中文关键词,如 airport / 咖啡 / 加油…" />
          </div>
        </div>
      )}

      {!cur ? (
        <Empty
          emoji={corpusLoading ? '⏳' : '🔍'}
          title={corpusLoading ? '教材句库载入中…' : '没有匹配的句子'}
          hint={corpusLoading ? '首次载入约 0.8MB,之后有缓存' : '换个关键词或放宽筛选试试'}
        />
      ) : (
        <div className="drill-card">
          <div className="drill-meta">
            <span>{cur.meta}</span>
            {bestScore != null && <span className="best-chip">最佳 {bestScore}</span>}
          </div>

          <div className="drill-sentence" lang="en">{cur.en}</div>
          {settings.showZh && cur.zh && <div className="drill-zh">{cur.zh}</div>}
          {cur.tip && <div className="drill-tip">💡 {cur.tip}</div>}

          <div className="drill-actions">
            <Btn onClick={() => say(false)}><IVolume size={16} /> 听原声</Btn>
            <Btn variant="ghost" onClick={() => say(true)}>慢速</Btn>
            <Btn variant={recording ? 'danger' : 'primary'} onClick={toggleRec}>
              {recording ? <><ISquare size={15} /> 结束</> : <><IMic size={16} /> 开始跟读</>}
            </Btn>
            <Btn variant="ghost" onClick={() => goto(-1)} aria-label="上一句">←</Btn>
            <Btn variant="ghost" onClick={() => goto(1)} aria-label="下一句">→</Btn>
            {mode === 'corpus' && <Btn variant="ghost" onClick={randomOne} title="随机来一句">🎲</Btn>}
          </div>

          {recording && (
            <div className="rec-bar center">
              <span className="rec-dot" /> 正在录音…{interim ? `「${interim}」` : '请照着句子大声读'}
            </div>
          )}
          {micErr && <div className="rec-err">{micErr}</div>}

          {result && (
            <div className="drill-result">
              <div className="result-left">
                <Ring value={result.score} />
                {haveMyAudio && (
                  <Btn size="sm" variant="ghost" onClick={playMine}><IPlay size={13} /> 听我的录音</Btn>
                )}
              </div>
              <div className="result-right">
                <div className="diff-words" lang="en">
                  {result.diff.map((w, i) => (
                    <span key={i} className={cx('dw', `dw-${w.status}`)} title={w.status === 'sub' ? `读成了:${w.said ?? '?'}` : w.status === 'miss' ? '漏读' : undefined}>
                      {w.target}
                    </span>
                  ))}
                </div>
                {result.extras.length > 0 && <div className="extras">多读出:{result.extras.join(' ')}(不算错,但注意别添词)</div>}
                <div className="result-tip">
                  {result.score >= 95 ? '🎉 完美!发音和语调都很到位' :
                   result.score >= 80 ? '👍 很好!注意标黄/标红的词,让 AI 帮你纠音' :
                   '再听一遍原声慢速跟读,然后试试 AI 发音诊断'}
                  <span className="result-sec"> · 用时 {result.seconds}s</span>
                </div>
                <div className="result-actions">
                  <Btn size="sm" onClick={toggleRec}><IRefresh size={14} /> 再试一次</Btn>
                  {hasAI && (
                    <Btn size="sm" variant="soft" onClick={diagnose} disabled={diagBusy}>
                      <ISparkles size={14} /> {diagBusy ? '诊断中…' : 'AI 发音诊断'}
                    </Btn>
                  )}
                </div>
                {diagErr && <div className="rec-err">{diagErr}</div>}
                {diag && (
                  <div className="diag-panel">
                    {diag.summary && <div className="diag-summary">{diag.summary}</div>}
                    {diag.diagnosis.map((d) => (
                      <div key={d.word} className="diag-item">
                        <div className="diag-word">
                          <b>{d.word}</b>
                          {d.ipa && <code>{d.ipa}</code>}
                          <button className="mini-speak" onClick={() => speak(d.word, { voiceURI: settings.voiceURI, rate: settings.rate * 0.8 })} aria-label="朗读该词"><IVolume size={12} /></button>
                        </div>
                        {d.problem && <div className="diag-problem">{d.problem}</div>}
                        {d.howto && <div className="diag-howto">👉 {d.howto}</div>}
                      </div>
                    ))}
                    {diag.practice.length > 0 && (
                      <div className="diag-practice">
                        <div className="tag">针对练习</div>
                        {diag.practice.map((p) => (
                          <button key={p.en} className="diag-sent" onClick={() => speak(p.en, { voiceURI: settings.voiceURI, rate: settings.rate * 0.85 })} title="点击朗读">
                            <b>{p.en}</b>
                            <span>{p.zh}{p.focus && ` · ${p.focus}`}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="drill-foot">
        {mode === 'pack' ? (
          <button className="gen-open" onClick={genSentence} disabled={!hasAI || genBusy} title={hasAI ? '' : '需要在设置里配置 API Key'}>
            <ISparkles size={15} /> {genBusy ? 'AI 正在出题…' : `让 AI 出一句「${pack.zh}」新句子`}
          </button>
        ) : (
          <span className="hint-line">教材句库数据来自开源平行语料 Tatoeba(CC-BY 2.0 FR),按词频分级、按话题标注,支持中英文搜索</span>
        )}
        {!SRSupported && mode === 'pack' && <span className="hint-line">提示:语音识别需要 Chrome / Edge 浏览器</span>}
      </div>
    </div>
  )
}
