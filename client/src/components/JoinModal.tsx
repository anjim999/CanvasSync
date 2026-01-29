import React, { useState, useEffect } from 'react';
import { Palette, Users, RotateCcw } from 'lucide-react';

interface JoinModalProps {
    onJoin: (username: string, roomId: string) => void;
    isDarkTheme?: boolean;
    onToggleTheme?: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ onJoin, isDarkTheme = true, onToggleTheme }) => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('main-canvas');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onJoin(username.trim(), roomId);
        }
    };

    const rooms = ['Main Canvas', 'Studio A', 'Design Lab', 'Chill Zone'];

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
                        {isDarkTheme ? '☀️' : '🌙'}
                    </button>
                )}

                {/* Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: isMobile ? '72px' : '100px',
                        height: isMobile ? '72px' : '100px',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        borderRadius: isMobile ? '18px' : '24px',
                        marginBottom: isMobile ? '16px' : '24px',
                        boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.4)'
                    }}>
                        <span style={{ fontSize: isMobile ? '36px' : '48px' }}>🎨</span>
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '32px' : '48px',
                        fontWeight: 800,
                        color: isDarkTheme ? 'white' : '#111827',
                        marginBottom: '8px',
                        lineHeight: 1.1,
                    }}>CanvasSync</h1>
                    <p style={{ fontSize: isMobile ? '14px' : '18px', color: '#9ca3af' }}>Real-time collaborative drawing</p>
                    {isMobile && (
                        <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '8px' }}>
                            ✨ Touch drawing supported!
                        </p>
                    )}
                </div>

                {/* Form Card */}
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
                            }}
                        >
                            Start Drawing 🚀
                        </button>
                    </form>
                </div>

                {/* Features */}
                <div style={{
                    marginTop: isMobile ? '24px' : '48px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: isMobile ? '20px' : '48px',
                    flexWrap: 'wrap',
                }}>
                    <Feature icon={<Palette size={isMobile ? 20 : 28} />} label="Real-time" color="#818cf8" isMobile={isMobile} />
                    <Feature icon={<Users size={isMobile ? 20 : 28} />} label="Multi-user" color="#c084fc" isMobile={isMobile} />
                    <Feature icon={<RotateCcw size={isMobile ? 20 : 28} />} label="Undo/Redo" color="#34d399" isMobile={isMobile} />
                </div>
            </div>
        </div>
    );
};

const Feature = ({ icon, label, color, isMobile }: { icon: React.ReactNode; label: string; color: string; isMobile?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        <div style={{
            padding: isMobile ? '12px' : '16px',
            borderRadius: isMobile ? '12px' : '16px',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a4a',
            color
        }}>
            {icon}
        </div>
        <span style={{
            fontSize: isMobile ? '10px' : '12px',
            color: '#9ca3af',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>{label}</span>
    </div>
);
