import React from 'react';
import type { ChatMessage } from '../../types';
import { getChatTheme } from './theme';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isOpen: boolean;
    onClose: () => void;
    currentUserId: string | null;
    userColor: string;
    isDarkTheme: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    onSendMessage,
    isOpen,
    onClose,
    currentUserId,
    userColor,
    isDarkTheme,
}) => {
    if (!isOpen) return null;

    const theme = getChatTheme(isDarkTheme);

    return (
        <div style={{
            position: 'absolute',
            right: '250px', // Left of UserPanel
            bottom: '20px',
            width: '320px',
            height: '400px',
            backgroundColor: theme.bg,
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 40,
        }}>
            <ChatHeader
                userColor={userColor}
                theme={theme}
                onClose={onClose}
            />

            <MessageList
                messages={messages}
                currentUserId={currentUserId}
                userColor={userColor}
                theme={theme}
            />

            <MessageInput
                onSendMessage={onSendMessage}
                theme={theme}
            />
        </div>
    );
};
