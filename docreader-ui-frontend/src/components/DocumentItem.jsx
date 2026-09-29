import { useState } from 'react';
import { FileText, FileCode, FileSpreadsheet, Trash2, AlertTriangle, Layers, BookOpen } from 'lucide-react';
import { formatFileSize, formatDate } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

export function DocumentItem({ document, isSelected, onSelect, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getFileIcon = (filename) => {
    if (!filename) return <FileText className="w-5 h-5 text-indigo-500" />;
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      case 'txt':
      case 'md':
        return <FileCode className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  const filename = document.filename || document.fileName || 'Untitled Document';

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await onDelete(document.id);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(document)}
      className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700/80 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/90 shrink-0 mt-0.5">
            {getFileIcon(filename)}
          </div>

          <div className="min-w-0 flex-1">
            <h4
              title={filename}
              className={`text-sm font-semibold truncate ${
                isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {filename}
            </h4>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span>{formatFileSize(document.fileSize)}</span>
              {document.createdAt && (
                <>
                  <span>•</span>
                  <span>{formatDate(document.createdAt)}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge status={document.status} errorMessage={document.errorMessage} />
              {document.totalChunks > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  <Layers className="w-3 h-3" />
                  {document.totalChunks} chunks
                </span>
              )}
              {document.totalPages > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  <BookOpen className="w-3 h-3" />
                  {document.totalPages} pages
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(true);
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-150 shrink-0"
          title="Delete document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Overlay */}
      {showConfirm && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-between border border-red-200 dark:border-red-900/80 z-20 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Delete this document?</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            Associated vectors and chat references will be removed.
          </p>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
