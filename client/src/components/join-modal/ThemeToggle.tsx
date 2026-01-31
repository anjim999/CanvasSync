import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    isDarkTheme: boolean;
    onToggleTheme: () => void;
    isMobile: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkTheme, onToggleTheme, isMobile }) => {
    return (
        <button
            onClick={onToggleTheme}
            style={{
                position: 'absolute',
                top: isMobile ? '16px' : '24px',
                right: isMobile ? '16px' : '24px',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: isDarkTheme ? '#1f2937' : 'white',
                border: isDarkTheme ? '1px solid #374151' : '1px solid #e5e7eb',
                color: isDarkTheme ? 'white' : '#111827',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                zIndex: 50,
                WebkitTapHighlightColor: 'transparent',
            }}
            title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};
