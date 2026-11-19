
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

export default function HistoryChart({ data }) {
  return (
    <div className="history-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="attempt"
            stroke="#a99b9b"
            tick={{ fontSize: 11 }}
          />

          <YAxis
            stroke="#a99b9b"
            tick={{ fontSize: 11 }}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              background: '#1b1010',
              border: '1px solid rgba(233,120,67,0.35)',
              borderRadius: '10px',
              color: '#f5eeee',
            }}
            formatter={(value) => [`${value} WPM`, 'Net WPM']}
          />

          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#e97843"
            strokeWidth={3}
            dot={{ r: 4, fill: '#e97843' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
