import React, { useState, useRef, useEffect } from 'react';

const StudyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const techniques = [
    { name: 'Hyperfocus', desc: 'No distractions for a short time.' },
    { name: 'Pomodoro', desc: '25 min work / 5 min break.' },
    { name: 'Waterfall', desc: '50/10 40/10 30/10 20/10 work/break split' },
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={buttonStyle}
      >
        Study Techniques
        <span style={{ marginLeft: '8px', opacity: 0.5 }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <ul style={dropdownMenuStyle}>
          {techniques.map((tech) => (
            <li key={tech.name} style={itemStyle} onClick={() => setIsOpen(false)}>
              <div style={itemNameStyle}>{tech.name}</div>
              <div style={itemDescStyle}>{tech.desc}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- Styles using Design Tokens ---

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface-elevated)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  padding: '10px 16px',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'background-color 0.2s',
};

const dropdownMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border-strong)',
  borderRadius: 'var(--radius-md)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  padding: '8px',
  listStyle: 'none',
  margin: 0,
  minWidth: '220px',
  zIndex: 100,
};

const itemStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  color: 'var(--color-text)',
};

// You can add a hover state in CSS, but for inline styles:
// onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-neutral)'}

const itemNameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-label)',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-secondary)',
};

const itemDescStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-text-muted)',
  marginTop: '2px',
};

export default StudyDropdown;