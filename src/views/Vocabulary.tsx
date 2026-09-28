import { useEffect, useMemo, useRef, useState } from 'react'
import type { SavedWord, Settings } from '../lib/types'
import { newWord } from '../lib/store'
import { speak } from '../lib/speech'
import { Btn, Empty, IVolume, ISearch, IStar } from '../ui'

// ===== 词汇模块:ECDICT 高频词库(音标 + 中文释义 + 考级标签),懒加载 =====

interface VocabEntry { w: string; ph: string; zh: string; pos: string; frq: number; tags: string[] }

const TAG_ZH: Record<string, string> = {
  all: '全部',
  cet4: '四级', cet6: '六级', ky: '考研', gk: '高考', zk: '中考',
  toefl: '托福', ielts: '雅思', gre: 'GRE', oxford: '牛津3000', gsl: '通用词表'
}
const TAG_KEYS = ['cet4', 'cet6', 'ky', 'gk', 'toefl', 'ielts', 'gre', 'oxford']

interface Props {
  settings: Settings
  seed?: { q: string; ts: number }
  saveWord: (w: SavedWord) => void
  onFindExamples: (word: string) => void
}

const PAGE = 80

export function Vocabulary({ settings, seed, saveWord, onFindExamples }: Props) {
  const [vocab, setVocab] = useState<VocabEntry[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(seed?.q || '')
  const [tag, setTag] = useState('all')
  const [limit, setLimit] = useState(PAGE)
  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (vocab || loading) return
    setLoading(true)
    import('../content/vocab.json').then((mod) => {
      setVocab(mod.default as unknown as VocabEntry[])
      setLoading(false)
    }).catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (seed) {
      setQuery(seed.q)
      setTag('all')
      setLimit(PAGE)
      searchRef.current?.focus()
    }
  }, [seed])

  const filtered = useMemo(() => {
    if (!vocab) return []
    const q = query.trim().toLowerCase()
    if (!q && tag === 'all') return vocab
    return vocab.filter((v) =>
      (tag === 'all' || v.tags.includes(tag)) &&
      (!q || v.w.toLowerCase().startsWith(q) || v.w.toLowerCase().includes(q) || v.zh.includes(query.trim())))
  }, [vocab, query, tag])

  const shown = filtered.slice(0, limit)
  const hot = (tags: string[]): string[] => tags.filter((t) => t === 'oxford' || t === 'cet6' || t === 'toefl' || t === 'ielts')

  return (
    <div className="vocab">
      <header className="view-head">
        <h1>词汇表</h1>
        <p>{vocab ? `${vocab.length.toLocaleString()} 个高频词 · 音标 + 释义 + 考级标签 · 来自开源词典 ECDICT` : '载入中…'}</p>
      </header>

      <div className="vocab-toolbar">
        <div className="search-box">
          <ISearch size={16} />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setLimit(PAGE) }}
            placeholder="搜单词(支持中文释义)…"
          />
        </div>
        {TAG_KEYS.map((t) => (
          <button key={t} className={`chip-btn ${tag === t ? 'on' : ''}`} onClick={() => { setTag(tag === t ? 'all' : t); setLimit(PAGE) }}>
            {TAG_ZH[t]}
          </button>
        ))}
      </div>

      {!vocab ? (
        <Empty emoji="⏳" title="词库载入中…" hint={`约 3MB,本地加载只需一瞬间`} />
      ) : shown.length === 0 ? (
        <Empty emoji="🔍" title="没有匹配的单词" hint="换个关键词,或放宽考级筛选" />
      ) : (
        <>
          <div className="vocab-list">
            {shown.map((v) => (
              <div key={v.w} className="vocab-row">
                <div className="word-main">
                  <div className="vocab-term">
                    {v.w}
                    {v.ph && <span className="vocab-ph">/{v.ph}/</span>}
                    {v.pos && <span className="word-src">{v.pos}</span>}
                  </div>
                  <div className="vocab-zh">{v.zh}</div>
                  {v.tags.length > 0 && (
                    <div className="vocab-tags">
                      {v.tags.map((t) => (
                        <span key={t} className={`vtag ${hot(v.tags).includes(t) ? 'hot' : ''}`}>{TAG_ZH[t] || t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="vocab-actions">
                  <button className="icon-btn" title="朗读" onClick={() => speak(v.w, { voiceURI: settings.voiceURI, rate: settings.rate * 0.9 })}>
                    <IVolume size={16} />
                  </button>
                  <button className="icon-btn" title="加入生词本" onClick={() => saveWord(newWord(v.w, '词汇表'))}>
                    <IStar size={16} />
                  </button>
                  <Btn size="sm" variant="ghost" onClick={() => onFindExamples(v.w)} title="在教材句库中找例句并跟读">
                    找例句
                  </Btn>
                </div>
              </div>
            ))}
          </div>
          {filtered.length > limit && (
            <div className="drill-foot">
              <Btn onClick={() => setLimit((n) => n + PAGE)}>
                显示更多(还有 {(filtered.length - limit).toLocaleString()} 个)
              </Btn>
            </div>
          )}
        </>
      )}
    </div>
  )
}
