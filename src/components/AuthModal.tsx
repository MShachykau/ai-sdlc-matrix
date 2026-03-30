import { useState, useRef, useEffect } from 'react';

interface AuthModalProps {
  onLogin: (username: string, password: string) => boolean;
  onDismiss: () => void;
}

export function AuthModal({ onLogin, onDismiss }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(username, password);
    if (!ok) {
      setError('Invalid username or password');
      setPassword('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-blue-400 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">Admin Access</h2>
              <p className="text-xs text-slate-400 mt-1">Sign in to edit matrix content</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Username</label>
            <input
              ref={usernameRef}
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onDismiss}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!username || !password}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg hover:from-violet-600 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
