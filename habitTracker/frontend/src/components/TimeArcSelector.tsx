import React, { useRef, useEffect, useCallback } from 'react';

interface TimeArcSelectorProps {
  totalMinutes: number;
  onChange: (minutes: number) => void; // Added this callback
}

const TimeArcSelector = ({ totalMinutes, onChange }: TimeArcSelectorProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const centerX = 150;
  const centerY = 150;
  const radius = 120;
  const maxMinutes = 120; // 2 Hours

  // Derived Values
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const angle = (totalMinutes / maxMinutes) * 180;

  const updateTime = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;

    let atan = Math.atan2(y, x);
    let deg = atan * (180 / Math.PI) + 180;

    // Constrain to the top semi-circle
    if (deg < 0) deg = 0;
    if (deg > 180) deg = 180;

    const rawMinutes = (deg / 180) * maxMinutes;
    const roundedMinutes = Math.round(rawMinutes);
    
    // CALL the callback instead of reassigning the prop
    onChange(roundedMinutes);
  }, [onChange]); // Add onChange to dependency array

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updateTime(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updateTime(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updateTime]);

  const endX = centerX + radius * Math.cos((angle - 180) * (Math.PI / 180));
  const endY = centerY + radius * Math.sin((angle - 180) * (Math.PI / 180));
  const arcPath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <label style={labelStyle}>Session Length</label>
        <div style={badgeStyle}>{totalMinutes} min total</div>
      </header>
      
      <div style={displayWrapper}>
        <div style={timeBox}>
          <span style={timeValue}>{hours}</span>
          <span style={unitLabel}>HR</span>
        </div>
        <div style={separator}>:</div>
        <div style={timeBox}>
          <span style={timeValue}>{minutes.toString().padStart(2, '0')}</span>
          <span style={unitLabel}>MIN</span>
        </div>
      </div>

      <svg 
        ref={svgRef} 
        width="300" 
        height="160" 
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging.current ? 'grabbing' : 'grab', touchAction: 'none' }}
      >
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-secondary)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
        </defs>

        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="var(--color-surface-elevated)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        
        <path
          d={arcPath}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        <circle
          cx={endX}
          cy={endY}
          r="14"
          fill="var(--color-text)"
          stroke="var(--color-primary)"
          strokeWidth="4"
          style={{ 
            filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))',
            transition: 'r 0.1s ease' 
          }}
        />
      </svg>
    </div>
  );
};

// ... (Styles remain the same as your previous code)

// --- Styles ---

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  width: '340px',
  userSelect: 'none' as const,
};

const headerStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-label)',
  color: 'var(--color-text-muted)',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-neutral)',
  padding: '4px 8px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '10px',
  color: 'var(--color-secondary)',
  fontFamily: 'var(--font-label)',
  fontWeight: 600,
};

const displayWrapper: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '12px',
  marginBottom: '10px',
};

const timeBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const timeValue: React.CSSProperties = {
  fontFamily: 'var(--font-headline)',
  fontSize: '56px',
  fontWeight: 800,
  color: 'var(--color-text)',
  lineHeight: 1,
};

const unitLabel: React.CSSProperties = {
  fontFamily: 'var(--font-label)',
  fontSize: '12px',
  color: 'var(--color-text-subtle)',
  fontWeight: 600,
};

const separator: React.CSSProperties = {
  fontFamily: 'var(--font-headline)',
  fontSize: '40px',
  color: 'var(--color-border-strong)',
  fontWeight: 300,
};

const footerStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 20px',
  marginTop: '-10px',
};

const limitLabel: React.CSSProperties = {
  fontFamily: 'var(--font-label)',
  fontSize: '10px',
  color: 'var(--color-text-subtle)',
};

export default TimeArcSelector;