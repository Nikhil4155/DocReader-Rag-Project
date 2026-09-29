import { CheckCircle2, Loader2, AlertCircle, UploadCloud } from 'lucide-react';

export function StatusBadge({ status, errorMessage, className = '' }) {
  switch (status) {
    case 'INDEXED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Indexed
        </span>
      );

    case 'PROCESSING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 ${className}`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
          Processing
        </span>
      );

    case 'UPLOADING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 ${className}`}
        >
          <UploadCloud className="w-3.5 h-3.5 animate-pulse text-blue-500" />
          Uploading
        </span>
      );

    case 'FAILED':
      return (
        <span
          title={errorMessage || 'Document processing failed'}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800/50 cursor-help ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          Failed
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ${className}`}
        >
          {status || 'Unknown'}
        </span>
      );
  }
}
