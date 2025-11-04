import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Building2, Save } from 'lucide-react'
import InputField from '../../components/InputField'
import AnimatedButton from '../../components/AnimatedButton'

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('aquacert_user') || '{}')
    setUserData(user)
  }, [])

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('aquacert_user', JSON.stringify(userData))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Profile Settings
        </h2>
        <p className="text-slate-600">Manage your account information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-aqua to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Organization Name"
            name="username"
            value={userData.username}
            onChange={handleChange}
            icon={Building2}
            required
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            icon={Mail}
          />

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 text-green-700 px-4 py-3 rounded-xl flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span className="font-medium">Profile updated successfully!</span>
            </motion.div>
          )}

          <AnimatedButton type="submit" icon={Save} className="w-full">
            Save Changes
          </AnimatedButton>
        </form>
      </motion.div>
    </div>
  )
}

export default Profile