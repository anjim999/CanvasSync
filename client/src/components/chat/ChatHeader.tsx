import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import type { ChatTheme } from './theme';

interface ChatHeaderProps {
    userColor: string;
    theme: ChatTheme;
    onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ userColor, theme, onClose }) => {
    return (
        <div style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color={userColor} />
                <span style={{ fontWeight: 600, color: theme.text }}>Team Chat</span>
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: theme.textSecondary,
                    cursor: 'pointer',
                    padding: '4px',
                }}
            >
                <X size={18} />
            </button>
        </div>
    );
};
