
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  RotateCcw,
  CheckCircle2,
  Keyboard,
  Target,
} from 'lucide-react'
import './TypingPractice.css'

const WORD_BANK = [
  'the', 'quick', 'brown', 'fox', 'jump', 'over', 'lazy', 'dog',
  'apple', 'water', 'light', 'green', 'house', 'small', 'happy',
  'learn', 'focus', 'write', 'read', 'think', 'world', 'dream',
  'hello', 'great', 'smart', 'music', 'table', 'chair', 'paper',
  'plant', 'river', 'cloud', 'stone', 'bread', 'smile', 'today',
  'night', 'early', 'fresh', 'clean', 'bright', 'story', 'friend',
  'school', 'typing', 'skill', 'practice', 'simple', 'strong',
  'keyboard', 'screen', 'speed', 'accuracy', 'finger', 'space',
  'orange', 'purple', 'yellow', 'flower', 'garden', 'travel',
]

function generateWords(count = 40) {
  const shuffled = [...WORD_BANK]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return Array.from(
    { length: count },
    (_, index) => shuffled[index % shuffled.length]
  )
}

function TypingPractice({
  title = 'Your first typing exercise',
  description = 'Type the words directly below. Focus on accuracy.',
  targetText,
  onComplete,
  onRestart,
}) {
  const inputRef = useRef(null)
  const targetRef = useRef(null)
  const activeWordRef = useRef(null)
  const startedAtRef = useRef(null)
  const completedRef = useRef(false)

  const isLessonPractice =
    typeof targetText === 'string' && targetText.trim().length > 0

  const sourceWords = useMemo(() => {
    return isLessonPractice
      ? targetText.trim().split(/\s+/)
      : generateWords()
  }, [targetText, isLessonPractice])

  const [words, setWords] = useState(sourceWords)
  const [typedWords, setTypedWords] = useState([])
  const [currentWord, setCurrentWord] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [finished, setFinished] = useState(false)
  const [feedback, setFeedback] = useState('')

  const currentIndex = typedWords.length

  useEffect(() => {
    setWords(sourceWords)
    setTypedWords([])
    setCurrentWord('')
    setStartedAt(null)
    setElapsedSeconds(0)
    setFinished(false)
    setFeedback('')

    startedAtRef.current = null
    completedRef.current = false
  }, [sourceWords])

  const correctCharacters = useMemo(() => {
    return typedWords.reduce(
      (total, typed, index) => {
        const target = words[index] || ''
        return total + [...typed].filter(
          (character, charIndex) =>
            character === target[charIndex]
        ).length
      },
      0
    ) + [...currentWord].filter(
      (character, index) =>
        character === (words[currentIndex] || '')[index]
    ).length
  }, [typedWords, currentWord, words, currentIndex])

  const totalTypedCharacters =
    typedWords.reduce((total, word) => total + word.length, 0) +
    currentWord.length

  const accuracy =
    totalTypedCharacters > 0
      ? Math.round(
          (correctCharacters / totalTypedCharacters) * 100
        )
      : null

  const wpm =
    elapsedSeconds > 0
      ? Math.round(correctCharacters / 5 / (elapsedSeconds / 60))
      : 0

  function startTimerIfNeeded() {
    if (startedAtRef.current === null) {
      const now = Date.now()
      startedAtRef.current = now
      setStartedAt(now)
    }
  }

  useEffect(() => {
    if (!startedAt || finished) return undefined

    const timerId = window.setInterval(() => {
      setElapsedSeconds((Date.now() - startedAt) / 1000)
    }, 250)

    return () => window.clearInterval(timerId)
  }, [startedAt, finished])

  useEffect(() => {
    const container = targetRef.current
    const activeWord = activeWordRef.current

    if (!container || !activeWord) return undefined

    const animationId = window.requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect()
      const wordRect = activeWord.getBoundingClientRect()

      if (wordRect.bottom > containerRect.bottom - 20) {
        container.scrollBy({
          top: wordRect.bottom - containerRect.bottom + 20,
          behavior: 'smooth',
        })
      } else if (wordRect.top < containerRect.top + 20) {
        container.scrollBy({
          top: wordRect.top - containerRect.top - 20,
          behavior: 'smooth',
        })
      }
    })

    return () => window.cancelAnimationFrame(animationId)
  }, [currentIndex, words])

  function finishExercise(finalWord) {
    if (completedRef.current) return

    completedRef.current = true

    const completedAt = Date.now()
    const startTime = startedAtRef.current ?? completedAt
    const duration = Math.max(
      (completedAt - startTime) / 1000,
      0.001
    )

    const finalTypedWords = [...typedWords, finalWord]
    const finalCharacters = finalTypedWords.reduce(
      (total, word) => total + word.length,
      0
    )

    const finalCorrectCharacters = finalTypedWords.reduce(
      (total, word, index) => {
        const expected = words[index] || ''
        return total + [...word].filter(
          (character, charIndex) =>
            character === expected[charIndex]
        ).length
      },
      0
    )

    const finalAccuracy = finalCharacters > 0
      ? Math.round(
          (finalCorrectCharacters / finalCharacters) * 100
        )
      : 100

    const finalWpm = Math.round(
      finalCorrectCharacters / 5 / (duration / 60)
    )

    setTypedWords(finalTypedWords)
    setCurrentWord('')
    setElapsedSeconds(duration)
    setFinished(true)
    setFeedback('')

    onComplete?.({
      accuracy: finalAccuracy,
      wpm: finalWpm,
      elapsedSeconds: duration,
      totalWords: words.length,
    })
  }

  function handleKeyDown(event) {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.key === 'Tab' ||
      event.isComposing
    ) {
      return
    }

    if (finished) {
      event.preventDefault()
      return
    }

    if (event.key === 'Backspace') {
      event.preventDefault()
      setFeedback('')

      if (currentWord.length > 0) {
        setCurrentWord((previous) => previous.slice(0, -1))
      } else if (typedWords.length > 0) {
        const previousWord = typedWords[typedWords.length - 1]
        setTypedWords((previous) => previous.slice(0, -1))
        setCurrentWord(previousWord)
      }

      return
    }

    if (event.key === ' ') {
      event.preventDefault()

      if (!currentWord.length) return

      const expectedWord = words[currentIndex]

      if (currentWord !== expectedWord) {
        setFeedback('This word is not correct yet. Fix it and try again.')
        return
      }

      setFeedback('')
      setTypedWords((previous) => [...previous, currentWord])
      setCurrentWord('')
      return
    }

    if (event.key.length === 1) {
      event.preventDefault()

      const expectedWord = words[currentIndex]
      if (!expectedWord) return

      startTimerIfNeeded()
      setFeedback('')

      const nextWord = currentWord + event.key

      // Automatically finish as soon as the final word is correct.
      if (
        currentIndex === words.length - 1 &&
        nextWord === expectedWord
      ) {
        finishExercise(nextWord)
        return
      }

      setCurrentWord(nextWord)
    }
  }

  function handleRestart() {
    const nextWords = isLessonPractice
      ? sourceWords
      : generateWords()

    setWords(nextWords)
    setTypedWords([])
    setCurrentWord('')
    setStartedAt(null)
    setElapsedSeconds(0)
    setFinished(false)
    setFeedback('')

    startedAtRef.current = null
    completedRef.current = false

    targetRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    onRestart?.()
    inputRef.current?.focus()
  }

  function renderWord(word, wordIndex) {
    const isCurrent = wordIndex === currentIndex
    const isCompleted = wordIndex < currentIndex

    const typed = isCurrent
      ? currentWord
      : isCompleted
        ? typedWords[wordIndex] || ''
        : ''

    return (
      <span
        className={`typing-word ${isCurrent ? 'active-word' : ''}`}
        key={`${word}-${wordIndex}`}
        ref={isCurrent ? activeWordRef : null}
      >
        {[...word].map((character, charIndex) => {
          const isTyped = charIndex < typed.length
          const isCorrect = typed[charIndex] === character
          const isCurrentCharacter =
            isCurrent && charIndex === typed.length

          return (
            <span
              className={[
                'typing-character',
                isTyped ? (isCorrect ? 'correct' : 'incorrect') : '',
                isCurrentCharacter ? 'current' : '',
              ].join(' ')}
              key={charIndex}
            >
              {character}
            </span>
          )
        })}

        {typed.length > word.length &&
          [...typed.slice(word.length)].map((character, index) => (
            <span
              className="typing-character incorrect"
              key={`extra-${index}`}
            >
              {character}
            </span>
          ))}

        {isCurrent && typed.length >= word.length && (
          <span className="typing-end-caret" />
        )}
      </span>
    )
  }

  return (
    <section
      className="typing-practice"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className="typing-hidden-input"
        type="text"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onPaste={(event) => event.preventDefault()}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Typing practice keyboard input"
        disabled={finished}
      />

      <div className="typing-practice-heading">
        <div className="typing-practice-icon">
          <Keyboard size={21} />
        </div>

        <div>
          <span className="typing-practice-eyebrow">
            GUIDED PRACTICE
          </span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="typing-practice-stats">
        <div>
          <span>ACCURACY</span>
          <strong>
            {accuracy === null ? '—' : `${accuracy}%`}
          </strong>
        </div>

        <div>
          <span>SPEED</span>
          <strong>
            {wpm} <small>WPM</small>
          </strong>
        </div>

        <div>
          <span>WORDS</span>
          <strong>
            {finished ? words.length : currentIndex}/{words.length}
          </strong>
        </div>
      </div>

      <div
        ref={targetRef}
        className="typing-practice-target"
        role="group"
        aria-label="Words to type"
      >
        {words.map(renderWord)}
      </div>

      <div
        className="typing-practice-feedback"
        aria-live="polite"
      >
        {finished ? (
          <span className="typing-success">
            <CheckCircle2 size={17} />
            Exercise completed! Great work.
          </span>
        ) : feedback ? (
          <span className="typing-error">{feedback}</span>
        ) : (
          <span>
            <Target size={15} />
            Type each word correctly and press Space to continue.
          </span>
        )}
      </div>

      <div className="typing-practice-footer">
        <span>
          {finished
            ? `Completed ${words.length} words in ${Math.round(elapsedSeconds)} seconds.`
            : 'Accuracy first. Speed will follow.'}
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            handleRestart()
          }}
          className="typing-restart-button"
        >
          <RotateCcw size={15} />
          {isLessonPractice ? 'Restart practice' : 'New words'}
        </button>
      </div>
    </section>
  )
}

export default TypingPractice
