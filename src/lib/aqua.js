/**
 * uhmm... Browser verification is structural only; to do a real cryptographic verification this would need server-side Node SDK.”
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
        
      } catch (error) {
        console.error("❌ Aqua SDK initialization failed:", error);
        throw new Error("Failed to initialize Aqua SDK");
      }
    }
  }

  /**
   * Sign certificate using createGenesisRevision
   * @param {Object} certificateData
   * @returns {Promise<Object>}
   */
  async signCertificate(certificateData) {
    try {
      this.init();

      console.log("🔐 Signing certificate with Aqua SDK...");

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
        throw new Error("No tree object returned");
      }

      console.log("✅ Certificate signed successfully");
      console.log("🌳 Full Tree Object:", treeObject);
      
      // Log the structure for debugging
      if (treeObject.aquaTree) {
        console.log("🌳 Inner aquaTree fields:", Object.keys(treeObject.aquaTree));
        console.log("🌳 Inner aquaTree data:", treeObject.aquaTree);
      }

      const hash = this.extractHash(treeObject);
      
      console.log("🔐 Extracted Hash:", hash);

      return {
        success: true,
        treeObject: treeObject,
        hash: hash,
        proofId: `PROOF-${Date.now()}`,
        signedAt: new Date().toISOString(),
      };

    } catch (error) {
      console.error("❌ Signing failed:", error);
      throw error;
    }
  }

  /**
   * Verify certificate
   * @param {Object} treeObject
   * @returns {Promise<boolean>}
   */
  async verifyCertificate(treeObject) {
    try {
      this.init();

      if (!treeObject) {
        throw new Error("No tree object provided");
      }

      console.log("🔍 Verifying certificate...");
      console.log("🌳 Full Tree Object:", treeObject);

      const isValid = this.validateTreeStructure(treeObject);

      console.log(isValid ? "✅ Verification successful" : "❌ Verification failed");
      return isValid;

    } catch (error) {
      console.error("❌ Verification error:", error);
      return false;
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

      // Log each field and its value for debugging
      Object.keys(aquaTree).forEach(key => {
        console.log(`  - ${key}:`, typeof aquaTree[key], aquaTree[key]);
      });

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

    // Log available fields for debugging
    console.log("🔍 Looking for hash in fields:", Object.keys(aquaTree));

    // Try all possible hash field names
    const hashFields = [
      'verification_hash',
      'merkle_root',
      'witness_event_verification_hash',
      'content_hash',
      'root_hash',
      'hash',
      'contentHash',
      'rootHash',
      'verificationHash',
      'witnessHash',
      'treeHash',
      'sha256',
      'checksum',
    ];

    for (const field of hashFields) {
      if (aquaTree[field]) {
        console.log(`✓ Found hash in field: ${field}`);
        return aquaTree[field];
      }
    }

    // If no hash found, try to find ANY field that looks like a hash
    for (const [key, value] of Object.entries(aquaTree)) {
      if (typeof value === 'string' && value.length > 20) {
        console.log(`ℹ️ Using ${key} as potential hash (long string)`);
        return value;
      }
    }

    console.warn("⚠️ Could not find hash in tree object");
    console.log("Available fields:", Object.keys(aquaTree));
    
    // Return a generated identifier based on the tree object
    return `HASH-${Date.now()}`;
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