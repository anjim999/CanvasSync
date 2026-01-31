import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ThemeToggle } from './join-modal/ThemeToggle';
import { LogoSection } from './join-modal/LogoSection';
import { JoinForm } from './join-modal/JoinForm';
import { FeatureList } from './join-modal/FeatureList';

interface JoinModalProps {
    onJoin: (username: string, roomId: string) => void;
    isDarkTheme?: boolean;
    onToggleTheme?: () => void;
    onClose?: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ onJoin, isDarkTheme = true, onToggleTheme, onClose }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{
            minHeight: onClose ? 'auto' : 'max(100vh, 100dvh)',
            width: '100%',
            backgroundColor: isDarkTheme ? '#0a0a12' : '#f3f4f6',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: isMobile ? '24px' : '32px',
            paddingRight: isMobile ? '16px' : '24px',
            paddingBottom: isMobile ? '48px' : '32px',
            paddingLeft: isMobile ? '16px' : '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            boxSizing: 'border-box',
            borderRadius: onClose ? '16px' : '0',
            maxHeight: onClose ? '90vh' : 'none',
        }}>
            {/* Close button when shown as modal */}
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        color: isDarkTheme ? '#fff' : '#333',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        zIndex: 10,
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                >
                    <X size={20} />
                </button>
            )}

            <div style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '480px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Theme Toggle Button */}
                {onToggleTheme && !onClose && (
                    <ThemeToggle
                        isDarkTheme={isDarkTheme}
                        onToggleTheme={onToggleTheme}
                        isMobile={isMobile}
                    />
                )}

                {/* Logo & Title */}
                <LogoSection isMobile={isMobile} isDarkTheme={isDarkTheme} />

                {/* Form Card */}
                <JoinForm
                    onJoin={onJoin}
                    isMobile={isMobile}
                    isDarkTheme={isDarkTheme}
                />

                {/* Features - hide when in modal mode for cleaner look */}
                {!onClose && <FeatureList isMobile={isMobile} />}
            </div>
        </div>
    );
};
