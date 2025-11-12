import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, CheckCircle, Copy, Key, Link as LinkIcon, X, Info, Shield, 
  Eye, FileCheck, ExternalLink, Award, Download, FileImage, FileText, User,
  Building2, GraduationCap, Calendar
} from 'lucide-react';
import AnimatedButton from '../../components/AnimatedButton';
import InputField from '../../components/InputField';
import FileUploadZone from '../../components/FileUploadZone';
import { issueUploadedCertificate } from '../../api/issue';

const UploadCertificate = () => {
  // Metadata form state
  const [formData, setFormData] = useState({
    recipientName: '',
    program: '',
    institution: '',
    issueDate: new Date().toISOString().split('T')[0],
    certificateType: 'Completion',
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [signed, setSigned] = useState(false);
  const [certificateResult, setCertificateResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [issuer, setIssuer] = useState(null);

  useEffect(() => {
    const walletData = localStorage.getItem('aquacert_wallet');
    if (walletData) {
      const wallet = JSON.parse(walletData);
      setIssuer({ address: wallet.address });
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setSigned(false);
    setCertificateResult(null);
  };

  const handleSignCertificate = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert('Please upload a certificate file');
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    try {
      console.log('🚀 Signing uploaded certificate with metadata...');

      setCurrentStep(1); // Signing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Combine metadata with file data
      const certificateData = {
        ...formData,
        ...uploadedFile,
      };

      const result = await issueUploadedCertificate(certificateData);

      setCurrentStep(2); // Notarizing
      await new Promise(resolve => setTimeout(resolve, 800));

      setCurrentStep(3); // Witnessing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCertificateResult(result);
      setSigned(true);
      setShowLinkModal(true);

      console.log('✅ Certificate signed successfully!');
    } catch (error) {
      console.error('❌ Error signing certificate:', error);
      alert(`Failed to sign certificate: ${error.message}`);
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  };

  const handleReset = () => {
    setFormData({
      recipientName: '',
      program: '',
      institution: '',
      issueDate: new Date().toISOString().split('T')[0],
      certificateType: 'Completion',
    });
    setUploadedFile(null);
    setSigned(false);
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
    { icon: Shield, label: 'Signing', description: 'Creating cryptographic proof' },
    { icon: FileCheck, label: 'Notarizing', description: 'Blockchain timestamp' },
    { icon: Eye, label: 'Witnessing', description: 'Collecting attestations' },
  ];

  const getFileIcon = () => {
    if (!uploadedFile) return FileText;
    if (uploadedFile.type.startsWith('image/')) return FileImage;
    return FileText;
  };

  const FileIcon = getFileIcon();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Upload & Sign Certificate
        </h2>
        <p className="text-slate-600">
          Upload your certificate and provide details for cryptographic verification
        </p>
      </div>

      {!signed ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSignCertificate} className="glass-card p-8 space-y-6">
            {/* Issuer Info */}
            {issuer && (
              <div className="bg-aqua/5 border-2 border-aqua/20 p-4 rounded-xl">
                <p className="text-sm font-semibold text-slate-700 mb-2">Issuing Authority</p>
                <div className="flex items-center space-x-3">
                  <div className="bg-aqua/10 p-2 rounded-full">
                    <Shield className="w-5 h-5 text-aqua" />
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

            {/* METADATA FORM */}
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Certificate Information</h3>
              </div>

              <InputField
                label="Recipient Name"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="John Doe"
                icon={User}
                required
              />

              <InputField
                label="Program/Course Name"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                placeholder="Web3 Development Bootcamp"
                icon={GraduationCap}
                required
              />

              <InputField
                label="Institution/Organization"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="Tech University"
                icon={Building2}
                required
              />

              <InputField
                label="Issue Date"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleInputChange}
                icon={Calendar}
                required
              />

              {/* Certificate Type Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>Certificate Type</span>
                </label>
                <select
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-aqua focus:outline-none transition-colors bg-white"
                  required
                >
                  <option value="Completion">Completion</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Degree">Degree</option>
                </select>
              </div>
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Upload Certificate File
              </label>
              <FileUploadZone onFileSelect={handleFileSelect} uploadedFile={uploadedFile} />
            </div>

            {/* File Preview */}
            {uploadedFile && (
              <div className="bg-slate-50 p-6 rounded-xl border-2 border-aqua/20">
                <div className="flex items-start space-x-4">
                  <div className="bg-aqua/10 p-3 rounded-xl flex-shrink-0">
                    <FileIcon className="w-8 h-8 text-aqua" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 mb-1">Selected File</h4>
                    <p className="text-sm text-slate-600 truncate mb-2">{uploadedFile.name}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Type: {uploadedFile.type}</span>
                      <span>Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>

                {/* File Preview Image */}
                {uploadedFile.preview && (
                  <div className="mt-4 rounded-lg overflow-hidden border-2 border-slate-200">
                    <img 
                      src={uploadedFile.preview} 
                      alt="Certificate preview" 
                      className="w-full h-auto max-h-96 object-contain bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Sign Button */}
            <AnimatedButton
              type="submit"
              icon={CheckCircle}
              loading={loading}
              disabled={!uploadedFile || loading}
              className="w-full"
            >
              {loading ? 'Signing Certificate...' : 'Sign Certificate'}
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

            {/* Certificate Metadata Display */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Recipient</span>
                  </p>
                  <p className="font-semibold text-slate-900">{formData.recipientName}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>Institution</span>
                  </p>
                  <p className="font-semibold text-slate-900">{formData.institution}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>Program</span>
                  </p>
                  <p className="font-semibold text-slate-900">{formData.program}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Type</span>
                  </p>
                  <p className="font-semibold text-slate-900">{formData.certificateType}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Issue Date</span>
                  </p>
                  <p className="font-semibold text-slate-900">{formData.issueDate}</p>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">Certificate ID</p>
                <button
                  onClick={() => copyToClipboard(certificateResult.certificate.certificateId, 'certId')}
                  className="flex items-center space-x-1 text-aqua hover:text-aqua-600 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedField === 'certId' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-mono text-sm text-slate-900 break-all">
                {certificateResult.certificate.certificateId}
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

            {/* File Info */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-sm font-semibold text-slate-700 mb-2">Uploaded File</p>
              <p className="text-sm text-slate-900 mb-1">{uploadedFile.name}</p>
              <p className="text-xs text-slate-600">
                {uploadedFile.type} • {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
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
                    This uploaded certificate has been <strong>cryptographically signed</strong> with Aqua SDK, 
                    <strong> notarized</strong> with blockchain timestamp, and <strong>witnessed</strong> by {certificateResult?.witness?.consensus?.total || 3} independent validators.
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

          {/* Uploaded File Preview */}
          {uploadedFile.preview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">
                Signed Certificate
              </h3>
              <div className="rounded-lg overflow-hidden border-4 border-aqua/20 shadow-xl">
                <img 
                  src={uploadedFile.preview} 
                  alt="Signed certificate" 
                  className="w-full h-auto bg-white"
                />
              </div>
            </motion.div>
          )}

          <div className="flex justify-center gap-4">
            <AnimatedButton variant="secondary" onClick={handleReset}>
              Upload Another Certificate
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
                  Certificate Signed!
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

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <p className="text-sm text-slate-700">
                    <strong className="text-aqua">Triple-Layer Security:</strong> This uploaded certificate 
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

export default UploadCertificate;