import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Detect if user is on mobile device
 */
function isMobileDevice() {
  return window.innerWidth <= 768;
}

/**
 * Generate responsive PDF certificate
 * - Portrait for mobile devices
 * - Landscape for desktop devices
 */
export async function generatePDF(certificateData, proofId) {
  try {
    const element = document.getElementById('certificate-preview');

    if (!element) {
      console.error('Certificate preview element not found');
      alert('Cannot generate PDF. Certificate preview not found.');
      return;
    }

    console.log('📄 Generating PDF...');

    const isMobile = isMobileDevice();
    console.log('📱 Device type:', isMobile ? 'Mobile' : 'Desktop');

    // Create canvas from HTML with high quality
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for better quality
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');

    // Calculate dimensions based on device
    let pdf;
    let pdfWidth;
    let pdfHeight;

    if (isMobile) {
      // Mobile: Portrait A4
      pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      pdfWidth = pdf.internal.pageSize.getWidth();
      pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit portrait
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Center the image
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

    } else {
      // Desktop: Landscape A4
      pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      pdfWidth = pdf.internal.pageSize.getWidth();
      pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    // Generate filename
    const filename = `Certificate-${certificateData.recipientName.replace(/\s+/g, '_')}-${proofId}.pdf`;

    // Download
    pdf.save(filename);

    console.log('✅ PDF generated successfully:', filename);

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}

/**
 * Alternative: Generate PDF with custom dimensions
 * Use this if you want more control
 */
export async function generateCustomPDF(certificateData, proofId, customOrientation = null) {
  try {
    const element = document.getElementById('certificate-preview');

    if (!element) {
      console.error('Certificate preview element not found');
      return;
    }

    const isMobile = isMobileDevice();
    const orientation = customOrientation || (isMobile ? 'portrait' : 'landscape');

    console.log('📄 Generating', orientation, 'PDF for', isMobile ? 'mobile' : 'desktop');

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Maintain aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const width = imgWidth * ratio;
    const height = imgHeight * ratio;

    // Center on page
    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    pdf.addImage(imgData, 'PNG', x, y, width, height);

    const filename = `${certificateData.recipientName.replace(/\s+/g, '_')}_Certificate.pdf`;
    pdf.save(filename);

    console.log('✅ PDF saved:', filename);

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    alert('Failed to generate PDF');
  }
}