import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Search, CheckCircle, XCircle, Shield, AlertTriangle, User, Building2,
  Calendar, Hash, Link as LinkIcon, Info, Award
} from 'lucide-react';
import InputField from '../components/InputField';
import AnimatedButton from '../components/AnimatedButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { verifyCertificateById } from '../api/verify';
import { format } from 'date-fns';

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fromLink, setFromLink] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      console.log('🔗 Certificate ID from URL:', idFromUrl);
      setCertificateId(idFromUrl);
      setFromLink(true);
    }
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const verifyResult = await verifyCertificateById(certificateId);
      setResult(verifyResult);
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        valid: false,
        error: 'Verification failed',
        details: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-5xl text-slate-900 mb-4"
          >
            Verify Certificate
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600"
          >
            Validate certificate authenticity instantly
          </motion.p>
        </div>

        {/* Link Detection Banner */}
        {fromLink && !result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-6 bg-aqua/5 border-2 border-aqua/20"
          >
            <div className="flex items-center space-x-3">
              <LinkIcon className="w-5 h-5 text-aqua flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Certificate ID Detected from Link
                </p>
                <p className="text-xs text-slate-600">
                  Click "Verify Certificate" below to check authenticity
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verification Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 mb-8"
        >
          <form onSubmit={handleVerify} className="space-y-6">
            <InputField
              label="Certificate ID or Proof ID"
              name="certificateId"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="CERT-1234567890 or PROOF-1234567890"
              icon={Search}
              required
            />

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    How to Verify
                  </p>
                  <p className="text-sm text-blue-700">
                    Enter the Certificate ID or Proof ID found on the certificate document 
                    to verify its authenticity.
                  </p>
                </div>
              </div>
            </div>

            <AnimatedButton
              type="submit"
              icon={Shield}
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </AnimatedButton>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && <LoadingSpinner message="Verifying certificate authenticity..." />}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`glass-card p-8 ${
                result.valid
                  ? 'border-2 border-green-500'
                  : 'border-2 border-red-500'
              }`}
            >
              {result.valid ? (
                /* VALID CERTIFICATE */
                <div>
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                      <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                  </div>

                  <h2 className="font-display font-bold text-3xl text-center text-slate-900 mb-2">
                    Authentic Certificate
                  </h2>
                  <p className="text-center text-slate-600 mb-8">
                    This is a valid and verified certificate
                  </p>

                  {/* Certificate Details */}
                  {result.data && (
                    <div className="bg-slate-50 p-6 rounded-xl space-y-4 mb-6">
                      <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center space-x-2">
                        <Award className="w-5 h-5 text-aqua" />
                        <span>Certificate Information</span>
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Recipient</span>
                          </p>
                          <p className="font-semibold text-slate-900">
                            {result.data.recipientName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>Institution</span>
                          </p>
                          <p className="font-semibold text-slate-900">
                            {result.data.institution}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-500 mb-1">Program</p>
                          <p className="font-semibold text-slate-900">
                            {result.data.program}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Issue Date</span>
                          </p>
                          <p className="font-semibold text-slate-900">
                            {format(new Date(result.data.issueDate), 'MMMM dd, yyyy')}
                          </p>
                        </div>

                        {result.data.issuedBy && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-slate-500 mb-1">Issued By</p>
                            <p className="font-mono text-sm text-slate-900">
                              {result.data.issuedBy}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Certificate ID</p>
                        <p className="font-mono text-sm text-slate-900 break-all">
                          {result.data.certificateId}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500 mb-1 flex items-center space-x-1">
                          <Hash className="w-4 h-4" />
                          <span>Verification ID</span>
                        </p>
                        <p className="font-mono text-sm text-aqua font-semibold break-all">
                          {result.proofId}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Simple Notarization Info - Only if available */}
                  {result.verification?.notarization?.valid && (
                    <div className="bg-aqua/5 border border-aqua/20 p-4 rounded-xl mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-aqua" />
                          <span className="text-sm font-semibold text-slate-900">
                            Blockchain Verified
                          </span>
                        </div>
                        <span className="text-xs text-slate-600">
                          {format(new Date(result.verification.notarization.timestamp), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Verification Timestamp */}
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-green-700">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-semibold">Verified Successfully</span>
                      </div>
                      <span className="text-sm text-green-600">
                        {format(new Date(result.verifiedAt), 'MMM dd, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* INVALID CERTIFICATE */
                <div>
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                      {result.error === 'Certificate not found' ? (
                        <AlertTriangle className="w-16 h-16 text-red-600" />
                      ) : (
                        <XCircle className="w-16 h-16 text-red-600" />
                      )}
                    </div>
                  </div>

                  <h2 className="font-display font-bold text-3xl text-center text-slate-900 mb-2">
                    {result.error === 'Certificate not found' ? 'Certificate Not Found' : 'Invalid Certificate'}
                  </h2>
                  <p className="text-center text-slate-600 mb-8">
                    {result.details || 'This certificate could not be verified.'}
                  </p>

                  <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <p className="text-red-700 font-semibold mb-3 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Possible Reasons</span>
                    </p>
                    <ul className="text-sm text-red-600 space-y-2">
                      <li>• Certificate ID or Proof ID not found in our system</li>
                      <li>• Certificate may have been altered or tampered with</li>
                      <li>• Invalid or expired verification code</li>
                      <li>• Certificate may not be issued by an authorized institution</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VerifyCertificate;