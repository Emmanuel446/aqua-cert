import React from 'react'
import { motion } from 'framer-motion'

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon: Icon, 
  loading = false,
  disabled = false,
  className = '' 
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } flex items-center justify-center space-x-2`}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  )
}

export default AnimatedButton