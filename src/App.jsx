import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';

// Your existing imports
import { WalletProvider } from './contexts/WalletContext';
import WalletConnectModal from './components/WalletConnectModal';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VerifyCertificate from './pages/VerifyCertificate';
import About from './pages/About';
import DashboardLayout from './components/DashboardLayout';
import GenerateCertificate from './pages/Dashboard/GenerateCertificate';
import ViewCertificates from './pages/Dashboard/ViewCertificates';
import Profile from './pages/Dashboard/Profile';
import History from './pages/Dashboard/History';
import Settings from './pages/Dashboard/Settings';
import NotFound from './pages/NotFound';
import { initializeMockDB } from './utils/mockDB';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    initializeMockDB();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <WalletConnectModal />
              
              <Routes>
                {/* Public routes - WITH Navbar */}
                <Route path="/" element={<><Navbar /><Home /></>} />
                <Route path="/verify" element={<><Navbar /><VerifyCertificate /></>} />
                <Route path="/verify/:certificateId" element={<><Navbar /><VerifyCertificate /></>} />
                <Route path="/about" element={<><Navbar /><About /></>} />

                {/* Dashboard routes - NO Navbar */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route path="generate" element={<GenerateCertificate />} />
                  <Route path="certificates" element={<ViewCertificates />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="history" element={<History />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* 404 - WITH Navbar */}
                <Route path="*" element={<><Navbar /><NotFound /></>} />
              </Routes>
            </div>
          </Router>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;