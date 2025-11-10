import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isDirectConnection, setIsDirectConnection] = useState(false);
  const [walletListeners, setWalletListeners] = useState(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  // Get the real chain ID from wagmi
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
        connectionType: isDirectConnection ? 'direct_connection' : 'wagmi'
      };
      localStorage.setItem('aquacert_wallet', JSON.stringify(walletData));
      
      if (!isDirectConnection) {
        console.log('✅ Wagmi wallet connected:', address);
        console.log('🌐 Network:', chainId === sepolia.id ? 'Sepolia' : 'Wrong Network');
      }
    }
  }, [isConnected, address, chainId, isDirectConnection]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setConnectionError(connectError.message);
      console.error('❌ Wagmi connection error:', connectError);
    }
  }, [connectError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (walletListeners) {
        walletListeners();
      }
    };
  }, [walletListeners]);

  // Direct Trust Wallet connection function
  const connectTrustWalletDirectly = async () => {
    try {
      setConnectionError(null);
      
      if (typeof window.ethereum === 'undefined') {
        setConnectionError('Please install Trust Wallet extension or app');
        return;
      }

      // Request account access directly
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get current chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      console.log('✅ Trust Wallet connected directly');
      console.log('📄 Account:', accounts[0]);
      console.log('🔗 Chain ID:', parseInt(chainId, 16));

      // Store wallet data immediately
      const walletData = {
        address: accounts[0],
        connectedAt: new Date().toISOString(),
        chainId: parseInt(chainId, 16),
        connectionType: 'direct_trustwallet'
      };
      localStorage.setItem('aquacert_wallet', JSON.stringify(walletData));

      // Mark as direct connection
      setIsDirectConnection(true);
      
      // Set up Trust Wallet event listeners
      const cleanup = setupTrustWalletListeners();
      setWalletListeners(cleanup);
      
      // Close modal
      setShowCustomModal(false);
      
    } catch (error) {
      console.error('❌ Direct Trust Wallet connection failed:', error);
      if (error.code === 4001) {
        setConnectionError('Connection request rejected by user');
      } else {
        setConnectionError(error.message || 'Failed to connect Trust Wallet');
      }
    }
  };

  // Set up Trust Wallet event listeners
  const setupTrustWalletListeners = () => {
    if (window.ethereum) {
      // Handle account changes
      const handleAccountsChanged = (accounts) => {
        console.log('🔄 Trust Wallet accounts changed:', accounts);
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          // Update wallet data
          const walletData = {
            address: accounts[0],
            connectedAt: new Date().toISOString(),
            chainId: chainId,
            connectionType: 'direct_trustwallet'
          };
          localStorage.setItem('aquacert_wallet', JSON.stringify(walletData));
        }
      };

      // Handle chain changes
      const handleChainChanged = (chainIdHex) => {
        console.log('🔄 Trust Wallet chain changed:', chainIdHex);
        const newChainId = parseInt(chainIdHex, 16);
        // Update wallet data with new chain
        const walletData = JSON.parse(localStorage.getItem('aquacert_wallet') || '{}');
        if (walletData.address) {
          walletData.chainId = newChainId;
          walletData.chainChangedAt = new Date().toISOString();
          localStorage.setItem('aquacert_wallet', JSON.stringify(walletData));
        }
      };

      // Add listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Store cleanup function
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  };

  // Connect wallet - this is what the modal will call
  const handleConnectClick = async (connectorId, onSuccess) => {
    try {
      setConnectionError(null);
      
      // For Trust Wallet, use direct connection
      if (connectorId === 'trustWallet') {
        if (window.ethereum) {
          await connectTrustWalletDirectly();
          // Close modal and call onSuccess callback
          setShowCustomModal(false);
          if (onSuccess) onSuccess();
          return;
        } else {
          throw new Error('Trust Wallet not detected');
        }
      }
      
      // For Binance Wallet, use direct connection
      if (connectorId === 'binanceWallet') {
        if (window.ethereum && window.BinanceChain) {
          // Connect to Binance Chain
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });

          if (accounts.length === 0) {
            throw new Error('No accounts found');
          }

          // Store wallet data
          const walletData = {
            address: accounts[0],
            connectedAt: new Date().toISOString(),
            chainId: 56, // BSC mainnet
            connectionType: 'binance_wallet'
          };
          localStorage.setItem('aquacert_wallet', JSON.stringify(walletData));

          setIsDirectConnection(true);
          setShowCustomModal(false);
          
          if (onSuccess) onSuccess();
          return;
        } else {
          throw new Error('Binance Wallet not detected. Please install Binance Chain Wallet extension');
        }
      }
      
      // For other wallets, use wagmi connector method
      const connector = connectors.find((c) => c.id === connectorId);
      
      if (!connector) {
        throw new Error(`Connector ${connectorId} not found`);
      }

      // Check if connector is available
      if (connectorId === 'injected' && typeof window.ethereum === 'undefined') {
        setConnectionError('Please install Trust Wallet, Binance Wallet or another Web3 wallet');
        return;
      }

      // Connect with the selected connector
      await connect({ connector });
      
      // Close modal on successful connection
      setShowCustomModal(false);
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      setConnectionError(error.message || 'Failed to connect wallet');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    // Clean up wallet listeners if they exist
    if (walletListeners) {
      walletListeners();
      setWalletListeners(null);
    }
    
    setIsDirectConnection(false);
    
    // Disconnect wagmi connection
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
    isDirectConnection,
    
    // Connection functions
    connectWallet: openConnectModal, // Backward compatibility
    handleConnectClick, // The missing function!
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