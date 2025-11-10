import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Simplified configuration - No WalletConnect Project ID needed
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    // Generic injected connector for MetaMask, Trust Wallet, Binance Wallet
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(), // Uses public Sepolia RPC
  },
});