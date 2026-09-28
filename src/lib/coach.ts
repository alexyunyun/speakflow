import type { ChatMsgInput } from './ai'
import type { Scenario, Level, Feedback, SavedWord, DrillSentence, PronDiagnosis } from './types'

// ===== 提示词构造:对话人格、教练反馈、场景生成、单词讲解、句子生成 =====

const LEVEL_NOTE: Record<Level, string> = {
  A2: 'Use very common everyday words and short simple sentences (CEFR A2). Speak slowly and simply.',
  B1: 'Use everyday vocabulary with occasional common idioms (CEFR B1). Keep sentences short and natural.',
  B2: 'Use a rich but natural vocabulary, including idioms and phrasal verbs (CEFR B2).',
  C1: 'Speak like an articulate native speaker with idioms, nuance and natural rhythm (CEFR C1).'
}

export function chatSystemPrompt(scenario: Scenario, level: Level): string {
  return [
    `You are "${scenario.persona}"`,
    `You are roleplaying a real-life conversation so the learner can practice SPOKEN English.`,
    `Rules:`,
    `- Always reply in English only. Never switch to Chinese, never explain grammar in the conversation.`,
    `- Keep every reply SHORT: 1 to 3 sentences, exactly like real speech. Never write lists or bullet points.`,
    `- Ask a natural follow-up question most of the time to keep the conversation going.`,
    `- ${LEVEL_NOTE[level]}`,
    `- Stay in character no matter what. If the learner seems stuck or replies in Chinese, gently rephrase your last question in simpler English.`,
    `- Never correct the learner inside the conversation; a separate coach analyzes their messages.`,
    scenario.custom ? `- This is a custom scenario created by the learner: "${scenario.title} — ${scenario.desc}". Invent realistic details as needed.` : ``
  ].filter(Boolean).join('\n')
}

export function feedbackMessages(scenario: Scenario, level: Level, history: ChatMsgInput[]): ChatMsgInput[] {
  const system = [
    'You are an expert English speaking coach for Chinese learners. Analyze the learner\'s LAST message in the conversation provided by the user.',
    'Requirements:',
    '- corrected: rewrite the learner\'s last message so a confident native speaker would say the same thing. Keep their meaning and tone, fix grammar, word choice and unnatural phrasing.',
    '- issues: at most 3 items. Each has type (grammar|word|phrase), original (exact fragment from the learner), fix (improved fragment), note (one short sentence in Chinese explaining why).',
    '- natural: up to 3 alternative ways to express the same idea, more natural, idiomatic or advanced than the corrected version. English only.',
    '- score: integer 0-100. 70 = understandable but with clear errors; 85 = minor issues; 95+ = native-like.',
    '- praise: one short encouraging sentence in Chinese.',
    '- If the learner\'s message is already natural, set corrected equal to the original, issues = [], and still try to offer 1-3 natural upgrades.',
    'Respond ONLY with a JSON object: {"corrected": string, "score": number, "issues": [{"type": "grammar|word|phrase", "original": string, "fix": string, "note": string}], "natural": [string], "praise": string}'
  ].join('\n')

  const user = JSON.stringify({
    scenario: `${scenario.title} (${scenario.zh})`,
    learnerLevel: level,
    recentConversation: history.slice(-6),
    instruction: 'Analyze the LAST user message above and respond with JSON only.'
  })

  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ]
}

export function parseFeedback(raw: unknown): Feedback {
  const o = raw as Partial<Feedback>
  return {
    corrected: String(o.corrected || ''),
    score: Math.max(0, Math.min(100, Math.round(Number(o.score) || 0))),
    issues: Array.isArray(o.issues)
      ? o.issues.slice(0, 3).map((i) => ({
          type: (['grammar', 'word', 'phrase'] as const).includes(i.type) ? i.type : 'grammar',
          original: String(i.original || ''),
          fix: String(i.fix || ''),
          note: String(i.note || '')
        }))
      : [],
    natural: Array.isArray(o.natural) ? o.natural.slice(0, 3).map(String) : [],
    praise: o.praise ? String(o.praise) : undefined
  }
}

// ===== AI 生成自定义场景 =====
export interface GeneratedScenario {
  title: string; zh: string; emoji: string; level: Level; desc: string
  persona: string; opener: string
  phrases: { en: string; zh: string }[]
  vocab: { en: string; zh: string }[]
}

export function scenarioGenMessages(topic: string): ChatMsgInput[] {
  const system = [
    'You are a scenario designer for an English speaking-practice app used by Chinese learners.',
    'Given a topic, design ONE realistic roleplay scenario. Respond ONLY with JSON:',
    '{"title": "short English scenario title", "zh": "中文场景名", "emoji": "one relevant emoji", "level": "A2|B1|B2|C1 (fit an intermediate learner)", "desc": "30字以内的中文描述", "persona": "2-3 sentences in English describing who the AI plays and the setting", "opener": "the AI character\'s natural first line in English", "phrases": [{"en": "useful sentence", "zh": "中文"}] (exactly 6 key phrases), "vocab": [{"en": "word or phrase", "zh": "中文"}] (exactly 8 items)}'
  ].join('\n')
  return [
    { role: 'system', content: system },
    { role: 'user', content: `Topic: ${topic}` }
  ]
}

