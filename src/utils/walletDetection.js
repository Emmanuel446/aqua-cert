// Wallet detection utilities

/**
 * Check if MetaMask is installed and available
 * @returns {boolean}
 */
export const isMetaMaskAvailable = () => {
  return typeof window !== 'undefined' && 
         window.ethereum && 
         window.ethereum.isMetaMask;
};

/**
 * Check if any injected wallet is available
 * @returns {boolean}
 */
export const isInjectedWalletAvailable = () => {
  return typeof window !== 'undefined' && 
         window.ethereum && 
         typeof window.ethereum.request === 'function';
};

/**
 * Get list of available injected wallets
 * @returns {Array} Array of wallet information
 */
export const getAvailableInjectedWallets = () => {
  const wallets = [];
  
  if (isMetaMaskAvailable()) {
    wallets.push({
      id: 'metaMask',
      name: 'MetaMask',
      icon: '🦊',
      provider: window.ethereum,
    });
  }
  
  // Check for other wallets (excluding MetaMask)
  if (window.ethereum && !window.ethereum.isMetaMask) {
    wallets.push({
      id: 'injected',
      name: 'Other Wallet',
      icon: '👛',
      provider: window.ethereum,
    });
  }
  
  return wallets;
};

/**
 * Request accounts from a specific provider
 * @param {Object} provider - The wallet provider
 * @returns {Promise<string[]>}
 */
export const requestAccounts = async (provider) => {
  try {
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });
    return accounts;
  } catch (error) {
    console.error('Failed to request accounts:', error);
    throw error;
  }
};

/**
 * Get the current chain ID
 * @param {Object} provider - The wallet provider
 * @returns {Promise<number>}
 */
export const getChainId = async (provider) => {
  try {
    const chainId = await provider.request({
      method: 'eth_chainId',
    });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    throw error;
  }
};