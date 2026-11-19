
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  RotateCcw,
  Clock3,
  Keyboard,
  Target,
  Zap,
  Trophy,
  Quote,
  Leaf,
  Square,
} from 'lucide-react'

import './TypingArena.css'
import { calculateTypingStats } from '../../utility/typingStats.js'
import { saveArenaResult } from '../../utility/arenaHistory.js'

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

const NUMBER_BANK = ['7', '12', '24', '42', '99', '100', '256', '2026']
const PUNCTUATION = [',', '.', '!', '?', ';', ':']

const QUOTES = [
  'The secret of getting ahead is getting started.',
  'Believe you can and you are halfway there.',
  'Great things are done by a series of small things brought together.',
  'Practice makes progress, not perfection.',
  'Success is the sum of small efforts repeated every day.',
  'Learning never exhausts the mind.',
  'Your future is created by what you do today.',
  'Stay focused and never stop improving yourself.',
  'Every expert was once a beginner.',
  'The only way to do great work is to love what you do.',
]

const DURATIONS = [15, 30, 60, 120]
const WORD_COUNTS = [10, 25, 50, 100]
const WORD_COUNT = 1000


const TYPING_MODES = {
  TIME: 'time',
  WORDS: 'words',
  QUOTE: 'quote',
  ZEN: 'zen',
}

function generateWords(
  count = WORD_COUNT,
  { includeNumbers = false, includePunctuation = false } = {},
) {
  const generated = []
  let previousWord = ''

  for (let index = 0; index < count; index += 1) {
    let nextWord

    const useNumber = includeNumbers && Math.random() < 0.16

    if (useNumber) {
      nextWord =
        NUMBER_BANK[Math.floor(Math.random() * NUMBER_BANK.length)]
    } else {
      do {
        nextWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
      } while (
        WORD_BANK.length > 1 &&
        nextWord === previousWord
      )
    }

    if (includePunctuation && Math.random() < 0.28) {
      nextWord +=
        PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)]
    }

    generated.push(nextWord)
    previousWord = nextWord
  }

  return generated
}

function generateQuote(previousQuote = '') {
  const availableQuotes = QUOTES.filter(
    (quote) => quote !== previousQuote,
  )

  const source = availableQuotes.length ? availableQuotes : QUOTES

  return source[Math.floor(Math.random() * source.length)]
}

export default function TypingArena() {
  const inputRef = useRef(null)
  const targetRef = useRef(null)
  const activeWordRef = useRef(null)
  const previousQuoteRef = useRef('')
  const resultSavedRef = useRef(false)
  const statsRef = useRef(null)
  const lastSampledSecondRef = useRef(0)

  const [mode, setMode] = useState(TYPING_MODES.TIME)
  const [duration, setDuration] = useState(30)
  const [wordLimit, setWordLimit] = useState(25)

  const [includeNumbers, setIncludeNumbers] = useState(false)
  const [includePunctuation, setIncludePunctuation] = useState(false)

  const [words, setWords] = useState(() => generateWords())
  const [typedWords, setTypedWords] = useState([])
  const [currentWord, setCurrentWord] = useState('')

  const [startedAt, setStartedAt] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [remaining, setRemaining] = useState(30)
  const [finished, setFinished] = useState(false)
  const [wpmSamples, setWpmSamples] = useState([])

  const currentIndex = typedWords.length
  const isTestStarted = startedAt !== null && !finished

  const isTimeMode = mode === TYPING_MODES.TIME
  const isWordsMode = mode === TYPING_MODES.WORDS
  const isQuoteMode = mode === TYPING_MODES.QUOTE
  const isZenMode = mode === TYPING_MODES.ZEN

  const stats = calculateTypingStats({
    typedWords,
    currentWord,
    words,
    elapsedSeconds,
  })

  statsRef.current = stats
  // Record actual typing speed once per elapsed second.
useEffect(() => {
  if (startedAt === null || finished) return

  const currentSecond = Math.floor(elapsedSeconds)

  if (
    currentSecond <= 0 ||
    currentSecond <= lastSampledSecondRef.current
  ) {
    return
  }

  lastSampledSecondRef.current = currentSecond

  setWpmSamples((previous) => [
    ...previous,
    {
      second: currentSecond,
      wpm: stats.netWpm,
    },
  ])
}, [elapsedSeconds, startedAt, finished, stats.netWpm])

  // Save a completed result once.
  function finishTest() {
    if (finished || resultSavedRef.current) return

    resultSavedRef.current = true

    try {
      const finalStats = statsRef.current

      saveArenaResult({
        mode,
        wordLimit: isWordsMode ? wordLimit : null,
        duration: isTimeMode ? duration : elapsedSeconds,
        elapsedSeconds,
        includeNumbers: !isQuoteMode && includeNumbers,
        includePunctuation: !isQuoteMode && includePunctuation,
        netWpm: finalStats.netWpm,
        rawWpm: finalStats.rawWpm,
        accuracy: finalStats.accuracy,
        errors: finalStats.incorrectCharacters,
        totalTypedCharacters: finalStats.totalTypedCharacters,
        correctCharacters: finalStats.correctCharacters,
        typedWords: [...typedWords],
targetWords: words.slice(0, typedWords.length),
wpmSamples: [...wpmSamples],
      })
    } catch (error) {
      console.error('Unable to save typing result:', error)
    } finally {
      setFinished(true)
    }
  }

  // Continuously replenish words in Zen Mode.
  useEffect(() => {
    if (
      mode !== TYPING_MODES.ZEN ||
      finished ||
      words.length - currentIndex >= 20
    ) {
      return
    }

    setWords((previous) => [
      ...previous,
      ...generateWords(1000, {
        includeNumbers,
        includePunctuation,
      }),
    ])
  }, [
    mode,
    finished,
    currentIndex,
    words.length,
    includeNumbers,
    includePunctuation,
  ])

  // Countdown for Time Mode; stopwatch for other modes.
  useEffect(() => {
    if (startedAt === null || finished) return undefined

    const timerId = window.setInterval(() => {
      const elapsed = Math.max(
        0,
        (Date.now() - startedAt) / 1000,
      )

      if (mode === TYPING_MODES.TIME) {
        setElapsedSeconds(Math.min(duration, elapsed))
        setRemaining(Math.max(0, duration - elapsed))
      } else {
        setElapsedSeconds(elapsed)
      }
    }, 100)

    return () => window.clearInterval(timerId)
  }, [startedAt, finished, mode, duration])

  // Automatic completion.
  useEffect(() => {
    if (finished || startedAt === null) return

    if (mode === TYPING_MODES.TIME && remaining <= 0) {
      finishTest()
    } else if (
      mode === TYPING_MODES.WORDS &&
      typedWords.length >= wordLimit
    ) {
      finishTest()
    } else if (
      mode === TYPING_MODES.QUOTE &&
      typedWords.length >= words.length
    ) {
      finishTest()
    }
  }, [
    mode,
    remaining,
    typedWords.length,
    wordLimit,
    words.length,
    startedAt,
    finished,
  ])

  // Keep the active word visible.
  useEffect(() => {
    const container = targetRef.current
    const activeWord = activeWordRef.current

    if (!container || !activeWord) return undefined

    const frameId = window.requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect()
      const wordRect = activeWord.getBoundingClientRect()

      if (wordRect.bottom > containerRect.bottom - 24) {
        container.scrollBy({
          top: wordRect.bottom - containerRect.bottom + 24,
          behavior: 'smooth',
        })
      } else if (wordRect.top < containerRect.top + 12) {
        container.scrollBy({
          top: wordRect.top - containerRect.top - 12,
          behavior: 'smooth',
        })
      }
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [currentIndex])

  // Keyboard input.
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

      if (currentWord.length === 0) return

      if (startedAt === null) {
        setStartedAt(Date.now())
      }

      setTypedWords((previous) => [...previous, currentWord])
      setCurrentWord('')
      return
    }

    if (event.key.length === 1) {
      event.preventDefault()

      if (startedAt === null) {
        setStartedAt(Date.now())
      }

      setCurrentWord((previous) => previous + event.key)
    }
  }

  // Start a fresh test.
  function restartTest(
    nextDuration = duration,
    nextMode = mode,
    nextWordLimit = wordLimit,
    nextOptions = { includeNumbers, includePunctuation },
  ) {
    setMode(nextMode)
    setDuration(nextDuration)
    setWordLimit(nextWordLimit)

    setIncludeNumbers(nextOptions.includeNumbers)
    setIncludePunctuation(nextOptions.includePunctuation)

    if (nextMode === TYPING_MODES.QUOTE) {
      const nextQuote = generateQuote(previousQuoteRef.current)

      previousQuoteRef.current = nextQuote
      setWords(nextQuote.split(' '))
    } else {
      const count =
        nextMode === TYPING_MODES.WORDS
          ? nextWordLimit
          : WORD_COUNT

      setWords(generateWords(count, nextOptions))
    }

    setTypedWords([])
setCurrentWord('')
setStartedAt(null)
setElapsedSeconds(0)

// Reset performance tracking for the new test.
setWpmSamples([])
lastSampledSecondRef.current = 0

setRemaining(nextDuration)
    setFinished(false)

    resultSavedRef.current = false

    targetRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    inputRef.current?.focus()
  }

  // Change practice settings and generate fresh text.
  function togglePracticeOption(option, checked) {
    const nextOptions = {
      includeNumbers:
        option === 'numbers' ? checked : includeNumbers,
      includePunctuation:
        option === 'punctuation' ? checked : includePunctuation,
    }

    restartTest(duration, mode, wordLimit, nextOptions)
  }

  const timerLabel = isTimeMode ? 'TIME LEFT' : 'TIME ELAPSED'

  const timerValue = isTimeMode
    ? `${Math.ceil(remaining)}s`
    : `${Math.floor(elapsedSeconds)}s`

  const progressLabel = isTimeMode
    ? 'ERRORS'
    : isWordsMode || isQuoteMode
      ? 'WORDS LEFT'
      : 'WORDS TYPED'

  const progressValue = isTimeMode
    ? stats.incorrectCharacters
    : isWordsMode
      ? Math.max(0, wordLimit - typedWords.length)
      : isQuoteMode
        ? Math.max(0, words.length - typedWords.length)
        : typedWords.length

  return (
    <main className={`arena-page ${isZenMode ? 'zen-mode' : ''}`}>
      <header className="arena-nav">
        <Link to="/" className="arena-logo">
          TYPE<span>UP.</span>
        </Link>

        <nav className="arena-nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learn">Learn</Link>
          <span className="active">Typing Arena</span>
          <Link to="/history">History</Link>
        </nav>

        <Link to="/dashboard" className="arena-back-link">
          Exit arena
        </Link>
      </header>

      <div className="arena-container">
        <section className="arena-heading">
          <span className="arena-eyebrow">THE TYPING ARENA</span>

          <h1>
            {isZenMode ? (
              <>Find your <span>flow.</span></>
            ) : (
              <>Test your <span>typing speed.</span></>
            )}
          </h1>

          <p>
            {isZenMode
              ? 'Relax, focus on each word and enjoy typing without pressure.'
              : 'Focus, find your rhythm and see how fast your fingers can go.'}
          </p>
        </section>

        {/* Test settings */}
        <section className="arena-settings">
          <div className="arena-mode-heading">
            <div>
              <span className="arena-eyebrow">TEST MODE</span>

              <h2>
                {isTimeMode
                  ? 'Time based'
                  : isWordsMode
                    ? 'Word based'
                    : isQuoteMode
                      ? 'Quote practice'
                      : 'Zen mode'}
              </h2>
            </div>

            <div className="arena-mode-icon">
              {isTimeMode ? (
                <Clock3 size={22} />
              ) : isWordsMode ? (
                <Keyboard size={22} />
              ) : isQuoteMode ? (
                <Quote size={22} />
              ) : (
                <Leaf size={22} />
              )}
            </div>
          </div>

          <div className="arena-duration-label">
            Choose your test mode
          </div>

          <div className="arena-duration-options">
            <div className="arena-mode-selector">
              <button
                type="button"
                className={isTimeMode ? 'active' : ''}
                onClick={() => restartTest(duration, TYPING_MODES.TIME)}
                disabled={isTestStarted}
              >
                <Clock3 size={16} /> Time
              </button>

              <button
                type="button"
                className={isWordsMode ? 'active' : ''}
                onClick={() => restartTest(duration, TYPING_MODES.WORDS)}
                disabled={isTestStarted}
              >
                <Keyboard size={16} /> Words
              </button>

              <button
                type="button"
                className={isQuoteMode ? 'active' : ''}
                onClick={() => restartTest(duration, TYPING_MODES.QUOTE)}
                disabled={isTestStarted}
              >
                <Quote size={16} /> Quote
              </button>

              <button
                type="button"
                className={isZenMode ? 'active' : ''}
                onClick={() => restartTest(duration, TYPING_MODES.ZEN)}
                disabled={isTestStarted}
              >
                <Leaf size={16} /> Zen
              </button>
            </div>

            {isTimeMode &&
              DURATIONS.map((seconds) => (
                <button
                  type="button"
                  key={seconds}
                  className={
                    duration === seconds
                      ? 'arena-duration active'
                      : 'arena-duration'
                  }
                  onClick={() =>
                    restartTest(seconds, TYPING_MODES.TIME)
                  }
                  disabled={isTestStarted}
                >
                  {seconds}s
                </button>
              ))}

            {isWordsMode &&
              WORD_COUNTS.map((count) => (
                <button
                  type="button"
                  key={count}
                  className={
                    wordLimit === count
                      ? 'arena-duration active'
                      : 'arena-duration'
                  }
                  onClick={() =>
                    restartTest(duration, TYPING_MODES.WORDS, count)
                  }
                  disabled={isTestStarted}
                >
                  {count}
                </button>
              ))}

            {isQuoteMode && (
              <span className="arena-quote-label">
                Complete the quote
              </span>
            )}

            {isZenMode && (
              <span className="arena-quote-label">
                No timer · No pressure
              </span>
            )}
          </div>

          {/* Numbers and punctuation settings */}
          <div
            className={`arena-practice-options ${
              isQuoteMode ? 'is-disabled' : ''
            }`}
          >
            <span className="arena-duration-label">
              PRACTICE CONTENT
            </span>

            <label className="arena-option-toggle">
              <input
                type="checkbox"
                checked={includeNumbers}
                disabled={isTestStarted || isQuoteMode}
                onChange={(event) =>
                  togglePracticeOption('numbers', event.target.checked)
                }
              />

              <span className="arena-toggle-track" aria-hidden="true" />
              <span>
                Numbers <small>123</small>
              </span>
            </label>

            <label className="arena-option-toggle">
              <input
                type="checkbox"
                checked={includePunctuation}
                disabled={isTestStarted || isQuoteMode}
                onChange={(event) =>
                  togglePracticeOption(
                    'punctuation',
                    event.target.checked,
                  )
                }
              />

              <span className="arena-toggle-track" aria-hidden="true" />
              <span>
                Punctuation <small>.,?!</small>
              </span>
            </label>

            {isQuoteMode && (
              <span className="arena-options-note">
                Quote text already includes its original punctuation.
              </span>
            )}
          </div>
        </section>

        {/* Typing test */}
        <section className="arena-test-card">
          {!isZenMode && (
            <div className="arena-live-stats">
              <div>
                <span>{timerLabel}</span>
                <strong className="arena-timer">{timerValue}</strong>
              </div>

              <div>
                <span>WPM</span>
                <strong>{stats.netWpm}</strong>
              </div>

              <div>
                <span>ACCURACY</span>
                <strong>{stats.accuracy}%</strong>
              </div>

              <div>
                <span>{progressLabel}</span>
                <strong>{progressValue}</strong>
              </div>
            </div>
          )}

          {isZenMode && (
            <div className="zen-heading">
              <Leaf size={17} />
              <span>Take a breath. Find your rhythm.</span>
            </div>
          )}

          {startedAt === null && !finished && (
            <div className="arena-instruction">
              <Keyboard size={16} />
              Click the words below and start typing
            </div>
          )}

          <div
            ref={targetRef}
            className="arena-words"
            onClick={() => inputRef.current?.focus()}
          >
            {words.map((word, wordIndex) => {
              const isCurrent = wordIndex === currentIndex
              const isCompleted = wordIndex < currentIndex

              const typed = isCurrent
                ? currentWord
                : isCompleted
                  ? typedWords[wordIndex] || ''
                  : ''

              return (
                <span
                  className={`arena-word ${
                    isCurrent ? 'active' : ''
                  }`}
                  key={`${wordIndex}-${word}`}
                  ref={isCurrent ? activeWordRef : null}
                >
                  {[...word].map((character, charIndex) => {
                    const isTyped = charIndex < typed.length
                    const isCorrect = typed[charIndex] === character

                    return (
                      <span
                        key={charIndex}
                        className={[
                          'arena-character',
                          isTyped
                            ? isCorrect
                              ? 'correct'
                              : 'incorrect'
                            : '',
                          isCurrent && charIndex === typed.length
                            ? 'current'
                            : '',
                        ].join(' ')}
                      >
                        {character}
                      </span>
                    )
                  })}

                  {isCurrent &&
                    [...currentWord]
                      .slice(word.length)
                      .map((character, index) => (
                        <span
                          key={`extra-${index}`}
                          className="arena-character incorrect"
                        >
                          {character}
                        </span>
                      ))}

                  {isCurrent && typed.length >= word.length && (
                    <span className="arena-end-caret" />
                  )}
                </span>
              )
            })}
          </div>

          <input
            ref={inputRef}
            className="arena-hidden-input"
            type="text"
            value=""
            readOnly
            onKeyDown={handleKeyDown}
            onPaste={(event) => event.preventDefault()}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Typing Arena keyboard input"
            disabled={finished}
          />

          {/* Result */}
          {finished && (
            <div className="arena-result">
              <div className="arena-result-icon">
                <Trophy size={25} />
              </div>

              <span className="arena-eyebrow">TEST COMPLETED</span>
              <h2>Your typing result</h2>

              <div className="arena-result-grid">
                <div>
                  <span>NET WPM</span>
                  <strong>{stats.netWpm}</strong>
                </div>

                <div>
                  <span>RAW WPM</span>
                  <strong>{stats.rawWpm}</strong>
                </div>

                <div>
                  <span>ACCURACY</span>
                  <strong>{stats.accuracy}%</strong>
                </div>

                <div>
                  <span>ERRORS</span>
                  <strong>{stats.incorrectCharacters}</strong>
                </div>
              </div>

              {isZenMode && (
                <p className="zen-result-time">
                  Your session: {Math.floor(elapsedSeconds / 60)}m{' '}
                  {Math.floor(elapsedSeconds % 60)}s
                </p>
              )}

              <button
                type="button"
                className="arena-primary-button"
                onClick={() => restartTest()}
              >
                <RotateCcw size={16} />
                Try again
              </button>
            </div>
          )}

          {!finished && (
            <div className="arena-test-footer">
              <span>
                <Target size={14} />
                {isZenMode
                  ? 'Enjoy the process. Stop whenever you want.'
                  : startedAt !== null
                    ? 'Keep going. Stay focused.'
                    : 'The timer starts with your first keystroke.'}
              </span>

              {isZenMode && (
                <button
                  type="button"
                  className="arena-restart-button zen-finish-button"
                  onClick={finishTest}
                  disabled={startedAt === null}
                >
                  <Square size={14} />
                  Finish session
                </button>
              )}

              <button
                type="button"
                className="arena-restart-button"
                onClick={() => restartTest()}
              >
                <RotateCcw size={15} />
                Restart
              </button>
            </div>
          )}
        </section>

        <section className="arena-tip">
          <Zap size={18} />

          <div>
            <strong>Accuracy before speed.</strong>
            <p>
              Consistent practice and correct finger placement
              will help your speed improve naturally.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
