import React from 'react';
import type { Room } from '../../types';

interface RoomListProps {
    currentRoom: string | null;
    rooms: Room[];
    onJoinRoom: (roomId: string) => void;
    onLeaveRoom: () => void;
    onShowCreateModal: () => void;
    isDarkTheme: boolean;
}

export const RoomList: React.FC<RoomListProps> = ({
    currentRoom,
    rooms,
    onJoinRoom,
    onLeaveRoom,
    onShowCreateModal,
    isDarkTheme,
}) => {
    const sectionStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#9ca3af',
    };

    const buttonStyle = (bgColor: string): React.CSSProperties => ({
        padding: '4px 8px',
        fontSize: '12px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: bgColor,
        color: 'white',
        WebkitTapHighlightColor: 'transparent',
    });

    if (currentRoom) {
        return (
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
        );
    }

    return (
        <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={labelStyle}>Available Rooms</span>
                <button onClick={onShowCreateModal} style={buttonStyle('#6366f1')}>
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
    );
};
