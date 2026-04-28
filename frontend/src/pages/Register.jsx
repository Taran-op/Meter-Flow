import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'consumer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg relative overflow-hidden">
      <div className="ambient-blob w-[500px] h-[500px] bg-[#B7D8E6] -top-40 -right-40"></div>
      <div className="ambient-blob w-[400px] h-[400px] bg-[#CDD2D8] -bottom-32 -left-32"></div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 theme-toggle"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle theme"
      >
        <div className="theme-toggle-knob">
          {isDark ? (
            <svg className="w-3.5 h-3.5 text-[#5aadca]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-[#E8A642]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </div>
      </button>

      <div className="relative w-full max-w-md p-8 neu-modal animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 neu-icon mb-4">
            <svg className="w-8 h-8 text-[#4A97B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary">MeterFlow</h1>
          <p className="text-text-secondary mt-2">Create your account</p>
        </div>

        {error && (<div className="mb-6 p-4 neu-inset text-error text-sm flex items-center gap-2"><svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>)}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 neu-input text-text-primary placeholder-text-muted" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 neu-input text-text-primary placeholder-text-muted" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 neu-input text-text-primary placeholder-text-muted" placeholder="••••••••" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ role: 'api_owner', title: 'Build APIs', sub: 'Create & sell', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                { role: 'consumer', title: 'Use APIs', sub: 'Consume APIs', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
              ].map(opt => (
                <button key={opt.role} type="button" onClick={() => setFormData({ ...formData, role: opt.role })} className={`p-4 rounded-xl transition-all text-left ${formData.role === opt.role ? 'neu-inset' : 'neu-flat hover:shadow-neu'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.role === opt.role ? 'bg-[#4A97B0] text-white' : 'neu-icon text-text-secondary'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} /></svg>
                    </div>
                    <div><p className="font-medium text-text-primary">{opt.title}</p><p className="text-xs text-text-muted">{opt.sub}</p></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 px-4 neu-btn-primary font-semibold disabled:opacity-50">
            {loading ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating...</span>) : 'Create Account'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-text-secondary">Already have an account?{' '}<Link to="/login" className="text-primary font-medium hover:text-accent-deep transition-colors">Sign in</Link></p>
      </div>
    </div>
  );
}

export default Register;