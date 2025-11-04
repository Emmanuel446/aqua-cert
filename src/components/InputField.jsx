import React from 'react'
import { motion } from 'framer-motion'

const InputField = ({ 
  label, 
  name,           // ← Added this
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  icon: Icon 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          name={name}           // ← Added this line
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${Icon ? 'pl-12' : ''}`}
        />
      </div>
    </motion.div>
  )
}

export default InputField