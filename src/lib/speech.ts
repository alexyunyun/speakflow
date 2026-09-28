// ===== 浏览器语音:识别(SpeechRecognition)与合成(speechSynthesis)封装 =====

// --- TypeScript 声明(Web Speech API 不在标准 DOM lib 里) ---
interface SRResultItem { transcript: string; confidence: number }
interface SRResult { isFinal: boolean; length: number; [i: number]: SRResultItem }
interface SRResultList { length: number; [i: number]: SRResult }
interface SREvent extends Event { results: SRResultList; resultIndex: number }
interface SRErrorEvent extends Event { error: string }
interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SREvent) => void) | null
  onerror: ((e: SRErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}
type SRCtor = new () => SpeechRecognitionLike

const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor }

export const SRSupported = Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)

export type RecHandler = {
  onFinal?: (text: string) => void
  onInterim?: (text: string) => void
  onError?: (kind: 'denied' | 'no-speech' | 'network' | 'other', detail?: string) => void
}

/** 按住/点按式识别器:调 start 开始,调 stop 结束并拿到最终文本 */
export class Recognizer {
  private rec: SpeechRecognitionLike | null = null
  private active = false
  private finalText = ''

  constructor(private handler: RecHandler) {}

  get isActive() { return this.active }

  start() {
    if (this.active) return
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Ctor) { this.handler.onError?.('other', '此浏览器不支持语音识别,建议使用 Chrome'); return }
    this.finalText = ''
    const rec = new Ctor()
    this.rec = rec
    rec.lang = 'en-US'
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        const t = r[0]?.transcript || ''
        if (r.isFinal) this.finalText += (this.finalText ? ' ' : '') + t.trim()
        else interim += t
      }
      if (interim) this.handler.onInterim?.(interim.trim())
      else this.handler.onInterim?.('')
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        this.active = false
        this.handler.onError?.('denied')
      } else if (e.error === 'network') {
        this.active = false
        this.handler.onError?.('network')
      } else if (e.error === 'no-speech' || e.error === 'aborted') {
        // 静默,等待用户停止
      } else {
        this.handler.onError?.('other', e.error)
      }
    }
    rec.onend = () => {
      // Chrome 会周期性断流:只要用户没停,就自动续上
      if (this.active) {
        try { rec.start() } catch { /* 竞态时忽略 */ }
      } else {
        this.handler.onInterim?.('')
      }
    }

    this.active = true
    try {
      rec.start()
    } catch (err) {
      this.active = false
      this.handler.onError?.('other', String(err))
    }
  }

  stop(): string {
    this.active = false
    try { this.rec?.stop() } catch { /* ignore */ }
    return this.finalText.trim()
  }

  abort() {
    this.active = false
    try { this.rec?.abort() } catch { /* ignore */ }
  }
}

// ===== TTS =====

let voices: SpeechSynthesisVoice[] = []
const voiceListeners = new Set<() => void>()

export function onVoicesReady(cb: () => void): () => void {
  voiceListeners.add(cb)
  if (voices.length) cb()
  else loadVoices()
  return () => voiceListeners.delete(cb)
}

function loadVoices() {
  if (!('speechSynthesis' in window)) return
  const vs = speechSynthesis.getVoices()
  if (vs.length) {
    voices = vs
    voiceListeners.forEach((cb) => cb())
  }
}

if ('speechSynthesis' in window) {
  loadVoices()
  speechSynthesis.onvoiceschanged = () => loadVoices()
}

export function listEnglishVoices(): SpeechSynthesisVoice[] {
  return voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
}

function pickVoice(voiceURI: string): SpeechSynthesisVoice | undefined {
  const en = listEnglishVoices()
  if (voiceURI) {
    const hit = en.find((v) => v.voiceURI === voiceURI)
    if (hit) return hit
  }
  return en.find((v) => /en[-_]US/i.test(v.lang) && /natural|neural|siri|google/i.test(v.name))
      || en.find((v) => /en[-_]US/i.test(v.lang))
      || en[0]
}

export function speak(text: string, opts: { voiceURI?: string; rate?: number } = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window) || !text.trim()) return resolve()
    speechSynthesis.cancel()
    // 长文本按句切分,避免 Chrome 中途静音
    const chunks = splitForTTS(text)
    let i = 0
    const next = () => {
      if (i >= chunks.length) return resolve()
      const u = new SpeechSynthesisUtterance(chunks[i++])
      const v = pickVoice(opts.voiceURI || '')
      if (v) { u.voice = v; u.lang = v.lang } else u.lang = 'en-US'
      u.rate = opts.rate ?? 1
      u.onend = next
      u.onerror = () => resolve()
      speechSynthesis.speak(u)
    }
    next()
  })
}

function splitForTTS(text: string): string[] {
  const parts = text.split(/(?<=[.!?;:])\s+/)
  const out: string[] = []
  let buf = ''
  for (const p of parts) {
    if ((buf + ' ' + p).length > 180) { if (buf) out.push(buf.trim()); buf = p } else buf += ' ' + p
  }
  if (buf.trim()) out.push(buf.trim())
  return out.length ? out : [text]
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel()
}
