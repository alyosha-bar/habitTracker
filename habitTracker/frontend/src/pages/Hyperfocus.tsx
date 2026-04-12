import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const HyperFocus = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate()
  
  // 1. Extract and sanitize Query Params
  const task = searchParams.get('task') || 'New Task';
  const initialMinutesParam = parseInt(searchParams.get('initialMinutes') || '25', 10);

  // 2. State management
  const [secondsLeft, setSecondsLeft] = useState(initialMinutesParam * 60);
  const [isActive, setIsActive] = useState(false);

  // Sync state if query params change while the component is mounted
  useEffect(() => {
    setSecondsLeft(initialMinutesParam * 60);
    setIsActive(false);
  }, [initialMinutesParam]);

  // 3. Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  // 4. Formatting
  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={pageContainerStyle}>
        <div style={containerStyle}>
        <div style={mainCardStyle}>
            <h1 style={titleStyle}>
            HyperFocus <span style={highlightStyle}>on {task}</span>
            </h1>

            <div style={timerStyle}>{formatTime()}</div>

            <div style={controlsStyle}>
            <button 
                onClick={() => setIsActive(!isActive)} 
                style={{
                ...buttonBase,
                backgroundColor: isActive ? 'var(--color-surface-elevated)' : 'var(--color-primary)',
                border: isActive ? '1px solid var(--color-border-strong)' : 'none',
                color: 'white',
                }}
            >
                {isActive ? 'Pause' : 'Start'}
            </button>
            
            <button 
                onClick={() => { setIsActive(false); setSecondsLeft(initialMinutesParam * 60); }} 
                style={secondaryButton}
            >
                Reset
            </button>
            <button style={secondaryButton} onClick={() => navigate("/")}> Home </button>
            </div>
        </div>

        <div style={infoContainer}>
            <h3 style={infoTitle}>Info on Hyperfocus:</h3>
            <p style={infoTextStyle}>
            Hyperfocus is a state of intense mental concentration on a single task. 
            It is most effective when sessions are timed between 20–90 minutes.
            </p>
        </div>
        </div>
    </div>
  );
};

const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  gap: '40px',
  margin: '150px',
};

const mainCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  padding: '48px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  textAlign: 'center',
  width: '100%',
  maxWidth: '450px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-headline)',
  color: 'var(--color-text)',
  fontSize: '18px',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  marginBottom: '32px',
};

const highlightStyle: React.CSSProperties = {
  color: 'var(--color-secondary)',
  fontWeight: 700,
};

const timerStyle: React.CSSProperties = {
  fontFamily: 'var(--font-headline)',
  fontSize: '84px',
  fontWeight: 800,
  color: 'var(--color-text)',
  fontVariantNumeric: 'tabular-nums', // Prevents numbers jumping
  marginBottom: '40px',
  letterSpacing: '-0.04em',
};

const controlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
};

const buttonBase: React.CSSProperties = {
  padding: '12px 28px',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const secondaryButton: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: 'transparent',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-muted)',
};

const infoContainer: React.CSSProperties = {
  maxWidth: '400px',
  textAlign: 'center',
  opacity: 0.6, // Softening the whole section
};

const infoTitle: React.CSSProperties = {
  fontFamily: 'var(--font-label)',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  color: 'var(--color-text-subtle)',
  letterSpacing: '0.1em',
  marginBottom: '8px',
};

const infoTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  lineHeight: '1.6',
  color: 'var(--color-text-subtle)',
};

export default HyperFocus;