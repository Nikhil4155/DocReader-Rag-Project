import { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check, Clock, BookOpen, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CitationCard } from './CitationCard';
import toast from 'react-hot-toast';

const markdownComponents = {
  p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
  h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-white">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2 text-slate-900 dark:text-white">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1.5 text-slate-900 dark:text-white">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
  li: ({ children }) => <li className="my-0.5">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-500 pl-3 italic text-slate-600 dark:text-slate-400 my-2">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 bg-slate-100 dark:bg-slate-800 font-semibold text-left text-slate-700 dark:text-slate-300">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-t border-slate-100 dark:border-slate-800">{children}</td>
  ),
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (!inline && match) {
      return (
        <div className="relative group/code my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-xs font-mono text-slate-400 border-b border-slate-800">
            <span>{match[1]}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(codeString);
                toast.success('Code copied');
              }}
              className="hover:text-white flex items-center gap-1 text-[11px]"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-3 text-xs font-mono overflow-x-auto">
            <code>{codeString}</code>
          </pre>
        </div>
      );
    }

    return (
      <code
        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export const MessageBubble = memo(function MessageBubble({ message, onSelectDocument, isLast, isStreaming }) {
  const [copied, setCopied] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const isUser = message.role === 'user';
  const { content, citations, responseTimeMs, noMatchesFound } = message;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 my-4">
        <div className="max-w-2xl bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm shadow-sm leading-relaxed">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-700 dark:bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5 my-6 group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex-1 max-w-3xl min-w-0 space-y-3">
        {/* Answer Content Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs relative">
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-3">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {(content || '').replace(/<br\s*\/?>/gi, '\n')}
            </ReactMarkdown>

            {isStreaming && isLast && (
              <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />
            )}
          </div>

          {/* Action footer & metadata */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              {responseTimeMs && (
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {responseTimeMs} ms
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy answer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* No Matches Found Note */}
        {noMatchesFound && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>No matching passages found in your documents. Answering using general AI knowledge.</span>
          </div>
        )}

        {/* Citations / Sources */}
        {citations && citations.length > 0 && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sources ({citations.length})</span>
              {sourcesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {sourcesOpen && (
              <div className="grid grid-cols-1 gap-2">
                {citations.map((citation, idx) => (
                  <CitationCard
                    key={`${citation.documentId || idx}-${citation.chunkIndex || idx}`}
                    citation={citation}
                    onSelectDocument={onSelectDocument}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
