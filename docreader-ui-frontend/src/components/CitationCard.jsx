import { useState } from 'react';
import { FileText, Layers, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPercent } from '../utils/formatters';

export function CitationCard({ citation, onSelectDocument }) {
  const [expanded, setExpanded] = useState(false);

  const { fileName, pageNumber, chunkIndex, similarityScore, snippet, documentId } = citation;
  const isSnippetLong = snippet && snippet.length > 220;
  const displayText = expanded || !isSnippetLong ? snippet : `${snippet?.slice(0, 220)}...`;
  const pctString = formatPercent(similarityScore);

  return (
    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 shadow-xs transition-all duration-200 text-xs">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => documentId && onSelectDocument && onSelectDocument(documentId)}
          className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate text-left"
          title="Filter chat by this document"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="truncate">{fileName || 'Document'}</span>
          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {pageNumber !== null && pageNumber !== undefined && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 text-[11px]">
              Page {pageNumber}
            </span>
          )}
          {chunkIndex !== null && chunkIndex !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
              <Layers className="w-3 h-3" />
              Chunk #{chunkIndex}
            </span>
          )}
          {pctString && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold text-[11px] border border-indigo-200/60 dark:border-indigo-800/60">
              {pctString}
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
        &ldquo;{displayText}&rdquo;
      </p>

      {isSnippetLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          {expanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
