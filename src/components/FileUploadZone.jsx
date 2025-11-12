import React, { useCallback } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUploadZone = ({ onFileSelect, uploadedFile }) => {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (JPG, PNG)');
      return;
    }

    // Validate file size (8MB max) ← UPDATED
    const maxSize = 8 * 1024 * 1024; // 8MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 8MB');
      return;
    }

    // Create preview for images
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = {
        file: file,
        name: file.name,
        type: file.type,
        size: file.size,
        preview: file.type.startsWith('image/') ? reader.result : null,
        base64Data: reader.result,
      };
      onFileSelect(fileData);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div>
      {!uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all
            ${dragActive 
              ? 'border-aqua bg-aqua/5' 
              : 'border-slate-300 hover:border-aqua/50'
            }
          `}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`
                p-4 rounded-full transition-colors
                ${dragActive ? 'bg-aqua/20' : 'bg-slate-100'}
              `}>
                <Upload className={`w-12 h-12 ${dragActive ? 'text-aqua' : 'text-slate-400'}`} />
              </div>
              
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-1">
                  {dragActive ? 'Drop your certificate here' : 'Upload Certificate'}
                </p>
                <p className="text-sm text-slate-600 mb-3">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-slate-500">
                  Supports: PDF, JPG, PNG • Max size: 8MB {/* ← UPDATED */}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="px-6 py-2 bg-gradient-to-r from-aqua to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                Choose File
              </motion.button>
            </div>
          </label>

          {/* Supported formats */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center space-x-1">
              <ImageIcon className="w-4 h-4" />
              <span>JPG/PNG</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-aqua bg-aqua/5 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-aqua/20 p-2 rounded-lg">
                {uploadedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-6 h-6 text-aqua" />
                ) : (
                  <FileText className="w-6 h-6 text-aqua" />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-slate-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUploadZone;