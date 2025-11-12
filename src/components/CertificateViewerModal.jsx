import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

const CertificateViewerModal = ({ isOpen, onClose, certificate }) => {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !certificate) return null;

  const isPDF = certificate.uploadedFile?.type === 'application/pdf';
  const isImage = certificate.uploadedFile?.type?.startsWith('image/');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificate.uploadedFile.base64Data;
    link.download = certificate.uploadedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-aqua to-blue-600 p-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-display font-bold text-xl">Certificate Viewer</h3>
                <p className="text-sm text-blue-100">{certificate.uploadedFile?.name}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Zoom Controls */}
                {isImage && (
                  <div className="flex items-center space-x-1 bg-white/20 rounded-lg p-1">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 hover:bg-white/20 rounded transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleZoomReset}
                      className="px-3 py-2 hover:bg-white/20 rounded transition-colors text-sm font-semibold"
                      title="Reset Zoom"
                    >
                      {zoom}%
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 hover:bg-white/20 rounded transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Download Certificate"
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Display Area */}
            <div className="flex-1 overflow-auto bg-slate-100 p-4">
              {isPDF ? (
                /* PDF Viewer */
                <div className="w-full h-full bg-white rounded-lg shadow-lg">
                  <iframe
                    src={certificate.uploadedFile.base64Data}
                    className="w-full h-full rounded-lg"
                    title="Certificate PDF"
                  />
                </div>
              ) : isImage ? (
                /* Image Viewer with Zoom */
                <div className="flex items-center justify-center h-full">
                  <img
                    src={certificate.uploadedFile.preview || certificate.uploadedFile.base64Data}
                    alt="Certificate"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
              ) : (
                /* Fallback */
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-slate-600 mb-4">Cannot preview this file type</p>
                    <button
                      onClick={handleDownload}
                      className="px-6 py-3 bg-aqua text-white rounded-lg hover:bg-aqua-600 transition-colors"
                    >
                      Download File
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-slate-600">
                <span>Type: <span className="font-semibold text-slate-900">{certificate.uploadedFile?.type}</span></span>
                <span>Size: <span className="font-semibold text-slate-900">{(certificate.uploadedFile?.size / 1024 / 1024).toFixed(2)} MB</span></span>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-aqua text-white rounded-lg hover:bg-aqua-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CertificateViewerModal;