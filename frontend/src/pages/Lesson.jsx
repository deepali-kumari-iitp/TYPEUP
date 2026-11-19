
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Target,
  Hand,
  Keyboard,
} from 'lucide-react'

import { lessonService } from '../services/api'
import TypingPractice from '../components/TypingPractice.jsx'
import {
  getCompletedLessons,
  completeLesson,
} from '../utility/lessonProgress'

import './Lesson.css'

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
]

const FINGER_MAP = {
  q: 'Left little finger',
  a: 'Left little finger',
  z: 'Left little finger',

  w: 'Left ring finger',
  s: 'Left ring finger',
  x: 'Left ring finger',

  e: 'Left middle finger',
  d: 'Left middle finger',
  c: 'Left middle finger',

  r: 'Left index finger',
  f: 'Left index finger',
  v: 'Left index finger',
  t: 'Left index finger',
  g: 'Left index finger',
  b: 'Left index finger',

  y: 'Right index finger',
  h: 'Right index finger',
  n: 'Right index finger',
  u: 'Right index finger',
  j: 'Right index finger',
  m: 'Right index finger',

  i: 'Right middle finger',
  k: 'Right middle finger',

  o: 'Right ring finger',
  l: 'Right ring finger',

  p: 'Right little finger',
  ';': 'Right little finger',
  ',': 'Right middle finger',
  '.': 'Right ring finger',
  '/': 'Right little finger',
}

const FINGER_COLORS = {
  'Left little finger': '#e87979',
  'Left ring finger': '#e9a15b',
  'Left middle finger': '#e5c65c',
  'Left index finger': '#80bd85',
  'Right index finger': '#61b8a2',
  'Right middle finger': '#68a9df',
  'Right ring finger': '#a38ae0',
  'Right little finger': '#d58bc4',
}

function getLessonKeys(day) {
  if (day === 2) return 'asdf'
  if (day === 3) return 'jkl;'
  if (day === 4 || day === 6 || day === 7) return 'asdfjkl;'
  if (day === 5) return 'fj'
  if (day === 8) return 'qwertyuiop'
  if (day === 9) return 'qwert'
  if (day === 10) return 'yuiop'
  if (day >= 11 && day <= 14) return 'qwertyuiopasdfjkl;'
  if (day === 15) return 'zxcvbnm'
  if (day === 16) return 'zxcvb'
  if (day === 17) return 'nm'
  if (day >= 18 && day <= 23) return 'qwertyuiopasdfghjkl;zxcvbnm'
  if (day === 24) return '1234567890'
  if (day === 25) return ',.;/'
  if (day >= 26) return 'qwertyuiopasdfghjkl;zxcvbnm'
  return 'qwertyuiopasdfghjkl;zxcvbnm'
}

function getFingerName(key) {
  if (key === ' ') return 'Both thumbs'
  return FINGER_MAP[key] || 'Use the appropriate finger'
}

