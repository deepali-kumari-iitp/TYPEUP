
export function calculateTypingStats({
  typedWords = [],
  currentWord = '',
  words = [],
  elapsedSeconds = 0,
}) {
  // Normalize input values.
  const safeElapsed = Math.max(
    0,
    Number.isFinite(Number(elapsedSeconds))
      ? Number(elapsedSeconds)
      : 0
  )

  let totalTypedCharacters = 0
  let correctCharacters = 0

  // Calculate completed words and submitted spaces.
  typedWords.forEach((typed, index) => {
    const typedText = String(typed ?? '')
    const target = String(words[index] ?? '')

    totalTypedCharacters += typedText.length + 1

    for (let i = 0; i < typedText.length; i += 1) {
      if (typedText[i] === target[i]) {
        correctCharacters += 1
      }
    }

    // A submitted word includes its ending space.
    correctCharacters += 1
  })

  // Calculate the currently typed word.
  const currentTarget = String(
    words[typedWords.length] ?? ''
  )

  const safeCurrentWord = String(currentWord ?? '')

  totalTypedCharacters += safeCurrentWord.length

  for (let i = 0; i < safeCurrentWord.length; i += 1) {
    if (safeCurrentWord[i] === currentTarget[i]) {
      correctCharacters += 1
    }
  }

  // Calculate incorrect characters.
  const incorrectCharacters = Math.max(
    0,
    totalTypedCharacters - correctCharacters
  )

  // Calculate elapsed time in minutes.
  const elapsedMinutes = safeElapsed / 60

  // Calculate raw typing speed.
  const rawWpm =
    elapsedMinutes > 0
      ? totalTypedCharacters / 5 / elapsedMinutes
      : 0

  // Calculate net typing speed using correct characters.
  const netWpm =
    elapsedMinutes > 0
      ? correctCharacters / 5 / elapsedMinutes
      : 0

  // Calculate typing accuracy.
  const accuracy =
    totalTypedCharacters > 0
      ? (correctCharacters / totalTypedCharacters) * 100
      : 100

  return {
    totalTypedCharacters,
    correctCharacters,
    incorrectCharacters,
    rawWpm: Math.round(rawWpm),
    netWpm: Math.round(netWpm),
    accuracy: Math.round(accuracy),
  }
}
