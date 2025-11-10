import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Shield, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletConnectModal = () => {
  const {
    showCustomModal,
    setShowCustomModal,
    connectionError,
    setConnectionError,
  } = useWallet();

  if (!showCustomModal) return null;

  const handleMetaMaskClick = async () => {
    console.log('🔵 MetaMask button clicked');
    
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask not installed');
        return;
      }

      console.log('🔵 Requesting accounts...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('✅ Connected:', accounts[0]);
      
      // Save to localStorage
      localStorage.setItem('aquacert_wallet', JSON.stringify({
        address: accounts[0],
        connectedAt: new Date().toISOString(),
      }));

      // Close modal
      setShowCustomModal(false);
      
      // Manual page refresh to update state
      window.location.href = '/dashboard/generate';

    } catch (error) {
      console.error('❌ Connection failed:', error);
      setConnectionError(error.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        {/* Backdrop */}
        <div
          onClick={() => {
            console.log('🔵 Backdrop clicked');
            setShowCustomModal(false);
            setConnectionError(null);
          }}
          className="absolute inset-0"
        />

        {/* Modal */}
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-aqua via-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-xl">
                  Connect Wallet
                </h2>
              </div>
              
              <button
                onClick={() => {
                  console.log('🔵 Close button clicked');
                  setShowCustomModal(false);
                  setConnectionError(null);
                }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {connectionError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Connection Failed</p>
                  <p className="text-sm text-red-700 mt-1">{connectionError}</p>
                </div>
              </div>
            )}

            {/* Simple MetaMask Button */}
            <button
              onClick={handleMetaMaskClick}
              className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-aqua hover:bg-aqua/5 transition-all text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-aqua/10">
                  <Wallet className="w-6 h-6 text-aqua" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">MetaMask</h3>
                  <p className="text-sm text-slate-600">Connect with MetaMask</p>
                </div>
              </div>
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              Testing simplified connection
            </p>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default WalletConnectModal;