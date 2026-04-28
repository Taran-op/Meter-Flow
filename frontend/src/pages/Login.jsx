import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg relative overflow-hidden">
      <div className="ambient-blob w-[500px] h-[500px] bg-[#B7D8E6] -top-40 -right-40"></div>
      <div className="ambient-blob w-[400px] h-[400px] bg-[#CDD2D8] -bottom-32 -left-32"></div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 w-11 h-11 neu-icon flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-5 h-5 text-[#5aadca]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        ) : (
          <svg className="w-5 h-5 text-[#E8A642]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        )}
      </button>

      <div className="relative w-full max-w-md p-8 neu-modal animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 neu-icon mb-4">
            <svg className="w-8 h-8 text-[#4A97B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary">MeterFlow</h1>
          <p className="text-text-secondary mt-2">API Billing Platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 neu-inset text-error text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-12 pr-4 py-3 neu-input text-text-primary placeholder-text-muted" placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-12 pr-4 py-3 neu-input text-text-primary placeholder-text-muted" placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 neu-btn-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:text-accent-deep transition-colors">Sign up</Link>
        </p>

        {/* Demo Login */}
        <div className="mt-6 pt-6 border-t border-border/40">
          <p className="text-xs text-text-muted text-center mb-3">Quick demo login (no backend needed)</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'admin', label: 'Admin', cls: 'text-purple-700' },
              { role: 'api_owner', label: 'API Owner', cls: 'text-emerald-700' },
              { role: 'consumer', label: 'Consumer', cls: 'text-sky-700' },
            ].map((demo) => (
              <button key={demo.role} type="button" onClick={() => {
                localStorage.setItem('accessToken', 'demo_token');
                localStorage.setItem('refreshToken', 'demo_refresh');
                localStorage.setItem('user', JSON.stringify({ id: 'demo_' + demo.role, name: 'Demo ' + demo.label, email: demo.role + '@meterflow.demo', role: demo.role }));
                navigate('/');
              }} className={`neu-btn px-3 py-2 text-xs font-semibold ${demo.cls}`}>
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;