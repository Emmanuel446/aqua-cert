import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Get WalletConnect Project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('⚠️ WalletConnect Project ID not found. WalletConnect will not work.');
}

// Get current URL dynamically (fixes the metadata warning)
const getAppMetadata = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use actual localhost URL in development
    return {
      url: window.location.origin,
      icon: `${window.location.origin}/logo.svg`,
    };
  }
  
  // Use production URL when deployed
  return {
    url: 'https://aquacert.vercel.app', // Update this when you deploy
    icon: 'https://aquacert.vercel.app/logo.svg',
  };
};

const metadata = getAppMetadata();

// Configure wagmi
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    // Specific MetaMask connector (only for non-direct connections)
    injected({
      shimDisconnect: true,
      target: {
        id: 'metaMask',
        provider: (window) => window.ethereum?.isMetaMask ? window.ethereum : undefined,
      },
    }),
    
    // WalletConnect - supports 300+ wallets
    walletConnect({
      projectId,
      metadata: {
        name: 'AquaCert',
        description: 'Blockchain-verified digital certificates',
        url: metadata.url,
        icons: [metadata.icon],
      },
      showQrModal: true, // Shows QR code for mobile wallets
    }),
    
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'AquaCert',
      appLogoUrl: metadata.icon,
    }),
  ],
  transports: {
    [sepolia.id]: http(), // Uses public Sepolia RPC
  },
});