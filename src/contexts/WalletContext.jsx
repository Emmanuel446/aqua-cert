import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();

  // Check if on correct network (Sepolia)
  const isCorrectNetwork = chainId === sepolia.id;

  // Persist wallet connection in localStorage
  useEffect(() => {
    if (isConnected && address) {
      const walletData = {
        address,
        connectedAt: new Date().toISOString(),
        chainId,
      };
      localStorage.setItem('aquacert_wallet', JSON.stringify(walletData));
      console.log('✅ Wallet connected:', address);
      console.log('🌐 Network:', chainId === sepolia.id ? 'Sepolia' : `Chain ID ${chainId}`);
    } else {
      localStorage.removeItem('aquacert_wallet');
    }
  }, [isConnected, address, chainId]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setConnectionError(connectError.message);
      console.error('❌ Connection error:', connectError);
    }
  }, [connectError]);

  // Connect wallet - handles MetaMask, Trust Wallet, Binance Wallet
  const handleConnectClick = async (walletId, onSuccess) => {
    try {
      setConnectionError(null);
      
      // Check if any wallet is available
      if (typeof window.ethereum === 'undefined') {
        setConnectionError('No wallet detected. Please install MetaMask, Trust Wallet, or Binance Chain Wallet.');
        return;
      }

      // Find the injected connector
      const injectedConnector = connectors.find((c) => c.id === 'injected');
      
      if (!injectedConnector) {
        throw new Error('Injected connector not found');
      }

      console.log(`🔌 Connecting to ${walletId}...`);

      // Connect with the injected connector (works for all three wallets)
      await connect({ connector: injectedConnector });
      
      // Close modal on successful connection
      setShowCustomModal(false);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      
      if (error.message?.includes('User rejected')) {
        setConnectionError('Connection request rejected');
      } else if (error.message?.includes('Already processing')) {
        setConnectionError('Connection already in progress');
      } else {
        setConnectionError(error.message || 'Failed to connect wallet');
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    disconnect();
    localStorage.removeItem('aquacert_wallet');
    console.log('👋 Wallet disconnected');
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await switchChain({ chainId: sepolia.id });
    } catch (error) {
      console.error('❌ Failed to switch network:', error);
      setConnectionError('Failed to switch to Sepolia network');
    }
  };

  // Open wallet connect modal
  const openConnectModal = () => {
    setShowCustomModal(true);
    setConnectionError(null);
  };

  const value = {
    // Wallet state
    address,
    isConnected,
    chainId,
    isCorrectNetwork,
    
    // Connection functions
    connectWallet: openConnectModal,
    handleConnectClick,
    disconnectWallet,
    switchToSepolia,
    
    // Modal state
    showCustomModal,
    setShowCustomModal,
    
    // Error handling
    connectionError,
    setConnectionError,
    
    // Loading state
    isPending,
    
    // Available connectors
    connectors,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}