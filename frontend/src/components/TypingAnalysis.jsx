
import {
  Activity,
  Target,
  Zap,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Keyboard,
} from 'lucide-react'

import './TypingAnalysis.css'

export default function TypingAnalysis({ analysis, result }) {
  if (!analysis || !result) {
    return (
      <div className="typing-analysis-empty">
        <Activity size={28} />
        <p>Detailed analysis is not available for this test.</p>
      </div>
    )
  }

  const weakKeys = analysis.weakKeys || []
  const speedTrend = analysis.speedTrend || []
  const suggestions = analysis.suggestions || []
  const consistency = analysis.consistency || {}

  const maxWpm = Math.max(
    1,
    ...speedTrend.map((sample) => sample.wpm || 0)
  )

  return (
    <section className="typing-analysis">
      <div className="analysis-heading">
        <div>
          <span className="analysis-eyebrow">PERFORMANCE REPORT</span>
          <h2>Detailed Typing Analysis</h2>
          <p>Understand your typing performance and identify areas to improve.</p>
        </div>
        <Activity size={26} />
      </div>

      <div className="analysis-metrics">
        <Metric
          icon={<Zap size={18} />}
          label="Net WPM"
          value={analysis.netWpm ?? result.netWpm ?? 0}
        />

        <Metric
          icon={<TrendingUp size={18} />}
          label="Raw WPM"
          value={result.rawWpm ?? 0}
        />

        <Metric
          icon={<Target size={18} />}
          label="Accuracy"
          value={`${analysis.accuracy ?? result.accuracy ?? 0}%`}
        />

        <Metric
          icon={<AlertCircle size={18} />}
          label="Incorrect Characters"
          value={analysis.incorrectCharacters ?? 0}
        />
      </div>

      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>
            <Activity size={18} />
            Typing Consistency
          </h3>

          <div className="consistency-score">
            <strong>
              {consistency.score === null || consistency.score === undefined
                ? 'N/A'
                : `${consistency.score}%`}
            </strong>
            <span>{consistency.label || 'Not enough data'}</span>
          </div>

          <p className="analysis-description">
            {consistency.score == null
              ? 'Complete a longer test to measure your typing consistency.'
              : 'This score estimates how steadily your typing speed was maintained.'}
          </p>
        </div>

        <div className="analysis-card">
          <h3>
            <Keyboard size={18} />
            Weak Keys / Characters
          </h3>

          {weakKeys.length > 0 ? (
            <div className="weak-keys">
              {weakKeys.slice(0, 10).map((item) => (
                <div className="weak-key-item" key={item.key}>
                  <span className="weak-key-character">
                    {item.key === ' ' ? 'Space' : item.key}
                  </span>
                  <span>{item.errors} errors</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="analysis-description">
              No character mistakes were detected in the saved words.
            </p>
          )}
        </div>
      </div>

      <div className="analysis-card speed-card">
        <h3>
          <TrendingUp size={18} />
          Typing Speed Trend
        </h3>

        {speedTrend.length > 1 ? (
          <div className="speed-chart">
            {speedTrend.map((sample) => (
              <div className="speed-bar-column" key={sample.second}>
                <span className="speed-bar-value">{sample.wpm}</span>
                <div className="speed-bar-track">
                  <div
                    className="speed-bar"
                    style={{
                      height: `${Math.max(
                        4,
                        (sample.wpm / maxWpm) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="speed-bar-label">
                  {sample.second}s
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="analysis-description">
            Not enough speed samples to display a trend. Complete another test
            to collect more data.
          </p>
        )}
      </div>

      <div className="analysis-card suggestions-card">
        <h3>
          <Lightbulb size={18} />
          Improvement Suggestions
        </h3>

        {suggestions.length > 0 ? (
          <ul>
           {suggestions.map((suggestion, index) => (
  <li key={index}>
    {typeof suggestion === 'string' ? (
      suggestion
    ) : (
      <div className="suggestion-item">
        <div className="suggestion-title">
          {suggestion.title}
        </div>

        <p>{suggestion.description}</p>

        {suggestion.priority && (
          <span className="suggestion-priority">
            {suggestion.priority}
          </span>
        )}
      </div>
    )}
  </li>
))}
          </ul>
        ) : (
          <p className="analysis-description">
            Keep practising regularly to improve your typing performance.
          </p>
        )}
      </div>
    </section>
  )
}

function Metric({ icon, label, value }) {
  return (
    <div className="analysis-metric">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
