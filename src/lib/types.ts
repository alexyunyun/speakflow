// ===== 全局类型定义 =====

export type Level = 'A2' | 'B1' | 'B2' | 'C1'

export type ScenarioGroup = 'daily' | 'travel' | 'work' | 'talk'

export interface Phrase { en: string; zh: string }

export interface Scenario {
  id: string
  emoji: string
  group: ScenarioGroup
  title: string
  zh: string
  level: Level
  desc: string
  persona: string   // 英文角色设定
  opener: string    // AI 开场白(英文)
  phrases: Phrase[] // 场景关键句
  vocab: Phrase[]   // 场景词汇
  custom?: boolean  // AI 生成场景
}

export interface FeedbackIssue {
  type: 'grammar' | 'word' | 'phrase'
  original: string
  fix: string
  note: string
}

export interface Feedback {
  corrected: string
  score: number
  issues: FeedbackIssue[]
  natural: string[]
  praise?: string
}

export interface ChatMsg {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
  error?: string          // 生成失败原因
  fb?: Feedback           // 教练反馈(挂在用户消息上)
  fbState?: 'loading' | 'done' | 'error'
}

export interface SavedWord {
  id: string
  term: string
  meaning?: string        // 中文释义
  context?: string        // 例句 / 上下文
  source?: string         // 来源场景
  ts: number
  box: number             // SRS 阶段 0-6
  due: number             // 下次复习时间戳
  pos?: string            // 词性
  example?: string        // 英文例句
  exampleZh?: string
  collocations?: string[] // 常见搭配
}

export interface SessionRec {
  ts: number
  scenarioId: string
  title: string
  minutes: number
  msgs: number
}

export interface DayStat { minutes: number; msgs: number; drills: number }

export interface Progress {
  days: Record<string, DayStat> // key: YYYY-MM-DD
  sessions: SessionRec[]
}

export interface Settings {
  apiKey: string
  voiceURI: string
  rate: number       // 0.6 - 1.3
  level: Level
  autoTTS: boolean
  instantFB: boolean
  showZh: boolean
}

export interface DrillSentence { id: string; en: string; zh: string; tip?: string }

export type DrillGroup = 'function' | 'scene' | 'work' | 'native' | 'pron'

export interface DrillPack {
  id: string
  title: string
  zh: string
  emoji: string
  group: DrillGroup
  desc?: string
  sentences: DrillSentence[]
}

export type WordDiffStatus = 'ok' | 'sub' | 'miss'

export interface WordDiff { status: WordDiffStatus; target: string; said?: string }

export interface DrillResult { score: number; diff: WordDiff[]; extras: string[]; seconds: number; said: string }

// ===== AI 发音诊断 =====
export interface PronTip { word: string; ipa: string; problem: string; howto: string }
export interface PronPractice { en: string; zh: string; focus: string }
export interface PronDiagnosis { summary: string; diagnosis: PronTip[]; practice: PronPractice[] }
