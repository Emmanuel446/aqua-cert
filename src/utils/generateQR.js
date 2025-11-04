// QR code generation is handled by qrcode.react component
// This file can contain helper functions if needed

export function getVerificationURL(proofId) {
  return `${window.location.origin}/verify?id=${proofId}`
}

export function generateQRData(certificateData, proofId) {
  return JSON.stringify({
    certificateId: certificateData.certificateId,
    proofId: proofId,
    verifyURL: getVerificationURL(proofId),
  })
}