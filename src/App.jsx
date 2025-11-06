import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import VerifyCertificate from './pages/VerifyCertificate'
import About from './pages/About'
import NotFound from './pages/NotFound'
import DashboardLayout from './components/DashboardLayout'
import GenerateCertificate from './pages/Dashboard/GenerateCertificate'
import ViewCertificates from './pages/Dashboard/ViewCertificates'
import Profile from './pages/Dashboard/Profile'
import History from './pages/Dashboard/History'
import Settings from './pages/Dashboard/Settings'
import Support from './pages/Dashboard/Support'
import { initializeMockDB } from './utils/mockDB'

function App() {
  useEffect(() => {
    initializeMockDB()
  }, [])

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* ===== PUBLIC ROUTES WITH NAVBAR & FOOTER ===== */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />
          
          {/* PUBLIC VERIFY PAGE - ACCESSIBLE TO EVERYONE */}
          <Route
            path="/verify"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <VerifyCertificate />
                </main>
                <Footer />
              </div>
            }
          />
          
          <Route
            path="/about"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <About />
                </main>
                <Footer />
              </div>
            }
          />

          {/* ===== DASHBOARD ROUTES (NO NAVBAR/FOOTER) ===== */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/generate" replace />} />
            <Route path="generate" element={<GenerateCertificate />} />
            <Route path="certificates" element={<ViewCertificates />} />
            <Route path="profile" element={<Profile />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* ===== 404 PAGE ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App