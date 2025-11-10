#AquaCert — Verifiable Digital Certificates

AquaCert is a web application that enables institutions and organizations to issue and verify tamper-proof digital certificates using the real Aqua SDK.
It brings trust, transparency, and authenticity to digital credentials — ensuring every certificate is cryptographically signed, traceable, and verifiable.

# Overview

AquaCert is fully integrated with the live Aqua JavaScript SDK (Web) for both certificate issuance and verification.
Each certificate is cryptographically signed via Aqua’s createGenesisRevision(), producing a verifiable Aqua Tree Object that acts as proof of authenticity.

Verification now leverages the real Aqua SDK verification process, which checks both the Merkle tree integrity and stored proof hashes, ensuring that documents have not been tampered with.

# How It Works
1. User Authentication

Users log in or sign up before issuing certificates.
Each issued certificate is automatically linked to the logged-in issuer’s wallet/account — ensuring traceability and accountability.

2. Upload Certificate Data

The issuer enters details such as:

Recipient Name

Institution

Program

Date of Issue

The app structures this data into a signed JSON payload ready for Aqua SDK processing.

# Sign with Aqua SDK

AquaCert calls createGenesisRevision() from the Aqua SDK (Web) to generate:

A Tree Object (Merkle proof)

A unique hash representing the certificate’s cryptographic fingerprint

This proof is stored locally (simulating decentralized persistence) and can be shared for public verification.

# Generate a Shareable Verification Link

After issuance, a shareable link is created, e.g.:

https://yourdomain.com/verify?id=CERT-1762730056309


Recipients (e.g., employers or institutions) can use this link to instantly verify certificate authenticity.

# Verify Certificate

When opened, the Verify page auto-fills the proof ID and:

Retrieves the stored proof object

Runs Aqua SDK verification on the tree and hash

Confirms the proof’s integrity and that the file has not been altered

The verification module uses verifyCertificate() logic powered by the Aqua SDK — confirming both tree validity and hash consistency.

## Technical Architecture
Frontend	React (JSX) + TailwindCSS
Aqua JavaScript SDK (Web)
Proof Storage	LocalStorage (simulated decentralized persistence)
Certificate Logic	Uses createGenesisRevision() for signing and SDK-based validation for verification
# SDK Notes

Signing: Fully handled by Aqua SDK (createGenesisRevision)

Verification:  Now powered by Aqua SDK’s real validation flow (Merkle tree + hash check)

Backend: Currently simulated; ready for upgrade to Node-based persistence or Aqua’s hosted verifier.

# Built With

React (JSX) — Interactive, modular frontend

TailwindCSS — Responsive minimal styling

Aqua SDK (Web) — Real cryptographic signing & verification

Local Storage — Temporary proof persistence

## Team Members

Samuel Obarine Ngekeda — Project Manager

Ogba Emmanuel — Frontend Developer

Oluwatoyin Boluwarin Ojumoro — Frontend Developer

Peters Vivian Okpokipoy — Frontend Developer
