import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import CertificateCard from '../../components/CertificateCard'
import LoadingSpinner from '../../components/LoadingSpinner'

const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = () => {
    setLoading(true)
    const stored = JSON.parse(localStorage.getItem('certificates') || '[]')
    setCertificates(stored)
    setLoading(false)
  }

  const filteredCertificates = certificates.filter((cert) =>
    cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Generated Certificates
        </h2>
        <p className="text-slate-600">
          View and manage all your issued certificates
        </p>
      </div>

      {/* Search & Filter */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, program, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <LoadingSpinner message="Loading certificates..." />
      ) : filteredCertificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.certificateId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CertificateCard certificate={cert} onClick={() => {}} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              {searchTerm ? 'No certificates found' : 'No certificates yet'}
            </h3>
            <p className="text-slate-600">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Generate your first certificate to get started'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewCertificates