import aquaSDK from '../lib/aqua';

/**
 * Issue certificate with Aqua SDK
 * 🔒 PROTECTED: Requires user to be logged in
 */
export async function issueCertificate(certificateData) {
  try {
    // 🔒 AUTH GUARD - Check if user is logged in
    const user = JSON.parse(localStorage.getItem('aquacert_user') || 'null');
    
    if (!user || !user.username) {
      throw new Error('Authentication required. Please log in to issue certificates.');
    }

    console.log('📝 Issuing certificate for:', certificateData.recipientName);
    console.log('👤 Issued by:', user.username);

    // Prepare data for signing
    const dataToSign = {
      certificateId: certificateData.certificateId,
      recipientName: certificateData.recipientName,
      institution: certificateData.institution,
      program: certificateData.program,
      issueDate: certificateData.issueDate,
      issuedBy: user.username,
      issuerEmail: user.email || '',
      issuedAt: new Date().toISOString(),
    };

    // Sign using Aqua SDK
    const signResult = await aquaSDK.signCertificate(dataToSign);

    if (!signResult.success) {
      throw new Error('Failed to sign certificate');
    }

    // Create certificate object
    const certificate = {
      certificateId: dataToSign.certificateId,
      recipientName: dataToSign.recipientName,
      institution: dataToSign.institution,
      program: dataToSign.program,
      issueDate: dataToSign.issueDate,
      issuedBy: dataToSign.issuedBy,
      issuerEmail: dataToSign.issuerEmail,

      // Aqua proof data
      proofId: signResult.proofId,
      treeObject: signResult.treeObject,
      hash: signResult.hash,
      signedAt: signResult.signedAt,

      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    certificates.push(certificate);
    localStorage.setItem('certificates', JSON.stringify(certificates));

    console.log('✅ Certificate issued successfully');
    console.log('🆔 Proof ID:', certificate.proofId);
    console.log('🔐 Hash:', certificate.hash);

    return {
      success: true,
      certificate: certificate,
      proofId: certificate.proofId,
      hash: certificate.hash,
      treeObject: certificate.treeObject,
    };

  } catch (error) {
    console.error('❌ Certificate issuance failed:', error);
    throw error;
  }
}

/**
 * Get certificate by ID
 */
export function getCertificate(certificateId) {
  const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  return certificates.find(
    (cert) => cert.certificateId === certificateId || cert.proofId === certificateId
  );
}