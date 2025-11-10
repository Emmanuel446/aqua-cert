import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Menu, X, Wallet, LogOut } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  // Use wallet context
  const { address, isConnected, setShowCustomModal, disconnectWallet } = useWallet()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/verify', label: 'Verify' },
    { path: '/about', label: 'About' },
  ]

  // Shorten wallet address for display
  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const handleConnectClick = () => {
    setShowCustomModal(true)
  }

  const handleDisconnect = () => {
    disconnectWallet()
    if (location.pathname.startsWith('/dashboard')) {
      navigate('/')
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="w-10 h-10 text-aqua transition-transform group-hover:scale-110" />
              <motion.div
                className="absolute inset-0 bg-aqua/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="font-display font-bold text-2xl text-slate-900">
              Aqua<span className="text-aqua">Cert</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 text-slate-700 hover:text-aqua transition-colors font-medium"
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-aqua"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Wallet Button - Desktop */}
          <div className="hidden md:block">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-aqua text-aqua hover:bg-aqua hover:text-white transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-mono font-medium">{formatAddress(address)}</span>
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDisconnect}
                  className="p-2 rounded-lg border-2 border-slate-200 hover:border-red-500 hover:text-red-500 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnectClick}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-white border-t border-slate-200"
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-aqua/10 text-aqua'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Wallet Button - Mobile */}
          {isConnected ? (
            <>
              <button
                onClick={() => {
                  navigate('/dashboard')
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-3 rounded-lg font-medium bg-aqua/10 text-aqua flex items-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span className="font-mono">{formatAddress(address)}</span>
              </button>
              <button
                onClick={() => {
                  handleDisconnect()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleConnectClick()
                setIsOpen(false)
              }}
              className="w-full btn-primary mt-2 flex items-center justify-center space-x-2"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.nav>
  )
}

export default Navbar