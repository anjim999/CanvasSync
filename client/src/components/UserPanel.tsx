import React from 'react';
import type { User, Room } from '../types';

interface UserPanelProps {
    users: User[];
    rooms: Room[];
    currentRoom: string | null;
    currentUserId: string | null;
    latency: number;
    onJoinRoom: (roomId: string) => void;
    onCreateRoom: (name: string) => void;
    onLeaveRoom: () => void;
    isMobile?: boolean;
    onClose?: () => void;
    isDarkTheme?: boolean;
}

export const UserPanel: React.FC<UserPanelProps> = ({
    users,
    rooms,
    currentRoom,
    currentUserId,
    latency,
    onJoinRoom,
    onCreateRoom,
    onLeaveRoom,
    isMobile = false,
    onClose,
    isDarkTheme = true, // Default to dark for backward compatibility if not passed immediately
}) => {
    const [showRoomModal, setShowRoomModal] = React.useState(false);
    const [newRoomName, setNewRoomName] = React.useState('');

    const handleCreateRoom = () => {
        if (newRoomName.trim()) {
            onCreateRoom(newRoomName.trim());
            setNewRoomName('');
            setShowRoomModal(false);
        }
    };

    const panelStyle: React.CSSProperties = {
        width: isMobile ? '100%' : '256px',
        height: '100%',
        backgroundColor: isDarkTheme ? 'rgba(26, 26, 46, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderLeft: isMobile ? 'none' : (isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'),
        color: isDarkTheme ? 'white' : '#1a1a2e',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto',
        flexShrink: 0,
        WebkitOverflowScrolling: 'touch',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const sectionStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#9ca3af',
    };

    const dividerStyle: React.CSSProperties = {
        height: '1px',
        backgroundColor: '#4b5563',
        width: '100%',
    };

    const buttonStyle = (bgColor: string): React.CSSProperties => ({
        padding: '4px 8px',
        fontSize: '12px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: bgColor,
        color: 'white', // Creating button always white text usually fine on colored bg
        WebkitTapHighlightColor: 'transparent',
    });

    const userItemStyle = (isCurrentUser: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        borderRadius: '8px',
        backgroundColor: isCurrentUser
            ? 'rgba(99, 102, 241, 0.3)'
            : (isDarkTheme ? '#1f2937' : '#e5e7eb'),
    });

    return (
        <div style={panelStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: isDarkTheme ? 'white' : '#1a1a2e', margin: 0 }}>
                    {isMobile ? 'Users & Room' : 'CanvasSync'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <div
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: latency < 100 ? '#4ade80' : latency < 300 ? '#facc15' : '#f87171',
                            }}
                        />
                        <span style={{ color: '#9ca3af' }}>{latency}ms</span>
                    </div>
                    {isMobile && onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#374151',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: isDarkTheme ? 'white' : '#374151',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Room Section */}
            {currentRoom ? (
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={labelStyle}>Room</span>
                        <button onClick={onLeaveRoom} style={buttonStyle('#dc2626')}>
                            Leave
                        </button>
                    </div>
                    <div
                        style={{
                            backgroundColor: isDarkTheme ? '#1f2937' : '#e5e7eb',
                            borderRadius: '8px',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 500,
                            color: '#818cf8',
                        }}
                    >
                        {currentRoom === 'default' ? 'Main Canvas' : currentRoom}
                    </div>
                </div>
            ) : (
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={labelStyle}>Available Rooms</span>
                        <button onClick={() => setShowRoomModal(true)} style={buttonStyle('#6366f1')}>
                            + New
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '128px', overflowY: 'auto' }}>
                        {rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => onJoinRoom(room.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px',
                                    backgroundColor: isDarkTheme ? '#1f2937' : '#e5e7eb',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: isDarkTheme ? 'white' : '#1a1a2e',
                                    WebkitTapHighlightColor: 'transparent',
                                }}
                            >
                                <span style={{ fontSize: '14px' }}>{room.name}</span>
                                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{room.userCount} users</span>
                            </button>
                        ))}
                        {rooms.length === 0 && (
                            <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '8px' }}>No rooms available</p>
                        )}
                    </div>
                </div>
            )}

            <div style={dividerStyle} />

            {/* Online Users */}
            <div style={{ ...sectionStyle, flex: 1, minHeight: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={labelStyle}>Online</span>
                    <span
                        style={{
                            fontSize: '12px',
                            padding: '2px 8px',
                            backgroundColor: '#16a34a',
                            borderRadius: '9999px',
                            color: 'white',
                        }}
                    >
                        {users.length}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
                    {users.map((user) => (
                        <div key={user.id} style={userItemStyle(user.id === currentUserId)}>
                            <div
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: user.color,
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ fontSize: '14px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.username}
                                {user.id === currentUserId && <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '4px' }}>(you)</span>}
                            </span>
                            {user.isDrawing && <span style={{ fontSize: '12px' }}>✏️</span>}
                        </div>
                    ))}
                    {users.length === 0 && (
                        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '16px' }}>
                            {currentRoom ? 'No other users' : 'Join a room to see users'}
                        </p>
                    )}
                </div>
            </div>

            {/* Instructions - Only show on desktop */}
            {!isMobile && (
                <div style={{ fontSize: '12px', color: '#6b7280', borderTop: '1px solid #374151', paddingTop: '8px' }}>
                    <p style={{ margin: '2px 0' }}>
                        <kbd style={{ padding: '2px 4px', backgroundColor: '#374151', borderRadius: '4px' }}>Ctrl+Z</kbd> Undo
                    </p>
                    <p style={{ margin: '2px 0' }}>
                        <kbd style={{ padding: '2px 4px', backgroundColor: '#374151', borderRadius: '4px' }}>Ctrl+Y</kbd> Redo
                    </p>
                </div>
            )}

            {/* Room Creation Modal */}
            {showRoomModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 50,
                        padding: isMobile ? '16px' : 0,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#1a1a2e',
                            padding: '24px',
                            borderRadius: '16px',
                            width: isMobile ? '100%' : '320px',
                            maxWidth: '320px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'white' }}>Create New Room</h3>
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            placeholder="Room name..."
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                backgroundColor: '#1f2937',
                                border: '1px solid #4b5563',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                color: 'white',
                                outline: 'none',
                                boxSizing: 'border-box',
                                fontSize: '16px',
                            }}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setShowRoomModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '8px 16px',
                                    backgroundColor: '#374151',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    WebkitTapHighlightColor: 'transparent',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRoom}
                                style={{
                                    flex: 1,
                                    padding: '8px 16px',
                                    backgroundColor: '#6366f1',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    WebkitTapHighlightColor: 'transparent',
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
