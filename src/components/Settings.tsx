import { useEffect, useState } from 'react'
import type { Settings as SettingsT, Level } from '../lib/types'
import { completeJSON, aiModeHint } from '../lib/ai'
import { onVoicesReady, listEnglishVoices } from '../lib/speech'
import { Btn, Modal, Toggle } from '../ui'

interface Props {
  settings: SettingsT
  setSettings: (fn: (s: SettingsT) => SettingsT) => void
  onClose: () => void
}

const LEVELS: Level[] = ['A2', 'B1', 'B2', 'C1']
const LEVEL_DESC: Record<Level, string> = {
  A2: '入门 · 简单短句',
  B1: '进阶 · 日常流利',
  B2: '中高 · 职场自如',
  C1: '高级 · 接近母语'
}

export function SettingsPanel({ settings, setSettings, onClose }: Props) {
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [voicesReady, setVoicesReady] = useState(0)

  useEffect(() => onVoicesReady(() => setVoicesReady((n) => n + 1)), [])
  const voices = listEnglishVoices()

  async function testKey() {
    setTesting(true)
    setTestResult(null)
    try {
      await completeJSON(
        [{ role: 'user', content: 'Return JSON {"ok":true,"msg":"connection fine"}' }],
        { userKey: settings.apiKey, maxTokens: 30 }
      )
      setTestResult({ ok: true, msg: '连接成功,AI 已就绪 🎉' })
    } catch (e) {
      setTestResult({ ok: false, msg: e instanceof Error ? e.message : String(e) })
    } finally {
      setTesting(false)
    }
  }

  function exportData() {
    const data: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('sf.')) data[k] = JSON.parse(localStorage.getItem(k) || 'null')
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `speakflow-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">设置</h2>

      <section className="set-sec">
        <h3>DeepSeek API Key</h3>
        <p className="set-hint">
          两种方式任选:① 在下面粘贴(存于本浏览器);② 填入项目根目录 <code>.env</code> 的 <code>DEEPSEEK_API_KEY=</code> 后重启服务。
        </p>
        <div className="key-row">
          <input
            type={showKey ? 'text' : 'password'}
            value={settings.apiKey}
            onChange={(e) => { setSettings((s) => ({ ...s, apiKey: e.target.value.trim() })); setTestResult(null) }}
            placeholder="sk-..."
            spellCheck={false}
            autoComplete="off"
          />
          <Btn variant="ghost" size="sm" onClick={() => setShowKey((v) => !v)}>{showKey ? '隐藏' : '显示'}</Btn>
        </div>
        <div className="key-row">
          <Btn variant="soft" size="sm" onClick={testKey} disabled={testing || !settings.apiKey}>
            {testing ? '测试中…' : '测试连接'}
          </Btn>
          <span className={`ai-status ${testResult?.ok ? 'ok' : ''}`}>{aiModeHint()}</span>
        </div>
        {testResult && <div className={testResult.ok ? 'rec-ok' : 'rec-err'}>{testResult.msg}</div>}
      </section>

      <section className="set-sec">
        <h3>英语水平(AI 会据此调整语速与词汇)</h3>
        <div className="lvl-row">
          {LEVELS.map((l) => (
            <button
              key={l}
              className={`lvl-btn ${settings.level === l ? 'on' : ''}`}
              onClick={() => setSettings((s) => ({ ...s, level: l }))}
            >
              <b>{l}</b><span>{LEVEL_DESC[l]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="set-sec">
        <h3>朗读语音</h3>
        <select
          value={settings.voiceURI}
          onChange={(e) => setSettings((s) => ({ ...s, voiceURI: e.target.value }))}
        >
          <option value="">自动选择(系统默认英语)</option>
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
          ))}
        </select>
        {!voices.length && <p className="set-hint">没有检测到英语语音包,朗读可能不可用。</p>}
        <div className="rate-row">
          <span className="toggle-label">语速</span>
          <input
            type="range" min={0.6} max={1.3} step={0.05} value={settings.rate}
            onChange={(e) => setSettings((s) => ({ ...s, rate: Number(e.target.value) }))}
          />
          <b>{settings.rate.toFixed(2)}x</b>
        </div>
      </section>

      <section className="set-sec">
        <h3>学习偏好</h3>
        <Toggle
          checked={settings.autoTTS}
          onChange={(v) => setSettings((s) => ({ ...s, autoTTS: v }))}
          label="自动朗读 AI 回复"
          hint="像真实对话一样,听到对方说话"
        />
        <Toggle
          checked={settings.instantFB}
          onChange={(v) => setSettings((s) => ({ ...s, instantFB: v }))}
          label="即时教练点评"
          hint="每次发言后自动给出更正、地道表达和评分"
        />
        <Toggle
          checked={settings.showZh}
          onChange={(v) => setSettings((s) => ({ ...s, showZh: v }))}
          label="显示中文翻译"
          hint="跟读句子下方的中文释义"
        />
      </section>

      <section className="set-sec">
        <h3>数据</h3>
        <p className="set-hint">所有学习数据只保存在本机浏览器中,不会上传。</p>
        <div className="key-row">
          <Btn variant="ghost" size="sm" onClick={exportData}>导出备份 (JSON)</Btn>
          <Btn
            variant="danger" size="sm"
            onClick={() => {
              if (confirm('确定清空全部学习数据(对话、生词、进度)?此操作不可恢复。')) {
                Object.keys(localStorage).filter((k) => k.startsWith('sf.')).forEach((k) => localStorage.removeItem(k))
                location.reload()
              }
            }}
          >
            清空全部数据
          </Btn>
        </div>
      </section>
      <div style={{ height: 8 }} data-voices={voicesReady} />
    </Modal>
  )
}
