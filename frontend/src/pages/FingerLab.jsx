
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Hand,
  RotateCcw,
  Target,
  Zap,
  CheckCircle2,
} from 'lucide-react'

import './FingerLab.css'

const KEYBOARD_ROWS = [
  [
    ['q', 'left-pinky'], ['w', 'left-ring'], ['e', 'left-middle'],
    ['r', 'left-index'], ['t', 'left-index'], ['y', 'right-index'],
    ['u', 'right-index'], ['i', 'right-middle'], ['o', 'right-ring'],
    ['p', 'right-pinky'],
  ],
  [
    ['a', 'left-pinky'], ['s', 'left-ring'], ['d', 'left-middle'],
    ['f', 'left-index'], ['g', 'left-index'], ['h', 'right-index'],
    ['j', 'right-index'], ['k', 'right-middle'], ['l', 'right-ring'],
    [';', 'right-pinky'],
  ],
  [
    ['z', 'left-pinky'], ['x', 'left-ring'], ['c', 'left-middle'],
    ['v', 'left-index'], ['b', 'left-index'], ['n', 'right-index'],
    ['m', 'right-index'], [',', 'right-middle'],
    ['.', 'right-ring'], ['/', 'right-pinky'],
  ],
]

const FINGERS = [
  { id: 'left-pinky', name: 'Left Pinky', color: '#e97843' },
  { id: 'left-ring', name: 'Left Ring', color: '#d5a04b' },
  { id: 'left-middle', name: 'Left Middle', color: '#9b77ce' },
  { id: 'left-index', name: 'Left Index', color: '#4f9dba' },
  { id: 'right-index', name: 'Right Index', color: '#55a98a' },
  { id: 'right-middle', name: 'Right Middle', color: '#8c9c4d' },
  { id: 'right-ring', name: 'Right Ring', color: '#d17c9a' },
  { id: 'right-pinky', name: 'Right Pinky', color: '#bd6c56' },
]

const EXERCISES = {
  home: {
    name: 'Home Row',
    description: 'Learn the foundation keys: ASDF and JKL;',
    sequence: 'asdf jkl; asdf jkl; fj dk sl a;'
  },
  top: {
    name: 'Top Row',
    description: 'Practice reaching the upper row without looking.',
    sequence: 'qwer tyui op qwer tyui op'
  },
  bottom: {
    name: 'Bottom Row',
    description: 'Practice the lower row with correct finger movement.',
    sequence: 'zxcv bnm zxcv bnm'
  },
  mixed: {
    name: 'Mixed Practice',
    description: 'Combine all three keyboard rows.',
    sequence: 'asdf qwer zxcv jkl; tyui bnm'
  },
}

function getFingerForKey(key) {
  for (const row of KEYBOARD_ROWS) {
    const found = row.find(([character]) => character === key)
    if (found) return found[1]
  }

  return null
}

