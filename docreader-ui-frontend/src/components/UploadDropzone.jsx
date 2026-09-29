import { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { documentApi } from '../api/documentApi';
import { formatFileSize } from '../utils/formatters';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt', 'md', 'csv'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export function UploadDropzone({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]); // [{ name, size, progress, status, error }]
  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const validateFiles = (files) => {
    const valid = [];
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        toast.error(`"${file.name}" has an unsupported format. Allowed: PDF, DOCX, TXT, MD, CSV`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds maximum allowed size of 25 MB (${formatFileSize(file.size)})`);
        continue;
      }
      valid.push(file);
    }
    return valid;
  };

  const handleProcessFiles = async (filesToUpload) => {
    const validFiles = validateFiles(filesToUpload);
    if (validFiles.length === 0) return;

    // Track active upload progress state
    const initialItems = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'UPLOADING',
    }));

    setUploadingFiles(initialItems);

    try {
      if (validFiles.length === 1) {
        const file = validFiles[0];
        await documentApi.uploadDocument(file, (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadingFiles((prev) =>
              prev.map((item) => (item.name === file.name ? { ...item, progress: pct } : item))
            );
          }
        });
        toast.success(`"${file.name}" uploaded and indexed successfully!`);
      } else {
        await documentApi.uploadMultipleDocuments(validFiles, (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadingFiles((prev) =>
              prev.map((item) => ({ ...item, progress: pct }))
            );
          }
        });
        toast.success(`${validFiles.length} files uploaded and indexed successfully!`);
      }

      setUploadingFiles([]);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload document';
      toast.error(msg);
      setUploadingFiles((prev) =>
        prev.map((item) => ({ ...item, status: 'FAILED', error: msg }))
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!isAuthenticated) {
      toast.error('Please login or register to upload documents');
      navigate('/login');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(Array.from(e.target.files));
      e.target.value = ''; // reset input
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl transition-all duration-200 text-center flex flex-col items-center justify-center p-4 ${
          isDragging
            ? 'bg-indigo-50/80 scale-[0.99] border-2 border-indigo-500 border-dashed'
            : 'border-2 border-transparent border-dashed'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.docx,.doc,.txt,.md,.csv"
          className="hidden"
        />

        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 mt-2">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h4 className="text-lg font-bold text-slate-800 mb-2">
          Upload Documents
        </h4>
        <p className="text-xs text-slate-500 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-[10px] text-slate-400 mb-6">
          PDF, DOCX, TXT, MD, CSV (Max 25 MB per file)
        </p>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!isAuthenticated) {
              toast.error('Please login or register to upload documents');
              navigate('/login');
            } else {
              fileInputRef.current?.click();
            }
          }}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          Choose Files
        </button>
      </div>

      {/* Upload Progress List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                </div>
                <span className="text-slate-400 text-[11px] shrink-0">{formatFileSize(file.size)}</span>
              </div>

              {file.status === 'FAILED' ? (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{file.error || 'Upload failed'}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${Math.max(file.progress, 10)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                      {file.progress < 100 ? `Uploading (${file.progress}%)` : 'Processing & Embedding...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
