
import { describe, it, expect } from 'vitest'
import { calculateTypingStats } from './typingStats.js'

describe('calculateTypingStats', () => {
  it('returns default stats for an empty test', () => {
    const result = calculateTypingStats({})

    expect(result).toEqual({
      totalTypedCharacters: 0,
      correctCharacters: 0,
      incorrectCharacters: 0,
      rawWpm: 0,
      netWpm: 0,
      accuracy: 100,
    })
  })

  it('calculates stats for correctly completed words', () => {
    const result = calculateTypingStats({
      typedWords: ['hello', 'world'],
      words: ['hello', 'world'],
      elapsedSeconds: 60,
    })

    expect(result.totalTypedCharacters).toBe(12)
    expect(result.correctCharacters).toBe(12)
    expect(result.incorrectCharacters).toBe(0)
    expect(result.rawWpm).toBe(2)
    expect(result.netWpm).toBe(2)
    expect(result.accuracy).toBe(100)
  })

  it('counts incorrect and extra characters', () => {
    const result = calculateTypingStats({
      typedWords: ['hello'],
      currentWord: 'typxx',
      words: ['hello', 'type'],
      elapsedSeconds: 60,
    })

    expect(result.totalTypedCharacters).toBe(11)
    expect(result.correctCharacters).toBe(9)
    expect(result.incorrectCharacters).toBe(2)
    expect(result.accuracy).toBe(82)
  })

  it('calculates stats for an incomplete word', () => {
    const result = calculateTypingStats({
      currentWord: 'hel',
      words: ['hello'],
      elapsedSeconds: 60,
    })

    expect(result.totalTypedCharacters).toBe(3)
    expect(result.correctCharacters).toBe(3)
    expect(result.incorrectCharacters).toBe(0)
    expect(result.accuracy).toBe(100)
  })

  it('handles zero elapsed time without division errors', () => {
    const result = calculateTypingStats({
      typedWords: ['hello'],
      words: ['hello'],
      elapsedSeconds: 0,
    })

    expect(result.rawWpm).toBe(0)
    expect(result.netWpm).toBe(0)
    expect(result.accuracy).toBe(100)
  })

  it('does not return negative net WPM', () => {
    const result = calculateTypingStats({
      typedWords: ['wrongword'],
      words: ['correct'],
      elapsedSeconds: 10,
    })

    expect(result.netWpm).toBeGreaterThanOrEqual(0)
  })
})