// ===== 生词 AI 讲解 =====
export interface WordExplain {
  meaning: string; pos: string; example: string; exampleZh: string; collocations: string[]
}

export function wordExplainMessages(word: string, context?: string): ChatMsgInput[] {
  const system = [
    'You are a vocabulary tutor for Chinese learners of English. Explain ONE English word or phrase.',
    'Respond ONLY with JSON: {"meaning": "简洁中文释义(可多个义项)", "pos": "词性如 n./v./adj./phr.", "example": "one natural English sentence using it", "exampleZh": "例句中文翻译", "collocations": ["3-5 common collocations or related phrases"]}'
  ].join('\n')
  return [
    { role: 'system', content: system },
    { role: 'user', content: JSON.stringify({ word, context: context || '' }) }
  ]
}

export function parseWordExplain(raw: unknown): WordExplain {
  const o = raw as Partial<WordExplain>
  return {
    meaning: String(o.meaning || ''),
    pos: String(o.pos || ''),
    example: String(o.example || ''),
    exampleZh: String(o.exampleZh || ''),
    collocations: Array.isArray(o.collocations) ? o.collocations.slice(0, 5).map(String) : []
  }
}

// ===== 跟读新句子生成 =====
export function drillGenMessages(topicHint: string, level: Level): ChatMsgInput[] {
  const system = [
    'You generate ONE English sentence for shadowing/pronunciation practice.',
    `Level: ${LEVEL_NOTE[level]}`,
    'Respond ONLY with JSON: {"en": "the sentence, 8-20 words, natural spoken English", "zh": "准确的中文翻译"}'
  ].join('\n')
  return [
    { role: 'system', content: system },
    { role: 'user', content: `Topic hint: ${topicHint || 'daily life'}` }
  ]
}

export function parseDrill(raw: unknown): DrillSentence {
  const o = raw as Partial<DrillSentence>
  return {
    id: `ai-${Date.now()}`,
    en: String(o.en || '').trim(),
    zh: String(o.zh || '').trim()
  }
}

// ===== AI 发音诊断 =====
// 说明:浏览器语音识别会自动"脑补"错音,诊断只能基于识别 diff 推测最可能的问题,
// 所以提示词要求 AI 用"可能/大概率"的口吻,并给出口型要点和针对性练习。
export function pronDiagnosisMessages(target: string, said: string, problems: string[]): ChatMsgInput[] {
  const system = [
    'You are an English pronunciation coach (accent diagnostician) for native Chinese speakers.',
    'The learner read a target sentence aloud. Speech recognition compared it word by word:',
    'missing = the word likely got swallowed or merged, replaced = likely mispronounced and recognized as another word.',
    'Note ASR diffs are imperfect evidence: frame findings as likely issues, not certainties.',
    'For each problematic word: give IPA, name the specific sound(s) Chinese speakers usually get wrong there, and one practical mouth-position tip in Chinese (舌尖/口型/声带/送气).',
    'Also give up to 3 short practice sentences that drill those exact sounds, each labeled with the target sound.',
    'Respond ONLY with JSON:',
    '{"summary": "中文一句话总评", "diagnosis": [{"word": "target word", "ipa": "/ˈeksɑːmpəl/", "problem": "中文描述可能的问题", "howto": "中文口型要点"}] (max 4, only for the flagged words), "practice": [{"en": "practice sentence", "zh": "中文翻译", "focus": "/θ/ TH 咬舌音"}] (max 3)}'
  ].join('\n')
  return [
    { role: 'system', content: system },
    {
      role: 'user',
      content: JSON.stringify({ target, recognizedAs: said || '(识别为空,可能整句都没读出来)', problemWords: problems })
    }
  ]
}

export function parsePronDiagnosis(raw: unknown): PronDiagnosis {
  const o = raw as Partial<PronDiagnosis>
  return {
    summary: String(o.summary || ''),
    diagnosis: Array.isArray(o.diagnosis)
      ? o.diagnosis.slice(0, 4).map((d) => ({
          word: String(d.word || ''),
          ipa: String(d.ipa || ''),
          problem: String(d.problem || ''),
          howto: String(d.howto || '')
        }))
      : [],
    practice: Array.isArray(o.practice)
      ? o.practice.slice(0, 3).map((p) => ({
          en: String(p.en || ''),
          zh: String(p.zh || ''),
          focus: String(p.focus || '')
        }))
      : []
  }
}
