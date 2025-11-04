// Mock database with sample certificates

export const sampleCertificates = [
  {
    certificateId: 'CERT-1701234567890',
    recipientName: 'Alice Johnson',
    institution: 'Tech University',
    program: 'Full Stack Web Development',
    issueDate: '2024-01-15',
    proofId: 'PROOF-1701234567890-abc123',
    signature: 'SIG-7f8a9b-1701234567890',
    issuedAt: '2024-01-15T10:30:00Z',
  },
  {
    certificateId: 'CERT-1701234568901',
    recipientName: 'Bob Smith',
    institution: 'Digital Academy',
    program: 'Advanced React Development',
    issueDate: '2024-02-20',
    proofId: 'PROOF-1701234568901-def456',
    signature: 'SIG-8g9h0i-1701234568901',
    issuedAt: '2024-02-20T14:45:00Z',
  },
  {
    certificateId: 'CERT-1701234569012',
    recipientName: 'Carol Williams',
    institution: 'Innovation Institute',
    program: 'Blockchain Fundamentals',
    issueDate: '2024-03-10',
    proofId: 'PROOF-1701234569012-ghi789',
    signature: 'SIG-9h0i1j-1701234569012',
    issuedAt: '2024-03-10T09:15:00Z',
  },
]

// Initialize localStorage with sample data on first load
export function initializeMockDB() {
  if (!localStorage.getItem('certificates')) {
    localStorage.setItem('certificates', JSON.stringify(sampleCertificates))
    console.log('Mock database initialized with sample certificates')
  }
}