
import { useEffect, useRef, useState } from 'react'

import {
  ArrowLeft,
  Clock3,
  Flame,
  Keyboard,
  RotateCcw,
  Target,
  Trophy,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import './Games.css'
import { saveGameResult } from '../utility/gameHistory'
import { Link, useNavigate, useParams } from 'react-router-dom'

const GAME_LIST = [
  {
    id: 'word-rush',
    name: 'Word Rush',
    description: 'Type as many words as you can before time runs out.',
    icon: Flame,
    difficulty: 'Easy',
    color: '#e97843',
  },
  {
    id: 'key-challenge',
    name: 'Key Challenge',
    description: 'Test your keyboard reflexes with random letters.',
    icon: Keyboard,
    difficulty: 'Easy',
    color: '#d5a04b',
  },
  {
    id: 'accuracy',
    name: 'Accuracy Challenge',
    description: 'Complete a sentence while keeping your accuracy high.',
    icon: Target,
    difficulty: 'Medium',
    color: '#9b77ce',
  },
  {
    id: 'speed-sprint',
    name: 'Speed Sprint',
    description: 'Race against the clock and improve your typing speed.',
    icon: Zap,
    difficulty: 'Medium',
    color: '#55a98a',
  },
]

const WORDS = [
  'keyboard', 'practice', 'typing', 'learning', 'focus',
  'speed', 'accuracy', 'improve', 'skill', 'computer',
  'creative', 'challenge', 'power', 'future', 'success',
  'progress', 'developer', 'technology', 'quick', 'strong',
  'journey', 'practice', 'coding', 'beautiful', 'amazing',
]

const KEY_POOL = 'asdfjklqwertyuiopzxcvbnm'

const SENTENCES = [
  'Practice makes progress every single day.',
  'Focus on accuracy before increasing your speed.',
  'Touch typing becomes easier with regular practice.',
]

const SPRINT_TEXT =
  'The best way to improve typing is to practise every day. Keep your fingers relaxed and focus on accuracy before speed.'

const GAME_DURATION = 30

export default function Games() {
  const navigate = useNavigate()
const { gameId } = useParams()
  const [selectedGame, setSelectedGame] = useState(null)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [target, setTarget] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [correctKeys, setCorrectKeys] = useState(0)
  const [feedback, setFeedback] = useState('Choose a game to begin.')
  const [wordIndex, setWordIndex] = useState(0)
  const [keyIndex, setKeyIndex] = useState(0)
  const [sentenceIndex, setSentenceIndex] = useState(0)
const [saveMessage, setSaveMessage] = useState('')
const savedResultRef = useRef(false)
  const startedAtRef = useRef(null)
  const inputRef = useRef(null)

  const words = useRef(
    [...WORDS, ...WORDS, ...WORDS].sort(() => Math.random() - 0.5)
  )

  const accuracy =
    correctKeys + mistakes > 0
      ? Math.round((correctKeys / (correctKeys + mistakes)) * 100)
      : 100

  function resetGame(game = selectedGame) {
    savedResultRef.current = false
setSaveMessage('')
    setSelectedGame(game)
    setStarted(false)
    setFinished(false)
    setTimeLeft(GAME_DURATION)
    setInput('')
    setScore(0)
    setMistakes(0)
    setCorrectKeys(0)
    setWordIndex(0)
    setKeyIndex(0)
    setSentenceIndex(0)
    startedAtRef.current = null

    if (game === 'word-rush') {
      setTarget(words.current[0])
      setFeedback('Type the word and press Enter.')
    } else if (game === 'key-challenge') {
      setTarget(KEY_POOL[0])
      setFeedback('Press the highlighted key.')
    } else if (game === 'accuracy') {
      setTarget(SENTENCES[0])
      setFeedback('Type the sentence exactly as shown.')
    } else if (game === 'speed-sprint') {
      setTarget(SPRINT_TEXT)
      setFeedback('Type the passage before time runs out.')
    }
  }

  useEffect(() => {
  const validGame = GAME_LIST.some((game) => game.id === gameId)

  if (validGame) {
    resetGame(gameId)
  } else {
    setSelectedGame(null)
    setStarted(false)
    setFinished(false)
  }
}, [gameId])
  function startGame() {
    if (!selectedGame) return
    setStarted(true)
    setFinished(false)
    startedAtRef.current = Date.now()
    setFeedback('Game started! Good luck.')
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!started || finished) return undefined

    const timer = window.setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startedAtRef.current) / 1000
      )
      const remaining = Math.max(0, GAME_DURATION - elapsed)

      setTimeLeft(remaining)

      if (remaining <= 0) {
        setStarted(false)
        setFinished(true)
        setFeedback('Time is up! Great effort.')
      }
    }, 200)

    return () => window.clearInterval(timer)
  }, [started, finished])

  

