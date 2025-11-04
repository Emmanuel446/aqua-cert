import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(certificateData, proofId) {
  try {
    const element = document.getElementById('certificate-preview')
    
    if (!element) {
      console.error('Certificate preview element not found')
      return
    }

    // Create canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    })

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // Download
    pdf.save(`Certificate-${certificateData.certificateId}.pdf`)
  } catch (error) {
    console.error('PDF generation error:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}