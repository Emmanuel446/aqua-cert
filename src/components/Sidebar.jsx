import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  FolderOpen,
  User,
  Clock,
  Settings,
  HelpCircle,
  ChevronLeft,
  Shield,
} from 'lucide-react'

const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard/generate', label: 'Generate Certificate', icon: FileText },
    { path: '/dashboard/certificates', label: 'View Certificates', icon: FolderOpen },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
    { path: '/dashboard/history', label: 'History', icon: Clock },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    { path: '/dashboard/support', label: 'Support', icon: HelpCircle },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (isOpen ? '280px' : '0px') : isOpen ? '280px' : '80px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 
          flex flex-col z-50 overflow-hidden
          ${isMobile ? 'shadow-2xl' : ''}
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-200">
          {isOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-aqua" />
              <span className="font-display font-bold text-xl text-slate-900">
                Aqua<span className="text-aqua">Cert</span>
              </span>
            </Link>
          )}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <motion.div
                animate={{ rotate: isOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </motion.div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group relative
                    ${
                      isActive
                        ? 'bg-aqua text-white shadow-lg shadow-aqua/30'
                        : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {isOpen && (
                    <span className="font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isOpen && !isMobile && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          {isOpen ? (
            <div className="bg-gradient-to-br from-aqua/10 to-blue-500/10 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-700 mb-1">
                Need Help?
              </p>
              <p className="text-xs text-slate-600">
                Contact our support team
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <HelpCircle className="w-6 h-6 text-aqua" />
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar