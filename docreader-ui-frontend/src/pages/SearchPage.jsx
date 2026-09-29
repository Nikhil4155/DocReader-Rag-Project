import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { chatApi } from '../api/chatApi';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import { CitationCard } from '../components/CitationCard';
import { CitationSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ThemeToggle } from '../components/ThemeToggle';
import { Search, ArrowLeft, FileText, Sliders, Sparkles, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function SearchPage() {
  const { documents, loading: docsLoading } = useDocuments();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [topK, setTopK] = useState(5);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.0);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null); // { query, totalMatches, matches: Citation[] }

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login or register to search documents');
      navigate('/login');
      return;
    }
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await chatApi.searchSimilarity({
        query: query.trim(),
        documentId: selectedDocId || undefined,
        topK,
        similaritySearch: similarityThreshold,
      });
      setResults(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Similarity search failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <h1 className="font-bold text-base flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-500" />
            Vector Similarity Search
          </h1>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Search Query & Filter Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search phrase or question to retrieve raw document vector matches..."
                className="w-full pl-12 pr-28 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute inset-y-1.5 right-1.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {/* Document Filter */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-500" />
                  Target Document
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  disabled={docsLoading}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Documents</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.filename || doc.fileName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Top-K Slider */}
              <div>
                <div className="flex justify-between items-center mb-1 font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    Top-K Matches: {topK}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer mt-2"
                />
              </div>

              {/* Min Similarity Slider */}
              <div>
                <div className="flex justify-between items-center mb-1 font-semibold text-slate-600 dark:text-slate-400">
                  <span>Min Similarity: {similarityThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer mt-2"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <CitationSkeleton />
              <CitationSkeleton />
              <CitationSkeleton />
            </div>
          ) : results ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Search Matches
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono text-xs border border-indigo-200 dark:border-indigo-800">
                    {results.totalMatches ?? results.matches?.length ?? 0} matches
                  </span>
                </h3>
              </div>

              {(!results.matches || results.matches.length === 0) ? (
                <EmptyState
                  icon={FileText}
                  title="No similarity matches found"
                  description="Try adjusting your search query or lowering the minimum similarity threshold slider."
                />
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {results.matches.map((match, idx) => (
                    <CitationCard key={idx} citation={match} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Vector Search Engine"
              description="Enter keywords or queries to directly retrieve relevant text chunks, page numbers, and cosine similarity scores."
            />
          )}
        </div>
      </main>
    </div>
  );
}
