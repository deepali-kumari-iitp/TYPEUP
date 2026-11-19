
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Flame,
  Keyboard,
  Target,
  Trophy,
  Hand,
  Gamepad2,
  History as HistoryIcon,
  CheckCircle2,
} from 'lucide-react'

import { lessonService } from '../services/api'
import { getCompletedLessons } from '../utility/lessonProgress'
import './Dashboard.css'

function Dashboard() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completedDays, setCompletedDays] = useState(getCompletedLessons)

  useEffect(() => {
    let active = true

    async function loadLessons() {
      try {
        setLoading(true)
        setError('')

        const data = await lessonService.getAll()

        if (active) {
          setLessons(data)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load lessons.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadLessons()

    return () => {
      active = false
    }
  }, [])

  // Keep progress synchronized across pages.
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

  const completedLessons = completedDays.length

  const progress = Math.min(
    100,
    Math.round((completedLessons / 30) * 100)
  )

  // Find the first lesson that has not been completed.
  const nextLesson = lessons
    .filter((lesson) => !completedDays.includes(lesson.day_number))
    .sort((a, b) => a.day_number - b.day_number)[0]

  const courseCompleted = completedLessons >= 30

  return (
    <main className="dashboard">
      <header className="dashboard-nav">
        <Link to="/" className="dashboard-logo">
          TYPE<span>UP</span>
          <span className="dashboard-logo-dot">.</span>
        </Link>

        <nav className="dashboard-nav-links">
          <Link to="/dashboard" className="active">
            Dashboard
          </Link>

          <Link to="/learn">Learn</Link>
          <Link to="/arena">Typing Arena</Link>
          <Link to="/finger-lab">Finger Lab</Link>
          <Link to="/games">Games</Link>
          <Link to="/game-history">Game History</Link>
        </nav>

        <Link to="/" className="dashboard-home-link">
          Home <ArrowRight size={15} />
        </Link>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              YOUR LEARNING SPACE
            </span>

            <h1>
              Welcome to your <span>typing journey.</span>
            </h1>

            <p>
              Build accuracy, develop muscle memory and become a
              confident touch typist — one day at a time.
            </p>

            {/* Continue Learning */}
            {!loading && !error && (
              <Link
                to={
                  courseCompleted
                    ? '/learn'
                    : nextLesson
                      ? `/learn/day/${nextLesson.day_number}`
                      : '/learn'
                }
                className="dashboard-action-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  marginTop: '18px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(110deg, #9a3832, #e97843)',
                  color: '#fff',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 5px 22px rgba(233, 120, 67, 0.16)',
                }}
              >
                {courseCompleted
                  ? 'Course Completed'
                  : nextLesson
                    ? `Continue Learning · Day ${nextLesson.day_number}`
                    : 'Explore Learning Path'}

                {courseCompleted ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <ArrowRight size={17} />
                )}
              </Link>
            )}
          </div>

          <div className="dashboard-welcome-icon">
            <Keyboard size={54} strokeWidth={1.2} />
          </div>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <BookOpen size={20} />
            </div>

            <span>Lessons completed</span>
            <strong>
              {completedLessons} <small>/ 30</small>
            </strong>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <ChartNoAxesColumnIncreasing size={20} />
            </div>

            <span>Course progress</span>
            <strong>{progress}%</strong>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <Flame size={20} />
            </div>

            <span>Learning streak</span>
            <strong>
              0 <small>days</small>
            </strong>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <Trophy size={20} />
            </div>

            <span>Achievements</span>
            <strong>
              0 <small>earned</small>
            </strong>
          </article>
        </section>

        <section className="dashboard-main-grid">
          <div className="dashboard-course-panel">
            <div className="dashboard-section-heading">
              <div>
                <span className="dashboard-eyebrow">
                  30-DAY ACADEMY
                </span>

                <h2>Your learning path</h2>
              </div>

              <span className="dashboard-course-count">
                {loading ? 'Loading...' : `${lessons.length} lessons`}
              </span>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="dashboard-progress-caption">
              {completedLessons} of 30 lessons completed
            </p>

            {loading && (
              <div className="dashboard-message">
                Loading your lessons...
              </div>
            )}

            {error && (
              <div className="dashboard-message dashboard-error">
                <p>{error}</p>

                <button onClick={() => window.location.reload()}>
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && lessons.length === 0 && (
              <div className="dashboard-message">
                No lessons are available yet.
              </div>
            )}

            {!loading && !error && lessons.length > 0 && (
              <div className="dashboard-lesson-list">
                {lessons
                  .slice()
                  .sort((a, b) => a.day_number - b.day_number)
                  .map((lesson) => {
                    const isCompleted = completedDays.includes(
                      lesson.day_number
                    )

                    return (
                      <article
                        className={`dashboard-lesson ${
                          isCompleted ? 'completed' : ''
                        }`}
                        key={lesson.id}
                      >
                        <div className="dashboard-lesson-number">
                          {isCompleted ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            String(lesson.day_number).padStart(2, '0')
                          )}
                        </div>

                        <div className="dashboard-lesson-info">
                          <span>DAY {lesson.day_number}</span>
                          <h3>{lesson.title}</h3>
                          <p>{lesson.description}</p>
                        </div>

                        <div className="dashboard-lesson-duration">
                          {lesson.duration_minutes} min
                        </div>

                        <Link
                          to={`/learn/day/${lesson.day_number}`}
                          aria-label={`Open Day ${lesson.day_number}: ${lesson.title}`}
                          title={`Open Day ${lesson.day_number}`}
                          style={{
                            color: isCompleted ? '#4ade80' : '#e97843',
                            display: 'grid',
                            placeItems: 'center',
                            textDecoration: 'none',
                            marginLeft: '10px',
                          }}
                        >
                          <ArrowRight size={17} />
                        </Link>
                      </article>
                    )
                  })}
              </div>
            )}
          </div>

          <aside className="dashboard-side-panel">
            <div className="dashboard-quick-card">
              <div className="dashboard-side-icon">
                <Target size={23} />
              </div>

              <span className="dashboard-eyebrow">
                READY TO PRACTICE?
              </span>

              <h2>Every keystroke makes you better.</h2>

              <p>
                Head to the typing arena and put your skills to the test.
              </p>

              <Link
                to="/arena"
                className="dashboard-action-link"
              >
                Enter typing arena <ArrowRight size={17} />
              </Link>
            </div>

            <div className="dashboard-games-card">
              <div className="dashboard-games-icon">
                <Gamepad2 size={25} />
              </div>

              <span className="dashboard-eyebrow">
                TYPEUP PLAY ZONE
              </span>

              <h2>Play. Practise. Improve.</h2>

              <p>
                Challenge yourself with interactive typing games.
                Improve your speed, accuracy and keyboard reflexes.
              </p>

              <Link to="/games" className="dashboard-action-link">
                Explore Games <ArrowRight size={17} />
              </Link>
            </div>

            <div className="dashboard-finger-card">
              <div className="dashboard-finger-icon">
                <Hand size={25} />
              </div>

              <span className="dashboard-eyebrow">
                LEARN FINGER PLACEMENT
              </span>

              <h2>Train your fingers. Build muscle memory.</h2>

              <p>
                Discover the correct finger for every key with
                interactive keyboard exercises.
              </p>

              <Link
                to="/finger-lab"
                className="dashboard-action-link"
              >
                Practice now <ArrowRight size={17} />
              </Link>
            </div>

            <div className="dashboard-game-history-card">
              <div className="dashboard-game-history-icon">
                <HistoryIcon size={25} />
              </div>

              <span className="dashboard-eyebrow">
                YOUR PLAY RECORD
              </span>

              <h2>Every attempt tells a story.</h2>

              <p>
                Review your previous game results, track your best scores
                and see how your typing skills are improving.
              </p>

              <Link
                to="/game-history"
                className="dashboard-action-link"
              >
                View Game History <ArrowRight size={17} />
              </Link>
            </div>

            <div className="dashboard-tip-card">
              <span className="dashboard-eyebrow">
                A SMALL REMINDER
              </span>

              <h3>Accuracy before speed.</h3>

              <p>
                Focus on correct finger placement first. Speed will
                develop naturally with consistent practice.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
