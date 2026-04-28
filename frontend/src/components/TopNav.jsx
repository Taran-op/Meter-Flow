import { Link, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

function TopNav({ role = 'consumer' }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navContainerRef = useRef(null);
  const navItemRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    ];
    const roleItems = {
      admin: [
        { path: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { path: '/admin/apis', label: 'All APIs', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/admin/billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { path: '/admin/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      ],
      api_owner: [
        { path: '/apis', label: 'My APIs', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
      ],
      consumer: [
        { path: '/marketplace', label: 'Marketplace', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
        { path: '/my-subscriptions', label: 'Subscriptions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { path: '/usage', label: 'Usage', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { path: '/playground', label: 'Playground', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
      ],
    };
    return [...commonItems, ...(roleItems[role] || [])];
  };

  const navItems = getNavItems();

  // Measure the active nav item and position the sliding indicator
  const updateIndicator = useCallback(() => {
    if (!navContainerRef.current) return;
    const el = navItemRefs.current[location.pathname];
    if (!el) return;
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  }, [location.pathname]);

  useLayoutEffect(() => {
    const timer = setTimeout(updateIndicator, 50);
    return () => clearTimeout(timer);
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const roleBadges = {
    admin: { label: 'Admin', cls: 'text-purple-700 dark:text-purple-400' },
    api_owner: { label: 'API Owner', cls: 'text-emerald-700 dark:text-emerald-400' },
    consumer: { label: 'Consumer', cls: 'text-sky-700 dark:text-sky-400' },
  };
  const badge = roleBadges[role] || roleBadges.consumer;

  return (
    <nav className="neu-topnav sticky top-0 z-50 px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 neu-icon flex items-center justify-center">
            <svg className="w-5 h-5 text-[#4A97B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">MeterFlow</span>
        </Link>

        {/* Nav Links with Sliding Indicator */}
        <div
          ref={navContainerRef}
          className="flex items-center gap-1 overflow-x-auto relative"
        >
          {/* Sliding pill indicator */}
          <div
            className="absolute top-0 h-full rounded-xl pointer-events-none"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
              background: 'var(--c-surface)',
              boxShadow: `inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light)`,
              border: '1px solid var(--c-border-white-faint)',
              transition: 'left 0.4s cubic-bezier(0.4, 0, 0.15, 1), width 0.35s cubic-bezier(0.4, 0, 0.15, 1), opacity 0.3s ease',
            }}
          />

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              ref={(el) => { navItemRefs.current[item.path] = el; }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-300 relative z-10 ${
                isActive(item.path)
                  ? 'text-[#4A97B0]'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            <div className="theme-toggle-knob">
              {isDark ? (
                <svg className="w-3.5 h-3.5 text-[#5aadca]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-[#E8A642]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </button>

          <span className={`neu-badge px-2.5 py-1 text-xs font-semibold ${isDark ? badge.cls.replace('text-purple-700','text-purple-400').replace('text-emerald-700','text-emerald-400').replace('text-sky-700','text-sky-400') : badge.cls}`}>{badge.label}</span>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 neu-icon flex items-center justify-center text-[#4A97B0] text-sm font-semibold">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary leading-tight">{user.name}</p>
              <p className="text-xs text-text-muted leading-tight">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-error/80 hover:text-error px-2.5 py-1.5 rounded-lg transition-all hover:shadow-neu-sm" title="Logout">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