export default function FingerLab() {
  const [exercise, setExercise] = useState('home')
  const [position, setPosition] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [lastKey, setLastKey] = useState('')
  const [feedback, setFeedback] = useState('Start typing the highlighted key.')
  const [finished, setFinished] = useState(false)

  const currentExercise = EXERCISES[exercise]
  const sequence = currentExercise.sequence
  const currentKey = sequence[position] || ''

  const currentFinger = useMemo(
    () => getFingerForKey(currentKey),
    [currentKey]
  )

  const fingerInfo = FINGERS.find(
    (finger) => finger.id === currentFinger
  )

  const accuracy =
    correct + mistakes > 0
      ? Math.round((correct / (correct + mistakes)) * 100)
      : 100

  const handleKey = useCallback((key) => {
    if (finished || !currentKey) return

    const normalizedKey = key.toLowerCase()

    if (normalizedKey === currentKey) {
      setCorrect((value) => value + 1)
      setLastKey(normalizedKey)
      setFeedback('Correct! Great finger placement.')
      
      if (position + 1 >= sequence.length) {
        setFinished(true)
        setFeedback('Exercise completed! Excellent work.')
      } else {
        setPosition((value) => value + 1)
      }
    } else {
      setMistakes((value) => value + 1)
      setLastKey(normalizedKey)
      setFeedback(`Try again. Expected "${currentKey}".`)
    }
  }, [currentKey, finished, position, sequence.length])

  
  
useEffect(() => {
  function handleKeyDown(event) {
    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.isComposing
    ) {
      return
    }

    if (event.key.length !== 1) return

    event.preventDefault()
    handleKey(event.key)
  }

  window.addEventListener('keydown', handleKeyDown, true)

  return () => {
    window.removeEventListener('keydown', handleKeyDown, true)
  }
}, [handleKey])


  function resetExercise() {
    setPosition(0)
    setCorrect(0)
    setMistakes(0)
    setLastKey('')
    setFeedback('Start typing the highlighted key.')
    setFinished(false)
  }

  function changeExercise(nextExercise) {
    setExercise(nextExercise)
    setPosition(0)
    setCorrect(0)
    setMistakes(0)
    setLastKey('')
    setFeedback('Start typing the highlighted key.')
    setFinished(false)
  }

  return (
    <main className="finger-lab-page">
      <div className="finger-lab-container">

        <header className="finger-lab-header">
          <Link to="/dashboard" className="finger-back">
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <span className="finger-eyebrow">TYPEUP TRAINING LAB</span>

          <h1>
            Finger <span>Lab</span>
          </h1>

          <p>
            Learn the correct finger placement and build your
            touch typing foundation.
          </p>
        </header>

        <section className="finger-stats">
          <div className="finger-stat">
            <Target />
            <span>Accuracy</span>
            <strong>{accuracy}%</strong>
          </div>

          <div className="finger-stat">
            <CheckCircle2 />
            <span>Correct Keys</span>
            <strong>{correct}</strong>
          </div>

          <div className="finger-stat">
            <Zap />
            <span>Mistakes</span>
            <strong>{mistakes}</strong>
          </div>

          <div className="finger-stat">
            <Hand />
            <span>Progress</span>
            <strong>{Math.round((position / sequence.length) * 100)}%</strong>
          </div>
        </section>

        <section className="finger-exercise-panel">
          <div className="finger-section-heading">
            <div>
              <span className="finger-label">CHOOSE YOUR TRAINING</span>
              <h2>Typing Exercises</h2>
            </div>

            <button
              className="finger-reset"
              type="button"
              onClick={resetExercise}
            >
              <RotateCcw size={15} />
              Restart
            </button>
          </div>

          <div className="finger-exercise-tabs">
            {Object.entries(EXERCISES).map(([id, item]) => (
              <button
                type="button"
                key={id}
                className={exercise === id ? 'active' : ''}
                onClick={() => changeExercise(id)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="finger-exercise-description">
            <h3>{currentExercise.name}</h3>
            <p>{currentExercise.description}</p>
          </div>

          <div className="finger-practice-box">
            <span className="finger-label">CURRENT TARGET</span>

            <div className="finger-target">
              {currentKey === ' ' ? 'SPACE' : currentKey || 'DONE'}
            </div>

            {fingerInfo && !finished && (
              <div className="finger-instruction">
                Use your <strong style={{ color: fingerInfo.color }}>
                  {fingerInfo.name}
                </strong>
              </div>
            )}

            <div className={`finger-feedback ${finished ? 'success' : ''}`}>
              {feedback}
            </div>

            <div className="finger-progress-track">
              <div
                className="finger-progress-fill"
                style={{
                  width: `${(position / sequence.length) * 100}%`
                }}
              />
            </div>

            <p className="finger-hint">
              Focus on the screen, not your keyboard.
            </p>
          </div>
        </section>

        <section className="finger-keyboard-panel">
          <div className="finger-section-heading">
            <div>
              <span className="finger-label">INTERACTIVE KEYBOARD</span>
              <h2>Finger Mapping</h2>
            </div>
          </div>

          <div className="finger-keyboard">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div className="finger-key-row" key={rowIndex}>
                {row.map(([key, finger]) => {
                  const fingerData = FINGERS.find(
                    (item) => item.id === finger
                  )

                  return (
                    <button
                      type="button"
                      key={key}
                      className={[
                        'finger-key',
                        currentKey === key ? 'target-key' : '',
                        lastKey === key ? 'last-key' : '',
                      ].join(' ')}
                      style={{
                        '--finger-color': fingerData.color
                      }}
                      onClick={() => handleKey(key)}
                      title={fingerData.name}
                    >
                      {key}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="finger-legend">
            {FINGERS.map((finger) => (
              <div className="finger-legend-item" key={finger.id}>
                <span style={{ background: finger.color }} />
                {finger.name}
              </div>
            ))}
          </div>
        </section>

        <section className="finger-tips">
          <Hand size={23} />

          <div>
            <h3>Remember the Home Position</h3>
            <p>
              Keep your left fingers on A, S, D, F and your right
              fingers on J, K, L, ;. Return to these keys after every reach.
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}
