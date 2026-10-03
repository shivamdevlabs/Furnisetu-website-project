import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import logo from '../../assets/logo.png';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if session expired query param is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      setError('Your admin session has expired. Please log in again.');
    }

    if (api.auth.isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login({
        email: email.trim(),
        password
      });

      const tokenData = res.data;
      localStorage.setItem('mr_office_token', tokenData.access_token);
      localStorage.setItem('mr_office_user', JSON.stringify({
        name: tokenData.user_name,
        email: tokenData.user_email,
        role: tokenData.user_role
      }));

      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Login failed. Please verify your administrator credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-3 p-2 bg-white rounded-2xl shadow-lg">
          <img src={logo} alt="FURNISETU Logo" className="h-12 w-auto object-contain" />
        </Link>
        <h2 className="text-2xl font-black text-white tracking-tight">
          FURNISETU Admin Portal
        </h2>
        <p className="text-xs text-slate-400">
          Authorized personnel only • Agra Operations Center
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-100 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mroffice.in"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-brand-navy hover:bg-brand-navyDark text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Log In to Dashboard
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-brand-navy flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>
            <span className="text-[11px] text-slate-400">Secure JWT Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
