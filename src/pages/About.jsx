import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Code, Lock, Zap } from 'lucide-react'

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-aqua/10 rounded-full mb-6"
          >
            <Shield className="w-10 h-10 text-aqua" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-5xl text-slate-900 mb-4"
          >
            About AquaCert
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600"
          >
            Redefining trust in digital certificates
          </motion.p>
        </div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 mb-12"
        >
          <h2 className="font-display font-bold text-3xl text-slate-900 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            AquaCert is a professional-grade certificate verification platform that
            leverages the power of the <strong>Aqua SDK</strong> to provide
            cryptographically signed, tamper-proof digital certificates.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            We believe that trust should be verifiable, transparent, and instant. Our
            platform empowers organizations to issue certificates that can be
            independently verified by anyone, anywhere, at any time.
          </p>
        </motion.div>

        {/* Technology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="font-display font-bold text-3xl text-slate-900 mb-8 text-center">
            Powered by Advanced Technology
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="bg-aqua/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-aqua" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Aqua SDK Integration
              </h3>
              <p className="text-slate-600">
                Built on the Aqua SDK, providing cryptographic proof and immutable
                verification for every certificate issued.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="bg-aqua/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-aqua" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Blockchain Security
              </h3>
              <p className="text-slate-600">
                Leveraging distributed ledger technology to ensure certificates
                remain tamper-proof and permanently verifiable.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="bg-aqua/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-aqua" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Enterprise Security
              </h3>
              <p className="text-slate-600">
                Bank-level encryption and security protocols protect your sensitive
                certificate data at all times.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="bg-aqua/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-aqua" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-slate-600">
                Verify thousands of certificates per second with our optimized
                verification engine.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8"
        >
          <h2 className="font-display font-bold text-3xl text-slate-900 mb-6">
            Use Cases
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-aqua/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-aqua"></div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Educational Institutions
                </h4>
                <p className="text-slate-600">
                  Universities and schools can issue tamper-proof diplomas and
                  transcripts that employers can instantly verify.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-aqua/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-aqua"></div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Professional Certifications
                </h4>
                <p className="text-slate-600">
                  Training providers can issue verifiable certificates for completed
                  courses and professional development programs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-aqua/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-aqua"></div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Event Participation
                </h4>
                <p className="text-slate-600">
                  Conference organizers can provide attendees with verifiable proof
                  of participation and achievement.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About