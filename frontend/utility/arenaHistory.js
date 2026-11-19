
const STORAGE_KEY = 'typeup_arena_history'
const MAX_HISTORY = 100

export function getArenaHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return []
    }

    const history = JSON.parse(stored)

    return Array.isArray(history) ? history : []
  } catch {
    return []
  }
}

export function saveArenaResult(result) {
  if (!result || typeof result !== 'object') {
    throw new Error('A valid typing result is required.')
  }

  const history = getArenaHistory()

  const newResult = {
    id: crypto.randomUUID(),
    ...result,
    completedAt: new Date().toISOString(),
  }

  const updatedHistory = [
    newResult,
    ...history,
  ].slice(0, MAX_HISTORY)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedHistory)
  )

  return newResult
}

export function clearArenaHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
