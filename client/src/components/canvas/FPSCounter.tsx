import React from 'react';

interface FPSCounterProps {
    fps: number;
    isDarkTheme: boolean;
}

export const FPSCounter: React.FC<FPSCounterProps> = ({ fps, isDarkTheme }) => {
    const fpsCounterStyle: React.CSSProperties = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 20,
        backgroundColor: isDarkTheme ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '4px 12px',
        borderRadius: '8px',
        border: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        color: isDarkTheme ? '#4ade80' : '#15803d',
        fontWeight: 600,
        boxShadow: isDarkTheme ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
    };

    return (
        <div style={fpsCounterStyle}>
            <span style={{ color: '#4ade80', fontWeight: 600 }}>{fps}</span>
            <span style={{ color: '#9ca3af', marginLeft: '4px' }}>FPS</span>
        </div>
    );
};
