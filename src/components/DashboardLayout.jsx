import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, LogOut, Shield } from 'lucide-react';
import Sidebar from './Sidebar';
import { useWallet } from '../contexts/WalletContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  
  const { address, isConnected, disconnectWallet } = useWallet();

  useEffect(() => {
    // 🔒 WALLET CHECK - Redirect if not connected
    if (!isConnected || !address) {
      console.warn('⚠️ No wallet connected, redirecting to home...');
      navigate('/');
      return;
    }

    // Check screen size
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isConnected, address, navigate]);

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

  // Shorten wallet address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!isConnected) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-around px-4 lg:px-6">
          {/* Left: Logo + Menu (Mobile) */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>

          {/* Center: Welcome Message (Hidden on small mobile) */}
          <div className="hidden md:block float-start">
            <p className="text-sm lg:text-2xl font-bold text-slate-600">
              Welcome <span className="font-mono font-semibold text-aqua">{formatAddress(address)}</span>
            </p>
          </div>

          {/* Right: Disconnect Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDisconnect}
            className="flex items-center px-3 lg:px-4 py-2 rounded-lg border-2 border-slate-200 hover:border-red-500 hover:text-red-500 transition-colors text-sm lg:text-base float-end"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Disconnect</span>
          </motion.button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;