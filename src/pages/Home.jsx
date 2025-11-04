import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import AuthModal from '../components/AuthModal'
import { Shield, Zap, Lock, CheckCircle, Award, FileCheck } from 'lucide-react'

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const navigate = useNavigate()

  const handleAuthSuccess = (userData) => {
    setShowAuthModal(false)
    navigate('/dashboard/generate')
  }

  const handleGenerateClick = () => {
    // Check if user is already logged in
    const user = localStorage.getItem('aquacert_user')
    if (user) {
      navigate('/dashboard/generate')
    } else {
      setShowAuthModal(true)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Cryptographically Secure',
      description: 'Every certificate is signed using Aqua SDK cryptographic proof technology.',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Verify any certificate in seconds with our powerful verification engine.',
    },
    {
      icon: Lock,
      title: 'Tamper-Proof',
      description: 'Blockchain-backed immutability ensures certificates cannot be altered.',
    },
    {
      icon: CheckCircle,
      title: 'Trusted by Organizations',
      description: 'Enterprise-grade security trusted by educational institutions worldwide.',
    },
    {
      icon: Award,
      title: 'Professional Design',
      description: 'Beautiful, print-ready certificates that reflect your brand excellence.',
    },
    {
      icon: FileCheck,
      title: 'Audit Trail',
      description: 'Complete transparency with verifiable proof of issuance and authenticity.',
    },
  ]

  const stats = [
    { value: '10,000+', label: 'Certificates Issued' },
    { value: '500+', label: 'Organizations' },
    { value: '99.9%', label: 'Verification Success' },
    { value: '<1s', label: 'Avg. Verification Time' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero with modified Generate button */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-aqua/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-aqua/10 px-4 py-2 rounded-full mb-8"
            >
              <Shield className="w-4 h-4 text-aqua" />
              <span className="text-sm font-medium text-aqua">Powered by Aqua SDK</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-slate-900 mb-6 leading-tight"
            >
              Trust, <span className="text-aqua">Proven</span>
              <br />
              Certificates That Can't Be Faked
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto mb-12"
            >
              Professional certificate verification platform powered by cryptographic proof. Generate, verify, and trust digital certificates with enterprise-grade security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateClick}
                className="btn-primary text-lg px-8 py-4"
              >
                Generate Certificate
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/verify')}
                className="btn-secondary text-lg px-8 py-4"
              >
                Verify Certificate
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {[
                { icon: Shield, text: 'Cryptographically Signed' },
                { icon: CheckCircle, text: 'Instantly Verifiable' },
                { icon: Lock, text: 'Tamper-Proof' },
                { icon: Zap, text: 'Lightning Fast' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 bg-white px-4 py-3 rounded-xl shadow-md border border-slate-200"
                >
                  <feature.icon className="w-5 h-5 text-aqua" />
                  <span className="font-medium text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="font-display font-bold text-4xl text-aqua mb-2">
                  {stat.value}
                </h3>
                <p className="text-slate-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - KEPT ON HOMEPAGE */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-bold text-4xl text-slate-900 mb-4"
            >
              Why Choose AquaCert?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Enterprise-grade certificate management powered by cutting-edge cryptographic technology
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8"
              >
                <div className="bg-aqua/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-aqua" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-aqua to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl mb-6"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-8 text-blue-100"
          >
            Join hundreds of organizations trusting AquaCert for their certificate verification needs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateClick}
              className="bg-white text-aqua font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Generate Your First Certificate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              View Documentation
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </motion.div>
  )
}

export default Home