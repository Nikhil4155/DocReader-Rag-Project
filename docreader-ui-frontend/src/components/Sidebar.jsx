import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { DocumentList } from './DocumentList';
import { UploadDropzone } from './UploadDropzone';
import { ThemeToggle } from './ThemeToggle';
import { FileText, Layers, LogOut, X, Shield, User, Search, PlusCircle, Settings, HardDrive } from 'lucide-react';

export function Sidebar({
  documents,
  selectedDocumentId,
  onSelectDocument,
  onDeleteDocument,
  onUploadSuccess,
  loading,
  onRefresh,
  mobileOpen,
  onCloseMobile,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              DocReader
            </h1>
            <p className="text-[11px] text-slate-400">AI Document Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          {mobileOpen && (
            <>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="px-3 py-4 space-y-1 border-b border-slate-800/60">
        <button
          type="button"
          onClick={() => {
            onSelectDocument(null);
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all duration-150 ${
            selectedDocumentId === null
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>All Documents</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">
            {documents.length}
          </span>
        </button>

        <Link
          to="/search"
          onClick={() => onCloseMobile?.()}
          className="w-full p-3 rounded-xl text-sm font-semibold flex items-center gap-3 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all duration-150"
        >
          <Search className="w-5 h-5 text-slate-400" />
          <span>Vector Search</span>
        </Link>

        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full p-3 rounded-xl text-sm font-semibold flex items-center gap-3 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all duration-150"
        >
          <PlusCircle className="w-5 h-5 text-indigo-400" />
          <span>Add Documents</span>
        </button>

        <button
          className="w-full p-3 rounded-xl text-sm font-semibold flex items-center gap-3 text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all duration-150"
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>

      {/* Main Document List Area (Recent Documents) */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          Recent Documents
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        <DocumentList
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onSelectDocument={(doc) => {
            onSelectDocument(doc);
            if (onCloseMobile) onCloseMobile();
          }}
          onDeleteDocument={onDeleteDocument}
          onUploadSuccess={onUploadSuccess}
          loading={loading}
          onRefresh={onRefresh}
        />
      </div>

      {/* Storage Usage */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2 text-slate-300">
          <HardDrive className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold">Storage Usage</span>
        </div>
        <div className="text-xs text-slate-400 mb-2">12 / 500 MB</div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className="w-[2%] h-full bg-indigo-500 rounded-full"></div>
        </div>
        <div className="text-right mt-1 text-[9px] text-slate-500 font-medium">2%</div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{user?.username || 'User'}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  {user?.role === 'ADMIN' && <Shield className="w-3 h-3 text-amber-400 shrink-0" />}
                  <span className="truncate">{user?.role || 'USER'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-colors w-full"
            >
              Login / Register
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-80 lg:w-96 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setShowUploadModal(false)} 
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-2">
              <UploadDropzone onUploadSuccess={() => {
                setShowUploadModal(false);
                if (onUploadSuccess) onUploadSuccess();
              }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
