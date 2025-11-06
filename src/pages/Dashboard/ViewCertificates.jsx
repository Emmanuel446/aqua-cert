import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import LoadingSpinner from '../../components/LoadingSpinner';

const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = () => {
    setLoading(true);
    const stored = JSON.parse(localStorage.getItem('certificates') || '[]');
    setCertificates(stored);
    setLoading(false);
  };

  const filteredCertificates = certificates.filter((cert) =>
    cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerificationUrl = (proofId) => {
    return `${window.location.origin}/verify?id=${proofId}`;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
              className="glass-card p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Certificate Info */}
              <div className="mb-4">
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                  {cert.recipientName}
                </h3>
                <p className="text-sm text-slate-600 mb-1">{cert.program}</p>
                <p className="text-sm text-slate-500">{cert.institution}</p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl border-2 border-slate-200 mb-4 flex justify-center">
                <QRCodeSVG
                  value={getVerificationUrl(cert.proofId)}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Proof ID */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-1">Proof ID</p>
                <p className="font-mono text-xs text-aqua break-all">
                  {cert.proofId}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="w-full flex items-center justify-center space-x-2 bg-aqua hover:bg-aqua-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => copyToClipboard(getVerificationUrl(cert.proofId), cert.proofId)}
                  className="w-full flex items-center justify-center space-x-2 border-2 border-slate-200 hover:border-aqua hover:text-aqua px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedId === cert.proofId ? 'Link Copied!' : 'Copy Verify Link'}</span>
                </button>
              </div>

              {/* Issue Date */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              </div>
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

      {/* Details Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
          >
            <h3 className="font-display font-bold text-2xl text-slate-900 mb-6">
              Certificate Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Recipient</p>
                <p className="font-semibold text-slate-900">{selectedCert.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Institution</p>
                <p className="font-semibold text-slate-900">{selectedCert.institution}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Program</p>
                <p className="font-semibold text-slate-900">{selectedCert.program}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Certificate ID</p>
                <p className="font-mono text-sm text-slate-900">{selectedCert.certificateId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Proof ID</p>
                <p className="font-mono text-sm text-aqua">{selectedCert.proofId}</p>
              </div>
            </div>

            {/* QR Code Large */}
            <div className="bg-slate-50 p-6 rounded-xl flex flex-col items-center mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">Scan to Verify</p>
              <QRCodeSVG
                value={getVerificationUrl(selectedCert.proofId)}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <button
              onClick={() => setSelectedCert(null)}
              className="w-full btn-primary"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewCertificates;