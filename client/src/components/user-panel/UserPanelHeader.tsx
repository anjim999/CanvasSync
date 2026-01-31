import React from 'react';

interface UserPanelHeaderProps {
    isMobile: boolean;
    onClose?: () => void;
    isDarkTheme: boolean;
    latency: number;
}

export const UserPanelHeader: React.FC<UserPanelHeaderProps> = ({
    isMobile,
    onClose,
    isDarkTheme,
    latency,
}) => {
    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    return (
        <div style={headerStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: isDarkTheme ? 'white' : '#1a1a2e', margin: 0 }}>
                {isMobile ? 'Users & Room' : 'CanvasSync'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <div
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: latency < 100 ? '#4ade80' : latency < 300 ? '#facc15' : '#f87171',
                        }}
                    />
                    <span style={{ color: '#9ca3af' }}>{latency}ms</span>
                </div>
                {isMobile && onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            padding: '4px 8px',
                            backgroundColor: '#374151',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: isDarkTheme ? 'white' : '#374151',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};