function KeyboardFingerGuide({ dayNumber }) {
  const lessonKeys = useMemo(
    () => getLessonKeys(dayNumber),
    [dayNumber]
  )

  const firstKey = lessonKeys[0] || 'f'
  const [selectedKey, setSelectedKey] = useState(firstKey)

  useEffect(() => {
    setSelectedKey(firstKey)
  }, [firstKey])

  const selectedFinger = getFingerName(selectedKey)
  const selectedColor = FINGER_COLORS[selectedFinger] || '#e97843'
  const isHighlighted = lessonKeys.includes(selectedKey)

  return (
    <section className="lesson-section">
      <span className="lesson-eyebrow">
        INTERACTIVE FINGER GUIDE
      </span>

      <h2>Know your keyboard</h2>

      <p className="lesson-section-description">
        Select any key to discover which finger should press it.
        The highlighted keys belong to today's lesson.
      </p>

      <div
        className="lesson-keyboard-card"
        style={{ marginTop: '22px' }}
      >
        <div className="lesson-keyboard-heading">
          <Keyboard size={19} />
          <span>QWERTY KEYBOARD</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 16px',
            marginTop: '22px',
            marginBottom: '12px',
          }}
        >
          {Object.entries(FINGER_COLORS).map(([finger, color]) => (
            <div
              key={finger}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                color: '#bbaaaa',
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '3px',
                  background: color,
                }}
              />
              {finger}
            </div>
          ))}
        </div>

        <div
          style={{
            width: '100%',
            overflowX: 'auto',
            padding: '15px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minWidth: '560px',
            }}
          >
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {row.map((key) => {
                  const finger = getFingerName(key)
                  const color = FINGER_COLORS[finger]
                  const isSelected = selectedKey === key
                  const isTarget = lessonKeys.includes(key)

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      aria-label={`${key.toUpperCase()}, ${finger}`}
                      aria-pressed={isSelected}
                      style={{
                        width: '43px',
                        height: '46px',
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '9px',
                        border: isSelected
                          ? `2px solid ${color}`
                          : isTarget
                            ? `1px solid ${color}`
                            : '1px solid rgba(255,255,255,0.12)',
                        borderBottom: isSelected
                          ? `3px solid ${color}`
                          : '3px solid rgba(255,255,255,0.10)',
                        background: isSelected
                          ? `${color}35`
                          : isTarget
                            ? `${color}20`
                            : 'rgba(255,255,255,0.035)',
                        color: isTarget || isSelected
                          ? '#ffffff'
                          : '#998b8b',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 160ms ease',
                        boxShadow: isSelected
                          ? `0 0 16px ${color}30`
                          : 'none',
                      }}
                    >
                      {key.toUpperCase()}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '5px 0 15px',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedKey(' ')}
            style={{
              width: 'min(280px, 70%)',
              height: '38px',
              color: selectedKey === ' ' ? '#fff' : '#bbaaaa',
              background: selectedKey === ' '
                ? 'rgba(233,120,67,0.22)'
                : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(233,120,67,0.25)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '11px',
            }}
          >
            SPACEBAR
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
            padding: '18px',
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '13px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              color: selectedColor,
              background: `${selectedColor}20`,
              borderRadius: '10px',
            }}
          >
            <Hand size={20} />
          </div>

          <div>
            <span
              style={{
                display: 'block',
                color: '#a99b9b',
                fontSize: '10px',
                letterSpacing: '1.3px',
                fontWeight: 700,
              }}
            >
              SELECTED KEY
            </span>

            <h3
              style={{
                margin: '6px 0',
                fontSize: '22px',
                color: selectedColor,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {selectedKey === ' '
                ? 'SPACEBAR'
                : selectedKey.toUpperCase()}
            </h3>

            <p
              style={{
                margin: 0,
                color: '#f0e5e5',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {selectedFinger}
            </p>

            <p
              style={{
                margin: '7px 0 0',
                color: '#a99b9b',
                fontSize: '11px',
                lineHeight: 1.7,
              }}
            >
              {selectedKey === ' '
                ? 'Use either thumb comfortably to press the spacebar.'
                : `Use your ${selectedFinger.toLowerCase()} to press this key, then return your finger to its home-row position.`}
            </p>

            <span
              style={{
                display: 'inline-block',
                marginTop: '10px',
                color: isHighlighted ? '#4ade80' : '#a99b9b',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              {isHighlighted
                ? "This key is part of today's lesson"
                : 'Additional keyboard key'}
            </span>
          </div>
        </div>

        <p style={{ marginTop: '17px' }}>
          Tip: Keep your wrists relaxed and return your fingers
          to the home row after every reach.
        </p>
      </div>
    </section>
  )
}

function Lesson() {
  const { dayId } = useParams()
  const dayNumber = Number(dayId)

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completedDays, setCompletedDays] = useState(getCompletedLessons)
  const [practiceCompleted, setPracticeCompleted] = useState(false)

  useEffect(() => {
    let active = true

    async function loadLesson() {
      if (
        !Number.isInteger(dayNumber) ||
        dayNumber < 1 ||
        dayNumber > 30
      ) {
        setError('Invalid lesson number.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      setLesson(null)
      setPracticeCompleted(false)

      try {
        const data = await lessonService.getByDay(dayNumber)

        if (active) setLesson(data)
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load this lesson.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadLesson()

    return () => {
      active = false
    }
  }, [dayNumber])

  useEffect(() => {
    function refreshProgress() {
      setCompletedDays(getCompletedLessons())
    }

    window.addEventListener('lesson-progress-updated', refreshProgress)

    return () => {
      window.removeEventListener(
        'lesson-progress-updated',
        refreshProgress
      )
    }
  }, [])

  const isCompleted = completedDays.includes(dayNumber)

  const sections = useMemo(() => {
    if (!Array.isArray(lesson?.sections)) return []

    return [...lesson.sections].sort(
      (a, b) => a.order_index - b.order_index
    )
  }, [lesson])

  const wordBanks = Array.isArray(lesson?.word_banks)
    ? lesson.word_banks
    : []

  const learningGoal = sections.find(
    (section) => section.section_type === 'learning_goal'
  )

  const learningSections = sections.filter(
    (section) => section.section_type !== 'learning_goal'
  )

  const practiceSection = sections.find(
    (section) => section.section_type === 'practice'
  )

  const practiceWords = wordBanks
    .map((bank) => bank.words)
    .filter((words) => typeof words === 'string' && words.trim())
    .join(' ')

  const hasPractice = Boolean(practiceWords.trim())

  function handlePracticeComplete() {
    setPracticeCompleted(true)
  }

  function handlePracticeRestart() {
    setPracticeCompleted(false)
  }

  function handleCompleteLesson() {
    if (isCompleted || !practiceCompleted) return

    try {
      const updated = completeLesson(dayNumber)
      setCompletedDays(updated)
    } catch (err) {
      setError(err.message || 'Unable to save lesson progress.')
    }
  }

  if (loading) {
    return (
      <main className="lesson-page">
        <p className="lesson-status">Loading your lesson...</p>
      </main>
    )
  }

  if (error || !lesson) {
    return (
      <main className="lesson-page">
        <div className="lesson-status">
          <h2>Lesson unavailable</h2>
          <p>{error || 'We could not find this lesson.'}</p>
          <Link to="/learn">Back to Academy</Link>
        </div>
      </main>
    )
  }

  const completionButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    minHeight: '46px',
    padding: '0 22px',
    borderRadius: '12px',
    border: '1px solid',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.01em',
    cursor: isCompleted || practiceCompleted ? 'pointer' : 'not-allowed',
    transition: 'all 180ms ease',
    background: isCompleted
      ? 'linear-gradient(135deg, #166534, #15803d)'
      : practiceCompleted
        ? 'linear-gradient(135deg, #15803d, #22a05a)'
        : 'rgba(255,255,255,0.045)',
    color: isCompleted || practiceCompleted ? '#ffffff' : '#827575',
    borderColor: isCompleted || practiceCompleted
      ? 'rgba(74,222,128,0.45)'
      : 'rgba(255,255,255,0.09)',
    boxShadow: isCompleted || practiceCompleted
      ? '0 5px 22px rgba(34,160,90,0.18)'
      : 'none',
    opacity: isCompleted || practiceCompleted ? 1 : 0.8,
  }

  return (
    <main className="lesson-page">
      <header className="lesson-nav">
        <Link to="/learn" className="lesson-back">
          <ArrowLeft size={17} />
          <span>Academy</span>
        </Link>

        <Link to="/" className="lesson-logo">
          TYPE<span>UP</span>.
        </Link>

        <span className="lesson-day-label">
          DAY {String(dayNumber).padStart(2, '0')} / 30
        </span>
      </header>

      <div className="lesson-container">
        <section className="lesson-hero">
          <span className="lesson-eyebrow">
            YOUR 30-DAY JOURNEY · DAY {dayNumber}
          </span>

          <h1>{lesson.title}</h1>
          <p>{lesson.description}</p>

          <div className="lesson-meta">
            <span>
              <Clock3 size={15} />
              {lesson.duration_minutes} minutes
            </span>

            <span>
              <BookOpen size={15} />
              Typing Academy
            </span>
          </div>
        </section>

        {learningGoal && (
          <section className="lesson-objective">
            <div className="lesson-objective-icon">
              <Target size={22} />
            </div>

            <div>
              <span className="lesson-eyebrow">
                TODAY'S LEARNING GOAL
              </span>
              <p>{learningGoal.content}</p>
            </div>
          </section>
        )}

        <KeyboardFingerGuide dayNumber={dayNumber} />

        {learningSections.map((section, index) => {
          const isPractice = section.section_type === 'practice'
          const isAssessment =
            section.section_type === 'assessment' ||
            section.section_type === 'challenge'

          return (
            <section
              className="lesson-section"
              key={section.id || section.order_index}
              style={{ width: '100%', minWidth: 0 }}
            >
              <span className="lesson-eyebrow">
                {String(index + 1).padStart(2, '0')} ·{' '}
                {section.title.toUpperCase()}
              </span>

              <h2>{section.title}</h2>

              <div
                className="lesson-concepts"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr)',
                  width: '100%',
                  gap: '16px',
                }}
              >
                <article
                  className="lesson-concept"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                  }}
                >
                  <span className="lesson-concept-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h3>
                      {isPractice
                        ? 'Practice carefully'
                        : isAssessment
                          ? 'Test your understanding'
                          : 'Learn and understand'}
                    </h3>

                    <p>{section.content}</p>
                  </div>
                </article>
              </div>

              {isPractice && wordBanks.length > 0 && (
                <div className="lesson-keyboard-card">
                  <div className="lesson-keyboard-heading">
                    <BookOpen size={20} />
                    <span>{wordBanks[0].title}</span>
                  </div>

                  <p className="lesson-section-description">
                    Difficulty: {wordBanks[0].difficulty}
                  </p>
                </div>
              )}
            </section>
          )
        })}

        {hasPractice && (
          <section
            className="lesson-section"
            style={{ width: '100%', minWidth: 0 }}
          >
            <span className="lesson-eyebrow">
              YOUR DAILY TYPING EXERCISE
            </span>

            <h2>Put what you learned into practice</h2>

            <p className="lesson-section-description">
              Practise the words from today's lesson.
              Focus on accuracy before increasing your speed.
            </p>

            <TypingPractice
              key={`lesson-practice-${dayNumber}`}
              title={wordBanks[0]?.title || 'Daily typing practice'}
              description={
                practiceSection?.content ||
                'Type the words carefully and focus on accuracy.'
              }
              targetText={practiceWords}
              onComplete={handlePracticeComplete}
              onRestart={handlePracticeRestart}
            />
          </section>
        )}

        {!hasPractice && (
          <section className="lesson-section">
            <p className="lesson-section-description">
              No typing exercise is configured for this lesson yet.
              Please review the lesson content.
            </p>
          </section>
        )}

        <section
          className="lesson-next-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            alignItems: 'center',
            gap: '28px',
            width: '100%',
            padding: '28px',
            borderRadius: '18px',
            border: '1px solid rgba(154,56,50,0.3)',
            background:
              'linear-gradient(125deg, rgba(65,19,23,0.42), rgba(20,15,15,0.88))',
          }}
        >
          <div>
            <span className="lesson-eyebrow">LESSON PROGRESS</span>

            <h2 style={{ marginTop: '12px' }}>
              {isCompleted
                ? 'Lesson completed!'
                : practiceCompleted
                  ? 'Excellent work!'
                  : 'Finished this lesson?'}
            </h2>

            <p
              className="lesson-section-description"
              style={{ marginTop: '10px', maxWidth: '440px' }}
            >
              {isCompleted
                ? 'Your lesson progress has been saved successfully. You can continue to another lesson.'
                : practiceCompleted
                  ? 'You completed all the practice words. Mark this lesson complete when you are ready.'
                  : 'Finish the daily typing exercise to activate the completion button. Your lesson will not be marked complete automatically.'}
            </p>

            <button
              type="button"
              onClick={handleCompleteLesson}
              disabled={isCompleted || !practiceCompleted}
              style={completionButtonStyle}
            >
              <CheckCircle2 size={18} />

              {isCompleted
                ? 'Lesson Completed'
                : practiceCompleted
                  ? 'Mark as Complete'
                  : 'Complete Practice First'}
            </button>

            {practiceCompleted && !isCompleted && (
              <p
                style={{
                  color: '#4ade80',
                  fontSize: '12px',
                  marginTop: '10px',
                }}
              >
                <CheckCircle2
                  size={13}
                  style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    marginRight: '5px',
                  }}
                />
                Practice completed · Ready to save
              </p>
            )}
          </div>

          <div>
            <span className="lesson-eyebrow">KEEP LEARNING</span>

            <h2 style={{ marginTop: '12px' }}>
              {dayNumber < 30
                ? 'Continue at your own pace'
                : 'Your 30-day journey'}
            </h2>

            <p
              className="lesson-section-description"
              style={{ marginTop: '10px' }}
            >
              All lessons are open. You can revisit any topic
              whenever you want to learn or revise.
            </p>

            {isCompleted && dayNumber < 30 && (
              <Link
                to={`/learn/day/${dayNumber + 1}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  color: '#f0a078',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Continue to Day {dayNumber + 1}
                <ArrowRight size={16} />
              </Link>
            )}

            {isCompleted && dayNumber === 30 && (
              <Link
                to="/learn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  color: '#4ade80',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Return to Academy
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </section>

        <div className="lesson-footer">
          <Link to="/learn" className="lesson-footer-link">
            <ArrowLeft size={16} />
            Back to learning path
          </Link>

          <span>Take your time. Accuracy comes first.</span>
        </div>
      </div>
    </main>
  )
}

export default Lesson
