import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import { FileText, Lock, User, Eye, EyeOff, Sparkles, BookOpen, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Username is required');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required');
      return;
    }

    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Left Brand Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center backdrop-blur-md text-indigo-300">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              DocMind
            </span>
          </div>

          <div className="max-w-md space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Chat with your documents
            </h1>
            <p className="text-indigo-200 text-base leading-relaxed">
              Upload PDF, DOCX, TXT, MD, or CSV files and query your knowledge base using state-of-the-art AI retrieval.
            </p>
          </div>
        </div>

        <div className="my-10 space-y-4 max-w-md">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-indigo-50">Instant Neural RAG Search</h4>
              <p className="text-xs text-indigo-200/80 mt-0.5">Extract precise context chunks & instant streaming answers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-indigo-50">Verified Citations</h4>
              <p className="text-xs text-indigo-200/80 mt-0.5">Every response links back to exact page numbers & similarity scores.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-indigo-50">Private & Secure</h4>
              <p className="text-xs text-indigo-200/80 mt-0.5">Your files are auto-scoped to your secure account only.</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-indigo-300/60">
          &copy; {new Date().getFullYear()} DocMind AI. Powered by DeepMind Agentic RAG.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-between items-center relative">
        <div className="w-full max-w-md flex justify-end mb-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md my-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Enter your credentials to access your document workspace
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="w-full text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          DocReader AI Document Platform
        </div>
      </div>
    </div>
  );
}
