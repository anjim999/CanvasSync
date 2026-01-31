import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatToggleProps {
    onClick: () => void;
    unreadCount: number;
    isOpen: boolean;
    isDarkTheme: boolean;
    style?: React.CSSProperties; // Allow custom positioning
}

export const ChatToggle: React.FC<ChatToggleProps> = ({
    onClick,
    unreadCount,
    isOpen,
    isDarkTheme,
    style = {},
}) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: isOpen ? '#6366f1' : (isDarkTheme ? '#374151' : '#e5e7eb'),
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                position: 'relative', // For badge positioning
                ...style, // Allow override
            }}
            title="Team Chat"
        >
            <MessageSquare
                size={24}
                color={isOpen ? 'white' : (isDarkTheme ? 'white' : '#374151')}
            />
            {unreadCount > 0 && !isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                </div>
            )}
        </button>
    );
};
