import { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';

export function ChatInput({ onSendMessage, onStopGeneration, isStreaming, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isStreaming) {
      if (onStopGeneration) onStopGeneration();
      return;
    }

    if (!input.trim() || disabled) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-end bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
        <div className="pl-4 pb-3.5 text-slate-400">
          <Sparkles className="w-5 h-5 text-indigo-500/80" />
        </div>

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'AI is generating...' : 'Ask a question about your documents... (Shift+Enter for newline)'}
          disabled={disabled && !isStreaming}
          className="w-full py-3.5 px-3 bg-transparent text-slate-900 placeholder-slate-400 text-sm resize-none focus:outline-none max-h-44 disabled:opacity-60"
        />

        <div className="p-2">
          {isStreaming ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all duration-200"
              title="Stop generating response"
            >
              <Square className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all duration-200 focus:outline-none"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
      <div className="text-[11px] text-center text-slate-400 mt-2">
        DocReader uses AI RAG retrieval. Verify important citation sources.
      </div>
    </div>
  );
}
