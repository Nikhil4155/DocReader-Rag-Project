import { DocumentItem } from './DocumentItem';
import { DocumentSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { FileText, RefreshCw } from 'lucide-react';

export function DocumentList({
  documents = [],
  selectedDocumentId,
  onSelectDocument,
  onDeleteDocument,
  loading = false,
  onRefresh,
}) {
  return (
    <div className="space-y-4">
      {onRefresh && (
        <div className="flex justify-end -mt-8 mb-2 relative z-10">
          <button
            type="button"
            onClick={onRefresh}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {loading && documents.length === 0 ? (
        <div className="space-y-2">
          <DocumentSkeleton />
          <DocumentSkeleton />
          <DocumentSkeleton />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload your files to start querying."
        />
      ) : (
        <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
          {documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              document={doc}
              isSelected={selectedDocumentId === doc.id}
              onSelect={() => onSelectDocument(doc)}
              onDelete={onDeleteDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
}
