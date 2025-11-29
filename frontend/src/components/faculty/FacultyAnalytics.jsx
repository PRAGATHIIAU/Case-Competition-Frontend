import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { RefreshCw, MessageSquare } from 'lucide-react'

const FacultyAnalytics = () => {
  const satisfactionData = [
    { name: 'Student Satisfaction', value: 2.5 },
    { name: 'Employer Satisfaction', value: 0 },
  ]

  const userDistributionData = [
    { name: 'Alumni', value: 50 },
    { name: 'Students', value: 42 },
    { name: 'Faculty', value: 8 },
  ]

  const metrics = [
    { label: 'Total Students', value: '5', icon: '👥' },
    { label: 'Active Mentors', value: '1', icon: '👤' },
    { label: 'Events Hosted', value: '6', icon: '📅' },
    { label: 'Avg Event Rating', value: '4.5', icon: '⭐' },
  ]

  const COLORS = ['#500000', '#6B0000', '#8B4513']

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">System Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor platform engagement and feedback.</p>
        </div>
        <button className="bg-tamu-maroon hover:bg-tamu-maroon-light text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              </div>
              <span className="text-3xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Feedback Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#500000" name="Average Rating" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>Student Feedback: <strong>4 responses</strong></p>
            <p>Employer Feedback: <strong>0 responses</strong></p>
          </div>
        </div>

        {/* User Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Types</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#500000]"></div>
              <span className="text-sm text-gray-700">Students: 5</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#6B0000]"></div>
              <span className="text-sm text-gray-700">Alumni: 6</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#8B4513]"></div>
              <span className="text-sm text-gray-700">Faculty: 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Employer Feedback */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Employer Feedback</h2>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <MessageSquare size={48} className="mb-4 opacity-50" />
          <p>No feedback available yet.</p>
        </div>
      </div>
    </div>
  )
}

export default FacultyAnalytics

