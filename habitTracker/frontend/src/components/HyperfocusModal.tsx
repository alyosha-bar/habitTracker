
import { useState } from 'react';
import TimeArcSelector from './TimeArcSelector';

interface HyperfocusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (todo: string, time: number) => void;
}

const HyperfocusModal = ({ isOpen, onClose, onSubmit }: HyperfocusModalProps) => {
    const [todo, setTodo] = useState<string>("")
    const [sessionTime, setSessionTime] = useState(30)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        // close modal - might not run given the redirect
        onClose();

        onSubmit(todo, sessionTime)
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={styles.overlay}>
            <div className="modal-content" style={styles.content}>
                <div className="modal-header" style={styles.header}>
                    <h2 style={styles.title}>Hyperfocus Session</h2>
                    <button onClick={onClose} className="close-btn" style={styles.closeBtn}>×</button>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="form-group" style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>Activity: </label>
                        <input type="text" style={styles.input} name='name' value={todo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodo(e.target.value)}/>
                    </div>
                    <div className="form-group" style={styles.formTimer}>
                        <TimeArcSelector 
                            totalMinutes={sessionTime} 
                            onChange={(newTime) => setSessionTime(newTime)} 
                        />
                    </div>
                    <div className="modal-actions" style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                        <button type="submit" style={styles.submitBtn}>Start</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
content: {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)', // Darker shadow for dark theme
        maxWidth: '500px',
        width: '90%',
        padding: '0',
        border: '1px solid var(--color-border)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        padding: '20px',
    },
    title: {
        margin: 0,
        fontSize: '20px',
        fontWeight: 600,
        fontFamily: 'var(--font-headline)',
        color: 'var(--color-text)',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: 'var(--color-text-muted)',
        padding: '0',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.2s',
    },
    form: {
        padding: '20px',
    },
    formGroup: {
        marginBottom: '16px',
    },
    formTimer: {
        display: 'flex',
        justifyContent: 'center',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'var(--font-label)',
        color: 'var(--color-text-muted)',
        marginBottom: '8px',
        textTransform: 'uppercase' as const, // <--- Add this
        letterSpacing: '0.025em',
    },
    todo: {
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        backgroundColor: 'var(--color-neutral)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '14px',
        color: 'var(--color-text)',
        boxSizing: 'border-box' as const,
        fontFamily: 'var(--font-body)',
        transition: 'border-color 0.2s',
        outline: 'none',
    },
    actions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '24px',
    },
    cancelBtn: {
        padding: '8px 16px',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-surface-elevated)',
        color: 'var(--color-text-muted)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        transition: 'background-color 0.2s',
    },
    submitBtn: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff', // Keep white for contrast on primary purple
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        transition: 'opacity 0.2s',
    },
}
 
export default HyperfocusModal;