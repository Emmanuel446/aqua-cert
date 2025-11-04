import React from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, Building2, FileText } from 'lucide-react'
import { format } from 'date-fns'

const CertificateCard = ({ certificate, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-aqua/10 p-3 rounded-xl">
          <Award className="w-8 h-8 text-aqua" />
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          Verified
        </span>
      </div>

      <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
        {certificate.recipientName}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-slate-600">
          <FileText className="w-4 h-4" />
          <span className="text-sm">{certificate.program}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <Building2 className="w-4 h-4" />
          <span className="text-sm">{certificate.institution}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {format(new Date(certificate.issueDate), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 mb-1">Certificate ID</p>
        <p className="font-mono text-xs text-slate-700 truncate">
          {certificate.certificateId}
        </p>
      </div>
    </motion.div>
  )
}

export default CertificateCard