import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Shield, Zap, AlertCircle, CreditCard } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

// Wallet option component
const WalletOption = ({ id, name, icon: Icon, description, onClick, disabled, isPending }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={() => !disabled && onClick(id)}
    disabled={disabled || isPending}
    className={`
      w-full p-4 rounded-xl border-2 transition-all text-left
      ${disabled
        ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-50'
        : 'border-slate-200 hover:border-aqua hover:bg-aqua/5 cursor-pointer'
      }
      ${isPending ? 'animate-pulse' : ''}
    `}
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-xl bg-slate-100">
        <Icon className="w-6 h-6 text-slate-700" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{name}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {isPending && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-aqua"></div>
      )}
    </div>
  </motion.button>
);

const WalletConnectModal = () => {
  const navigate = useNavigate();
  
  const {
    showCustomModal,
    setShowCustomModal,
    handleConnectClick,
    connectionError,
    setConnectionError,
    isPending,
    connectors,
  } = useWallet();

  // Success callback for wallet connection
  const handleWalletConnectSuccess = () => {
    console.log('🚀 Auto-navigating to dashboard...');
    navigate('/dashboard');
  };

  if (!showCustomModal) return null;

  // Check if Trust Wallet is installed
  const isTrustWalletInstalled = typeof window.ethereum !== 'undefined';

  const walletOptions = [
    {
      id: 'trustWallet',
      name: 'Trust Wallet',
      icon: Shield,
      description: isTrustWalletInstalled ? 'Connect with Trust Wallet (Recommended)' : 'Please install Trust Wallet',
      disabled: !isTrustWalletInstalled,
    },
    {
      id: 'binanceWallet',
      name: 'Binance Wallet',
      icon: Wallet,
      description: 'Connect with Binance Chain Wallet',
      disabled: false,
    },
    {
      id: 'coinbaseWalletSDK',
      name: 'Coinbase Wallet',
      icon: CreditCard,
      description: 'Connect with Coinbase Wallet',
      disabled: false,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowCustomModal(false);
            setConnectionError(null);
          }}
          className="absolute inset-0"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header with Gradient - Reduced padding */}
          <div className="relative bg-gradient-to-br from-aqua via-blue-500 to-blue-600 p-6 text-white overflow-hidden flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-xl">
                  Connect Wallet
                </h2>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setConnectionError(null);
                }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content - More compact */}
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Error Message */}
            {connectionError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Connection Failed</p>
                  <p className="text-sm text-red-700 mt-1">{connectionError}</p>
                </div>
              </motion.div>
            )}

            {/* Wallet Options */}
            <div className="space-y-3 mb-6">
              {walletOptions.map((option) => (
                <WalletOption
                  key={option.id}
                  {...option}
                  onClick={(id) => handleConnectClick(id, handleWalletConnectSuccess)}
                  isPending={isPending}
                />
              ))}
            </div>

            {/* Features - Compact */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="bg-aqua/10 p-1.5 rounded-lg flex-shrink-0">
                  <Shield className="w-3 h-3 text-aqua" />
                </div>
                <p className="text-xs text-slate-600">
                  Secure authentication with your wallet
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-aqua/10 p-1.5 rounded-lg flex-shrink-0">
                  <Wallet className="w-3 h-3 text-aqua" />
                </div>
                <p className="text-xs text-slate-600">
                  Issue blockchain-verified certificates
                </p>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 mt-4">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WalletConnectModal;