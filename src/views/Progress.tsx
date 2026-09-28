import { useMemo } from 'react'
import type { Progress, SavedWord } from '../lib/types'
import { streakOf, lastNDays, todayKey } from '../lib/store'
import { SCENARIOS } from '../content/scenarios'
import { Btn } from '../ui'

interface Props {
  progress: Progress
  words: SavedWord[]
  onGoTalk: () => void
}

function fmtTs(ts: number): string {
  const d = new Date(ts)
  const isToday = todayKey(d) === todayKey()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return isToday ? `今天 ${hh}:${mm}` : `${d.getMonth() + 1}月${d.getDate()}日 ${hh}:${mm}`
}

export function ProgressView({ progress, words, onGoTalk }: Props) {
  const days = lastNDays(14)
  const totalMinutes = useMemo(() => Object.values(progress.days).reduce((a, d) => a + d.minutes, 0), [progress])
  const totalMsgs = useMemo(() => Object.values(progress.days).reduce((a, d) => a + d.msgs, 0), [progress])
  const totalDrills = useMemo(() => Object.values(progress.days).reduce((a, d) => a + d.drills, 0), [progress])
  const streak = streakOf(progress)
  const max = Math.max(1, ...days.map((k) => progress.days[k]?.minutes || 0))
  const emojiOf = (id: string) => SCENARIOS.find((s) => s.id === id)?.emoji || '💬'

  const stats = [
    { cls: 'stat-blue', emoji: '💬', num: totalMsgs, unit: '句', label: '对话轮次' },
    { cls: 'stat-green', emoji: '🎙️', num: totalDrills, unit: '次', label: '跟读训练' },
    { cls: 'stat-amber', emoji: '🔥', num: streak, unit: '天', label: '连续练习' },
    { cls: 'stat-pink', emoji: '📚', num: words.length, unit: '个', label: '生词收藏' }
  ]

  return (
    <div className="progress">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-kicker">Keep Talking · 每日练习</div>
          <h2>{streak > 0 ? `连击 ${streak} 天,今天继续吧!` : '从今天开始,每天开口 10 分钟'}</h2>
          <p>先跟读几句热身,再去对话场景里实战;收藏的好句子睡前用闪卡过一遍。累计已练 {Math.round(totalMinutes)} 分钟。</p>
          <Btn variant="white" onClick={onGoTalk}>开始今天的练习 →</Btn>
        </div>
        <svg className="hero-deco" width="340" height="220" viewBox="0 0 340 220" fill="none" aria-hidden="true">
          <circle cx="250" cy="90" r="120" stroke="rgba(158,192,255,.25)" strokeWidth="26" />
          <circle cx="250" cy="90" r="70" stroke="rgba(158,192,255,.45)" strokeWidth="26" />
          <circle cx="250" cy="90" r="26" fill="rgba(158,192,255,.7)" />
        </svg>
      </section>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.emoji}</div>
            <div>
              <div className="stat-num">{s.num}<span>{s.unit}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <section className="chart-card">
          <h3>最近 14 天练习时长</h3>
          <div className="chart">
            {days.map((k) => {
              const v = progress.days[k]?.minutes || 0
              const h = Math.max(v > 0 ? 8 : 3, Math.round((v / max) * 100))
              const d = new Date(k + 'T00:00:00')
              return (
                <div key={k} className="chart-col" title={`${k}:${Math.round(v)} 分钟`}>
                  <div className="chart-bar-wrap">
                    <div className={`chart-bar ${v > 0 ? 'on' : ''}`} style={{ height: `${h}%` }} />
                  </div>
                  <div className="chart-label">{d.getDate()}</div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="sess-card">
          <h3>最近练习</h3>
          {progress.sessions.length === 0 ? (
            <div className="empty" style={{ padding: '26px 10px' }}>
              <div className="empty-emoji">🚀</div>
              <div className="empty-title">还没有记录</div>
              <div className="empty-hint">去「对话」聊上几分钟就会出现</div>
            </div>
          ) : (
            <ul className="sess-list">
              {progress.sessions.slice(0, 8).map((s, i) => (
                <li key={i}>
                  <span className="sess-emoji">{emojiOf(s.scenarioId)}</span>
                  <span className="sess-title">{s.title}</span>
                  <span className="sess-meta">{s.msgs} 句 · {s.minutes} 分钟</span>
                  <span className="sess-date">{fmtTs(s.ts)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
