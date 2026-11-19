
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Gamepad2,
  Trophy,
  Target,
  History as HistoryIcon,
  Trash2,
  RotateCcw,
  Eye,
  X,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import {
  getGameHistory,
  clearGameHistory,
} from '../utility/gameHistory'

import './GameHistory.css'

const GAME_NAMES = {
  'word-rush': 'Word Rush',
  'key-challenge': 'Key Challenge',
  accuracy: 'Accuracy Challenge',
  'speed-sprint': 'Speed Sprint',
}

function formatDate(date) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable'
  }

  return parsedDate.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPerformanceFeedback(accuracy) {
  if (accuracy >= 95) {
    return {
      title: 'Excellent accuracy!',
      message: 'You maintained excellent typing accuracy. Keep practising consistently.',
      type: 'excellent',
    }
  }

  if (accuracy >= 85) {
    return {
      title: 'Good performance!',
      message: 'You are building a good foundation. Keep working on accuracy.',
      type: 'good',
    }
  }

  return {
    title: 'Room for improvement',
    message: 'Slow down, focus on correct keystrokes and practise regularly.',
    type: 'improve',
  }
}

export default function GameHistory() {
  const [history, setHistory] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
const [selectedLeaderboardGame, setSelectedLeaderboardGame] =
  useState('word-rush')
  useEffect(() => {
    setHistory(getGameHistory())
  }, [])

  const stats = useMemo(() => {
    const totalGames = history.length

    const bestScore = history.reduce(
      (best, item) => Math.max(best, Number(item.score) || 0),
      0
    )

    const averageAccuracy = totalGames
      ? history.reduce(
          (sum, item) => sum + (Number(item.accuracy) || 0),
          0
        ) / totalGames
      : 0

    const gameCounts = {}

    history.forEach(item => {
      gameCounts[item.gameId] = (gameCounts[item.gameId] || 0) + 1
    })

    return {
      totalGames,
      bestScore,
      averageAccuracy,
      gameCounts,
    }
  }, [history])

  const bestScores = useMemo(() => {
    const best = {}

    history.forEach(item => {
      const current = best[item.gameId]

      if (!current || Number(item.score) > Number(current.score)) {
        best[item.gameId] = item
      }
    })

    return best
  }, [history])
  const leaderboardEntries = useMemo(() => {
  return history
    .filter(item => item.gameId === selectedLeaderboardGame)
    .sort((a, b) => {
      const scoreDifference =
        Number(b.score) - Number(a.score)

      if (scoreDifference !== 0) return scoreDifference

      const accuracyDifference =
        Number(b.accuracy) - Number(a.accuracy)

      if (accuracyDifference !== 0) return accuracyDifference

      return Number(a.mistakes) - Number(b.mistakes)
    })
    .slice(0, 5)
}, [history, selectedLeaderboardGame])

const recentPerformance = useMemo(() => {
  const attempts = history
    .filter(item => item.gameId === selectedLeaderboardGame)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime()
    )

  if (attempts.length < 2) return null

  const latest = attempts[0]
  const previous = attempts[1]

  return {
    latestScore: Number(latest.score) || 0,
    previousScore: Number(previous.score) || 0,
    scoreChange:
      (Number(latest.score) || 0) -
      (Number(previous.score) || 0),
    latestAccuracy: Number(latest.accuracy) || 0,
    previousAccuracy: Number(previous.accuracy) || 0,
    accuracyChange:
      (Number(latest.accuracy) || 0) -
      (Number(previous.accuracy) || 0),
  }
}, [history, selectedLeaderboardGame])

  function handleClearHistory() {
    clearGameHistory()
    setHistory([])
    setSelectedResult(null)
    setShowConfirm(false)
  }

  function openReport(item) {
    setSelectedResult(item)
  }

  function closeReport() {
    setSelectedResult(null)
  }

  const selectedAccuracy = Number(selectedResult?.accuracy) || 0
  const selectedFeedback = selectedResult
    ? getPerformanceFeedback(selectedAccuracy)
    : null

  return (
    <main className="game-history-page">
      <div className="game-history-container">
        <Link to="/games" className="game-history-back">
          <ArrowLeft size={16} />
          Back to Games
        </Link>

        <header className="game-history-header">
          <span className="game-history-eyebrow">
            TYPEUP PLAY ZONE
          </span>

          <h1>
            Game <span>History</span>
          </h1>

          <p>
            Track your attempts, celebrate your best scores and keep improving.
          </p>
        </header>

        <section className="game-history-stats">
          <article className="game-history-stat">
            <Gamepad2 />
            <span>Total Attempts</span>
            <strong>{stats.totalGames}</strong>
          </article>

          <article className="game-history-stat">
            <Trophy />
            <span>Best Score</span>
            <strong>{stats.bestScore}</strong>
          </article>

          <article className="game-history-stat">
            <Target />
            <span>Average Accuracy</span>
            <strong>{stats.averageAccuracy.toFixed(1)}%</strong>
          </article>

          <article className="game-history-stat">
            <HistoryIcon />
            <span>Games Played</span>
            <strong>{Object.keys(stats.gameCounts).length}/4</strong>
          </article>
        </section>

<section className="game-history-section leaderboard-section">
  <div className="game-history-section-heading">
    <div>
      <h2>Personal Leaderboard</h2>
      <p>Your best five attempts in each game.</p>
    </div>
    <Trophy size={23} color="#e97843" />
  </div>

  <div className="leaderboard-game-tabs">
    {Object.entries(GAME_NAMES).map(([gameId, gameName]) => (
      <button
        key={gameId}
        className={
          selectedLeaderboardGame === gameId ? 'active' : ''
        }
        onClick={() => setSelectedLeaderboardGame(gameId)}
      >
        {gameName}
      </button>
    ))}
  </div>

  {leaderboardEntries.length === 0 ? (
    <div className="leaderboard-empty">
      <Trophy size={30} />
      <h3>No rankings yet</h3>
      <p>Play this game to create your personal leaderboard.</p>
    </div>
  ) : (
    <div className="leaderboard-list">
      {leaderboardEntries.map((item, index) => (
        <article className="leaderboard-item" key={item.id}>
          <div className={`leaderboard-rank rank-${index + 1}`}>
            {index + 1}
          </div>

          <div className="leaderboard-attempt-info">
            <strong>
              {index === 0
                ? 'Personal Best'
                : `Attempt #${index + 1}`}
            </strong>
            <span>{formatDate(item.completedAt)}</span>
          </div>

          <div className="leaderboard-result">
            <strong>{item.score}</strong>
            <span>Score</span>
          </div>

          <div className="leaderboard-result">
            <strong>{Number(item.accuracy).toFixed(1)}%</strong>
            <span>Accuracy</span>
          </div>

          <div className="leaderboard-result">
            <strong>{item.mistakes}</strong>
            <span>Mistakes</span>
          </div>
        </article>
      ))}
    </div>
  )}

  <div className="leaderboard-performance">
    <div className="leaderboard-performance-heading">
      <h3>Recent Performance</h3>
      <span>Latest vs Previous Attempt</span>
    </div>

    {recentPerformance ? (
      <div className="leaderboard-comparison">
        <article>
          <span>Score change</span>
          <strong className={
            recentPerformance.scoreChange > 0
              ? 'performance-positive'
              : recentPerformance.scoreChange < 0
                ? 'performance-negative'
                : ''
          }>
            {recentPerformance.scoreChange > 0 ? '+' : ''}
            {recentPerformance.scoreChange}
          </strong>
        </article>

        <article>
          <span>Accuracy change</span>
          <strong className={
            recentPerformance.accuracyChange > 0
              ? 'performance-positive'
              : recentPerformance.accuracyChange < 0
                ? 'performance-negative'
                : ''
          }>
            {recentPerformance.accuracyChange > 0 ? '+' : ''}
            {recentPerformance.accuracyChange.toFixed(1)}%
          </strong>
        </article>
      </div>
    ) : (
      <p className="leaderboard-no-comparison">
        Complete at least two attempts in this game to compare your performance.
      </p>
    )}
  </div>
</section>


        <section className="game-history-section">
          <div className="game-history-section-heading">
            <div>
              <h2>Best Scores</h2>
              <p>Your personal best in each game.</p>
            </div>
          </div>

          <div className="game-best-grid">
            {Object.entries(GAME_NAMES).map(([gameId, gameName]) => {
              const best = bestScores[gameId]

              return (
                <article className="game-best-card" key={gameId}>
                  <span>{gameName}</span>
                  <strong>{best ? best.score : '—'}</strong>
                  <small>
                    {best
                      ? `${best.accuracy}% accuracy`
                      : 'No attempts yet'}
                  </small>
                </article>
              )
            })}
          </div>
        </section>

        <section className="game-history-section">
          <div className="game-history-section-heading">
            <div>
              <h2>Previous Attempts</h2>
              <p>Your latest game results.</p>
            </div>

            {history.length > 0 && (
              <button
                className="game-history-clear"
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 size={15} />
                Clear History
              </button>
            )}
          </div>

          {showConfirm && (
            <div className="game-history-confirm">
              <p>Are you sure you want to delete all game history?</p>
              <button onClick={handleClearHistory}>Yes, clear</button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          )}

          {history.length === 0 ? (
            <div className="game-history-empty">
              <Gamepad2 size={36} />
              <h3>No games played yet</h3>
              <p>Complete a typing game to see your results here.</p>

              <Link to="/games">
                Play a Game <RotateCcw size={15} />
              </Link>
            </div>
          ) : (
            <div className="game-history-table-wrap">
              <table className="game-history-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Mistakes</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Report</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td>{item.gameName || GAME_NAMES[item.gameId]}</td>
                      <td>{item.score}</td>
                      <td>{Number(item.accuracy).toFixed(1)}%</td>
                      <td>{item.mistakes}</td>
                      <td>{item.duration}s</td>
                      <td>{formatDate(item.completedAt)}</td>
                      <td>
                        <button
                          className="game-history-report-button"
                          onClick={() => openReport(item)}
                        >
                          <Eye size={14} />
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedResult && (
        <div
          className="game-report-overlay"
          onClick={closeReport}
        >
          <section
            className="game-report-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-report-title"
            onClick={event => event.stopPropagation()}
          >
            <div className="game-report-header">
              <div>
                <span className="game-history-eyebrow">
                  TYPEUP PLAY ZONE
                </span>

                <h2 id="game-report-title">Game Report</h2>
                <p>
                  {selectedResult.gameName ||
                    GAME_NAMES[selectedResult.gameId]}
                </p>
              </div>

              <button
                className="game-report-close"
                onClick={closeReport}
                aria-label="Close report"
              >
                <X size={20} />
              </button>
            </div>

            <div className="game-report-date">
              <Clock3 size={15} />
              {formatDate(selectedResult.completedAt)}
            </div>

            <div className="game-report-metrics">
              <article>
                <Trophy />
                <span>Final Score</span>
                <strong>{selectedResult.score}</strong>
              </article>

              <article>
                <Target />
                <span>Accuracy</span>
                <strong>{selectedAccuracy.toFixed(1)}%</strong>
              </article>

              <article>
                <AlertCircle />
                <span>Mistakes</span>
                <strong>{selectedResult.mistakes}</strong>
              </article>

              <article>
                <Clock3 />
                <span>Time Taken</span>
                <strong>{selectedResult.duration}s</strong>
              </article>
            </div>

            <div className="game-report-feedback">
              {selectedFeedback.type === 'excellent' ? (
                <CheckCircle2 />
              ) : (
                <Target />
              )}

              <div>
                <h3>{selectedFeedback.title}</h3>
                <p>{selectedFeedback.message}</p>
              </div>
            </div>

            <div className="game-report-footer">
              <span>
                Report ID: {selectedResult.id}
              </span>

              <button onClick={closeReport}>
                Close Report
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
