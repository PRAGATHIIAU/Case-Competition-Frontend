import { useState } from 'react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Filter, TrendingUp } from 'lucide-react'

export default function EngagementCharts({ engagementData, industryInterest }) {
  const [sentimentFilter, setSentimentFilter] = useState('all')

  const sentimentOptions = [
    { value: 'all', label: 'All Sentiment' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' }
  ]

  return (
    <div className="space-y-8">
      {/* Engagement Trends Line Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-tamu-maroon" />
            <h3 className="text-2xl font-semibold text-gray-800">Engagement Trends</h3>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
            >
              {sentimentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#500000"
              strokeWidth={3}
              name="Engagement Score"
              dot={{ fill: '#500000', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Engagement trends showing spikes around major events
        </p>
      </div>

      {/* Student Industry Interest Pie Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Student Industry Interest</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={industryInterest}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {industryInterest.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {industryInterest.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

