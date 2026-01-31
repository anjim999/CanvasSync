import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';
import type { ChatTheme } from './theme';
import { MessageItem } from './MessageItem';

interface MessageListProps {
    messages: ChatMessage[];
    currentUserId: string | null;
    userColor: string;
    theme: ChatTheme;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    userColor,
    theme
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on mount and when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        }}>
            {messages.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    color: theme.textSecondary,
                    fontSize: '13px',
                    marginTop: 'auto',
                    marginBottom: 'auto'
                }}>
                    No messages yet.<br />Say hello to your team! 👋
                </div>
            ) : (
                messages.map((msg) => (
                    <MessageItem
                        key={msg.id}
                        msg={msg}
                        currentUserId={currentUserId}
                        userColor={userColor}
                        theme={theme}
                    />
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};
