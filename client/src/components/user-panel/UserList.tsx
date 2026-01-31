import React from 'react';
import type { User } from '../../types';

interface UserListProps {
    users: User[];
    currentUserId: string | null;
    isDarkTheme: boolean;
    currentRoom: string | null;
}

export const UserList: React.FC<UserListProps> = ({
    users,
    currentUserId,
    isDarkTheme,
    currentRoom,
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
    );
};
