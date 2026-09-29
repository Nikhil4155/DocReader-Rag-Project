import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { SettingsPopover } from './SettingsPopover';
import { UploadDropzone } from './UploadDropzone';
import { FileText, X, Trash2, Search, Sparkles, MessageSquare, Layers, BarChart2, Calendar, Lightbulb, SplitSquareHorizontal, Clock } from 'lucide-react';
const SUGGESTED_PROMPTS = [
  'Summarize the key information in this document',
  'What are the main conclusions or findings?',
  'What are the key points and action items?',
  'List any important dates, statistics, or figures',
];

export function ChatWindow({
  messages,
  isStreaming,
  settings,
  onSettingsChange,
  onSendMessage,
  onStopGeneration,
  onClearChat,
  selectedDocument,
  onClearScope,
  onSelectDocumentById,
  onUploadSuccess,
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSendMessage = (msg) => {
    if (!isAuthenticated) {
      toast.error('Please login or register to send messages');
      navigate('/login');
      return;
    }
    onSendMessage(msg);
  };

  // Auto-scroll logic (scroll to bottom unless user has scrolled up significantly)
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 200;

      if (isScrolledToBottom || isStreaming) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 relative">
      {/* Header bar */}
      <div className="h-14 px-4 sm:px-6 border-b border-slate-200/60 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {selectedDocument ? (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-sm text-indigo-900 font-medium truncate">
              <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Chatting with: <strong className="font-semibold">{selectedDocument.filename || selectedDocument.fileName}</strong></span>
              <button
                type="button"
                onClick={onClearScope}
                className="p-0.5 rounded-md hover:bg-indigo-200/60 text-indigo-600 transition-colors ml-1"
                title="Clear document filter (search all documents)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-700 font-medium">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Scope: <strong>All User Documents</strong></span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Nav link to Search Page */}
          <Link
            to="/search"
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm font-medium"
            title="Go to Vector Similarity Search Page"
          >
            <Search className="w-4 h-4 text-indigo-500" />
            <span className="hidden md:inline">Vector Search</span>
          </Link>

          {/* Settings Popover */}
          <SettingsPopover settings={settings} onSettingsChange={onSettingsChange} />

          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
              title="Clear conversation history"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={containerRef} className={`flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 ${messages.length === 0 ? 'bg-hero-gradient' : ''}`}>
        {messages.length === 0 ? (
          <div className="max-w-6xl mx-auto w-full pt-8 pb-12">
            {/* Hero Header */}
            <div className="text-center space-y-4 mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by RAG • Find. Understand. Get Answers.</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                Your Documents, <span className="text-indigo-600">Smarter</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Upload your documents and ask anything. DocReader reads, understands and finds the most relevant information using AI.
              </p>
            </div>

            {/* Two Column Layout for Upload & Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Left Column: Upload */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-center items-center">
                <UploadDropzone onUploadSuccess={onUploadSuccess} />
              </div>

              {/* Right Column: Features Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 border border-blue-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Summarize</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">Get concise summaries of your documents</div>
                  </div>
                </div>

                <div className="bg-rose-50/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 border border-rose-100">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Key Insights</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">Find important points and action items</div>
                  </div>
                </div>

                <div className="bg-emerald-50/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 border border-emerald-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Extract Information</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">Get dates, statistics and key figures</div>
                  </div>
                </div>

                <div className="bg-amber-50/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">
                    <SplitSquareHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Compare</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">Compare information across documents</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Prompts Grid */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  Try these <span className="text-indigo-600">example questions</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUGGESTED_PROMPTS.map((prompt, idx) => {
                  const icons = [MessageSquare, BarChart2, Calendar, Clock];
                  const Icon = icons[idx % icons.length] || MessageSquare;
                  const colors = ['text-indigo-500', 'text-emerald-500', 'text-rose-500', 'text-amber-500'];
                  const bgColors = ['bg-indigo-50', 'bg-emerald-50', 'bg-rose-50', 'bg-amber-50'];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 flex items-center gap-4 text-left group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${bgColors[idx % 4]} ${colors[idx % 4]} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 leading-snug">{prompt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id || idx}
                message={msg}
                onSelectDocument={(docId) => onSelectDocumentById && onSelectDocumentById(docId)}
                isLast={idx === messages.length - 1}
                isStreaming={isStreaming}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer Chat Input */}
      <div className="px-4 sm:px-6 pb-4 pt-2 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          onStopGeneration={onStopGeneration}
          isStreaming={isStreaming}
          disabled={false}
        />
      </div>
    </div>
  );
}
