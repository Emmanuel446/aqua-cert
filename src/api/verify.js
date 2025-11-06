/**
 * Certificate Verification API
 * Uses real Aqua SDK to verify certificates
 */

import aquaSDK from '../lib/aqua';
import { getCertificate } from './issue';

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

    // Verify using Aqua SDK
    const isValid = await aquaSDK.verifyCertificate(certificate.treeObject);

    if (!isValid) {
      console.error('❌ Aqua verification failed');
      return {
        valid: false,
        error: 'Invalid certificate',
        details: 'Aqua SDK verification failed. Document may be tampered with.',
      };
    }

    console.log('✅ Certificate verified successfully');

    return {
      valid: true,
      proofId: certificate.proofId,
      proofHash: certificate.hash,
      data: {
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        institution: certificate.institution,
        program: certificate.program,
        issueDate: certificate.issueDate,
        issuedBy: certificate.issuedBy,
      },
      metadata: {
        signedAt: certificate.signedAt,
        createdAt: certificate.createdAt,
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
    const isValid = await aquaSDK.verifyCertificate(treeObject);

    if (!isValid) {
      return {
        valid: false,
        error: 'Invalid tree object',
        details: 'Aqua SDK verification failed for this tree object.',
      };
    }

    return {
      valid: true,
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