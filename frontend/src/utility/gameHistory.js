
const STORAGE_KEY = 'typeup_game_history'
const MAX_HISTORY = 100

export function getGameHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return []

    const history = JSON.parse(stored)

    return Array.isArray(history) ? history : []
  } catch {
    return []
  }
}

export function saveGameResult(result) {
  if (!result || typeof result !== 'object') {
    throw new Error('A valid game result is required.')
  }

  const validGames = [
    'word-rush',
    'key-challenge',
    'accuracy',
    'speed-sprint',
  ]

  if (!validGames.includes(result.gameId)) {
    throw new Error('Invalid game type.')
  }

  const score = Number(result.score)
  const accuracy = Number(result.accuracy)
  const mistakes = Number(result.mistakes)
  const duration = Number(result.duration)

  if (
    !Number.isFinite(score) ||
    score < 0 ||
    !Number.isFinite(accuracy) ||
    accuracy < 0 ||
    accuracy > 100 ||
    !Number.isFinite(mistakes) ||
    mistakes < 0 ||
    !Number.isFinite(duration) ||
    duration < 0
  ) {
    throw new Error('Invalid game result values.')
  }

  const history = getGameHistory()

  const newResult = {
    id: crypto.randomUUID(),
    gameId: result.gameId,
    gameName: result.gameName,
    score,
    accuracy,
    mistakes,
    duration,
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

export function getBestGameScores() {
  const history = getGameHistory()
  const bestScores = {}

  history.forEach((result) => {
    const currentBest = bestScores[result.gameId]

    if (!currentBest || result.score > currentBest.score) {
      bestScores[result.gameId] = result
    }
  })

  return bestScores
}

export function clearGameHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
