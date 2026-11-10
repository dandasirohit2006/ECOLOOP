import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Mail, Lock, AlertCircle, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill if demo parameter present
  useEffect(() => {
    const demo = searchParams.get('demo');
    if (demo === 'seller') {
      setEmail('seller@ecoloop.com');
      setPassword('ecoloop123');
    } else if (demo === 'buyer') {
      setEmail('buyer@ecoloop.com');
      setPassword('ecoloop123');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/marketplace');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'seller' | 'buyer') => {
    if (role === 'seller') {
      setEmail('seller@ecoloop.com');
      setPassword('ecoloop123');
    } else {
      setEmail('buyer@ecoloop.com');
      setPassword('ecoloop123');
    }
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-soft-gradient">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-card border border-emerald-100">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white shadow-md">
            <Recycle className="w-6 h-6 animate-spin [animation-duration:15s]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign in to EcoLoop
          </h2>
          <p className="text-xs text-slate-500">
            Access your B2B circular economy marketplace dashboard
          </p>
        </div>

        {/* Demo Quick-Login Buttons */}
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Demo Logins:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('seller')}
              className="py-2 px-2.5 rounded-xl text-left bg-white border border-emerald-200 hover:border-emerald-400 text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <div className="font-bold text-emerald-800">Demo Seller</div>
              <div className="text-slate-400 truncate">GreenPack (Kolkata)</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('buyer')}
              className="py-2 px-2.5 rounded-xl text-left bg-white border border-emerald-200 hover:border-emerald-400 text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <div className="font-bold text-teal-800">Demo Buyer</div>
              <div className="text-slate-400 truncate">EcoRecycle (Howrah)</div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Business Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-forest-900 hover:bg-forest-800 text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Signup */}
        <div className="text-center text-xs text-slate-500">
          Don't have a business account yet?{' '}
          <Link to="/signup" className="font-bold text-emerald-700 hover:text-emerald-800">
            Register your enterprise
          </Link>
        </div>
      </div>
    </div>
  );
};
