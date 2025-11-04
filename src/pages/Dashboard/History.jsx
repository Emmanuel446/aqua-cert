import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, FileText } from 'lucide-react'
import { format } from 'date-fns'

const History = () => {
  const activities = [
    {
      type: 'generated',
      description: 'Generated certificate for John Doe',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: FileText,
    },
    {
      type: 'verified',
      description: 'Certificate CERT-1234567890 verified',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: CheckCircle,
    },
    {
      type: 'generated',
      description: 'Generated certificate for Jane Smith',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: FileText,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Activity History
        </h2>
        <p className="text-slate-600">Track all your certificate activities</p>
      </div>

      <div className="glass-card p-8">
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 pb-6 border-b border-slate-200 last:border-0"
              >
                <div className={`p-3 rounded-xl ${
                  activity.type === 'generated' 
                    ? 'bg-aqua/10' 
                    : 'bg-green-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    activity.type === 'generated'
                      ? 'text-aqua'
                      : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 mb-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{format(activity.timestamp, 'PPp')}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default History