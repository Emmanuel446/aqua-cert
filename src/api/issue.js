import aquaSDK from '../lib/aqua';
import { notarizeCertificate } from './notarize';
import { requestWitness } from './witness';

/**
 * Issue certificate with Aqua SDK (includes Notarization + Witnessing)
 */
export async function issueCertificate(certificateData, issuerAddress = null) {
  try {
    let walletAddress = issuerAddress;

    if (!walletAddress) {
      const walletData = JSON.parse(localStorage.getItem('aquacert_wallet') || 'null');
      if (!walletData || !walletData.address) {
        throw new Error('Authentication required. Please connect your wallet to issue certificates.');
      }
      walletAddress = walletData.address;
    }

    console.log('📝 Issuing certificate for:', certificateData.recipientName);
    console.log('👤 Issued by wallet:', walletAddress);

    const dataToSign = {
      certificateId: certificateData.certificateId,
      recipientName: certificateData.recipientName,
      institution: certificateData.institution,
      program: certificateData.program,
      issueDate: certificateData.issueDate,
      issuedBy: walletAddress,
      issuerAddress: walletAddress,
      issuedAt: new Date().toISOString(),
    };

    // STEP 1: Sign with Aqua SDK
    console.log('🔐 Step 1/3: Signing with Aqua SDK...');
    const signResult = await aquaSDK.signCertificate(dataToSign);
    if (!signResult.success) throw new Error('Failed to sign certificate with Aqua SDK');
    
    console.log('✅ Aqua SDK signing successful');

    // STEP 2: Notarize the certificate
    console.log('📝 Step 2/3: Notarizing certificate...');
    const notarizationResult = await notarizeCertificate(dataToSign, signResult);

    if (!notarizationResult.success) {
      console.warn('⚠️ Notarization failed, proceeding without notarization');
    }

    // STEP 3: Request witness attestations
    console.log('👁️ Step 3/3: Requesting witness attestations...');
    let witnessResult = null;

    if (notarizationResult.success) {
      witnessResult = await requestWitness(
        dataToSign,
        notarizationResult.notarization,
        3 // Request 3 witnesses
      );

      if (!witnessResult.success) {
        console.warn('⚠️ Witness attestation failed, proceeding without witnesses');
      }
    }

    // Create complete certificate object
    const certificate = {
      ...dataToSign,
      proofId: signResult.proofId,
      treeObject: signResult.treeObject,
      hash: signResult.hash,
      fileHash: signResult.fileHash,
      signedAt: signResult.signedAt,
      
      // Notarization data
      notarization: notarizationResult.success ? notarizationResult.notarization : null,
      
      // Witness data
      witness: witnessResult?.success ? witnessResult.witness : null,
      witnessedAt: witnessResult?.success ? new Date().toISOString() : null,
      witnessDetails: witnessResult?.success ? witnessResult.witness : null,
      
      // Verification status
      verification: {
        signed: true,
        notarized: notarizationResult.success,
        witnessed: witnessResult?.success || false,
        complete: notarizationResult.success && witnessResult?.success,
      },
      
      createdAt: new Date().toISOString(),
    };

    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    certificates.push(certificate);
    localStorage.setItem('certificates', JSON.stringify(certificates));

    console.log('✅ Certificate issued successfully');
    console.log('🆔 Proof ID:', certificate.proofId);
    console.log('🔐 Hash:', certificate.hash);
    console.log('📋 Notarized:', certificate.verification.notarized);
    console.log('👁️ Witnessed:', certificate.verification.witnessed);

    return {
      success: true,
      certificate,
      proofId: certificate.proofId,
      hash: certificate.hash,
      fileHash: certificate.fileHash,
      treeObject: certificate.treeObject,
      notarization: certificate.notarization,
      witness: certificate.witness,
      verification: certificate.verification,
      witnessedAt: certificate.witnessedAt,
      witnessDetails: certificate.witnessDetails,
    };
  } catch (error) {
    console.error('❌ Certificate issuance failed:', error);
    throw error;
  }
}

/**
 * Get a certificate by certificateId or proofId from localStorage
 */
export function getCertificate(id) {
  const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  return certificates.find(
    (c) => c.certificateId === id || c.proofId === id
  ) || null;
}