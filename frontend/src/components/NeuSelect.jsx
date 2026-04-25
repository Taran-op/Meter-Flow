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
            ? '#E1E5EA'
            : 'linear-gradient(145deg, #eaeff4, #d6dae0)',
          boxShadow: isOpen
            ? 'inset 3px 3px 6px #bec3c8, inset -3px -3px 6px #ffffff'
            : '4px 4px 10px #bec3c8, -4px -4px 10px #ffffff',
          border: '1px solid rgba(255,255,255,0.4)',
          color: '#1A2633',
        }}
      >
        <span className={`truncate ${selected ? '' : 'text-[#8A97A4]'}`}>
          {selected?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: '#4A97B0' }}
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
            background: '#E1E5EA',
            boxShadow: '8px 8px 24px #a8adb2, -8px -8px 24px #ffffff',
            border: '1px solid rgba(255,255,255,0.5)',
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
                color: opt.value === value ? '#4A97B0' : '#1A2633',
                background: opt.value === value ? 'rgba(183,216,230,0.25)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = opt.value === value ? 'rgba(183,216,230,0.25)' : 'transparent';
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A97B0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
