import { motion } from 'framer-motion'
import { Users, GraduationCap, Heart, Calendar } from 'lucide-react'

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Student Engagement %',
      value: stats?.studentEngagementPercent != null
        ? `${stats.studentEngagementPercent}%`
        : '—',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Alumni Engagement %',
      value: `${stats?.alumniEngagement || 0}%`,
      icon: GraduationCap,
      color: 'bg-tamu-maroon',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Partner NPS Score',
      value: stats?.partnerNPS || 0,
      icon: Heart,
      color: 'bg-green-500',
      change: '+8',
      trend: 'up'
    },
    {
      title: 'Active Events',
      value: stats?.activeEvents || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+3',
      trend: 'up'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                card.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

