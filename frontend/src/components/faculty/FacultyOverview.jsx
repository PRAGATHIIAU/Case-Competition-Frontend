import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Activity } from 'lucide-react'

const FacultyOverview = () => {
  const engagementData = [
    { month: 'Sep', score: 65 },
    { month: 'Oct', score: 72 },
    { month: 'Nov', score: 78 },
    { month: 'Dec', score: 85 },
    { month: 'Jan', score: 95 },
  ]

  const participationData = [
    { name: 'Alumni Participation', value: 42 },
    { name: 'Student Participation', value: 58 },
  ]

  const liveFeed = [
    { activity: 'Team 7 submitted a file', time: '6 minutes ago', color: 'blue' },
    { activity: 'ExxonMobil signed up as a sponsor', time: '11 minutes ago', color: 'green' },
    { activity: 'Sarah Johnson accepted mentorship request', time: '16 minutes ago', color: 'purple' },
    { activity: 'Data Warriors updated their submission', time: '21 minutes ago', color: 'blue' },
    { activity: 'Microsoft registered for Industry Mixer', time: '31 minutes ago', color: 'orange' },
    { activity: 'Tech Titans scored 88.3 points', time: '41 minutes ago', color: 'red' },
  ]

  const COLORS = ['#500000', '#6B0000']

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Platform Overview</h1>
        <p className="text-gray-600">Analytics, tracking, and event management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Trends */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-tamu-maroon" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Engagement Trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#500000" 
                strokeWidth={2}
                name="Engagement Score"
                dot={{ fill: '#500000', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4">
            Engagement trends showing spikes during major events.
          </p>
        </div>

        {/* Live Feed */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-tamu-maroon" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Live Feed</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {liveFeed.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-2 bg-${item.color}-500`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{item.activity}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alumni vs Student Participation */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Alumni vs Student Participation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={participationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {participationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col justify-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#500000]"></div>
                <span className="text-gray-700">Alumni Participation: 42%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#6B0000]"></div>
                <span className="text-gray-700">Student Participation: 58%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyOverview

