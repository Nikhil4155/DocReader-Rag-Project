import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { useChat } from '../hooks/useChat';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';
import { Menu, FileText } from 'lucide-react';

export function DashboardPage() {
  const {
    documents,
    loading: docsLoading,
    selectedDocumentId,
    selectedDocument,
    setSelectedDocumentId,
    deleteDocument,
    refreshDocuments,
  } = useDocuments();

  const {
    messages,
    isStreaming,
    settings,
    setSettings,
    sendMessage,
    stopGeneration,
    clearChat,
  } = useChat(selectedDocumentId);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar
        documents={documents}
        selectedDocumentId={selectedDocumentId}
        onSelectDocument={(doc) => setSelectedDocumentId(doc ? doc.id : null)}
        onDeleteDocument={deleteDocument}
        onUploadSuccess={refreshDocuments}
        loading={docsLoading}
        onRefresh={refreshDocuments}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Mobile Header Bar */}
        <div className="md:hidden h-14 px-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>DocReader</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Chat Window */}
        <div className="flex-1 min-h-0">
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            settings={settings}
            onSettingsChange={setSettings}
            onSendMessage={sendMessage}
            onStopGeneration={stopGeneration}
            onClearChat={clearChat}
            selectedDocument={selectedDocument}
            onClearScope={() => setSelectedDocumentId(null)}
            onSelectDocumentById={(docId) => setSelectedDocumentId(docId)}
            onUploadSuccess={refreshDocuments}
          />
        </div>
      </div>
    </div>
  );
}
