import { useMemo, useState } from 'react'
import type { SavedWord, Settings } from '../lib/types'
import { completeJSON, aiReady } from '../lib/ai'
import { wordExplainMessages, parseWordExplain } from '../lib/coach'
import { newWord, SRS_INTERVALS, useLS } from '../lib/store'
import { speak } from '../lib/speech'
import { Btn, Empty, IPlus, ISearch, ISparkles, IStar, ITrash, IVolume, IX, Modal, cx } from '../ui'

interface Props {
  settings: Settings
  words: SavedWord[]
  setWords: (fn: (ws: SavedWord[]) => SavedWord[]) => void
}

const DAY = 86400000

export function Words({ settings, words, setWords }: Props) {
  const [q, setQ] = useState('')
  const [review, setReview] = useState(false)
  const [input, setInput] = useState('')
  const [explaining, setExplaining] = useState('')
  const [err, setErr] = useState('')

  const hasAI = aiReady(settings.apiKey)
  const due = useMemo(() => words.filter((w) => w.due <= Date.now()).sort((a, b) => a.due - b.due), [words])
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (!k) return words
    return words.filter((w) =>
      (w.term + ' ' + (w.meaning || '') + ' ' + (w.context || '')).toLowerCase().includes(k))
  }, [words, q])

  function add() {
    const t = input.trim()
    if (!t) return
    setWords((ws) => [newWord(t), ...ws])
    setInput('')
  }

  async function explain(w: SavedWord) {
    if (!hasAI) { setErr('需要先在设置里配置 API Key'); return }
    setErr(''); setExplaining(w.id)
    try {
      const ex = parseWordExplain(await completeJSON(wordExplainMessages(w.term, w.context), { userKey: settings.apiKey }))
      setWords((ws) => ws.map((x) => (x.id === w.id ? { ...x, ...ex } : x)))
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setExplaining('')
    }
  }

  function remove(w: SavedWord) {
    if (confirm(`删除「${w.term}」?`)) setWords((ws) => ws.filter((x) => x.id !== w.id))
  }

  const mastered = words.filter((w) => w.box >= 5).length

  return (
    <div className="words">
      <header className="view-head">
        <h1>生词本</h1>
        <p>共 {words.length} 个 · 待复习 {due.length} 个 · 已掌握 {mastered} 个</p>
      </header>

      <div className="words-toolbar">
        <div className="search-box">
          <ISearch size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索单词 / 释义 / 例句…" />
        </div>
        <Btn variant="primary" onClick={() => setReview(true)} disabled={!due.length}>
          开始复习{due.length ? `(${due.length})` : ''}
        </Btn>
      </div>

      <div className="add-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="手动添加单词或短语,回车保存…"
        />
        <Btn onClick={add} disabled={!input.trim()}><IPlus size={15} /> 添加</Btn>
      </div>
      {err && <div className="rec-err">{err}</div>}

      {filtered.length === 0 ? (
        <Empty
          emoji="📚"
          title={q ? '没有匹配的记录' : '生词本还是空的'}
          hint="对话中点 ⭐ 收藏 AI 说过的好句子,或在上面手动添加"
        />
      ) : (
        <div className="word-list">
          {filtered.map((w) => (
            <div key={w.id} className="word-row">
              <button className="word-speak" onClick={() => speak(w.term, { voiceURI: settings.voiceURI, rate: settings.rate })} title="朗读">
                <IVolume size={15} />
              </button>
              <div className="word-main">
                <div className="word-term">{w.term}
                  {w.box >= 5 && <span className="lvl-chip ok">已掌握</span>}
                  {w.source && <span className="word-src">{w.source}</span>}
                </div>
                {w.meaning && <div className="word-meaning">{w.pos && <i>{w.pos}</i>} {w.meaning}</div>}
                {w.example && (
                  <div className="word-example">
                    {w.example}
                    {w.exampleZh && <span className="zh"> {w.exampleZh}</span>}
                  </div>
                )}
                {w.context && <div className="word-ctx">“{w.context}”</div>}
                {w.collocations && w.collocations.length > 0 && (
                  <div className="word-coll">{w.collocations.join(' · ')}</div>
                )}
              </div>
              <div className="word-actions">
                {!w.meaning && (
                  <Btn size="sm" onClick={() => explain(w)} disabled={explaining === w.id}>
                    <ISparkles size={13} /> {explaining === w.id ? '讲解中…' : 'AI 讲解'}
                  </Btn>
                )}
                <button className="icon-btn" onClick={() => remove(w)} title="删除"><ITrash size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {review && <ReviewOverlay words={due} setWords={setWords} settings={settings} onClose={() => setReview(false)} />}
    </div>
  )
}

// ===== 间隔复习(闪卡) =====
function ReviewOverlay({ words, setWords, settings, onClose }: {
  words: SavedWord[]
  setWords: (fn: (ws: SavedWord[]) => SavedWord[]) => void
  settings: Settings
  onClose: () => void
}) {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)

  const card = words[i]

  function grade(good: boolean) {
    if (!card) return
    setWords((ws) => ws.map((x) => {
      if (x.id !== card.id) return x
      const box = good ? Math.min(x.box + 1, 6) : 0
      const days = SRS_INTERVALS[good ? box : 1] || 1
      return { ...x, box, due: Date.now() + days * DAY }
    }))
    setFlipped(false)
    if (good) setDone((d) => d + 1)
    setI((n) => n + 1)
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">闪卡复习 {card ? `· ${i + 1} / ${words.length}` : ''}</h2>
      {!card ? (
        <div className="review-done">
          <div className="empty-emoji">🎉</div>
          <div className="empty-title">本轮复习完成!</div>
          <div className="empty-hint">记住了 {done} 个,忘记的明天会再出现</div>
          <Btn variant="primary" onClick={onClose}>完成</Btn>
        </div>
      ) : (
        <div className="flash">
          <button className="flash-card" onClick={() => setFlipped((f) => !f)}>
            <div className="flash-term">{card.term}</div>
            {!flipped && <div className="flash-tap">点击翻面查看释义</div>}
            {flipped && (
              <div className="flash-back">
                {card.pos && <i>{card.pos} </i>}{card.meaning || <span className="dim">尚无释义,可回到列表点「AI 讲解」</span>}
                {card.example && <div className="flash-ex">{card.example}<span className="zh"> {card.exampleZh}</span></div>}
                {card.context && <div className="flash-ctx">“{card.context}”</div>}
              </div>
            )}
          </button>
          <button className="flash-speak" onClick={() => speak(card.term, { voiceURI: settings.voiceURI, rate: settings.rate })}>
            <IVolume size={16} /> 朗读
          </button>
          {flipped && (
            <div className="flash-actions">
              <Btn variant="danger" onClick={() => grade(false)}>还不熟</Btn>
              <Btn variant="primary" onClick={() => grade(true)}>记住了 ✓</Btn>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
