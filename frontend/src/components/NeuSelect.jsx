import { useState, useRef, useEffect } from 'react';

function NeuSelect({ value, onChange, options = [], className = '', placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 neu-select text-left text-text-primary transition-all ${isOpen ? 'shadow-[inset_2px_2px_5px_#bec3c8,inset_-2px_-2px_5px_#ffffff]' : ''}`}
      >
        <span className={`truncate ${selected ? 'font-medium' : 'text-text-muted'}`}>
          {selected?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#4A97B0] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[160px] py-2 rounded-xl animate-fade-in"
             style={{ 
               background: '#E1E5EA', 
               boxShadow: '8px 8px 20px #bec3c8, -8px -8px 20px #ffffff',
               border: '1px solid rgba(255,255,255,0.5)'
             }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                opt.value === value
                  ? 'text-[#4A97B0] font-semibold bg-gradient-to-r from-[#B7D8E6]/20 to-transparent'
                  : 'text-text-primary hover:text-[#4A97B0] hover:bg-white/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt.label}</span>
                {opt.value === value && (
                  <svg className="w-4 h-4 text-[#4A97B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NeuSelect;
