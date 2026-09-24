import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  TrendingUp,
  ArrowRight,
  UserCheck,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { LastUser } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastUser: LastUser | null;
  onLogin: (email: string, password: string, remember: boolean) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string) => Promise<boolean>;
  onLoginAsGuest: () => void;
  onForgetLastUser: () => void;
  loading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lastUser,
  onLogin,
  onRegister,
  onLoginAsGuest,
  onForgetLastUser,
  loading,
  errorMessage,
  onClearError,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(lastUser ? 'login' : 'login');
  const [switchAccount, setSwitchAccount] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState(lastUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    onClearError();

    const targetEmail = switchAccount || !lastUser ? email : lastUser.email;

    if (!targetEmail || !targetEmail.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your account password.');
      return;
    }

    const success = await onLogin(targetEmail, password, rememberMe);
    if (success) {
      setPassword('');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    onClearError();

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    const success = await onRegister(name, email, password);
    if (success) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSwitchAccount(true);
    setMode('login');
    setLocalError(null);
    onClearError();
  };

  const isRememberedUserPrompt = !!lastUser && !switchAccount && mode === 'login';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 7, 12, 0.85)', backdropFilter: 'blur(14px)' }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden animate-fadeIn"
        style={{
          background: 'rgba(15, 20, 31, 0.95)',
          borderColor: 'rgba(79, 142, 247, 0.25)',
          boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(59, 130, 246, 0.2)',
        }}
      >
        {/* Header decoration bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          title="Dismiss (Explore as Guest)"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
              style={{ background: 'rgba(79, 142, 247, 0.18)', border: '1px solid rgba(79, 142, 247, 0.35)' }}
            >
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                NEPSE<span className="text-blue-400 font-mono">ALARM</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 font-bold uppercase tracking-wider">
                  AI Terminal
                </span>
              </div>
              <p className="text-xs text-slate-400">Nepal Stock Exchange AI Prediction System</p>
            </div>
          </div>

          {/* Prompt / Notification if Remembered User */}
          {isRememberedUserPrompt ? (
            <div className="space-y-5">
              <div
                className="p-4 rounded-xl border flex items-center gap-3.5"
                style={{ background: 'rgba(79, 142, 247, 0.08)', borderColor: 'rgba(79, 142, 247, 0.2)' }}
              >
                <img
                  src={lastUser.avatar}
                  alt={lastUser.name}
                  className="h-12 w-12 rounded-full border border-blue-500/30 object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-blue-400">Welcome Back</span>
                    <Sparkles className="h-3 w-3 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{lastUser.name}</h3>
                  <p className="text-xs text-slate-400 truncate">{lastUser.email}</p>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Account Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {(localError || errorMessage) && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    {localError || errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In as {lastUser.name.split(' ')[0]}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSwitchAccount(true);
                      setPassword('');
                      setLocalError(null);
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Switch account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onForgetLastUser();
                      setSwitchAccount(true);
                      setPassword('');
                    }}
                    className="text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    Forget this user
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Standard Login / Register form */
            <div>
              {/* Mode Tabs */}
              <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLocalError(null);
                    onClearError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setLocalError(null);
                    onClearError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-9 pr-10 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
                      />
                      <span>Remember this user</span>
                    </label>
                    {lastUser && (
                      <button
                        type="button"
                        onClick={() => setSwitchAccount(false)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Use {lastUser.name.split(' ')[0]}
                      </button>
                    )}
                  </div>

                  {(localError || errorMessage) && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                      {localError || errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Registration form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sakxam Bhattarai"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-10 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {(localError || errorMessage) && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                      {localError || errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Trader Account</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Demo Account Quick Logins */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <span className="block text-[11px] font-medium text-slate-400 mb-2">
                  Quick Demo Accounts (One-Click):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('demo@nepse.ai', 'password123')}
                    className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 text-left transition-colors group"
                  >
                    <div className="text-[11px] font-bold text-slate-200 group-hover:text-blue-400">
                      Sakxam Bhattarai
                    </div>
                    <div className="text-[10px] text-slate-500">Lead Trader</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('evaluator@tu.edu.np', 'password123')}
                    className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 text-left transition-colors group"
                  >
                    <div className="text-[11px] font-bold text-slate-200 group-hover:text-purple-400">
                      TU Evaluator
                    </div>
                    <div className="text-[10px] text-slate-500">Academic Demo</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Guest / Examiner Access Button */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={onLoginAsGuest}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-white/5"
            >
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Continue as Guest / Examiner Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
