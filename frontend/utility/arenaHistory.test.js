
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import {
  getArenaHistory,
  saveArenaResult,
  clearArenaHistory,
} from './arenaHistory.js'

const STORAGE_KEY = 'typeup_arena_history'

function createLocalStorageMock() {
  const storage = {}

  return {
    getItem: vi.fn((key) => storage[key] ?? null),

    setItem: vi.fn((key, value) => {
      storage[key] = String(value)
    }),

    removeItem: vi.fn((key) => {
      delete storage[key]
    }),
  }
}

describe('Arena History', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns an empty array when history does not exist', () => {
    expect(getArenaHistory()).toEqual([])
  })

  it('saves a typing result successfully', () => {
    const result = saveArenaResult({
      netWpm: 50,
      rawWpm: 54,
      accuracy: 99,
      errors: 1,
      duration: 30,
    })

    expect(result.netWpm).toBe(50)
    expect(result.rawWpm).toBe(54)
    expect(result.accuracy).toBe(99)
    expect(result.errors).toBe(1)
    expect(result.duration).toBe(30)
    expect(result.id).toBeTruthy()
    expect(result.completedAt).toBeTruthy()
  })

  it('retrieves previously saved results', () => {
    saveArenaResult({
      netWpm: 45,
      rawWpm: 48,
      accuracy: 96,
      errors: 2,
      duration: 30,
    })

    const history = getArenaHistory()

    expect(history).toHaveLength(1)
    expect(history[0].netWpm).toBe(45)
  })

  it('keeps the newest result first', () => {
    saveArenaResult({ netWpm: 30 })
    saveArenaResult({ netWpm: 50 })

    const history = getArenaHistory()

    expect(history[0].netWpm).toBe(50)
    expect(history[1].netWpm).toBe(30)
  })

  it('limits history to the latest 100 results', () => {
    for (let i = 1; i <= 105; i += 1) {
      saveArenaResult({ netWpm: i })
    }

    const history = getArenaHistory()

    expect(history).toHaveLength(100)
    expect(history[0].netWpm).toBe(105)
    expect(history[99].netWpm).toBe(6)
  })

  it('returns an empty array for invalid stored JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json')

    expect(getArenaHistory()).toEqual([])
  })

  it('clears all saved history', () => {
    saveArenaResult({ netWpm: 40 })

    clearArenaHistory()

    expect(getArenaHistory()).toEqual([])
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
  })

  it('rejects an invalid result', () => {
    expect(() => saveArenaResult(null)).toThrow(
      'A valid typing result is required.'
    )
  })
})
