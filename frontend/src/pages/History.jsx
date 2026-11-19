
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ArrowLeft,
  Clock3,
  Target,
  Zap,
  Trophy,
  Trash2,
  History as HistoryIcon,
  BarChart3,
} from 'lucide-react'

import {
  getArenaHistory,
  clearArenaHistory,
} from '../../utility/arenaHistory.js'

import { calculateTypingAnalysis } from '../../utility/typingAnalysis.js'

import './History.css'

const HistoryChart = lazy(
  () => import('../components/HistoryChart.jsx')
)

const TypingAnalysis = lazy(
  () => import('../components/TypingAnalysis.jsx')
)

function History() {
  const [history, setHistory] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)

  useEffect(() => {
    setHistory(getArenaHistory())
  }, [])

  const totalTests = history.length

  const bestWpm = totalTests
    ? Math.max(...history.map((item) => item.netWpm || 0))
    : 0

  const averageWpm = totalTests
    ? Math.round(
        history.reduce(
          (sum, item) => sum + (item.netWpm || 0),
          0
        ) / totalTests
      )
    : 0

  const averageAccuracy = totalTests
    ? Math.round(
        history.reduce(
          (sum, item) => sum + (item.accuracy || 0),
          0
        ) / totalTests
      )
    : 0

  const chartData = [...history]
    .reverse()
    .map((item, index) => ({
      attempt: `Test ${index + 1}`,
      wpm: item.netWpm || 0,
      accuracy: item.accuracy || 0,
    }))

  const selectedAnalysis = useMemo(() => {
    if (!selectedResult) return null

    return calculateTypingAnalysis({
      typedWords: selectedResult.typedWords || [],
      targetWords: selectedResult.targetWords || [],
      wpmSamples: selectedResult.wpmSamples || [],
      accuracy: selectedResult.accuracy || 0,
      netWpm: selectedResult.netWpm || 0,
      totalTypedCharacters: selectedResult.totalTypedCharacters || 0,
      correctCharacters: selectedResult.correctCharacters || 0,
    })
  }, [selectedResult])

  function handleClearHistory() {
    if (history.length === 0) return

    const confirmed = window.confirm(
      'Are you sure you want to clear all typing history? This action cannot be undone.'
    )

    if (!confirmed) return

    clearArenaHistory()
    setHistory([])
    setSelectedResult(null)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date'
    }

    return date.toLocaleString()
  }

  function getTestMode(item) {
    const modes = {
      time: 'Time',
      words: 'Words',
      quote: 'Quote',
      zen: 'Zen',
    }

    return modes[item.mode] || 'Time'
  }

  function getTestTarget(item) {
    if (item.mode === 'words') {
      return `${item.wordLimit || 0} words`
    }

    if (item.mode === 'quote') {
      return 'Complete quote'
    }

    if (item.mode === 'zen') {
      return 'Free practice'
    }

    return `${item.duration || 0}s`
  }

  function getActualTime(item) {
    const seconds = item.elapsedSeconds ?? item.duration

    if (seconds === null || seconds === undefined) {
      return '—'
    }

    const safeSeconds = Math.max(0, Math.floor(seconds))
    const minutes = Math.floor(safeSeconds / 60)
    const remainingSeconds = safeSeconds % 60

    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`
  }

  return (
    <main className="history-page">
      <div className="history-container">

        <header className="history-header">
          <Link to="/arena" className="history-back">
            <ArrowLeft size={17} />
            Back to Arena
          </Link>

          <span className="history-eyebrow">
            YOUR PERFORMANCE
          </span>

          <h1>
            Typing <span>History</span>
          </h1>

          <p>
            Every test is a step towards becoming a better typist.
          </p>
        </header>

        <section className="history-stats">
          <article className="history-stat-card">
            <Zap />
            <span>Best WPM</span>
            <strong>{bestWpm}</strong>
          </article>

          <article className="history-stat-card">
            <Target />
            <span>Average Accuracy</span>
            <strong>{averageAccuracy}%</strong>
          </article>

          <article className="history-stat-card">
            <Trophy />
            <span>Average WPM</span>
            <strong>{averageWpm}</strong>
          </article>

          <article className="history-stat-card">
            <HistoryIcon />
            <span>Tests Completed</span>
            <strong>{totalTests}</strong>
          </article>
        </section>

        <section className="history-chart">
          <div className="history-chart-heading">
            <div>
              <h2>Speed Progress</h2>
              <p>
                Track your net WPM across completed tests.
              </p>
            </div>
          </div>

          {chartData.length < 2 ? (
            <div className="history-chart-empty">
              Complete at least two typing tests to see your improvement graph.
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="history-chart-empty">
                  Loading performance chart...
                </div>
              }
            >
              <HistoryChart data={chartData} />
            </Suspense>
          )}
        </section>

        <section className="history-records">
          <div className="history-records-header">
            <div>
              <h2>Previous Attempts</h2>
              <p>Your latest typing test results.</p>
            </div>

            {totalTests > 0 && (
              <button
                type="button"
                className="history-clear-button"
                onClick={handleClearHistory}
              >
                <Trash2 size={15} />
                Clear history
              </button>
            )}
          </div>

          {totalTests === 0 ? (
            <div className="history-empty">
              <Clock3 size={35} />

              <h3>No typing tests yet</h3>

              <p>
                Complete your first typing test to see your
                performance history here.
              </p>

              <Link
                to="/arena"
                className="history-start-button"
              >
                Start typing
              </Link>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Target</th>
                    <th>Net WPM</th>
                    <th>Raw WPM</th>
                    <th>Accuracy</th>
                    <th>Errors</th>
                    <th>Time Taken</th>
                    <th>Analysis</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.completedAt)}</td>
                      <td>{getTestMode(item)}</td>
                      <td>{getTestTarget(item)}</td>
                      <td className="history-wpm">
                        {item.netWpm ?? 0}
                      </td>
                      <td>{item.rawWpm ?? 0}</td>
                      <td>{item.accuracy ?? 0}%</td>
                      <td>{item.errors ?? 0}</td>
                      <td>{getActualTime(item)}</td>

                      <td>
                        <button
                          type="button"
                          className="history-analysis-button"
                          onClick={() => setSelectedResult(item)}
                        >
                          <BarChart3 size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedResult && (
          <section className="history-analysis-section">
            <div className="history-analysis-heading">
              <div>
                <span className="history-eyebrow">
                  SELECTED TEST
                </span>
                <h2>Test Performance Report</h2>
                <p>
                  {getTestMode(selectedResult)} mode ·{' '}
                  {formatDate(selectedResult.completedAt)}
                </p>
              </div>

              <button
                type="button"
                className="history-clear-button"
                onClick={() => setSelectedResult(null)}
              >
                Close Report
              </button>
            </div>

            <Suspense
              fallback={
                <div className="history-chart-empty">
                  Loading detailed analysis...
                </div>
              }
            >
              <TypingAnalysis
                analysis={selectedAnalysis}
                result={selectedResult}
              />
            </Suspense>
          </section>
        )}

      </div>
    </main>
  )
}

export default History
