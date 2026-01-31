import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatTheme } from './theme';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    theme: ChatTheme;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, theme }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            padding: '12px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            gap: '8px',
        }}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                style={{
                    flex: 1,
                    background: theme.inputBg,
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: theme.text,
                    outline: 'none',
                    fontSize: '14px',
                }}
            />
            <button
                type="submit"
                disabled={!inputValue.trim()}
                style={{
                    background: inputValue.trim() ? '#6366f1' : theme.inputBg,
                    color: inputValue.trim() ? 'white' : theme.textSecondary,
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                }}
            >
                <Send size={16} />
            </button>
        </form>
    );
};
