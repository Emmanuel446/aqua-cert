import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, GraduationCap, Calendar, Hash, Download, CheckCircle, 
  Copy, Key, Link as LinkIcon, X, Info, Shield, Eye, FileCheck, 
  ExternalLink, Clock, Award 
} from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [certificateResult, setCertificateResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [issuer, setIssuer] = useState(null);

  // Get logged-in user on mount
  useEffect(() => {
    const walletData = localStorage.getItem('aquacert_wallet');
    if (walletData) {
      const wallet = JSON.parse(walletData);
      setIssuer({ address: wallet.address });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentStep(0);

    try {
      console.log('🚀 Generating certificate with Aqua SDK...');

      // Simulate step progression
      setCurrentStep(1); // Signing
      await new Promise(resolve => setTimeout(resolve, 500));

      const result = await issueCertificate(formData);

      setCurrentStep(2); // Notarizing (happens in background)
      await new Promise(resolve => setTimeout(resolve, 800));

      setCurrentStep(3); // Witnessing (happens in background)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCertificateResult(result);
      setGenerated(true);
      setShowLinkModal(true);

      console.log('✅ Certificate generated successfully!');
    } catch (error) {
      console.error('❌ Error generating certificate:', error);
      alert(`Failed to generate certificate: ${error.message}`);
    } finally {
      setLoading(false);
      setCurrentStep(0);
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

  const steps = [
    { icon: Shield, label: 'Signing', description: 'Creating Aqua proof' },
    { icon: FileCheck, label: 'Notarizing', description: 'Blockchain timestamp' },
    { icon: Eye, label: 'Witnessing', description: 'Collecting attestations' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Generate New Certificate
        </h2>
        <p className="text-slate-600">
          Create a cryptographically signed, notarized, and witnessed certificate
        </p>
      </div>

      {!generated ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {/* Issuer Info */}
            {issuer && (
              <div className="bg-aqua/5 border-2 border-aqua/20 p-4 rounded-xl">
                <p className="text-sm font-semibold text-slate-700 mb-2">Issuing Authority</p>
                <div className="flex items-center space-x-3">
                  <div className="bg-aqua/10 p-2 rounded-full">
                    <User className="w-5 h-5 text-aqua" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 font-mono text-sm">
                      {issuer.address.slice(0, 6)}...{issuer.address.slice(-4)}
                    </p>
                    <p className="text-xs text-slate-600">Connected Wallet</p>
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
              {loading ? 'Processing...' : 'Generate & Sign Certificate'}
            </AnimatedButton>

            {/* Progress Steps */}
            {loading && (
              <div className="bg-gradient-to-r from-blue-50 to-aqua/10 border-2 border-aqua/20 p-6 rounded-xl">
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === index + 1;
                    const isComplete = currentStep > index + 1;

                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isComplete
                              ? 'bg-green-500 text-white'
                              : isActive
                              ? 'bg-aqua text-white animate-pulse'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              isActive ? 'text-aqua' : isComplete ? 'text-green-600' : 'text-slate-500'
                            }`}
                          >
                            Step {index + 1}: {step.label}
                          </p>
                          <p className="text-sm text-slate-600">{step.description}</p>
                        </div>
                        {isActive && (
                          <div className="w-5 h-5 border-2 border-aqua border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    );
                  })}
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
              <span className="font-semibold">
                ✅ Certificate signed, notarized, and witnessed successfully!
              </span>
            </div>
            
            {/* Verification Status Badges */}
            <div className="flex justify-center gap-3 flex-wrap">
              {certificateResult?.verification?.signed && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Signed</span>
                </div>
              )}
              {certificateResult?.verification?.notarized && (
                <div className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
                  <FileCheck className="w-4 h-4" />
                  <span>Notarized</span>
                </div>
              )}
              {certificateResult?.verification?.witnessed && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                  <Eye className="w-4 h-4" />
                  <span>Witnessed</span>
                </div>
              )}
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

            {/* Certificate ID */}
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

            {/* Proof ID */}
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

            {/* Notarization Info */}
            {certificateResult?.notarization && (
              <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-3">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-semibold text-purple-900">Notarization Details</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Notary ID:</span>
                    <span className="font-mono text-purple-900 text-xs">
                      {certificateResult.notarization.notaryId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Transaction:</span>
                    <a
                      href={certificateResult.notarization.blockchainReceipt.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-aqua hover:underline flex items-center space-x-1"
                    >
                      <span>
                        {certificateResult.notarization.blockchainReceipt.transactionHash.slice(0, 10)}...
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Block:</span>
                    <span className="font-mono text-purple-900 text-xs">
                      #{certificateResult.notarization.blockchainReceipt.blockNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Network:</span>
                    <span className="text-purple-900">
                      {certificateResult.notarization.notary.network}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Witness Info */}
            {certificateResult?.witness && (
              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">Witness Attestations</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm">Consensus:</span>
                    <span className="font-bold text-green-900">
                      {certificateResult.witness.consensus.approved}/{certificateResult.witness.consensus.total} Approved
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm">Confidence:</span>
                    <span className="font-bold text-green-900">
                      {certificateResult.witness.consensus.confidence}%
                    </span>
                  </div>
                  <div className="pt-2 border-t border-green-200">
                    <p className="text-xs text-green-700 mb-2">Witnesses:</p>
                    {certificateResult.witness.attestations.map((attestation, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs mb-1">
                        <span className="text-green-800">{attestation.witnessName}</span>
                        <span className="flex items-center space-x-1">
                          <Award className="w-3 h-3 text-green-600" />
                          <span className="text-green-600">{attestation.reputation.trustLevel}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Info Text */}
            <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Triple-Layer Verification
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This certificate has been <strong>cryptographically signed</strong> with Aqua SDK, 
                    <strong> notarized</strong> with blockchain timestamp, and <strong>witnessed</strong> by {certificateResult?.witness?.consensus?.total || 3} independent validators. 
                    Anyone can verify its authenticity using the Certificate ID or Proof ID.
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Link Button */}
            <button
              onClick={() => setShowLinkModal(true)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-aqua to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <LinkIcon className="w-5 h-5" />
              <span className="font-semibold">View Verification Link</span>
            </button>
          </motion.div>

          <CertificatePreview 
            data={formData} 
            proofId={certificateResult.proofId}
            verification={certificateResult.verification}
            notarization={certificateResult.notarization}
            witness={certificateResult.witness}
          />

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
              <button
                onClick={() => setShowLinkModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

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
                  Signed, Notarized, and Witnessed ✅
                </p>
              </div>

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

                {/* Verification Status */}
                <div className="bg-slate-50 p-4 rounded-xl mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Cryptographically Signed</span>
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  {certificateResult.verification?.notarized && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-purple-600" />
                        <span>Blockchain Notarized</span>
                      </span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {certificateResult.verification?.witnessed && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-green-600" />
                        <span>Multi-Witness Verified</span>
                      </span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <p className="text-sm text-slate-700">
                    <strong className="text-aqua">Triple-Layer Security:</strong> This certificate 
                    has been verified through cryptographic signing, blockchain notarization, 
                    and independent witness attestation.
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