useEffect(() => {
  if (!finished || !selectedGame || savedResultRef.current) {
    return
  }

  savedResultRef.current = true

  const game = GAME_LIST.find(item => item.id === selectedGame)

  try {
    saveGameResult({
      gameId: selectedGame,
      gameName: game?.name || selectedGame,
      score,
      accuracy,
      mistakes,
      duration: Math.max(0, GAME_DURATION - timeLeft),
    })

    setSaveMessage('Your game result has been saved!')
  } catch (error) {
    savedResultRef.current = false
    setSaveMessage('Unable to save your game result.')
    console.error('Game history save failed:', error)
  }
}, [finished, selectedGame, score, accuracy, mistakes, timeLeft])


function handleWordSubmit(event) {
  event.preventDefault()
  if (!started || finished) return

  const typed = input.trim().toLowerCase()
  const expected = target.toLowerCase()

  if (!typed) return

  const maxLength = Math.max(typed.length, expected.length)
  let matched = 0
  let incorrect = 0

  for (let i = 0; i < maxLength; i += 1) {
    if (typed[i] && typed[i] === expected[i]) {
      matched += 1
    } else {
      incorrect += 1
    }
  }

  setCorrectKeys(value => value + matched)
  setMistakes(value => value + incorrect)

  if (typed === expected) {
    setScore(value => value + 1)
    setWordIndex(value => value + 1)
    setTarget(words.current[wordIndex + 1] || WORDS[0])
    setFeedback('Correct word! Keep going.')
  } else {
    setFeedback('Not quite! Try the word again.')
  }

  setInput('')
}


  function handleKeyChallenge(event) {
    if (!started || finished || selectedGame !== 'key-challenge') return
    if (event.key.length !== 1) return

    event.preventDefault()

    if (event.key.toLowerCase() === target) {
      setScore(value => value + 1)
      setCorrectKeys(value => value + 1)
      setKeyIndex(value => value + 1)
      setTarget(KEY_POOL[(keyIndex + 1) % KEY_POOL.length])
      setFeedback('Correct key!')
    } else {
      setMistakes(value => value + 1)
      setFeedback(`Try again! Press "${target}".`)
    }
  }

  useEffect(() => {
    if (selectedGame !== 'key-challenge') return undefined

    window.addEventListener('keydown', handleKeyChallenge, true)

    return () => {
      window.removeEventListener('keydown', handleKeyChallenge, true)
    }
  })

  function handleAccuracyChange(value) {
  if (!started || finished) return

  setInput(value)

  const correctCount = [...value].filter(
    (character, index) => character === target[index]
  ).length

  const incorrectCount = [...value].filter(
    (character, index) => character !== target[index]
  ).length

  setCorrectKeys(correctCount)
  setMistakes(incorrectCount)

  if (value === target) {
    setScore(count => count + 1)
    setFinished(true)
    setStarted(false)
    setFeedback('Perfect! You completed the sentence.')
  }
}

  function handleSprintChange(value) {
    if (!started || finished) return

    setInput(value)

    const correctCount = [...value].filter(
      (character, index) => character === SPRINT_TEXT[index]
    ).length

    setCorrectKeys(correctCount)

    const incorrectCount = [...value].filter(
      (character, index) => character !== SPRINT_TEXT[index]
    ).length

    setMistakes(incorrectCount)

    if (value.length >= SPRINT_TEXT.length) {
      setFinished(true)
      setStarted(false)
      setScore(correctCount)
      setFeedback('Sprint completed! Excellent work.')
    }
  }

  function backToGames() {
  navigate('/games')
  setSelectedGame(null)
  setStarted(false)
  setFinished(false)
  setInput('')
  setFeedback('Choose a game to begin.')
}
  const activeGame = GAME_LIST.find(game => game.id === selectedGame)
  const ActiveIcon = activeGame?.icon

  return (
    <main className="games-page">
      <div className="games-container">
        <header className="games-header">
         <Link
  to={gameId ? '/games' : '/dashboard'}
  className="games-back"
>
  <ArrowLeft size={17} />
  {gameId ? 'Back to Games' : 'Dashboard'}
</Link>

          <span className="games-eyebrow">TYPEUP PLAY ZONE</span>
          <h1>Typing <span>Games</span></h1>
          <p>Play, practise and improve your typing skills.</p>
        </header>

        {!selectedGame ? (
          <section className="games-grid">
            {GAME_LIST.map(game => {
              const Icon = game.icon

              return (
                <article className="game-card" key={game.id}>
                  <div
                    className="game-icon"
                    style={{ '--game-color': game.color }}
                  >
                    <Icon size={25} />
                  </div>

                  <span className="game-difficulty">{game.difficulty}</span>
                  <h2>{game.name}</h2>
                  <p>{game.description}</p>

                  <button
                    type="button"
                    className="game-play-button"
                    onClick={() => navigate(`/games/${game.id}`)}
                  >
                    Play Game <Zap size={16} />
                  </button>
                </article>
              )
            })}
          </section>
        ) : (
          <section className="game-arena">
            <div className="game-arena-heading">
              <button
                type="button"
                className="game-back-button"
                onClick={backToGames}
              >
                <ArrowLeft size={16} /> All Games
              </button>

              <div className="game-active-title">
                {ActiveIcon && <ActiveIcon size={22} />}
                <h2>{activeGame?.name}</h2>
              </div>

              <button
                type="button"
                className="game-reset-button"
                onClick={() => resetGame()}
              >
                <RotateCcw size={15} /> Restart
              </button>
            </div>

            <div className="game-metrics">
              <div>
                <Clock3 />
                <span>Time Left</span>
                <strong>{timeLeft}s</strong>
              </div>
              <div>
                <Trophy />
                <span>Score</span>
                <strong>{score}</strong>
              </div>
              <div>
                <CheckCircle2 />
                <span>Accuracy</span>
                <strong>{accuracy}%</strong>
              </div>
              <div>
                <Target />
                <span>Mistakes</span>
                <strong>{mistakes}</strong>
              </div>
            </div>

            <div className="game-play-area">
              {!started && !finished && (
                <>
                  <span className="game-label">READY?</span>
                  <h3>Let's play!</h3>
                  <p>{activeGame?.description}</p>
                  <button
                    type="button"
                    className="game-start-button"
                    onClick={startGame}
                  >
                    Start Game <Zap size={17} />
                  </button>
                </>
              )}

              {started && selectedGame === 'word-rush' && (
                <>
                  <span className="game-label">TYPE THIS WORD</span>
                  <h3 className="game-target-word">{target}</h3>
                  <form onSubmit={handleWordSubmit}>
                    <input
                      ref={inputRef}
                      autoFocus
                      className="game-input"
                      value={input}
                      onChange={event => setInput(event.target.value)}
                      placeholder="Type the word..."
                      autoComplete="off"
                    />
                    <button className="game-start-button" type="submit">
                      Submit Word
                    </button>
                  </form>
                </>
              )}

              {started && selectedGame === 'key-challenge' && (
                <>
                  <span className="game-label">PRESS THIS KEY</span>
                  <h3 className="game-target-word">{target.toUpperCase()}</h3>
                  <p>Press the matching key on your physical keyboard.</p>
                </>
              )}

              {started && selectedGame === 'accuracy' && (
                <>
                  <span className="game-label">TYPE THE SENTENCE</span>
                  <h3 className="game-sentence">{target}</h3>
                  <textarea
                    ref={inputRef}
                    autoFocus
                    className="game-input game-textarea"
                    value={input}
                    onChange={event => handleAccuracyChange(event.target.value)}
                    placeholder="Start typing here..."
                    spellCheck="false"
                  />
                </>
              )}

              {started && selectedGame === 'speed-sprint' && (
                <>
                  <span className="game-label">30 SECOND SPRINT</span>
                  <h3 className="game-sentence">{target}</h3>
                  <textarea
                    ref={inputRef}
                    autoFocus
                    className="game-input game-textarea"
                    value={input}
                    onChange={event => handleSprintChange(event.target.value)}
                    placeholder="Type the passage here..."
                    spellCheck="false"
                  />
                </>
              )}

              {finished && (
                <div className="game-finished">
                  <p className="game-save-message">{saveMessage}</p>
                  <Trophy size={40} />
                  <h3>Game Complete!</h3>
                  <p>Your score: <strong>{score}</strong></p>
                  <p>Accuracy: <strong>{accuracy}%</strong></p>
                  <button
                    type="button"
                    className="game-start-button"
                    onClick={() => resetGame()}
                  >
                    Play Again <RotateCcw size={16} />
                  </button>
                </div>
              )}

              <p className="game-feedback">{feedback}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
