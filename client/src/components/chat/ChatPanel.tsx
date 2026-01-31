import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../../types';

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
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    if (!isOpen) return null;

    const theme = {
        bg: isDarkTheme ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        text: isDarkTheme ? '#ffffff' : '#1a1a2e',
        textSecondary: isDarkTheme ? '#9ca3af' : '#6b7280',
        inputBg: isDarkTheme ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
        msgBgSelf: isDarkTheme ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
        msgBgOther: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    };

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
            {/* Header */}
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

            {/* Messages List */}
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
                    messages.map((msg) => {
                        const isSelf = msg.userId === currentUserId;
                        return (
                            <div key={msg.id} style={{
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
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
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
        </div>
    );
};
