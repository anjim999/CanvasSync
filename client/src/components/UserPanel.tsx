import React, { useState } from 'react';
import type { User, Room } from '../types';
import { UserPanelHeader } from './user-panel/UserPanelHeader';
import { RoomList } from './user-panel/RoomList';
import { UserList } from './user-panel/UserList';
import { ShortcutsHelp } from './user-panel/ShortcutsHelp';
import { CreateRoomModal } from './user-panel/CreateRoomModal';

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
    isDarkTheme?: boolean; // Default to dark for backward compatibility if not passed immediately
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
    isDarkTheme = true,
}) => {
    const [showRoomModal, setShowRoomModal] = useState(false);

    const handleCreateRoom = (name: string) => {
        onCreateRoom(name);
        setShowRoomModal(false);
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

    const dividerStyle: React.CSSProperties = {
        height: '1px',
        backgroundColor: '#4b5563',
        width: '100%',
    };

    return (
        <div style={panelStyle}>
            {/* Header */}
            <UserPanelHeader
                isMobile={isMobile}
                onClose={onClose}
                isDarkTheme={isDarkTheme}
                latency={latency}
            />

            {/* Room Section */}
            <RoomList
                currentRoom={currentRoom}
                rooms={rooms}
                onJoinRoom={onJoinRoom}
                onLeaveRoom={onLeaveRoom}
                onShowCreateModal={() => setShowRoomModal(true)}
                isDarkTheme={isDarkTheme}
            />

            <div style={dividerStyle} />

            {/* Online Users */}
            <UserList
                users={users}
                currentUserId={currentUserId}
                isDarkTheme={isDarkTheme}
                currentRoom={currentRoom}
            />

            {/* Instructions - Only show on desktop */}
            {!isMobile && <ShortcutsHelp />}

            {/* Room Creation Modal */}
            {showRoomModal && (
                <CreateRoomModal
                    onClose={() => setShowRoomModal(false)}
                    onCreate={handleCreateRoom}
                    isMobile={isMobile}
                />
            )}
        </div>
    );
};
