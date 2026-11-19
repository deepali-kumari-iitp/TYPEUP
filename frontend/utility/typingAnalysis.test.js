
import { describe, expect, it } from 'vitest'
import { calculateTypingAnalysis } from './typingAnalysis.js'

describe('calculateTypingAnalysis', () => {
  it('identifies frequently mistyped keys', () => {
    const result = calculateTypingAnalysis({
      typedWords: ['hxllo'],
      targetWords: ['hello'],
      totalTypedCharacters: 5,
      correctCharacters: 4,
    })

    expect(result.weakKeys[0]).toEqual({
      key: 'e',
      errors: 1,
    })
  })

  it('calculates consistency from WPM samples', () => {
    const result = calculateTypingAnalysis({
      wpmSamples: [
        { second: 1, wpm: 30 },
        { second: 2, wpm: 30 },
        { second: 3, wpm: 30 },
      ],
    })

    expect(result.consistency.score).toBe(100)
    expect(result.consistency.label).toBe('Very consistent')
  })

  it('does not invent consistency without enough samples', () => {
    const result = calculateTypingAnalysis({
      wpmSamples: [{ second: 1, wpm: 30 }],
    })

    expect(result.consistency.score).toBeNull()
  })

  it('provides improvement suggestions', () => {
    const result = calculateTypingAnalysis({
      accuracy: 80,
      netWpm: 15,
      typedWords: ['hxllo'],
      targetWords: ['hello'],
      totalTypedCharacters: 5,
      correctCharacters: 4,
    })

    expect(result.suggestions.length).toBeGreaterThan(0)
  })
})
