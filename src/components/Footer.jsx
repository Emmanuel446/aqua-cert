import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-aqua" />
              <span className="font-display font-bold text-2xl text-white">
                Aqua<span className="text-aqua">Cert</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-md mb-4">
              Professional certificate verification platform powered by cryptographic
              proof. Trust, proven.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-aqua transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-aqua transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-aqua transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-aqua transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/generate" className="hover:text-aqua transition-colors">
                  Generate Certificate
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-aqua transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-aqua transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-aqua transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-aqua transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-aqua transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-aqua transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} AquaCert. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer