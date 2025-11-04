import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Lock, Building2 } from 'lucide-react'

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('login') // 'login' or 'signup'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Store user info in localStorage
    const userData = {
      username: formData.username,
      email: formData.email,
      loggedInAt: new Date().toISOString(),
    }
    
    localStorage.setItem('aquacert_user', JSON.stringify(userData))
    
    // Call success callback
    onSuccess(userData)
    
    // Reset form
    setFormData({ username: '', email: '', password: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-aqua to-blue-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
            <h2 className="font-display font-bold text-3xl text-center mb-2">
              Welcome to AquaCert
            </h2>
            <p className="text-center text-blue-100">
              {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 font-semibold transition-colors relative ${
                activeTab === 'login'
                  ? 'text-aqua'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
              {activeTab === 'login' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-aqua"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-4 font-semibold transition-colors relative ${
                activeTab === 'signup'
                  ? 'text-aqua'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
              {activeTab === 'signup' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-aqua"
                />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Username/Organization */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {activeTab === 'signup' ? 'Organization Name' : 'Username'}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder={
                        activeTab === 'signup'
                          ? 'Tech University'
                          : 'Enter your username'
                      }
                      required
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                {/* Email (optional for login, visible for signup) */}
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="organization@example.com"
                        className="input-field pl-12"
                      />
                    </div>
                  </div>
                )}

                {/* Password (only for signup) */}
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required={activeTab === 'signup'}
                        className="input-field pl-12"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-primary text-lg"
                >
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AuthModal