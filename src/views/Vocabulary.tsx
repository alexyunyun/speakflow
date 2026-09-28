import { useEffect, useMemo, useRef, useState } from 'react'
import type { SavedWord, Settings } from '../lib/types'
import { newWord, useLS } from '../lib/store'
import { speak } from '../lib/speech'
import { Btn, Empty, ISearch, IVolume, IStar, Modal, cx } from '../ui'

// ===== 词汇模块:分页浏览 + 背单词(已背/未背标记)=====
// 词库:ECDICT 高频词(懒加载);牛津3000 来自其独立标记列

interface VocabEntry { w: string; ph: string; zh: string; pos: string; tags: string[] }

const TAG_ZH: Record<string, string> = {
  all: '全部',
  cet4: '四级', cet6: '六级', ky: '考研', gk: '高考', zk: '中考',
  toefl: '托福', ielts: '雅思', gre: 'GRE', oxford: '牛津3000', gsl: '通用词表'
}
const TAG_KEYS = ['cet4', 'cet6', 'ky', 'gk', 'toefl', 'ielts', 'gre', 'oxford']
const PAGE = 24

type VStatus = 'all' | 'un' | 'ed'

interface Props {
  settings: Settings
  seed?: { q: string; ts: number }
  saveWord: (w: SavedWord) => void
  onFindExamples: (word: string) => void
}

export function Vocabulary({ settings, seed, saveWord, onFindExamples }: Props) {
  const [vocab, setVocab] = useState<VocabEntry[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useLS('sf.vocabQuery', '')
  const [tag, setTag] = useLS('sf.vocabTag', 'all')
  const [status, setStatus] = useLS<VStatus>('sf.vocabStatus', 'all')
  const [page, setPage] = useLS('sf.vocabPage', 1)
  const [learned, setLearned] = useLS<Record<string, number>>('sf.learned', {})
  const [study, setStudy] = useState<{ deck: VocabEntry[]; i: number; known: number; unknown: number; shown: boolean } | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

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
      setQuery(seed.q); setTag('all'); setStatus('all'); setPage(1)
      searchRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])

  const base = useMemo(() => {
    if (!vocab) return [] as VocabEntry[]
    const q = query.trim().toLowerCase()
    return vocab.filter((v) =>
      (tag === 'all' || v.tags.includes(tag)) &&
      (!q || v.w.toLowerCase().startsWith(q) || v.w.toLowerCase().includes(q) || v.zh.includes(query.trim())))
  }, [vocab, tag, query])

  const filtered = useMemo(() =>
    base.filter((v) => status === 'all' || (status === 'ed' ? Object.prototype.hasOwnProperty.call(learned, v.w) : !Object.prototype.hasOwnProperty.call(learned, v.w))),
  [base, status, learned])
  const learnedInBase = useMemo(() => base.reduce((n, v) => n + (Object.prototype.hasOwnProperty.call(learned, v.w) ? 1 : 0), 0), [base, learned])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const curPage = Math.min(Math.max(1, page), totalPages)
  const shown = filtered.slice((curPage - 1) * PAGE, curPage * PAGE)

  function goPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
    containerRef.current?.scrollTo({ top: 0 })
  }
  // 注意:词库里有 "constructor" 这种与 Object.prototype 属性同名的真实单词,
  // 判断已背必须用 hasOwnProperty,否则会命中原型链方法造成误判
  const hasOwn = (w: string) => Object.prototype.hasOwnProperty.call(learned, w)
  const toggleLearned = (w: string) =>
    setLearned((m) => {
      if (Object.prototype.hasOwnProperty.call(m, w)) {
        const c = { ...m }; delete c[w]; return c
      }
      return { ...m, [w]: Date.now() }
    })

  function openStudy() {
    if (!filtered.length) return
    setStudy({ deck: filtered.slice(), i: 0, known: 0, unknown: 0, shown: false })
  }
  function gradeStudy(good: boolean) {
    if (!study) return
    const card = study.deck[study.i]
    if (good && card) setLearned((m) => ({ ...m, [card.w]: Date.now() }))
    setStudy({ deck: study.deck, i: study.i + 1, known: study.known + (good ? 1 : 0), unknown: study.unknown + (good ? 0 : 1), shown: false })
  }
  // study.deck 引用的 filtered 已含状态筛选;标记后 deck 快照不变,保证顺序稳定

  return (
    <div className="vocab" ref={containerRef}>
      <header className="view-head">
        <h1>词汇表</h1>
        <p>{vocab
          ? `${vocab.length.toLocaleString()} 个高频词 · 已背 ${Object.keys(learned).length.toLocaleString()} 个 · 来自开源词典 ECDICT`
          : '载入中…'}</p>
      </header>

      <div className="vocab-toolbar">
        <div className="search-box">
          <ISearch size={16} />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="搜单词(支持中文释义)…"
          />
        </div>
        <Btn variant="primary" onClick={openStudy} disabled={!filtered.length}>
          🎯 背单词({filtered.length.toLocaleString()})
        </Btn>
      </div>

      <div className="grp-row">
        {TAG_KEYS.map((t) => (
          <button key={t} className={cx('chip-btn', tag === t && 'on')}
            onClick={() => { setTag(tag === t ? 'all' : t); setPage(1) }}>
            {TAG_ZH[t]}
          </button>
        ))}
        <span className="pager-sep" />
        <button className={cx('chip-btn', status === 'all' && 'on')} onClick={() => { setStatus('all'); setPage(1) }}>全部</button>
        <button className={cx('chip-btn', status === 'un' && 'on')} onClick={() => { setStatus('un'); setPage(1) }}>
          未背 {base.length ? `(${(base.length - learnedInBase).toLocaleString()})` : ''}
        </button>
        <button className={cx('chip-btn', status === 'ed' && 'on')} onClick={() => { setStatus('ed'); setPage(1) }}>
          已背 {learnedInBase ? `(${learnedInBase.toLocaleString()})` : ''}
        </button>
      </div>

      {!vocab ? (
        <Empty emoji="⏳" title="词库载入中…" hint="约 3MB,本地加载只需一瞬间" />
      ) : shown.length === 0 ? (
        <Empty emoji="🔍" title="没有匹配的单词" hint="换个关键词,或放宽筛选(比如状态切回「全部」)" />
      ) : (
        <>
          <div className="vocab-grid">
            {shown.map((v) => {
              const lv = hasOwn(v.w)
              return (
                <div key={v.w} className={cx('vcard', lv && 'learned')}>
                  <div className="v-top">
                    <div className="v-term">
                      <b>{v.w}</b>
                      {v.ph && <span className="vocab-ph">/{v.ph}/</span>}
                      {lv && <span className="v-done">✓ 已背</span>}
                    </div>
                    <div className="v-actions">
                      <button className="vbtn" title="朗读" onClick={() => speak(v.w, { voiceURI: settings.voiceURI, rate: settings.rate * 0.9 })}><IVolume size={14} /></button>
                      <button className="vbtn" title="加入生词本" onClick={() => saveWord(newWord(v.w, '词汇表'))}><IStar size={14} /></button>
                      <button className={cx('vbtn', lv && 'on')} title={lv ? '标记为未背' : '标记为已背'} onClick={() => toggleLearned(v.w)}>{lv ? '✓' : '✗'}</button>
                    </div>
                  </div>
                  <div className="vocab-zh">{v.zh}</div>
                  {v.tags.length > 0 && (
                    <div className="vocab-tags">
                      {v.tags.map((t) => <span key={t} className="vtag">{TAG_ZH[t] || t}</span>)}
                    </div>
                  )}
                  <button className="vbtn wide" onClick={() => onFindExamples(v.w)} title="在教材句库中找例句并跟读">找例句</button>
                </div>
              )
            })}
          </div>

          <div className="pager">
            <Btn size="sm" variant="ghost" disabled={curPage <= 1} onClick={() => goPage(curPage - 1)}>← 上一页</Btn>
            <span className="pager-info">第 <b>{curPage}</b> / {totalPages.toLocaleString()} 页 · 共 {filtered.length.toLocaleString()} 词</span>
            <Btn size="sm" variant="ghost" disabled={curPage >= totalPages} onClick={() => goPage(curPage + 1)}>下一页 →</Btn>
            <input
              className="pager-jump" type="number" min={1} max={totalPages}
              placeholder={`${curPage}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = Number((e.target as HTMLInputElement).value)
                  if (v >= 1 && v <= totalPages) goPage(v)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
              title="输入页码,回车跳转"
            />
          </div>
        </>
      )}

      {study && (
        <Modal onClose={() => setStudy(null)}>
          <h2 className="modal-title">背单词 {study.i >= study.deck.length ? '· 完成!' : `· ${study.i + 1} / ${study.deck.length}`}</h2>
          <div className="study-bar"><div style={{ width: `${Math.round((Math.min(study.i, study.deck.length) / Math.max(study.deck.length, 1)) * 100)}%` }} /></div>
          {study.i >= study.deck.length ? (
            <div className="review-done">
              <div className="empty-emoji">🎉</div>
              <div className="empty-title">本轮完成!</div>
              <div className="empty-hint">认识 {study.known} 个 · 不认识 {study.unknown} 个(不认识的随时再来一轮)</div>
              <Btn variant="primary" onClick={() => setStudy(null)}>完成</Btn>
            </div>
          ) : (
            <div className="flash">
              <div className="flash-card" onClick={() => setStudy({ ...study, shown: !study.shown })}>
                <div className="flash-term">{study.deck[study.i].w}</div>
                {study.deck[study.i].ph && <div className="flash-tap">/{study.deck[study.i].ph}/</div>}
                {study.shown
                  ? <div className="flash-back">{study.deck[study.i].zh}</div>
                  : <div className="flash-tap">点击卡片显示释义</div>}
              </div>
              <button className="flash-speak" onClick={() => speak(study.deck[study.i].w, { voiceURI: settings.voiceURI, rate: settings.rate * 0.9 })}>
                <IVolume size={15} /> 朗读
              </button>
              <div className="flash-actions">
                <Btn variant="danger" onClick={() => gradeStudy(false)}>不认识</Btn>
                <Btn variant="primary" onClick={() => gradeStudy(true)}>✓ 认识了</Btn>
              </div>
              <div className="hint-line">点「认识了」即记入已背;列表里也可以随时手动打勾</div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
