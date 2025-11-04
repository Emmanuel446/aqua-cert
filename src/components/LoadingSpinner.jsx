import React from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="relative"
      >
        <Shield className="w-16 h-16 text-aqua" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-aqua/20 rounded-full blur-xl"
        />
      </motion.div>
      <p className="mt-6 text-slate-600 font-medium">{message}</p>
    </div>
  )
}

export default LoadingSpinner