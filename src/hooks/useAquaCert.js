import { useState, useEffect } from 'react'
import { initializeMockDB } from '../utils/mockDB'

export function useAquaCert() {
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    // Initialize mock DB on mount
    initializeMockDB()
    loadCertificates()
  }, [])

  const loadCertificates = () => {
    const stored = JSON.parse(localStorage.getItem('certificates') || '[]')
    setCertificates(stored)
  }

  const addCertificate = (certificate) => {
    const updated = [...certificates, certificate]
    localStorage.setItem('certificates', JSON.stringify(updated))
    setCertificates(updated)
  }

  return {
    certificates,
    loadCertificates,
    addCertificate,
  }
}