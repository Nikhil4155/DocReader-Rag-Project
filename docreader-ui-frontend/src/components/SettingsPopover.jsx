import { useState, useEffect, useRef } from 'react';
import { Sliders, X, RotateCcw } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../utils/settings';

export function SettingsPopover({ settings, onSettingsChange }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    onSettingsChange(updated);
    try {
      localStorage.setItem('docreader_settings', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleReset = () => {
    onSettingsChange(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('docreader_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
        title="Chat & RAG Retrieval Settings"
      >
        <Sliders className="w-4 h-4 text-indigo-500" />
        <span className="hidden sm:inline">Settings</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Retrieval &amp; Stream Settings
            </h4>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* TopK Slider */}
            <div>
              <div className="flex justify-between items-center mb-1 font-medium">
                <label className="text-slate-700 dark:text-slate-300">Top-K Context Chunks</label>
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                  {settings.topK}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={settings.topK}
                onChange={(e) => handleChange('topK', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">Number of document passages to retrieve (1 - 20).</p>
            </div>

            {/* Min Similarity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1 font-medium">
                <label className="text-slate-700 dark:text-slate-300">Minimum Similarity Threshold</label>
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                  {settings.minSimilarity.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.minSimilarity}
                onChange={(e) => handleChange('minSimilarity', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">Filter out chunks with cosine similarity below this score.</p>
            </div>

            {/* Streaming Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200">Stream Responses</label>
                <p className="text-[10px] text-slate-400">Stream text chunks with parallel citation retrieval.</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('stream', !settings.stream)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  settings.stream ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.stream ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
