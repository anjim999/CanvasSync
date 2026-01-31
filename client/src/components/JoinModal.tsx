import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './join-modal/ThemeToggle';
import { LogoSection } from './join-modal/LogoSection';
import { JoinForm } from './join-modal/JoinForm';
import { FeatureList } from './join-modal/FeatureList';

interface JoinModalProps {
    onJoin: (username: string, roomId: string) => void;
    isDarkTheme?: boolean;
    onToggleTheme?: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ onJoin, isDarkTheme = true, onToggleTheme }) => {
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
            minHeight: 'max(100vh, 100dvh)',
            width: '100%',
            backgroundColor: isDarkTheme ? '#0a0a12' : '#f3f4f6',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: isMobile ? '24px' : '48px',
            paddingRight: isMobile ? '16px' : '24px',
            paddingBottom: isMobile ? '48px' : '48px',
            paddingLeft: isMobile ? '16px' : '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            boxSizing: 'border-box',
        }}>
            <div style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '480px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Theme Toggle Button */}
                {onToggleTheme && (
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

                {/* Features */}
                <FeatureList isMobile={isMobile} />
            </div>
        </div>
    );
};
