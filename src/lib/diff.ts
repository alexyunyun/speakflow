import type { WordDiff, DrillResult } from './types'

// ===== 跟读打分:目标句 vs 识别结果,逐词对齐(LCS)=====

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'’\s]/g, ' ')
    .replace(/[’]/g, "'")
    .split(/\s+/)
    .filter(Boolean)
}

export function scoreReading(target: string, said: string, seconds: number): DrillResult {
  const t = tokenize(target)
  const s = tokenize(said)

  // LCS 动态规划
  const m = t.length, n = s.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = t[i] === s[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const diff: WordDiff[] = []
  const extras: string[] = []
  let ok = 0
  let i = 0, j = 0
  while (i < m && j < n) {
    if (t[i] === s[j]) { diff.push({ status: 'ok', target: t[i] }); ok++; i++; j++ }
    else if (dp[i + 1][j] > dp[i][j + 1]) { diff.push({ status: 'miss', target: t[i] }); i++ }
    else if (dp[i + 1][j] < dp[i][j + 1]) { extras.push(s[j]); j++ }
    else if (i + 1 < m && j + 1 < n && t[i + 1] === s[j + 1]) {
      // 平局且下一个词两边都能对上 → 判为读错(替换)
      diff.push({ status: 'sub', target: t[i], said: s[j] }); i++; j++
    }
    else { diff.push({ status: 'miss', target: t[i] }); i++ }
  }
  while (i < m) { diff.push({ status: 'miss', target: t[i] }); i++ }
  while (j < n) { extras.push(s[j]); j++ }

  const score = t.length === 0 ? 0 : Math.round((ok / t.length) * 100)
  return { score, diff, extras, seconds: Math.round(seconds), said: said.trim() }
}

export function scoreColor(score: number): string {
  if (score >= 90) return 'var(--green)'
  if (score >= 70) return 'var(--amber)'
  return 'var(--red)'
}
