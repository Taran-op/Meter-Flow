import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function NeuSelect({ value, onChange, options = [], className = '', placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Position the dropdown relative to the trigger
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 160),
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setIsOpen(false);
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [isOpen]);

  const selected = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-all rounded-xl"
        style={{
          background: isOpen
            ? 'var(--c-surface)'
            : 'linear-gradient(145deg, var(--c-btn-grad-from), var(--c-btn-grad-to))',
          boxShadow: isOpen
            ? 'inset 3px 3px 6px var(--neu-dark), inset -3px -3px 6px var(--neu-light)'
            : '4px 4px 10px var(--neu-dark), -4px -4px 10px var(--neu-light)',
          border: '1px solid var(--c-border-white)',
          color: 'var(--c-text-primary)',
        }}
      >
        <span className={`truncate ${selected ? '' : 'opacity-50'}`} style={{ color: selected ? 'var(--c-text-primary)' : 'var(--c-text-muted)' }}>
          {selected?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--c-accent-deep)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown — rendered via portal at document.body so it's never clipped */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 9999,
            background: 'var(--c-surface)',
            boxShadow: '8px 8px 24px var(--neu-dark-strong), -8px -8px 24px var(--neu-light)',
            border: '1px solid var(--c-border-white-bright)',
            borderRadius: '0.75rem',
            padding: '6px 0',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: opt.value === value ? '600' : '500',
                color: opt.value === value ? 'var(--c-accent-deep)' : 'var(--c-text-primary)',
                background: opt.value === value ? 'var(--c-sheen-accent)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = 'var(--c-sheen-white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = opt.value === value ? 'var(--c-sheen-accent)' : 'transparent';
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

export default NeuSelect;
