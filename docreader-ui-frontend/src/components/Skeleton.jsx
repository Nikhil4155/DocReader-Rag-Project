
export function DocumentSkeleton() {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 animate-pulse flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 my-4 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-2 max-w-xl">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
      </div>
    </div>
  );
}

export function CitationSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
    </div>
  );
}
