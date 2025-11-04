import React from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Shield, Award } from 'lucide-react'
import { format } from 'date-fns'

const CertificatePreview = ({ data, proofId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div
        id="certificate-preview"
        className="bg-white p-12 rounded-2xl shadow-2xl border-8 border-aqua/20 relative overflow-hidden"
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Shield className="w-96 h-96" />
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="flex justify-center mb-4">
            <div className="bg-aqua/10 p-4 rounded-full">
              <Award className="w-16 h-16 text-aqua" />
            </div>
          </div>
          <h1 className="font-display font-bold text-4xl text-slate-900 mb-2">
            Certificate of Achievement
          </h1>
          <div className="w-32 h-1 bg-aqua mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="text-center mb-8 space-y-6">
          <p className="text-lg text-slate-600">This is to certify that</p>
          <h2 className="font-display font-bold text-5xl text-slate-900">
            {data.recipientName}
          </h2>
          <p className="text-lg text-slate-600">
            has successfully completed the program
          </p>
          <h3 className="font-display font-semibold text-3xl text-aqua">
            {data.program}
          </h3>
          <p className="text-lg text-slate-600">
            at <span className="font-semibold">{data.institution}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-slate-200">
          <div className="text-left">
            <p className="text-sm text-slate-500 mb-1">Issue Date</p>
            <p className="font-semibold text-slate-900">
              {format(new Date(data.issueDate), 'MMMM dd, yyyy')}
            </p>
            <p className="text-sm text-slate-500 mt-3 mb-1">Certificate ID</p>
            <p className="font-mono text-xs text-slate-700">{data.certificateId}</p>
          </div>

          <div className="text-center">
            {proofId && (
              <div className="bg-white p-2 rounded-lg shadow-md">
                <QRCodeSVG
                  value={`${window.location.origin}/verify?id=${proofId}`}
                  size={100}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-xs text-slate-500 mt-1">Verify Online</p>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="mb-2">
              <div className="w-48 border-t-2 border-slate-900 mb-1"></div>
              <p className="font-semibold text-slate-900">Authorized Signatory</p>
            </div>
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Shield className="w-5 h-5 text-aqua" />
              <p className="text-xs text-slate-500">Verified by AquaCert</p>
            </div>
          </div>
        </div>

        {/* Proof ID Badge */}
        {proofId && (
          <div className="mt-6 p-4 bg-aqua/5 rounded-xl border border-aqua/20">
            <p className="text-xs text-slate-500 mb-1">Cryptographic Proof ID</p>
            <p className="font-mono text-sm text-aqua font-semibold break-all">
              {proofId}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CertificatePreview