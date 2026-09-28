import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Settings, Progress, SavedWord, Scenario } from './types'

// ===== localStorage 持久化 Hook =====
export function useLS<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw) as T
    } catch { /* 损坏数据当作不存在 */ }
    return initial
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* 存储满时静默 */ }
  }, [key, val])
  return [val, setVal]
}

export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  voiceURI: '',
  rate: 1,
  level: 'B1',
  autoTTS: true,
  instantFB: true,
  showZh: true
}

export const EMPTY_PROGRESS: Progress = { days: {}, sessions: [] }

// ===== 日期工具 =====
export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function lastNDays(n: number): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    out.push(todayKey(d))
  }
  return out
}

export function streakOf(progress: Progress): number {
  let n = 0
  const d = new Date()
  // 今天还没练不打断连击,从昨天往前数
  if (!progress.days[todayKey(d)]) d.setDate(d.getDate() - 1)
  while (progress.days[todayKey(d)]) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

// ===== 生词本 SRS =====
export const SRS_INTERVALS = [0, 1, 2, 4, 8, 15, 30] // 天,按 box 阶段

export function newWord(term: string, source?: string, context?: string): SavedWord {
  return { id: uid(), term: term.trim(), source, context, ts: Date.now(), box: 0, due: Date.now() }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// ===== 进度记录 =====
export function addProgress(
  p: Progress,
  patch: { minutes?: number; msgs?: number; drills?: number }
): Progress {
  const k = todayKey()
  const day = p.days[k] || { minutes: 0, msgs: 0, drills: 0 }
  return {
    ...p,
    days: {
      ...p.days,
      [k]: {
        minutes: day.minutes + (patch.minutes || 0),
        msgs: day.msgs + (patch.msgs || 0),
        drills: day.drills + (patch.drills || 0)
      }
    }
  }
}

// 聊天记录按场景保存
export const chatKey = (scenarioId: string) => `sf.chat.${scenarioId}`

export function loadChat(scenarioId: string) {
  try { return JSON.parse(localStorage.getItem(chatKey(scenarioId)) || 'null') } catch { return null }
}
export function saveChat(scenarioId: string, msgs: unknown) {
  try { localStorage.setItem(chatKey(scenarioId), JSON.stringify(msgs)) } catch { /* ignore */ }
}

export function scenarioTitle(s: Scenario | undefined): string {
  return s ? `${s.emoji} ${s.zh}` : '自由聊天'
}
