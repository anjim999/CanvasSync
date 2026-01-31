import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface JoinFormProps {
    onJoin: (username: string, roomId: string) => void;
    isMobile: boolean;
    isDarkTheme: boolean;
}

export const JoinForm: React.FC<JoinFormProps> = ({ onJoin, isMobile, isDarkTheme }) => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('main-canvas');

    const rooms = ['Main Canvas', 'Studio A', 'Design Lab', 'Chill Zone'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onJoin(username.trim(), roomId);
        }
    };

    return (
        <div style={{
            backgroundColor: isDarkTheme ? '#16162a' : 'white',
            borderRadius: isMobile ? '16px' : '24px',
            padding: isMobile ? '20px' : '40px',
            boxShadow: isDarkTheme ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.1)',
            border: isDarkTheme ? '2px solid #2a2a4a' : '2px solid #e5e7eb',
            width: '100%',
            boxSizing: 'border-box',
        }}>
            <form onSubmit={handleSubmit}>

                {/* Nickname Input */}
                <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: isMobile ? '12px' : '14px',
                        fontWeight: 700,
                        color: isDarkTheme ? 'white' : '#374151',
                        marginBottom: isMobile ? '8px' : '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Your Nickname
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Picasso"
                        style={{
                            width: '100%',
                            padding: isMobile ? '14px 16px' : '16px 20px',
                            backgroundColor: isDarkTheme ? '#0d0d1a' : '#f9fafb',
                            color: isDarkTheme ? 'white' : '#111827',
                            fontSize: isMobile ? '16px' : '18px',
                            borderRadius: '12px',
                            border: isDarkTheme ? '2px solid #3a3a5a' : '2px solid #d1d5db',
                            outline: 'none',
                            boxSizing: 'border-box',
                            WebkitAppearance: 'none',
                        }}
                        autoComplete="off"
                        maxLength={15}
                    />
                </div>

                {/* Room Selection */}
                <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: isMobile ? '12px' : '14px',
                        fontWeight: 700,
                        color: isDarkTheme ? 'white' : '#374151',
                        marginBottom: isMobile ? '8px' : '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Select Room
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: isMobile ? '8px' : '16px'
                    }}>
                        {rooms.map(room => {
                            const id = room.toLowerCase().replace(/\s+/g, '-');
                            const selected = roomId === id;
                            return (
                                <button
                                    key={room}
                                    type="button"
                                    onClick={() => setRoomId(id)}
                                    style={{
                                        padding: isMobile ? '12px 8px' : '16px',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        fontSize: isMobile ? '12px' : '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: selected ? '2px solid #818cf8' : (isDarkTheme ? '2px solid #3a3a5a' : '2px solid #d1d5db'),
                                        backgroundColor: selected ? '#6366f1' : (isDarkTheme ? '#0d0d1a' : '#f9fafb'),
                                        color: selected ? 'white' : (isDarkTheme ? '#d1d5db' : '#4b5563'),
                                        boxShadow: selected ? '0 10px 25px -5px rgba(99, 102, 241, 0.4)' : 'none',
                                        WebkitTapHighlightColor: 'transparent',
                                    }}
                                >
                                    {room}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!username.trim()}
                    style={{
                        width: '100%',
                        padding: isMobile ? '16px' : '20px',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                        color: 'white',
                        fontSize: isMobile ? '16px' : '20px',
                        fontWeight: 800,
                        borderRadius: '12px',
                        border: 'none',
                        cursor: username.trim() ? 'pointer' : 'not-allowed',
                        opacity: username.trim() ? 1 : 0.5,
                        boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)',
                        WebkitTapHighlightColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                    }}
                >
                    Start Drawing <ArrowRight size={isMobile ? 20 : 24} />
                </button>
            </form>
        </div>
    );
};
