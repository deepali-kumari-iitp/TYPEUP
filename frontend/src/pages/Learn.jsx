
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Target,
} from 'lucide-react'
import { lessonService } from '../services/api'
import { getCompletedLessons } from '../utility/lessonProgress'
import './Learn.css'

const stages = [
  {
    id: 1,
    title: 'The Foundations',
    subtitle: 'Build your typing foundation',
    start: 1,
    end: 7,
  },
  {
    id: 2,
    title: 'Finger Control',
    subtitle: 'Train every finger independently',
    start: 8,
    end: 14,
  },
  {
    id: 3,
    title: 'Touch Typing',
    subtitle: 'Type without looking at the keyboard',
    start: 15,
    end: 21,
  },
  {
    id: 4,
    title: 'Speed & Accuracy',
    subtitle: 'Develop speed without sacrificing accuracy',
    start: 22,
    end: 28,
  },
  {
    id: 5,
    title: 'Final Challenge',
    subtitle: 'Test everything you have learned',
    start: 29,
    end: 30,
  },
]

function Learn() {
  const [lessons, setLessons] = useState([])
  const [completedDays, setCompletedDays] = useState(getCompletedLessons)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Keep lesson progress synchronized across pages.
  useEffect(() => {
    function refreshProgress() {
      setCompletedDays(getCompletedLessons())
    }

    window.addEventListener(
      'lesson-progress-updated',
      refreshProgress
    )

    return () => {
      window.removeEventListener(
        'lesson-progress-updated',
        refreshProgress
      )
    }
  }, [])

  // Load all 30 lessons from the backend.
  useEffect(() => {
    let active = true

    async function loadLessons() {
      try {
        const data = await lessonService.getAll()

        if (active) {
          setLessons(data)
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || 'Unable to load the academy.'
          )
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

  const completedCount = completedDays.length
  const progress = Math.round((completedCount / 30) * 100)

  return (
    <main className="learn-page">
      <header className="learn-nav">
        <Link to="/" className="learn-logo">
          TYPE<span>UP</span>.
        </Link>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learn" className="active">
            Learn
          </Link>
          <Link to="/arena">Typing Arena</Link>
        </nav>
      </header>

      <div className="learn-container">
        <section className="learn-hero">
          <span className="learn-eyebrow">
            THE TYPEUP ACADEMY
          </span>

          <h1>
            Thirty days to a <span>better typist.</span>
          </h1>

          <p>
            A structured journey from your first keystroke to
            confident touch typing. Learn at your pace, one
            lesson at a time.
          </p>
        </section>

        <section className="learn-progress-card">
          <div className="learn-progress-top">
            <div>
              <span className="learn-eyebrow">
                YOUR JOURNEY
              </span>

              <h2>
                {completedCount} of 30 days completed
              </h2>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="learn-progress-track">
            <div
              className="learn-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="learn-progress-bottom">
            <span>
              <Target size={15} />
              Learn at your own pace
            </span>

            <span>
              <Clock3 size={15} />
              About 30 min per lesson
            </span>
          </div>
        </section>

        <div className="learn-heading">
          <div>
            <span className="learn-eyebrow">
              YOUR CURRICULUM
            </span>

            <h2>The 30-day learning path</h2>
          </div>

          <span className="learn-total">
            5 stages · 30 lessons
          </span>
        </div>

        {loading && (
          <div className="learn-message">
            Loading your learning path...
          </div>
        )}

        {error && (
          <div className="learn-message learn-error">
            {error}
          </div>
        )}

        {!loading && !error && lessons.length === 0 && (
          <div className="learn-message">
            No lessons are available yet.
          </div>
        )}

        {!loading && !error && lessons.length > 0 && (
          <div className="learn-stages">
            {stages.map((stage) => {
              const stageLessons = lessons.filter(
                (lesson) =>
                  lesson.day_number >= stage.start &&
                  lesson.day_number <= stage.end
              )

              const stageCompleted = stageLessons.filter(
                (lesson) =>
                  completedDays.includes(lesson.day_number)
              ).length

              return (
                <section
                  className="learn-stage"
                  key={stage.id}
                >
                  <div className="learn-stage-heading">
                    <div className="learn-stage-number">
                      {String(stage.id).padStart(2, '0')}
                    </div>

                    <div className="learn-stage-title">
                      <span>STAGE {stage.id}</span>
                      <h3>{stage.title}</h3>
                      <p>{stage.subtitle}</p>
                    </div>

                    <span className="learn-stage-count">
                      {stageCompleted}/{stageLessons.length}
                    </span>
                  </div>

                  <div className="learn-day-list">
                    {stageLessons.map((lesson) => {
                      const day = lesson.day_number
                      const isCompleted =
                        completedDays.includes(day)

                      // All lessons are accessible from the beginning.
                      return (
                        <article
                          className={`learn-day ${
                            isCompleted ? 'completed' : ''
                          }`}
                          key={lesson.id}
                        >
                          <div className="learn-day-number">
                            {isCompleted ? (
                              <Check size={17} />
                            ) : (
                              String(day).padStart(2, '0')
                            )}
                          </div>

                          <div className="learn-day-info">
                            <span>DAY {day}</span>
                            <h4>{lesson.title}</h4>
                            <p>{lesson.description}</p>
                          </div>

                          <div className="learn-day-action">
                            <span>
                              {lesson.duration_minutes} min
                            </span>

                            <Link
                              to={`/learn/day/${day}`}
                              aria-label={`Open Day ${day}: ${lesson.title}`}
                              title={`Open Day ${day}`}
                            >
                              <ArrowRight size={17} />
                            </Link>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        <section className="learn-bottom-note">
          <BookOpen size={20} />

          <p>
            Every lesson is open. Follow the recommended
            sequence or choose any topic you want to learn.
            Your completed lessons will be saved automatically.
          </p>
        </section>
      </div>
    </main>
  )
}

export default Learn
