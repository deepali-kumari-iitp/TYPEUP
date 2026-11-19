
function getCharacterErrors(typedWords = [], targetWords = []) {
  const errors = {}

  typedWords.forEach((typedWord, wordIndex) => {
    const typed = String(typedWord ?? '')
    const target = String(targetWords[wordIndex] ?? '')

    const maxLength = Math.max(typed.length, target.length)

    for (let index = 0; index < maxLength; index += 1) {
      const typedCharacter = typed[index]
      const targetCharacter = target[index]

      if (typedCharacter !== targetCharacter) {
        const key = targetCharacter || typedCharacter

        if (key) {
          errors[key] = (errors[key] || 0) + 1
        }
      }
    }
  })

  return errors
}

function calculateConsistency(samples = []) {
  // Only measure active typing periods.
  const validSamples = samples
    .map((sample) => Number(sample?.wpm))
    .filter((wpm) => Number.isFinite(wpm) && wpm > 0)

  if (validSamples.length < 2) {
    return {
      score: null,
      variation: null,
      label: 'Not enough data',
    }
  }

  const average =
    validSamples.reduce((sum, value) => sum + value, 0) /
    validSamples.length

  const variance =
    validSamples.reduce(
      (sum, value) => sum + (value - average) ** 2,
      0
    ) / validSamples.length

  const standardDeviation = Math.sqrt(variance)

  const coefficientOfVariation =
    (standardDeviation / average) * 100

  const score = Math.max(
    0,
    Math.min(100, Math.round(100 - coefficientOfVariation))
  )

  return {
    score,
    variation: Math.round(standardDeviation * 10) / 10,
    label:
      score >= 85
        ? 'Very consistent'
        : score >= 70
          ? 'Consistent'
          : score >= 50
            ? 'Variable speed'
            : 'Needs improvement',
  }
}

function calculateSpeedTrend(samples = []) {
  return samples
    .filter((sample) => {
      const second = Number(sample?.second)
      const wpm = Number(sample?.wpm)

      return (
        Number.isFinite(second) &&
        Number.isFinite(wpm) &&
        second > 0 &&
        wpm > 0
      )
    })
    .map((sample) => ({
      second: Number(sample.second),
      wpm: Number(sample.wpm),
    }))
    .sort((a, b) => a.second - b.second)
}

function generateSuggestions({
  accuracy = 100,
  netWpm = 0,
  weakKeys = [],
  consistency = null,
}) {
  const suggestions = []

  if (accuracy < 90) {
    suggestions.push({
      title: 'Improve typing accuracy',
      description:
        'Slow down slightly and focus on pressing the correct keys before increasing your speed.',
      priority: 'high',
    })
  } else if (accuracy < 97) {
    suggestions.push({
      title: 'Refine your accuracy',
      description:
        'You are doing well. Focus on reducing small typing mistakes.',
      priority: 'medium',
    })
  }

  if (netWpm < 20) {
    suggestions.push({
      title: 'Build your typing foundation',
      description:
        'Practice common words daily and focus on correct finger placement.',
      priority: 'high',
    })
  } else if (netWpm < 40) {
    suggestions.push({
      title: 'Increase your typing speed',
      description:
        'Try short, consistent practice sessions while maintaining accuracy.',
      priority: 'medium',
    })
  }

  if (weakKeys.length > 0) {
    suggestions.push({
      title: `Practice the "${weakKeys[0].key}" key`,
      description:
        `This key caused ${weakKeys[0].errors} typing error(s). Give it extra practice.`,
      priority: 'medium',
    })
  }

  if (consistency !== null && consistency < 70) {
    suggestions.push({
      title: 'Work on typing consistency',
      description:
        'Try maintaining a steady rhythm instead of typing in sudden bursts.',
      priority: 'medium',
    })
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: 'Keep building your skills',
      description:
        'Your performance looks strong. Continue practising regularly to maintain your progress.',
      priority: 'low',
    })
  }

  return suggestions
}

export function calculateTypingAnalysis({
  typedWords = [],
  targetWords = [],
  wpmSamples = [],
  accuracy = 100,
  netWpm = 0,
  totalTypedCharacters = 0,
  correctCharacters = 0,
} = {}) {
  // Normalize incoming numeric values.
  const safeAccuracy = Number.isFinite(Number(accuracy))
    ? Math.max(0, Math.min(100, Number(accuracy)))
    : 100

  const safeNetWpm = Number.isFinite(Number(netWpm))
    ? Math.max(0, Number(netWpm))
    : 0

  const safeTotalCharacters = Number.isFinite(
    Number(totalTypedCharacters)
  )
    ? Math.max(0, Number(totalTypedCharacters))
    : 0

  const safeCorrectCharacters = Number.isFinite(
    Number(correctCharacters)
  )
    ? Math.max(
        0,
        Math.min(safeTotalCharacters, Number(correctCharacters))
      )
    : 0

  // Character-level error analysis.
  const characterErrors = getCharacterErrors(
    typedWords,
    targetWords
  )

  const weakKeys = Object.entries(characterErrors)
    .map(([key, errors]) => ({
  key,
  errors,
}))
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 10)

  const incorrectCharacters = Math.max(
    0,
    safeTotalCharacters - safeCorrectCharacters
  )

  // Speed and consistency analysis.
  const consistencyResult = calculateConsistency(wpmSamples)
  const speedTrend = calculateSpeedTrend(wpmSamples)

  // Personalized improvement suggestions.
  const suggestions = generateSuggestions({
    accuracy: safeAccuracy,
    netWpm: safeNetWpm,
    weakKeys,
    consistency: consistencyResult.score,
  })

  const hasDetailedData =
    typedWords.length > 0 ||
    speedTrend.length > 0 ||
    safeTotalCharacters > 0

  return {
    characterErrors,
    weakKeys,
    totalTypedCharacters: safeTotalCharacters,
    correctCharacters: safeCorrectCharacters,
    incorrectCharacters,
    accuracy: safeAccuracy,
    netWpm: safeNetWpm,
    consistency: consistencyResult,
    speedTrend,
    suggestions,
    hasDetailedData,
  }
}
