import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Globe, Palette } from 'lucide-react'

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    weeklyReports: true,
  })

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Settings
        </h2>
        <p className="text-slate-600">Customize your AquaCert experience</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-aqua/10 p-3 rounded-xl">
              <Bell className="w-6 h-6 text-aqua" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Notifications
              </h3>
              <p className="text-sm text-slate-600">
                Manage how you receive updates
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <button
                  onClick={() => toggleSetting(key)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    value ? 'bg-aqua' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: value ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-aqua/10 p-3 rounded-xl">
              <Lock className="w-6 h-6 text-aqua" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Security
              </h3>
              <p className="text-sm text-slate-600">
                Keep your account secure
              </p>
            </div>
          </div>

          <button className="btn-secondary w-full">Change Password</button>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-aqua/10 p-3 rounded-xl">
              <Palette className="w-6 h-6 text-aqua" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Appearance
              </h3>
              <p className="text-sm text-slate-600">
                Light mode only - professional & clean
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border-2 border-aqua">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">Light Mode</span>
              <div className="w-8 h-8 bg-white rounded-lg border-2 border-slate-200"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings