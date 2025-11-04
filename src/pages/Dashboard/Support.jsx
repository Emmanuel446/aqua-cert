import React from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, Mail, MessageSquare, FileQuestion, ExternalLink } from 'lucide-react'

const Support = () => {
  const supportOptions = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'support@aquacert.com',
      color: 'aqua',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      color: 'blue',
    },
    {
      icon: FileQuestion,
      title: 'Documentation',
      description: 'Browse our comprehensive guides',
      action: 'View Docs',
      color: 'purple',
    },
  ]

  const faqs = [
    {
      question: 'How do I verify a certificate?',
      answer: 'Enter the certificate ID on the verification page. Our system will check the cryptographic proof instantly.',
    },
    {
      question: 'Are certificates tamper-proof?',
      answer: 'Yes, all certificates are cryptographically signed using Aqua SDK and stored on the blockchain.',
    },
    {
      question: 'Can I download certificates as PDF?',
      answer: 'Absolutely! Every generated certificate can be downloaded as a high-quality PDF with embedded QR code.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-2">
          Support Center
        </h2>
        <p className="text-slate-600">We're here to help you succeed</p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {supportOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center cursor-pointer"
            >
              <div className="bg-aqua/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-aqua" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4">{option.description}</p>
              <span className="text-aqua font-semibold text-sm flex items-center justify-center space-x-1">
                <span>{option.action}</span>
                <ExternalLink className="w-4 h-4" />
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-aqua/10 p-3 rounded-xl">
            <HelpCircle className="w-6 h-6 text-aqua" />
          </div>
          <h3 className="font-display font-bold text-2xl text-slate-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-200 pb-6 last:border-0">
              <h4 className="font-semibold text-slate-900 mb-2">{faq.question}</h4>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Support