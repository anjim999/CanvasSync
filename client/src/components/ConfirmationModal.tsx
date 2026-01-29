import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    theme?: {
        panelBg: string;
        text: string;
        textSecondary: string;
        border: string;
    };
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    theme = { // Default to dark theme if not provided
        panelBg: 'rgba(26, 26, 46, 0.95)',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        border: 'rgba(255,255,255,0.1)'
    }
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }} onClick={onCancel}>
            <div style={{
                backgroundColor: theme.panelBg,
                borderRadius: '16px',
                border: `1px solid ${theme.border}`,
                padding: '24px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transform: 'scale(1)',
                animation: 'modalSlideIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: theme.text
                }}>{title}</h3>

                <p style={{
                    margin: '0 0 24px 0',
                    fontSize: '16px',
                    color: theme.textSecondary,
                    lineHeight: 1.5
                }}>{message}</p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: 'transparent',
                            color: theme.text,
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isDestructive ? '#ef4444' : '#6366f1',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: isDestructive
                                ? '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
                                : '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};
