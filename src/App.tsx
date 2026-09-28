import { useEffect, useRef, useState } from 'react'
import type { Progress, SavedWord, Scenario, SessionRec, Settings } from './lib/types'
import { DEFAULT_SETTINGS, EMPTY_PROGRESS, addProgress, streakOf, useLS } from './lib/store'
import { probe, aiReady, isDemo } from './lib/ai'
import { Talk } from './views/Talk'
import { Drill } from './views/Drill'
import { Words } from './views/Words'
import { Vocabulary } from './views/Vocabulary'
import { ProgressView } from './views/Progress'
import { SettingsPanel } from './components/Settings'
import { IBookmark, IBook, IChat, IChart, IGear, ISearch, IWave, cx } from './ui'

type TabId = 'talk' | 'drill' | 'vocab' | 'words' | 'progress'

const TABS: { id: TabId; label: string; icon: typeof IChat }[] = [
  { id: 'talk', label: '对话', icon: IChat },
  { id: 'drill', label: '跟读', icon: IWave },
  { id: 'vocab', label: '词汇', icon: IBook },
  { id: 'words', label: '生词本', icon: IBookmark },
  { id: 'progress', label: '进度', icon: IChart }
]

export interface DrillSeed { q: string; ts: number }
export interface VocabSeed { q: string; ts: number }

export function App() {
  const [settings, setSettings] = useLS<Settings>('sf.settings', DEFAULT_SETTINGS)
  const [progress, setProgress] = useLS<Progress>('sf.progress', EMPTY_PROGRESS)
  const [words, setWords] = useLS<SavedWord[]>('sf.words', [])
  const [custom, setCustom] = useLS<Scenario[]>('sf.custom', [])
  const [tab, setTab] = useState<TabId>('talk')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [gQuery, setGQuery] = useState('')
  const [drillSeed, setDrillSeed] = useState<DrillSeed | undefined>()
  const [vocabSeed, setVocabSeed] = useState<VocabSeed | undefined>()
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => { void probe() }, [])

  const hasAI = aiReady(settings.apiKey)
  const streak = streakOf(progress)

  function showToast(msg: string) {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2200)
  }

  const saveWord = (w: SavedWord) => {
    setWords((ws) => [w, ...ws].slice(0, 1200))
    showToast(`⭐ 已收藏:${w.term}`)
  }
  const addCustom = (s: Scenario) => setCustom((c) => [...c, s])
  const bumpMsgs = () => setProgress((p) => addProgress(p, { msgs: 1 }))
  const bumpMinute = () => setProgress((p) => addProgress(p, { minutes: 1 }))
  const bumpDrills = () => setProgress((p) => addProgress(p, { drills: 1 }))
  const addSession = (s: SessionRec) => setProgress((p) => ({ ...p, sessions: [s, ...p.sessions].slice(0, 60) }))

  // 顶栏全局查词:回车 → 跳到词汇模块搜索
  function globalSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = gQuery.trim()
    if (!q) return
    setVocabSeed({ q, ts: Date.now() })
    setTab('vocab')
    setGQuery('')
  }

  // 从词汇模块跳到句库搜例句
  const findExamples = (word: string) => {
    setDrillSeed({ q: word, ts: Date.now() })
    setTab('drill')
  }

  return (
    <div className="app">
      <div className="canvas">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-mark">
              <svg viewBox="0 0 64 64" width="30" height="30">
                <rect width="64" height="64" rx="14" fill="#3B76F0" />
                <g stroke="#fff" strokeWidth="4.5" strokeLinecap="round">
                  <line x1="16" y1="26" x2="16" y2="38" /><line x1="24" y1="18" x2="24" y2="46" />
                  <line x1="32" y1="24" x2="32" y2="40" /><line x1="40" y1="14" x2="40" y2="50" />
                  <line x1="48" y1="28" x2="48" y2="36" />
                </g>
              </svg>
            </div>
            <div className="logo-text">
              <b>SpeakFlow</b>
              <span>英语口语陪练</span>
            </div>
          </div>

          <nav className="nav">
            {TABS.map((t) => (
              <button key={t.id} className={cx('nav-item', tab === t.id && 'on')} onClick={() => setTab(t.id)}>
                <t.icon size={19} />
                <span>{t.label}</span>
                {t.id === 'words' && words.length > 0 && <em className="nav-badge">{words.length}</em>}
              </button>
            ))}
          </nav>

          <div className="promo">
            <div className="promo-emoji">{streak > 0 ? '🔥' : '🚀'}</div>
            <b>{streak > 0 ? `已连击 ${streak} 天` : '从今天开始'}</b>
            <span>{streak > 0 ? '状态很好,今天也开口 10 分钟吧' : '每天开口 10 分钟,一个月后见分晓'}</span>
          </div>

          <div className="side-foot">
            {isDemo() && <div className="demo-chip">演示模式</div>}
            <button className="ai-chip" onClick={() => setSettingsOpen(true)} title={hasAI ? 'AI 已就绪' : '点击配置 API Key'}>
              <span className={cx('dot', hasAI ? 'ok' : 'bad')} />
              {hasAI ? 'AI 已就绪' : '未配置 Key'}
            </button>
            <button className="nav-item" onClick={() => setSettingsOpen(true)}>
              <IGear size={18} /><span>设置</span>
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="greeting">
              <h2>欢迎回来 👋</h2>
              <p>{streak > 0 ? `已连续练习 ${streak} 天,保持节奏!` : '选个场景或句子,今天开口就是进步'}</p>
            </div>
            <form className="gsearch" onSubmit={globalSearch}>
              <ISearch size={17} />
              <input
                value={gQuery}
                onChange={(e) => setGQuery(e.target.value)}
                placeholder="查单词、搜例句,回车搜索…"
              />
            </form>
          </div>

          <div className="view-area">
            {tab === 'talk' && (
              <Talk
                settings={settings} custom={custom} addCustom={addCustom}
                saveWord={saveWord} bumpMsgs={bumpMsgs} bumpMinute={bumpMinute}
                addSession={addSession} onOpenSettings={() => setSettingsOpen(true)}
              />
            )}
            {tab === 'drill' && <Drill settings={settings} bumpDrills={bumpDrills} seed={drillSeed} />}
            {tab === 'vocab' && (
              <Vocabulary settings={settings} seed={vocabSeed} saveWord={saveWord} onFindExamples={findExamples} />
            )}
            {tab === 'words' && <Words settings={settings} words={words} setWords={setWords} />}
            {tab === 'progress' && <ProgressView progress={progress} words={words} onGoTalk={() => setTab('talk')} />}
          </div>
        </main>
      </div>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={cx('tab-item', tab === t.id && 'on')} onClick={() => setTab(t.id)}>
            <t.icon size={21} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          setSettings={(fn) => setSettings((s) => fn(s))}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
