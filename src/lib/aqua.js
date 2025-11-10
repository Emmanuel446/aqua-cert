/**
 * Aqua SDK Wrapper - Real Implementation
 * Uses aqua-js-sdk/web for browser environment
 * 
 * Due to limitations in the browser version of the Aqua SDK, the app performs structural
 * validation of certificate proofs instead of full cryptographic verification.
 * The full verification would require a server-side implementation
 */

import Aquafier from "aqua-js-sdk/web";

class AquaCertSDK {
  constructor() {
    this.aquafier = null;
    this.initialized = false;
  }

  /**
   * Initialize Aquafier
   */
  init() {
  if (!this.initialized) {
    try {
      this.aquafier = new Aquafier();
      this.initialized = true;
      console.log("✅ Aqua SDK initialized");
      
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.aquafier))
        .filter(name => typeof this.aquafier[name] === 'function');
      console.log("📋 Available Aquafier methods:", methods);
      
      // ADD THESE LINES:
      console.log("🔍 Checking verification methods:");
      console.log("Has verifyRevision?", typeof this.aquafier.verifyRevision === 'function');
      console.log("Has verifyProof?", typeof this.aquafier.verifyProof === 'function');
      console.log("Has verify?", typeof this.aquafier.verify === 'function');
      console.log("Has verifyTree?", typeof this.aquafier.verifyTree === 'function');
      console.log("Has validateProof?", typeof this.aquafier.validateProof === 'function');
      
    } catch (error) {
      console.error("❌ Aqua SDK initialization failed:", error);
      throw new Error("Failed to initialize Aqua SDK");
    }
  }
}
  // init() {
  //   if (!this.initialized) {
  //     try {
  //       this.aquafier = new Aquafier();
  //       this.initialized = true;
  //       console.log("✅ Aqua SDK initialized");
        
  //       const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.aquafier))
  //         .filter(name => typeof this.aquafier[name] === 'function');
  //       console.log("📋 Available Aquafier methods:", methods);
        
  //     } catch (error) {
  //       console.error("❌ Aqua SDK initialization failed:", error);
  //       throw new Error("Failed to initialize Aqua SDK");
  //     }
  //   }
  // }

  /**
   * Sign certificate using createGenesisRevision
   * @param {Object} certificateData
   * @returns {Promise<Object>}
   */
  async signCertificate(certificateData) {
    try {
      this.init();

      console.log("🚀 Generating certificate with Aqua SDK...");

      const fileObject = {
        fileName: `${certificateData.recipientName.replace(/\s+/g, '_')}_certificate.json`,
        fileContent: JSON.stringify(certificateData, null, 2),
      };

      console.log("📄 File Object:", fileObject);

      const result = await this.aquafier.createGenesisRevision(fileObject);

      if (result.error) {
        console.error("❌ Error creating proof:", result.logData);
        throw new Error(result.logData?.join(", ") || "Genesis revision failed");
      }

      const treeObject = result.data;

      if (!treeObject) {
        throw new Error("No tree object returned from Aqua SDK");
      }

      console.log("✅ Certificate signed successfully");
      console.log("🌳 Full Tree Object:", treeObject);

      // Detailed logging for debugging
      console.log('🔍 Detailed tree inspection:');
      console.log('  aquaTree:', treeObject.aquaTree);
      console.log('  aquaTree.revisions:', treeObject.aquaTree?.revisions);
      console.log('  aquaTree.tree:', treeObject.aquaTree?.tree);
      console.log('  aquaTree.file_index:', treeObject.aquaTree?.file_index);
      console.log('  aquaTree.treeMapping:', treeObject.aquaTree?.treeMapping);

      // Extract both hashes
      const treeHash = this.extractHash(treeObject);
      const fileHash = this.extractFileHash(treeObject);
      
      console.log("🔐 Tree Hash (Merkle Root):", treeHash);
      console.log("📄 File Hash (Content Hash):", fileHash);

      return {
        success: true,
        treeObject: treeObject,
        hash: treeHash,              // Canonical Aqua tree hash
        fileHash: fileHash,           // Content hash
        proofId: `PROOF-${Date.now()}`,
        signedAt: new Date().toISOString(),
        
        // Metadata for debugging/verification
        metadata: {
          fileName: fileObject.fileName,
          treeStructure: {
            hasRevisions: !!treeObject.aquaTree?.revisions,
            hasTree: !!treeObject.aquaTree?.tree,
            hasMapping: !!treeObject.aquaTree?.treeMapping,
          }
        }
      };

    } catch (error) {
      console.error("❌ Signing failed:", error);
      throw error;
    }
  }

  /**
   * Verify certificate
   * @param {Object} treeObject
   * @param {string} expectedHash - Optional: compare against expected hash
   * @returns {Promise<Object>}
   */
  async verifyCertificate(treeObject, expectedHash = null) {
    try {
      this.init();

      if (!treeObject) {
        throw new Error("No tree object provided");
      }

      console.log("🔍 Verifying certificate...");

      // Step 1: Structural validation
      const structureValid = this.validateTreeStructure(treeObject);
      
      if (!structureValid) {
        return {
          valid: false,
          reason: "Invalid tree structure"
        };
      }

      // Step 2: Hash extraction and verification
      let extractedHash;
      try {
        extractedHash = this.extractHash(treeObject);
      } catch (error) {
        return {
          valid: false,
          reason: "Could not extract hash from tree object",
          error: error.message
        };
      }

      // Step 3: Hash comparison (if expected hash provided)
      if (expectedHash) {
        const hashesMatch = extractedHash.toLowerCase() === expectedHash.toLowerCase();
        
        console.log("🔐 Hash Comparison:");
        console.log("  Expected:", expectedHash);
        console.log("  Extracted:", extractedHash);
        console.log("  Match:", hashesMatch ? "✅" : "❌");

        if (!hashesMatch) {
          return {
            valid: false,
            reason: "Hash mismatch - certificate may be tampered",
            expectedHash,
            extractedHash
          };
        }
      }

      console.log("✅ Certificate verification successful");
      
      return {
        valid: true,
        hash: extractedHash,
        verifiedAt: new Date().toISOString(),
        verificationType: "structural + hash extraction"
      };

    } catch (error) {
      console.error("❌ Verification error:", error);
      return {
        valid: false,
        reason: "Verification failed",
        error: error.message
      };
    }
  }

  /**
   * Validate tree object structure
   * @param {Object} treeObject
   * @returns {boolean}
   */
  validateTreeStructure(treeObject) {
    try {
      console.log("🔍 Performing structural validation...");

      if (!treeObject || typeof treeObject !== 'object') {
        console.log("❌ Invalid tree object type");
        return false;
      }

      // Check for the nested aquaTree structure
      if (!treeObject.aquaTree) {
        console.log("❌ No aquaTree found in tree object");
        return false;
      }

      const aquaTree = treeObject.aquaTree;
      console.log("🌳 Inner aquaTree:", aquaTree);
      console.log("🔍 aquaTree field names:", Object.keys(aquaTree));

      // Check if aquaTree has ANY content at all
      const hasContent = Object.keys(aquaTree).length > 0;

      if (!hasContent) {
        console.log("❌ aquaTree is empty");
        return false;
      }

      // Check logData for errors
      if (treeObject.logData && Array.isArray(treeObject.logData)) {
        console.log("📋 Log Data:", treeObject.logData);
        
        const hasErrors = treeObject.logData.some(log => {
          const logStr = String(log).toLowerCase();
          return logStr.includes('error') || logStr.includes('fail');
        });
        
        if (hasErrors) {
          console.log("⚠️ Tree object contains error logs");
          return false;
        }
      }

      // If aquaTree exists and has content, consider it valid
      console.log("✅ Structural validation passed");
      console.log("ℹ️ aquaTree contains", Object.keys(aquaTree).length, "fields");
      
      return true;

    } catch (error) {
      console.error("❌ Structural validation failed:", error);
      return false;
    }
  }

  /**
   * Extract hash from tree object
   * @param {Object} treeObject
   * @returns {string}
   */
  extractHash(treeObject) {
    const aquaTree = treeObject?.aquaTree || treeObject;

    console.log("🔍 Extracting Aqua hash from tree object...");

    // ✅ PRIMARY HASH LOCATIONS (based on actual SDK output)
    
    // 1. Try tree.hash first (this is the canonical Merkle root)
    if (aquaTree.tree?.hash) {
      console.log("✅ Found canonical hash at tree.hash:", aquaTree.tree.hash);
      return aquaTree.tree.hash;
    }

    // 2. Try treeMapping.latestHash (same value, backup location)
    if (aquaTree.treeMapping?.latestHash) {
      console.log("✅ Found hash at treeMapping.latestHash:", aquaTree.treeMapping.latestHash);
      return aquaTree.treeMapping.latestHash;
    }

    // 3. Try to extract from revisions object (the key IS the hash)
    if (aquaTree.revisions && typeof aquaTree.revisions === 'object') {
      const revisionKeys = Object.keys(aquaTree.revisions);
      if (revisionKeys.length > 0) {
        const revisionHash = revisionKeys[0]; // First key is the hash
        console.log("✅ Found hash from revision key:", revisionHash);
        return revisionHash;
      }
    }

    // 4. FALLBACK: Legacy hash field locations (for compatibility)
    const legacyHashFields = [
      'verification_hash',
      'merkle_root',
      'witness_event_verification_hash',
      'hash',
      'rootHash',
    ];

    for (const field of legacyHashFields) {
      if (aquaTree[field]) {
        console.log(`✅ Found legacy hash at ${field}:`, aquaTree[field]);
        return aquaTree[field];
      }
    }

    // ❌ If still no hash found, this is an error
    console.error("❌ CRITICAL: Could not extract Aqua hash from tree object");
    console.log("Available aquaTree fields:", Object.keys(aquaTree));
    console.log("Full aquaTree:", aquaTree);
    
    throw new Error("Unable to extract Aqua hash from tree object. Invalid structure.");
  }

  /**
   * Extract file hash (content hash) from revision data
   * @param {Object} treeObject
   * @returns {string|null}
   */
  extractFileHash(treeObject) {
    const aquaTree = treeObject?.aquaTree || treeObject;

    console.log("🔍 Extracting file hash from revisions...");

    if (!aquaTree.revisions || typeof aquaTree.revisions !== 'object') {
      console.warn("⚠️ No revisions found in tree object");
      return null;
    }

    // Get first revision
    const revisionKeys = Object.keys(aquaTree.revisions);
    if (revisionKeys.length === 0) {
      console.warn("⚠️ Revisions object is empty");
      return null;
    }

    const firstRevision = aquaTree.revisions[revisionKeys[0]];
    
    if (firstRevision?.file_hash) {
      console.log("✅ Found file hash:", firstRevision.file_hash);
      return firstRevision.file_hash;
    }

    console.warn("⚠️ No file_hash found in revision");
    return null;
  }

  /**
   * Get detailed info about tree object
   * @param {Object} treeObject
   * @returns {Object}
   */
  getTreeInfo(treeObject) {
    const aquaTree = treeObject?.aquaTree || {};
    
    return {
      hash: this.extractHash(treeObject),
      fileHash: this.extractFileHash(treeObject),
      hasAquaTree: !!treeObject.aquaTree,
      hasLogData: !!treeObject.logData,
      aquaTreeKeys: Object.keys(aquaTree),
      topLevelKeys: Object.keys(treeObject),
      aquaTreeData: aquaTree,
    };
  }
}

// Export singleton
const aquaSDK = new AquaCertSDK();
export default aquaSDK;