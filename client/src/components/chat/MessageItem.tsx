import React from 'react';
import type { ChatMessage } from '../../types';
import type { ChatTheme } from './theme';

interface MessageItemProps {
    msg: ChatMessage;
    currentUserId: string | null;
    userColor: string;
    theme: ChatTheme;
}

export const MessageItem: React.FC<MessageItemProps> = ({ msg, currentUserId, userColor, theme }) => {
    const isSelf = msg.userId === currentUserId;
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isSelf ? 'flex-end' : 'flex-start',
            maxWidth: '100%',
        }}>
            {!isSelf && (
                <span style={{
                    fontSize: '11px',
                    color: msg.color,
                    marginBottom: '2px',
                    marginLeft: '8px',
                    fontWeight: 500
                }}>
                    {msg.username}
                </span>
            )}
            <div style={{
                padding: '8px 12px',
                borderRadius: '12px',
                borderTopRightRadius: isSelf ? '2px' : '12px',
                borderTopLeftRadius: !isSelf ? '2px' : '12px',
                backgroundColor: isSelf ? theme.msgBgSelf : theme.msgBgOther,
                color: theme.text,
                fontSize: '14px',
                lineHeight: '1.4',
                wordBreak: 'break-word',
                maxWidth: '85%',
                border: isSelf ? `1px solid ${userColor}40` : `1px solid ${theme.border}`,
            }}>
                {msg.text}
            </div>
            <span style={{
                fontSize: '10px',
                color: theme.textSecondary,
                marginTop: '2px',
                marginRight: isSelf ? '4px' : 0,
                marginLeft: !isSelf ? '4px' : 0,
            }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};
