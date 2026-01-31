import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

interface LogoSectionProps {
    isMobile: boolean;
    isDarkTheme: boolean;
}

export const LogoSection: React.FC<LogoSectionProps> = ({ isMobile, isDarkTheme }) => {
    return (
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '72px' : '100px',
                height: isMobile ? '72px' : '100px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                borderRadius: isMobile ? '18px' : '24px',
                marginBottom: isMobile ? '16px' : '24px',
                boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.4)'
            }}>
                <Palette size={isMobile ? 36 : 48} color="white" />
            </div>
            <h1 style={{
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: 800,
                color: isDarkTheme ? 'white' : '#111827',
                marginBottom: '8px',
                lineHeight: 1.1,
            }}>CanvasSync</h1>
            <p style={{ fontSize: isMobile ? '14px' : '18px', color: '#9ca3af' }}>Real-time collaborative drawing</p>
            {isMobile && (
                <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Sparkles size={14} /> Touch drawing supported!
                </p>
            )}
        </div>
    );
};
