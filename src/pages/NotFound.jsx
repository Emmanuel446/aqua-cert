import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-9xl text-aqua mb-4">404</h1>
          <div className="relative inline-block">
            <Search className="w-24 h-24 text-slate-300 mx-auto" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-4 border-aqua/30 border-t-aqua rounded-full"
            />
          </div>
        </motion.div>

        <h2 className="font-display font-bold text-4xl text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/verify')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Verify Certificate</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default NotFound