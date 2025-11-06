import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, GraduationCap, Calendar, Hash, Download, CheckCircle, Copy, Key, Link as LinkIcon, ExternalLink, X, Info } from 'lucide-react';
import InputField from '../../components/InputField';
import AnimatedButton from '../../components/AnimatedButton';
import CertificatePreview from '../../components/CertificatePreview';
import { issueCertificate } from '../../api/issue';
import { generatePDF } from '../../utils/generatePDF';

const GenerateCertificate = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    institution: '',
    program: '',
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: `CERT-${Date.now()}`,
  });

  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [certificateResult, setCertificateResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [issuer, setIssuer] = useState(null);

  // Get logged-in user on mount
  useEffect(() => {
    const userData = localStorage.getItem('aquacert_user');
    if (userData) {
      setIssuer(JSON.parse(userData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🚀 Generating certificate with Aqua SDK...');

      const result = await issueCertificate(formData);

      setCertificateResult(result);
      setGenerated(true);
      
      // Show link modal after generation
      setShowLinkModal(true);

      console.log('✅ Certificate generated successfully!');

    } catch (error) {
      console.error('❌ Error generating certificate:', error);
      alert(`Failed to generate certificate: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    generatePDF(formData, certificateResult.proofId);
  };

  const handleReset = () => {
    setFormData({
      recipientName: '',
      institution: '',
      program: '',
      issueDate: new Date().toISOString().split('T')[0],
      certificateId: `CERT-${Date.now()}`,
    });
    setGenerated(false);
    setCertificateResult(null);
    setShowLinkModal(false);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getVerificationUrl = (proofId) => {
    return `${window.location.origin}/verify?id=${proofId}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Generate New Certificate
        </h2>
        <p className="text-slate-600">
          Create a cryptographically signed certificate using Aqua SDK
        </p>
      </div>

      {!generated ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {/* Issuer Info - Read Only */}
            {issuer && (
              <div className="bg-aqua/5 border-2 border-aqua/20 p-4 rounded-xl">
                <p className="text-sm font-semibold text-slate-700 mb-2">Issuing Authority</p>
                <div className="flex items-center space-x-3">
                  <div className="bg-aqua/10 p-2 rounded-full">
                    <User className="w-5 h-5 text-aqua" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{issuer.username}</p>
                    {issuer.email && (
                      <p className="text-sm text-slate-600">{issuer.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <InputField
              label="Recipient Name"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="John Doe"
              icon={User}
              required
            />

            <InputField
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="University of Technology"
              icon={Building2}
              required
            />

            <InputField
              label="Program/Course"
              name="program"
              value={formData.program}
              onChange={handleChange}
              placeholder="Advanced Web Development"
              icon={GraduationCap}
              required
            />

            <InputField
              label="Issue Date"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
              icon={Calendar}
              required
            />

            <InputField
              label="Certificate ID"
              name="certificateId"
              value={formData.certificateId}
              onChange={handleChange}
              icon={Hash}
              required
            />

            <AnimatedButton
              type="submit"
              icon={CheckCircle}
              loading={loading}
              className="w-full"
            >
              {loading ? 'Signing with Aqua SDK...' : 'Generate & Sign Certificate'}
            </AnimatedButton>

            {loading && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <div className="text-sm text-blue-700 flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating genesis revision with Aqua SDK...</span>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Success Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">✅ Certificate signed and registered successfully on Aqua blockchain</span>
            </div>
          </motion.div>

          {/* Certificate Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Key className="w-6 h-6 text-aqua" />
              <h3 className="font-display font-bold text-xl text-slate-900">
                Certificate Information
              </h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">Certificate ID</p>
                <button
                  onClick={() => copyToClipboard(formData.certificateId, 'certId')}
                  className="flex items-center space-x-1 text-aqua hover:text-aqua-600 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedField === 'certId' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-mono text-sm text-slate-900 break-all">
                {formData.certificateId}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">Proof ID</p>
                <button
                  onClick={() => copyToClipboard(certificateResult.proofId, 'proofId')}
                  className="flex items-center space-x-1 text-aqua hover:text-aqua-600 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedField === 'proofId' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-mono text-sm text-slate-900 break-all">
                {certificateResult.proofId}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-sm font-semibold text-slate-700 mb-2">Issue Date</p>
              <p className="text-slate-900">
                {new Date(formData.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* ⭐ NEW: Info Text - How to Verify */}
            <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    How to Verify This Certificate
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This certificate can be verified using either the{' '}
                    <span className="font-bold text-blue-900">Certificate ID</span> or the{' '}
                    <span className="font-bold text-blue-900">Proof ID</span> shown above. 
                    Share the verification link below, or provide either ID to anyone who needs 
                    to confirm the certificate's authenticity.
                  </p>
                </div>
              </div>
            </div>

            {/* Button to reopen link modal */}
            <button
              onClick={() => setShowLinkModal(true)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-aqua to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <LinkIcon className="w-5 h-5" />
              <span className="font-semibold">View Verification Link</span>
            </button>
          </motion.div>

          <CertificatePreview data={formData} proofId={certificateResult.proofId} />

          <div className="flex justify-center gap-4">
            <AnimatedButton icon={Download} onClick={handleDownload}>
              Download PDF
            </AnimatedButton>
            <AnimatedButton variant="secondary" onClick={handleReset}>
              Generate Another
            </AnimatedButton>
          </div>
        </div>
      )}

      {/* Verification Link Modal */}
      <AnimatePresence>
        {showLinkModal && certificateResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLinkModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-aqua to-blue-600 p-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="font-display font-bold text-3xl text-center mb-2">
                  Certificate Generated!
                </h2>
                <p className="text-center text-blue-100">
                  Share this verification link with anyone
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4 text-aqua" />
                    <span>Verification Link</span>
                  </label>
                  <div className="bg-slate-50 border-2 border-aqua/30 p-4 rounded-xl mb-4">
                    <p className="font-mono text-sm text-aqua break-all">
                      {getVerificationUrl(certificateResult.proofId)}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      copyToClipboard(getVerificationUrl(certificateResult.proofId), 'modalLink');
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-aqua hover:bg-aqua-600 text-white px-6 py-3 rounded-xl transition-colors font-semibold"
                  >
                    <Copy className="w-5 h-5" />
                    <span>{copiedField === 'modalLink' ? 'Link Copied!' : 'Copy Verification Link'}</span>
                  </button>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <p className="text-sm text-slate-700">
                    <strong className="text-aqua">How it works:</strong> Anyone who opens this link 
                    will be able to verify the certificate's authenticity instantly. 
                    The certificate ID will be pre-filled for one-click verification.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenerateCertificate;