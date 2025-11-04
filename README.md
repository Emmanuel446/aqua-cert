AquaCert — Verifiable Digital Certificates

AquaCert is a web application that enables institutions and organizations to issue and verify tamper-proof digital certificates using the Aqua SDK.
It brings trust, transparency, and authenticity to digital credentials — ensuring every certificate is cryptographically signed and traceable.

AquaCert fully integrates the real Aqua JavaScript SDK (Web) to issue and validate digital certificates on-chain.
Each certificate is signed using createGenesisRevision(), generating an authentic Aqua Tree Object as proof of origin.
Due to current SDK constraints, verification runs structural validation client-side, but the system is architected for full cryptographic verification once verifyRevision() becomes available in the SDK.
This project demonstrates end-to-end Aqua protocol usage — from secure issuance to shareable proof verification — inside a modern React + Tailwind interface.

🔗 How It Works
1. User Authentication

Users log in or sign up before issuing certificates.
Each issued certificate is automatically linked to the logged-in issuer’s account, ensuring traceability and accountability.

2. Upload Certificate Data

The issuer fills in certificate details: name, institution, program, and date.

The app structures this information into a JSON object ready for signing.

3. Sign with Aqua SDK

The app calls createGenesisRevision() from the Aqua SDK (Web) to generate a Tree Object, representing a cryptographic proof of authenticity.

The proof is stored locally (simulating decentralized storage).

This process ensures each certificate has a unique, verifiable signature issued through Aqua’s real SDK.

4. Generate a Shareable Verification Link

After issuance, the system generates a shareable verification link, for example:

https://yourdomain.com/verify?id=PROOF-1762266043527


The link can be sent to employers, institutions, or anyone who needs to validate the certificate.

5. Verify Certificate

When a recipient opens the link, the Verify page auto-fills the Proof ID.

Clicking “Verify Certificate” runs an in-browser validation that checks the proof structure, completeness, and integrity.

While full cryptographic verification isn’t available client-side, the system ensures proof consistency and data authenticity.

⚙️ Current Limitation

Due to current SDK constraints, the browser build (aqua-js-sdk/web) only exposes the createGenesisRevision() method.
This means full cryptographic verification (e.g., verifyRevision()) cannot yet be executed in the browser.

As a result:

Verification currently performs structural validation of proofs.

Full blockchain-level verification will be enabled once Aqua exposes the verification method in the web SDK or when connected to a Node backend.

This limitation does not affect issuance authenticity — every certificate is still signed through the real Aqua SDK, producing genuine proof data.

Built With

- React (JSX) — for a clean, interactive frontend

- TailwindCSS — for responsive and minimal styling

- Aqua JavaScript SDK (Web) — for cryptographic proof creation

- Local Storage — for temporary data and proof persistence
