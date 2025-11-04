AquaCert — Verifiable Digital Certificates

AquaCert is a web application that enables institutions and organizations to issue verifiable digital certificates securely using the Aqua SDK. It brings transparency and authenticity to digital credentials — ensuring every certificate is uniquely signed and traceable.

Users fill in certificate details (name, institution, program, date), which are signed using Aqua’s createGenesisRevision() method to produce a cryptographic proof (a tree object). This proof can later be checked for validity, ensuring certificates remain tamper-evident and verifiable across systems.

- How It Works

  Upload Certificate Data:
  
  User enters certificate information via a web form.
  
  Data is structured into a JSON object for signing.
  
  Sign with Aqua SDK:
  
  The app calls createGenesisRevision() from the Aqua SDK to generate a tree object — a verifiable proof structure.
  
  This proof is stored locally (simulating decentralized record storage).
  
  Verification:
  
  The app validates certificate proofs through a structural check in the browser.
  
  It ensures the proof object exists, is complete, and hasn’t been modified.
  
  Due to SDK restrictions, full cryptographic verification isn’t available in-browser; this would require a backend using the Node SDK or Aqua’s verification service.

- Current Limitation

  The browser SDK exposes only createGenesisRevision(), meaning full cryptographic verification (verifyRevision()) cannot be executed client-side.
  
  Verification in this demo therefore focuses on proof structure integrity, not full cryptographic validation.
  
  This limitation doesn’t affect issuance authenticity — every proof is still created via Aqua’s real SDK.

- what we used to build Aqua-cert:

  Built with React + TailwindCSS for a clean, responsive UI.
  
  Integrates the Aqua JavaScript SDK (Web) for decentralized proof creation.
  
  Stores certificate data and tree proofs locally.
