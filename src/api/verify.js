/**
 * Certificate Verification API
 * Uses real Aqua SDK to verify certificates
 */

import aquaSDK from '../lib/aqua';
import { getCertificate } from './issue';
import { verifyNotarization } from './notarize';
import { verifyWitness } from './witness';

/**
 * Verify certificate by ID
 * @param {string} certificateId - Certificate ID or Proof ID
 * @returns {Promise<Object>}
 */
export async function verifyCertificate(certificateId) {
  try {
    console.log('🔍 Starting verification for:', certificateId);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get certificate from storage
    const certificate = getCertificate(certificateId);

    if (!certificate) {
      console.warn('⚠️ Certificate not found');
      return {
        valid: false,
        error: 'Certificate not found',
        details: 'No certificate exists with this ID in our database.',
      };
    }

    if (!certificate.treeObject) {
      return {
        valid: false,
        error: 'Missing tree object',
        details: 'Certificate has no Aqua proof attached.',
      };
    }

    console.log('📦 Found certificate, verifying with Aqua SDK...');
    console.log('🔍 Certificate tree object:', certificate.treeObject);
    console.log('🔍 Tree object keys:', Object.keys(certificate.treeObject));

    // Verify with hash comparison
    const verificationResult = await aquaSDK.verifyCertificate(
      certificate.treeObject,
      certificate.hash  // Compare against stored hash
    );

    if (!verificationResult.valid) {
      console.error('❌ Aqua verification failed:', verificationResult.reason);
      return {
        valid: false,
        error: 'Invalid certificate',
        details: verificationResult.reason || 'Aqua SDK verification failed. Document may be tampered with.',
      };
    }

    // Verify notarization if present
    let notarizationVerification = null;
    if (certificate.notarization) {
      console.log('📝 Verifying notarization...');
      notarizationVerification = verifyNotarization(certificate.notarization);
    }

    // Verify witness if present
    let witnessVerification = null;
    if (certificate.witness) {
      console.log('👁️ Verifying witness attestations...');
      witnessVerification = verifyWitness(certificate.witness);
    }

    console.log('✅ Certificate verified successfully');

    return {
      valid: true,
      proofId: certificate.proofId,
      proofHash: certificate.hash,
      fileHash: certificate.fileHash,
      data: {
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        institution: certificate.institution,
        program: certificate.program,
        issueDate: certificate.issueDate,
        issuedBy: certificate.issuedBy,
        
        // ⚠️ ADD THESE 5 LINES:
        type: certificate.type,
        certificateType: certificate.certificateType,
        uploadedFile: certificate.uploadedFile,
        notarization: certificate.notarization,
        witness: certificate.witness,
      },
      metadata: {
        signedAt: certificate.signedAt,
        createdAt: certificate.createdAt,
      },
      verification: {
        extractedHash: verificationResult.hash,
        storedHash: certificate.hash,
        hashMatch: verificationResult.hash === certificate.hash,
        verificationType: verificationResult.verificationType,
        
        // Notarization verification
        notarization: notarizationVerification,
        isNotarized: notarizationVerification?.valid || false,
        
        // Witness verification
        witness: witnessVerification,
        isWitnessed: witnessVerification?.valid || false,
        
        // Overall completion
        isComplete: certificate.verification?.complete || false,
      },
      verifiedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error('❌ Verification process failed:', error);
    return {
      valid: false,
      error: 'Verification failed',
      details: error.message,
    };
  }
}

/**
 * Verify custom tree object
 * @param {Object|string} treeObjectInput
 * @returns {Promise<Object>}
 */
export async function verifyCustomCertificate(treeObjectInput) {
  try {
    console.log('🔍 Verifying custom tree object...');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Parse if string
    let treeObject = treeObjectInput;
    if (typeof treeObjectInput === 'string') {
      try {
        treeObject = JSON.parse(treeObjectInput);
      } catch (e) {
        throw new Error('Invalid JSON format');
      }
    }

    if (!treeObject || typeof treeObject !== 'object') {
      throw new Error('Invalid tree object');
    }

    // Verify using Aqua SDK
    const verificationResult = await aquaSDK.verifyCertificate(treeObject);

    if (!verificationResult.valid) {
      return {
        valid: false,
        error: 'Invalid tree object',
        details: verificationResult.reason || 'Aqua SDK verification failed for this tree object.',
      };
    }

    return {
      valid: true,
      hash: verificationResult.hash,
      verifiedAt: new Date().toISOString(),
      message: '✅ Tree object verified successfully. Document is authentic.',
    };

  } catch (error) {
    console.error('❌ Custom verification failed:', error);
    return {
      valid: false,
      error: 'Verification failed',
      details: error.message,
    };
  }
}

// Export alias for backward compatibility
export const verifyCertificateById = verifyCertificate;