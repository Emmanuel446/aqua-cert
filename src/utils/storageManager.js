/**
 * localStorage Manager with Auto-Cleanup
 * Manages certificate storage with 8MB limit and auto-deletion
 */

const MAX_STORAGE_SIZE = 8 * 1024 * 1024; // 8MB in bytes

/**
 * Calculate size of localStorage data in bytes
 */
export function getStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

/**
 * Get all certificates sorted by creation date (oldest first)
 */
export function getCertificatesSorted() {
  const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  return certificates.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateA - dateB; // Oldest first
  });
}

/**
 * Delete oldest certificate
 */
export function deleteOldestCertificate() {
  const certificates = getCertificatesSorted();
  if (certificates.length === 0) return false;

  const oldest = certificates[0];
  console.log('🗑️ Deleting oldest certificate:', oldest.certificateId);

  // Remove oldest certificate
  const remaining = certificates.slice(1);
  localStorage.setItem('certificates', JSON.stringify(remaining));
  
  return true;
}

/**
 * Check if adding new data would exceed storage limit
 * Auto-delete oldest certificates if needed
 */
export function ensureStorageSpace(newDataSize) {
  const estimatedSize = newDataSize * 1.33; // Account for base64 encoding overhead
  let currentSize = getStorageSize();
  let deletedCount = 0;

  console.log('📊 Current storage:', (currentSize / 1024 / 1024).toFixed(2), 'MB');
  console.log('📊 New data size:', (estimatedSize / 1024 / 1024).toFixed(2), 'MB');

  // Keep deleting oldest certificates until we have space
  while (currentSize + estimatedSize > MAX_STORAGE_SIZE) {
    const deleted = deleteOldestCertificate();
    if (!deleted) {
      console.error('❌ Cannot free up storage space');
      throw new Error('Storage limit exceeded and no certificates to delete');
    }
    deletedCount++;
    currentSize = getStorageSize();
  }

  if (deletedCount > 0) {
    console.log(`✅ Deleted ${deletedCount} old certificate(s) to free up space`);
  }

  return deletedCount;
}

/**
 * Save certificate with automatic storage management
 */
export function saveCertificate(certificate) {
  try {
    const certificateString = JSON.stringify(certificate);
    const dataSize = certificateString.length;

    // Ensure we have space
    const deletedCount = ensureStorageSpace(dataSize);

    // Save certificate
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    certificates.push(certificate);
    localStorage.setItem('certificates', JSON.stringify(certificates));

    console.log('✅ Certificate saved successfully');
    if (deletedCount > 0) {
      console.log(`ℹ️ ${deletedCount} old certificate(s) were automatically deleted`);
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error('❌ Failed to save certificate:', error);
    throw error;
  }
}

/**
 * Get storage stats
 */
export function getStorageStats() {
  const size = getStorageSize();
  const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
  
  return {
    totalSize: size,
    totalSizeMB: (size / 1024 / 1024).toFixed(2),
    maxSize: MAX_STORAGE_SIZE,
    maxSizeMB: (MAX_STORAGE_SIZE / 1024 / 1024).toFixed(2),
    percentUsed: ((size / MAX_STORAGE_SIZE) * 100).toFixed(1),
    certificateCount: certificates.length,
  };
}